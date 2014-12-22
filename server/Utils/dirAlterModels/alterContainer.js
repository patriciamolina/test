/**
 * Created by Felipe on 21-12-2014.
 */
var async = require("async");
module.exports = function(app) {

    var Container = app.models.Container
        ,   Destino = app.models.Destino
        ,   Customer = app.models.Customer
        ,   Imagen = app.models.Imagen
        ,   Video = app.models.Video
        ,   Audio = app.models.Audio
        ,   Codigoqr = app.models.Codigoqr;

    Container.afterRemote("upload",function(req, res, cb){
        console.log(req);
        var container = req.req.params.container
            ,   token = req.accessToken;
        console.log(token);
        Customer.relations.accessTokens.modelTo.findById(token.id, function(err, accessToken) {
            if (err) {
                cb(err,null);
            }
            if (!accessToken) {
                cb(new Error('could not find accessToken'),null);
            }

            // Look up the user associated with the accessToken
            Customer.findById(accessToken.userId, function (err, user) {
                if (err) {
                    cb(err,null);
                }
                if ( ! user) {
                    cb(new Error('could not find a valid user'),null);
                }
                Destino.find({where: {
                        "and": [ {rutabiblioteca: container}, {idcliente: user.idcliente}  ]
                    }
                }, function (err,destino){
                    if(err) cb(err,null);
                    if(destino){
                        async.each(res.result.files["files[]"],function(file,callback){
                            console.log(file.type);
                            var multimedia = objectMultimedia(file.type);
                            if( multimedia != undefined){
                                console.log(multimedia.name);
                            }else {
                                console.log("type of file no supported!!");
                                Container.removeFile(file.container,file.name);
                            }
                            callback();
                        },function(err){
                            if(err)cb(err,null);
                            cb(null,res);
                        });
                    }else{
                        async.each(res.result.files["files[]"],function(file,callback){
                            Container.removeFile(file.container,file.name);
                            callback();
                        },function(err){
                            if(err)cb(err,null);
                            cb(new Error("Destino no existe"));
                        });
                    }
                });
            });
        });
    });

    function objectMultimedia(type){
        switch(type){
            case    "image/bmp":
            case    "image/cis-cod":
            case    "image/gif":
            case    "image/ief":
            case    "image/jpeg":
            case    "image/pipeg":
            case    "image/svg+xml":
            case    "image/tiff":
            case    "image/x-cmu-raster":
            case    "image/x-cmx":
            case    "image/x-icon":
            case    "image/x-portable-anymap":
            case    "image/x-portable-bitmap":
            case    "image/x-portable-graymap":
            case    "image/x-portable-pixmap":
            case    "image/x-rgb":
            case    "image/x-xbitmap":
            case    "image/x-xpixmap":
            case    "image/x-xwindowdump":
                return Imagen;
            case    "video/mpeg":
            case    "video/quicktime":
            case    "video/x-la-asf":
            case    "video/x-ms-asf":
            case    "video/x-msvideo":
            case    "video/x-sgi-movie":
                return Video;
            case    "audio/basic":
            case    "audio/mid":
            case    "audio/mpeg":
            case    "audio/x-aiff":
            case    "audio/x-mpegurl":
            case    "audio/x-pn-realaudio":
            case    "audio/x-wav":
                return Audio;
            default:
                return undefined;
        }
    }
};