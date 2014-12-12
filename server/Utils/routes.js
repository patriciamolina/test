module.exports = function(app) {
  var router = app.loopback.Router();
  var contentTypesByExtension = {
    'html': "text/html",
    'css':  "text/css",
    'js':   "text/javascript",
    'json': "application/json" //Edited due to answer - Still no success :(
  };

  router.get('*',function(req, res, next) {
      var httpsPort = app.get('port-https') || 443;
        if (!req.secure) {
            var parts = req.get('host').split(':');
            var host = parts[0] || '127.0.0.1';
            return res.redirect('https://' + host + ':' + httpsPort + req.url);
        }
        next();
    });

    router.get('/', function(req, res) {
        res.render('index', {
            loginFailed: false
        });
    });

  router.get('/login', function(req, res) {
    res.render('index', {
      loginFailed: false
    });
  });

  router.get('/resources', function(req, res) {
    res.render('resources');
  });

  router.post('/resources', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    app.models.Customer.login({
        username: username,
      password: password
    }, 'customer', function(err, token) {
      if (token !== undefined) {
          token = token.toJSON();
          if (err) {
              res.render('index', {
                  username: username,
                  password: password,
                  loginFailed: true
              });
          } else {
              res.render('resources', {
                  username: username,
                  accessToken: token.id
              });
          }
      }else{
          res.render('index', {
              username: username,
              password: password,
              loginFailed: true
          });
      }
    });
  });

  router.get('/logout', function(req, res) {
    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query.access_token});
    app.models.Customer.logout(token.accessToken, function (err) {
          console.log(err || 'Logged out');
    });
    token.destroy();
    res.redirect('/login');
  });

  router.get('/VerifyToken/:id', function(req, res) {
        var AccessToken = app.models.AccessToken;
        AccessToken.findById(req.params.id,function(err,token){
            if(err)console.error(err);

            var respjson;

            if(token == null){
                respjson = {logged: "false"};
            }else{
                respjson = {logged: "true", token: token};
            }

            var headers = {};
            var contentType = contentTypesByExtension["json"];
            if (contentType) headers["Content-Type"] = contentType;
            res.writeHead(200, headers);
            res.write(JSON.stringify(respjson));
            res.write
            res.end();
        });
  });

  app.use(router);
};
