module.exports = function(app) {

    var Destino = app.models.Destino
        ,   Subcategoria = app.models.Subcategoria
        ,   SubcategoriaTieneDestinos = app.models.SubcategoriaTieneDestinos
        ,   Texto = app.models.Texto
        ,   DestinoTieneTexto = app.models.DestinoTieneTexto
        ,   Estadodestino = app.models.Estadodestino
        ,   Bibliotecamultimedia = app.models.Bibliotecamultimedia
        ,   Tipotexto = app.models.Tipotexto
        ,   filtroCampos = app.models.DestinoMasivo.definition.rawProperties
        ,   Utils = require('../index')
        ,   async = require('async')
        ,   isNumeric = require("isnumeric");

    Destino.cargaMasiva = function (req, data, cb){
        var response = {};
        if(Utils.isEmpty(data))
            cb(null, "Json empty");
        else if(Utils.isValidJson(data)){
            async.each(data,function (elemento, callback){
                var result = validador(elemento);
                if(result){
                    console.log("insertando: " + elemento);
                    Subcategoria.findOne({ where: {nombre: elemento.NOMBRE} },function(err,subcategoria){
                        if (err) console.error(err);
                        console.log(subcategoria);
                        //callback();
                    });
                }else{
                    if(response.result === undefined
                        && response.elements === undefined){

                        response["result"] = "Problems";
                        response["elements"] = [];
                    }
                    response.elements.push(elemento);
                    callback();
                }
            },function(err){
                if (err) {
                    console.error(err);
                }
                if(response.elements === undefined){
                    response["result"] = "OK";
                }
                cb(null, response);
            });
        }else{
            cb(null, "Data is invalid Json");
        }

    };

    /*
     * Validador de datos
     */
    var filtroRequire = function (filtro, value) {
        if (filtro && !value)
            return true;
        else
            return false;
    };
    var filtroType = function (filtro, value) {
        if (!!value && filtro != "string" && !isNumeric(value.replace(",", ".")))
            return true;
        else
            return false;
    };
    var filtroLength = function (filtro, value) {
        if (!!value && typeof(value) === "string" && value.length > filtro)
            return true;
        else
            return false;
    };

    function validador(data) {


        var isValid = true;
        /*
         * Validación de toda la fila, basado en los filtros definidos
         */
        for (var property in filtroCampos) {
            if(property != "id") {
                for (var h in filtroCampos[property]) {
                    if (h === "required" && filtroRequire(filtroCampos[property][h], data[property])) {
                        isValid = false;
                    } else if (h === "type" && filtroType(filtroCampos[property][h], data[property])) {
                        isValid = false;
                    } else if (h === "length" && filtroLength(filtroCampos[property][h], data[property])) {
                        isValid = false;
                    }
                }

            }
        }
        return isValid;
    }

};