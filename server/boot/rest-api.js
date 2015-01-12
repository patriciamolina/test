var cors = require('cors');

module.exports = function mountRestApi(server) {
  var restApiRoot = server.get('restApiRoot');
  server.use(cors());
  server.use(restApiRoot, server.loopback.rest());
};
