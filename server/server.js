var loopback = require('loopback');
var boot = require('loopback-boot');

var http = require('http')
    , https = require('https')
    , path = require('path')
    , sslCert = require('./private/ssl_cert')
    , Utils = require('./Utils');

var httpsOptions = {
    key: sslCert.privateKey,
    cert: sslCert.certificate
};

var app = module.exports = loopback();

// Set up the /favicon.ico
app.use(loopback.favicon(__dirname + '/resources/favicon.jpg'));

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --

// -- Add your pre-processing middleware here --
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('json spaces', 2); //pretty print json responses

//routes
Utils.routes(app);

// boot scripts mount components like REST API
boot(app, __dirname);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
//   var path = require('path');
//   app.use(loopback.static(path.resolve(__dirname, '../client')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());
app.__dirserver = __dirname;
Utils.alterModels(app);
// Add headers

app.start = function() {
    console.log("Starting...");
    
    var portHttp = process.env.OPENSHIFT_NODEJS_PORT || app.get('port');
    var hostHttp = process.env.OPENSHIFT_NODEJS_IP || app.get('host');
    var backlog   = 511;

    http.createServer(app).listen(portHttp, hostHttp, backlog, function() {
        app.emit('started');
        console.log('Web server listening at: %s:%s', hostHttp, portHttp);
        // MySQL test
    });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
