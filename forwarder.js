const MongoClient = require('mongodb').MongoClient; // eslint-disable-line
const mergeJSON = require("merge-json");

const url = 'mongodb://localhost:27017';
const dbName = 'torch';

// TODO: move this to mapper.js
function jsonify(obj) {
  // iterate over the property names
  Object.keys(obj).forEach(function(k) {
    // slip the property value based on `.`
    var prop = k.split('.');
    if (prop.length > 1) {
      // get the last value fom array 
      var last = prop.pop();
      // iterate over the remaining array value 
      // and define the object if not already defined
      prop.reduce(function(o, key) {
        // define the object if not defined and return
        return o[key] = o[key] || {};
        // set initial value as object
        // and set the property value
      }, obj)[last] = obj[k];
      // delete the original property from object
      delete obj[k];
    }
  });

  return obj;
}

function byteCount(data) {
  return Buffer.byteLength(JSON.stringify(data), 'utf8');
}

exports.initialise = function () {
  return function (data, type, separator, callback) {
    try {
      obj = JSON.parse(data);
      objData = obj.data;
      const beaconData = jsonify(objData);
      const bodyPid = beaconData.pid;

      beaconData['referer'] = obj['referer'];
      beaconData['userAgent'] = obj['userAgent'];
      beaconData['browser'] = obj['browser'];

      MongoClient.connect(url, { useNewUrlParser: true } , (connectError, client) => {
        if (connectError) throw connectError;

        const db = client.db(dbName);
        const collection = db.collection('beacons');

        // Look for a beacon with the same page ID
        collection.findOne({ pid: bodyPid }, (queryError, queryResult) => {
          if (queryError) throw queryError;

          if (queryResult) {
            const mergedResult = mergeJSON.merge(queryResult, beaconData);
            // Update the existing beacon with new data
            collection.updateOne({ pid: bodyPid }, { $set: mergedResult }, {upsert: true}, (updateError) => {
              if (updateError) throw updateError;
              client.close();
              callback(false, byteCount(mergedResult));
            });
          } else {
            // Insert the new beacon
            collection.insertOne(beaconData, {}, (insertErr) => {
              if (insertErr) throw insertErr;
              client.close();
              callback(false, byteCount(beaconData));
            });
          }
        });
      });
    } catch (e) {
      console.log('found an error');
      console.log(e);
      callback(false, byteCount(data));
    }
  };
};