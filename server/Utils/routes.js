var cors = require('cors')
    ,   dns = require('dns');

module.exports = function(app) {
  var router = app.loopback.Router();
  var contentTypesByExtension = {
    'html': "text/html",
    'css':  "text/css",
    'js':   "text/javascript",
    'json': "application/json" //Edited due to answer - Still no success :(
  };

    app.use(cors());

  router.get('/VerifyToken/:id', function(req, res) {
      setHeaders(res);
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
            dns.lookup(req.headers.origin.replace("http://",""), function onLookup(err, addresses, family) {
                console.log('err:', err);
                console.log('addresses:', addresses);
                console.log('family:', family);
            });
        });
  });

  app.use(router);

 function setHeaders(res){
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 }
};
