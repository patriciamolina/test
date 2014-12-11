module.exports = function(app) {
    var Destino = app.models.Destino
        , filtroCampos = app.models.DestinoMasivo
        , Utils = require('../index');

    Destino.cargaMasiva = function (req, data, cb){
        if(Utils.isEmpty(data))
            cb(null, "Json empty");
        else if(Utils.isValidJson(data)){
            console.log(filtroCampos);
            cb(null, "Json is Ok.");
        }else{
            cb(null, "Data is invalid Json");
        }

    };

    Destino.remoteMethod(
        'cargaMasiva',
        {
            http: { verb: 'post'},
            description: 'Carga Masiva de Información',
            accepts: [
                {arg: 'req', type: 'object', http: {source: 'req'}},
                {arg: 'data', type: 'DestinoMasivo', required: true, http: {source: 'body'}}
            ],
            returns: {arg: 'response', type:'string'}
        });
};