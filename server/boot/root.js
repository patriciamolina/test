module.exports = function(server) {
  // Install a `/` route that returns server status
    // Add headers
    server.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
