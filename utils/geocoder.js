const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'opencage',
    httpAdapter: 'https',
  apiKey: '7b3211a6a87649baabc2a4e69c4869e0', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;