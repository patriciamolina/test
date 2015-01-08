/**
 * Created by Felipe on 19-12-2014.
 */
module.exports = function(app) {

    var CodigoQr = app.models.Codigoqr
        ,   video = app.models.Video
        ,   imagen = app.models.Imagen
        ,   audio = app.models.Audio
        ,   destino = app.models.Destino
        ,   Biblioteca = app.models.Bibliotecamultimedia
        ,   async = require("async");


    video.find({},function(err,imgs){
        async.each(imgs,function(img,callback){
            destino.findOne({where: {idbiblioteca: img.idbiblioteca}},function(err,d){
                img.updateAttribute("iddestino", d.iddestino,function(err,i){
                    console.log(i);
                    callback();
                });
            })
        },function(err){
            console.log("fin");
        });
    });


//    Destino.find({},function(err,destino){
//        async.each(destino,function (dest, callback){
//            Biblioteca.findById(dest.idbiblioteca,function(err,biblio){
//                dest.updateAttributes({rutabiblioteca: biblio.ruta},function(err,d){
//                    console.log(d);
//                    callback();
//                });
//            });
//        },function(err){
//            console.log("fin");
//        });
//    });
};
