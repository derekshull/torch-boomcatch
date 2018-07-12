const MongoClient = require('mongodb').MongoClient; // eslint-disable-line

const url = 'mongodb://localhost:27017';
const dbName = 'torch';

exports.initialise = function () {
  return function (data, type, separator, callback) {
    try {
      const bodyPid = data.pid;

      MongoClient.connect(url, { useNewUrlParser: true } , (connectError, client) => {
        if (connectError) throw connectError;

        const db = client.db(dbName);
        const collection = db.collection('beacons');

        // Look for a beacon with the same page ID
        collection.findOne({ pid: bodyPid }, (queryError, queryResult) => {
          if (queryError) throw queryError;

          if (queryResult) {
            // Update the existing beacon with new data
            collection.updateOne({ pid: bodyPid }, { $set: data }, {}, (updateError) => {
              if (updateError) throw updateError;
              client.close();
              console.log('updated existing beacon');
              return data;
            });
          } else {
            // Insert the new beacon
            collection.insertOne(data, {}, (insertErr) => {
              if (insertErr) throw insertErr;
              client.close();
              console.log('inserted new beacon');
              return data;
            });
          }
        });
      });
    } catch (e) {
      console.log('found an error');
      console.log(e);
      return data;
    }
  };
};