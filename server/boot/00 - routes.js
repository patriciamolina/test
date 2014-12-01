module.exports = function(app) {
  var router = app.loopback.Router();

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

  router.get('/resources', function(req, res) {
    res.render('resources');
  });

  router.post('/resources', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    app.models.User.login({
        username: username,
      password: password
    }, 'user', function(err, token) {
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
                  username: token.user.username,
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
    token.destroy();
    res.redirect('/');
  });

  app.use(router);
};
