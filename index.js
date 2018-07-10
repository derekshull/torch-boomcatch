const path = require('path');
const boomcatch = require('boomcatch');

boomcatch.listen({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 5000,
  https: false,
  path: '/api/store-beacon',
  referer: /.*/,
  origin: '*',
  limit: 100,
  // maxSize: -1,
  /*log: {
      info: function () {},
      warn: function () {},
      error: function () {}
  },*/
  log: console,
  validator: 'permissive',
  filter: 'unfiltered',
  mapper: 'unmapped',
  forwarder: 'console',
  workers: 1,
  delayRespawn: 0,
  maxRespawn: -1
});