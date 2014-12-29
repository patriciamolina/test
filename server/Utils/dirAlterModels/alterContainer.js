/**
 * Created by Felipe on 21-12-2014.
 */
var async = require("async")
    ,    Thumbnail = require('thumbnail')
    ,   fs = require("fs");
module.exports = function(app) {

    var Container = app.models.Container
        ,   Destino = app.models.Destino
        ,   Customer = app.models.Customer
        ,   Codigoqr = app.models.Codigoqr
        ,   Imagen = app.models.Imagen
        ,   Video = app.models.Video
        ,   Audio = app.models.Audio
        ,   finder = require('findit')
        ,   path = require('path');

    Container.afterRemote("removeFile",function(ctx, element, cb){
        var container = ctx.args.container;
        if(ctx.req.accessToken){
            var token = ctx.req.accessToken;
            Customer.relations.accessTokens.modelTo.findById(token.id, function (err, accessToken) {
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
                                    Imagen.findOne({where: {
                                        "and": [
                                            {iddestino: destino.iddestino},
                                            {ruta: ctx.args.file}
                                        ]
                                    }
                                    },function(err,img){
                                        if(err)cb(err);
                                        if(img) {
                                            Imagen.destroyById(img.idimagenes, function (err) {
                                                if (err)cb(err);
                                                var file = ctx.args.file;
                                                Container.removeFile(container,"thumb_" + file);
                                                cb(null,{result: "Imagen Eliminada"});
                                            });
                                        }else{
                                            Video.findOne({where: {
                                                "and": [
                                                    {iddestino: destino.iddestino},
                                                    {ruta: ctx.args.file}
                                                ]
                                            }
                                            },function(err,vid){
                                                if(err)cb(err);
                                                if(vid) {
                                                    Video.destroyById(vid.idvideo, function (err) {
                                                        if (err)cb(err);
                                                        var file = ctx.args.file;
                                                        Container.removeFile(container,"thumb_" + file);
                                                        cb(null,{result: "Video Eliminado"});
                                                    });
                                                }else{
                                                    Audio.findOne({where: {
                                                        "and": [
                                                            {iddestino: destino.iddestino},
                                                            {ruta: ctx.args.file}
                                                        ]
                                                    }
                                                    },function(err,aud){
                                                        if(err)cb(err);
                                                        if(aud) {
                                                            Audio.destroyById(aud.idaudio, function (err) {
                                                                if (err)cb(err);
                                                                var file = ctx.args.file;
                                                                Container.removeFile(container,"thumb_" + file);
                                                                cb(null,{result: "Audio Eliminado"});
                                                            });
                                                        }else{
                                                            cb(new Error("El tipo de archivo no existe"));
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                            } else {
                                if (err)cb(err, null);
                                cb(new Error("Destino no existe"));
                            }
                        });
                    });
                }
            });
        }else{
            if (err)cb(err, null);
            cb(new Error("Access Token is Required"));
        }
    });

    Container.beforeRemote("removeFile", function(ctx, element, cb){
        var container = ctx.args.container;
        if(ctx.req.accessToken != undefined){
            var token = ctx.req.accessToken;
            Customer.relations.accessTokens.modelTo.findById(token.id, function (err, accessToken) {
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

                                Container.getContainer(container,function(err,container){
                                    if(err)cb(err);
                                    if(container){
                                        cb();
                                    }else{
                                        cb(new Error("El contenedor No existe"));
                                    }
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
            if (err)cb(err, null);
            cb(new Error("Access Token is Required"));
        }
    });

    Container.afterRemote("getFiles", function(req, res, cb){
        var arrFiles = [];
        var token = req.req.accessToken;
        if(token) {
            async.each(res, function (element, callback) {
                if(!(element.name.indexOf("thumb_") > -1)) {
                    var objetoFinalTemp = {
                        deleteType: "DELETE",
                        deleteUrl: app.get('url') + "/api/Containers/" + element.container
                            + "/files/" + element.name + "?access_token=" + token.id,
                        name: element.name,
                        size: element.size,
                        thumbnailUrl: app.get('url') + "/api/Containers/" + element.container
                            + "/download/thumb_" + element.name
                            + "?access_token=" + token.id,
                        url: app.get('url') + "/api/Containers/" + element.container + "/download/" + element.name + "?access_token=" + token.id
                    };
                    arrFiles.push(objetoFinalTemp);
                    callback();
                }else{
                    callback();
                }
            }, function (err) {
                if (err)cb(err);
                else {
                    req.result = { files: arrFiles };
                    res = arrFiles;
                    cb();
                }
            });
        }else{
            cb(new Error("Access token not null"));
        }
    });

    Container.afterRemote("upload",function(req, res, cb){
        var arrFiles = [];
        var container = req.req.params.container;
        if(req.req.accessToken != undefined){
            var token = req.req.accessToken;
            Customer.relations.accessTokens.modelTo.findById(token.id, function (err, accessToken) {
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
                                            var find = finder(app.__dirserver);

                                            //This listens for files found
                                            find.on('file', function (foundfile) {
                                                if(path.basename(foundfile) == file.name &&
                                                    path.dirname(foundfile).indexOf(file.container) > -1) {

                                                    var thumbnail = new Thumbnail(path.dirname(foundfile), path.dirname(foundfile));
                                                    thumbnail.ensureThumbnail(file.name, null, 100, function (err, filename) {
                                                        // "filename" is the name of the thumb in '/path/to/thumbnails'
                                                        if(err)console.error(err);
                                                        var base = path.dirname(foundfile);
                                                        fs.rename(base + "/" + filename, base + "/thumb_" + file.name, function(err){
                                                            if(err)console.error(err);
                                                            var objetoFinalTemp = {
                                                                deleteType: "DELETE",
                                                                deleteUrl: app.get('url') + "/api/Containers/" + file.container
                                                                    + "/files/" + file.name
                                                                    + "?access_token=" + token.id,
                                                                name: file.name,
                                                                size: file.size,
                                                                thumbnailUrl: app.get('url') + "/api/Containers/" + file.container
                                                                    + "/download/thumb_" + file.name
                                                                    + "?access_token=" + token.id,
                                                                url: app.get('url') + "/api/Containers/" + file.container + "/download/" + file.name + "?access_token=" + token.id
                                                            };
                                                            arrFiles.push(objetoFinalTemp);
                                                            callback();
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                    } else {
                                        cb(new Error("Tipo de archivo no creado"));
                                        Container.removeFile(file.container, file.name);
                                        callback();
                                    }
                                }, function (err) {
                                    if (err)cb(err, null);
                                    req.result = { files: arrFiles };
                                    res = arrFiles;
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