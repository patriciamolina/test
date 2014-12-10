module.exports = function(app) {
    var Destino = app.models.Destino
        , filtroCampos = app.models.DestinoMasivo;

    Destino.cargaMasiva = function (req, data, cb){
        if(isEmpty(data))
            cb(null, "Json empty");
        else if(isValidJson(data)){
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

    function isEmpty(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }

    function isValidJson(jsonObject){
        var json = JSON.stringify(jsonObject);
        if (/^[\],:{}\s]*$/.test(json.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            return true;

        }else{

            return false;

        }
    }
};