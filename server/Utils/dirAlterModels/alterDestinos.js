module.exports = function(app) {

    var Destino = app.models.Destino
        ,   Customer = app.models.Customer
        ,   Categoria = app.models.Categoria
        ,   Subcategoria = app.models.Subcategoria
        ,   SubcategoriaTieneDestinos = app.models.SubcategoriaTieneDestinos
        ,   Texto = app.models.Texto
        ,   DestinoTieneTexto = app.models.DestinoTieneTexto
        ,   Estadodestino = app.models.Estadodestino
        ,   Bibliotecamultimedia = app.models.Bibliotecamultimedia
        ,   Tipotexto = app.models.Tipotexto
        ,   Container = app.models.Container
        ,   filtroCampos = app.models.DestinoMasivo.definition.rawProperties
        ,   Utils = require('../index')
        ,   async = require('async')
        ,   isNumeric = require("isnumeric")
        ,   md5 = require('MD5');;

    Destino.cargaMasiva = function (req, data, cb){
        var response = {}
            ,   token = req.accessToken;
        if(Utils.isEmpty(data))
            cb(null, "Json empty");
        else if(Utils.isValidJson(data)){
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
                    async.each(data, function (elemento, callback) {
                        var result = validador(elemento);
                        if (result) {
                            Categoria.findOne({ where: {nombre: elemento.CATEGORIA} }, function (err, categoria) {
                                if (err){
                                    if (response.result === undefined
                                        && response.elements === undefined) {

                                        response["result"] = "Problems";
                                        response["elements"] = [];
                                    }
                                    elemento["PROBLEMA"] = "error";
                                    response.elements.push(elemento);
                                    callback();
                                }
                                if(categoria == null){
                                    if (response.result === undefined
                                        && response.elements === undefined) {

                                        response["result"] = "Problems";
                                        response["elements"] = [];
                                    }
                                    elemento["PROBLEMA"] = "Categoria No existe";
                                    response.elements.push(elemento);
                                    callback();
                                }else {
                                    Subcategoria.findOne({ where: {nombre: elemento.SUBCATEGORIA} }, function (err, subcategoria) {
                                        if (err) {
                                            if (response.result === undefined
                                                && response.elements === undefined) {

                                                response["result"] = "Problems";
                                                response["elements"] = [];
                                            }
                                            elemento["PROBLEMA"] = "error";
                                            response.elements.push(elemento);
                                            callback();
                                        }

                                        if (subcategoria != null) {
                                            var nombre = "" + user.idcliente + "" + categoria.idcategoria + "" + subcategoria.idsubcategoria + "" + elemento.NOMBRE
                                                , nombreMD5 = md5(nombre)
                                                , contenedor = {name: nombreMD5};
                                            Container.createContainer(contenedor, function (err) {
                                                if (err) {
                                                    if (response.result === undefined
                                                        && response.elements === undefined) {

                                                        response["result"] = "Problems";
                                                        response["elements"] = [];
                                                    }
                                                    elemento["PROBLEMA"] = "Elemento Ya existe";
                                                    response.elements.push(elemento);
                                                    callback();
                                                } else {
                                                    Bibliotecamultimedia.create({ruta: nombreMD5},function(err,biblioteca){
                                                        if (err) {
                                                            if (response.result === undefined
                                                                && response.elements === undefined) {

                                                                response["result"] = "Problems";
                                                                response["elements"] = [];
                                                            }
                                                            elemento["PROBLEMA"] = "error";
                                                            response.elements.push(elemento);
                                                            callback();
                                                        }

                                                        if(biblioteca == null){
                                                            if (response.result === undefined
                                                                && response.elements === undefined) {

                                                                response["result"] = "Problems";
                                                                response["elements"] = [];
                                                            }
                                                            elemento["PROBLEMA"] = "Elemento Ya existe";
                                                            response.elements.push(elemento);
                                                            callback();
                                                        }else{
                                                            console.log("se creo la biblioteca (id): " + biblioteca.idbiblioteca);
                                                            callback();
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            if (response.result === undefined
                                                && response.elements === undefined) {

                                                response["result"] = "Problems";
                                                response["elements"] = [];
                                            }
                                            elemento["PROBLEMA"] = "Subcategoria No existe";
                                            response.elements.push(elemento);
                                            callback();
                                        }
                                    });
                                }
                            });
                        } else {
                            if (response.result === undefined
                                && response.elements === undefined) {

                                response["result"] = "Problems";
                                response["elements"] = [];
                            }
                            elemento["PROBLEMA"] = "Elemento Invalido";
                            response.elements.push(elemento);
                            callback();
                        }
                    }, function (err) {
                        if (err) {
                            cb(err,null);
                        }
                        if (response.elements === undefined) {
                            response["result"] = "OK";
                        }
                        cb(null, response);
                    });
                });
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