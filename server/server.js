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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
    Utils.alterModels(app);
    var port = app.get('port');
    var portHttps = app.get('port-https');
    http.createServer(app).listen(port, function() {
        var url = 'http://' + app.get('host') + ':' + app.get('port') + '/';
        console.log('Web server listening at: %s', url);
        https.createServer(httpsOptions, app).listen(portHttps, function() {
            app.emit('started');
            console.log('Web server listening at: %s', app.get('url'));
        });
    });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
