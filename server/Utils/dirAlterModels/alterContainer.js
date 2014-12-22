/**
 * Created by Felipe on 21-12-2014.
 */
var async = require("async");
module.exports = function(app) {

    var Container = app.models.Container
        ,   Destino = app.models.Destino
        ,   Customer = app.models.Customer
        ,   Codigoqr = app.models.Codigoqr;

    Container.afterRemote("upload",function(req, res, cb){
        var container = req.req.params.container;
        if(res.result.fields.access_token != undefined){
            var token = res.result.fields.access_token[0];
            Customer.relations.accessTokens.modelTo.findById(token, function (err, accessToken) {
                if (err) {
                    cb(err, null);
                }
                if (!accessToken) {
                    cb(new Error('User not logged'), null);
                }else {
                    // Look up the user associated with the accessToken
                    Customer.findById(accessToken.userId, function (err, user) {
                        if (err) {
                            cb(err, null);
                        }
                        if (!user) {
                            cb(new Error('could not find a valid user'), null);
                        }
                        Destino.findOne({where: {
                            "and": [
                                {rutabiblioteca: container},
                                {idcliente: user.idcliente}
                            ]
                        }
                        }, function (err, destino) {
                            if (err) cb(err, null);
                            if (destino) {
                                async.each(res.result.files["files[]"], function (file, callback) {
                                    var multimedia = objectMultimedia(file.type);
                                    if (multimedia != undefined) {
                                        multimedia.create({
                                            iddestino: destino.iddestino,
                                            ruta: file.name
                                        },function(err,elem){
                                            if(err)cb(err);
                                            callback();
                                        });
                                    } else {
                                        cb(new Error("Tipo de archivo no creado"));
                                        Container.removeFile(file.container, file.name);
                                        callback();
                                    }
                                }, function (err) {
                                    if (err)cb(err, null);
                                    cb(null, res);
                                });
                            } else {
                                async.each(res.result.files["files[]"], function (file, callback) {
                                    Container.removeFile(file.container, file.name);
                                    callback();
                                }, function (err) {
                                    if (err)cb(err, null);
                                    cb(new Error("Destino no existe"));
                                });
                            }
                        });
                    });
                }
            });
        }else{
            async.each(res.result.files["files[]"], function (file, callback) {
                Container.removeFile(file.container, file.name);
                callback();
            }, function (err) {
                if (err)cb(err, null);
                cb(new Error("Access Token is Required"));
            });
        }
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
            case    "image/png":
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
                return app.models.Imagen;
            case    "video/mpeg":
            case    "video/quicktime":
            case    "video/x-la-asf":
            case    "video/x-ms-asf":
            case    "video/x-msvideo":
            case    "video/x-sgi-movie":
                return app.models.Video;
            case    "audio/basic":
            case    "audio/mid":
            case    "audio/mpeg":
            case    "audio/x-aiff":
            case    "audio/x-mpegurl":
            case    "audio/x-pn-realaudio":
            case    "audio/x-wav":
                return app.models.Audio;
            default:
                return undefined;
        }
    }
};