module.exports = function(app) {

    var Destino = app.models.Destino
        ,   Customer = app.models.Customer
        ,   Categoria = app.models.Categoria
        ,   Subcategoria = app.models.Subcategoria
        ,   SubcategoriaTieneDestinos = app.models.SubcategoriaTieneDestino
        ,   Texto = app.models.Texto
        ,   DestinoTieneTexto = app.models.DestinoTieneTexto
        ,   Tipotexto = app.models.Tipotexto
        ,   Container = app.models.Container
        ,   filtroCampos = app.models.DestinoMasivo.definition.rawProperties
        ,   Utils = require('../index')
        ,   async = require('async')
        ,   isNumeric = require("isnumeric")
        ,   md5 = require('MD5')
        ,   moderado = 2;

    Destino.cargaMasiva = function (req, data, cb){
        var response = {}
            ,   token = req.accessToken;
        if(Utils.isEmpty(data))
            cb(null, {result:"Json empty"});
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
                    var contObj = 0;
                    console.error(req.headers);
                    console.log(data);
                    async.each(data, function (elemento, callback) {
                        contObj++;
                        var result = validador(elemento);
                        if (result) {
                            Categoria.findOne({
                                where: {
                                    nombre: elemento.CATEGORIA
                                }
                            }, function (err, categoria) {
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
                                    Subcategoria.findOne({
                                        where: {
                                            nombre: elemento.SUBCATEGORIA
                                        }
                                    }, function (err, subcategoria) {
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
                                            var nombre = "" + user.idcliente + ""
                                                    + categoria.idcategoria + ""
                                                    + subcategoria.idsubcategoria + ""
                                                    + elemento.NOMBRE
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
                                                    Destino.create({
                                                        idestadodestino: moderado,
                                                        idcliente: user.idcliente,
                                                        rutabiblioteca: nombreMD5,
                                                        nombreicono: subcategoria.nombreicono,
                                                        iconox: subcategoria.iconox,
                                                        iconoy: subcategoria.iconoy,
                                                        color: categoria.color,
                                                        tienepanel: 0,
                                                        nombre: elemento.NOMBRE,
                                                        tipogeometria: "POINT",
                                                        geometria: "POINT(" + elemento.LONGITUD + ", " + elemento.LATITUD + ")"
                                                    },function(err,destino){
                                                        if (err) {
                                                            if (response.result === undefined
                                                                && response.elements === undefined) {

                                                                response["result"] = "Problems";
                                                                response["elements"] = [];
                                                            }
                                                            elemento["PROBLEMA"] = "error";
                                                            response.elements.push(elemento);
                                                            callback();
                                                        }else{
                                                            if(destino == null){
                                                                if (response.result === undefined
                                                                    && response.elements === undefined) {

                                                                    response["result"] = "Problems";
                                                                    response["elements"] = [];
                                                                }
                                                                elemento["PROBLEMA"] = "Elemento Ya existe";
                                                                response.elements.push(elemento);
                                                                callback();
                                                            }else{
                                                                SubcategoriaTieneDestinos.create({
                                                                        iddestino: destino.iddestino,
                                                                        idsubcategoria: subcategoria.idsubcategoria
                                                                },function(err,std){
                                                                    if(err) cb(err,null);
                                                                    if(std != null){
                                                                        Tipotexto.findOne({
                                                                            where: {
                                                                                nombretipotexto: 'TITULO'
                                                                            }
                                                                        }, function(err,tipotext1){
                                                                            if(err) cb(err,null);
                                                                            if(tipotext1 != null){
                                                                                var idioma = 1;
                                                                                Texto.create({
                                                                                    idlenguaje: idioma,
                                                                                    texto: elemento.NOMBRE
                                                                                },function(err,text1){
                                                                                    if(err) cb(err,null);
                                                                                    if(text1 != null){
                                                                                        DestinoTieneTexto.create({
                                                                                            iddestino: destino.iddestino,
                                                                                            idtexto: text1.idtexto,
                                                                                            idtipotexto: tipotext1.idtipotexto
                                                                                        },function(err,dtt){
                                                                                            if(err) cb(err,null);
                                                                                            if(dtt != null){
                                                                                                if(!Utils.isEmpty(elemento.TEXTOS)) {
                                                                                                    async.each(elemento.TEXTOS, function (elementotext, callbacktexto) {
                                                                                                        Tipotexto.findOne({
                                                                                                            where: {
                                                                                                                nombretipotexto: elementotext.tipotexto
                                                                                                            }
                                                                                                        }, function (err, tipotext2) {
                                                                                                            if (err) cb(err, null);
                                                                                                            if (tipotext2 != null) {
                                                                                                                var idioma = 1;
                                                                                                                Texto.create({
                                                                                                                    idlenguaje: idioma,
                                                                                                                    texto: elementotext.texto
                                                                                                                }, function (err, text2) {
                                                                                                                    if (err) cb(err, null);
                                                                                                                    if (text2 != null) {
                                                                                                                        DestinoTieneTexto.create({
                                                                                                                            iddestino: destino.iddestino,
                                                                                                                            idtexto: text2.idtexto,
                                                                                                                            idtipotexto: tipotext2.idtipotexto
                                                                                                                        }, function (err, dtt2) {
                                                                                                                            if (err) cb(err, null);
                                                                                                                            if (dtt2 != null) {
                                                                                                                                callbacktexto();
                                                                                                                            } else {
                                                                                                                                cb(new Error('No fue posible insertar la relacion ' +
                                                                                                                                    'Destino (' + destino.iddestino + ') con' +
                                                                                                                                    'Texto (' + text2.idtexto + ')'), null);
                                                                                                                            }
                                                                                                                        });
                                                                                                                    } else {
                                                                                                                        cb(new Error('No se pudo insertar el texto : ' + text2.texto), null);
                                                                                                                    }
                                                                                                                });
                                                                                                            } else {
                                                                                                                cb(new Error('No se encontro ningun tipo de texto del tipo :' + elementotext.tipotexto), null);
                                                                                                            }
                                                                                                        });
                                                                                                    }, function (err) {
                                                                                                        if (err) {
                                                                                                            cb(err, null);
                                                                                                        }
                                                                                                        callback();
                                                                                                    });
                                                                                                }else{
                                                                                                    destino.updateAttributes("tienepanel", 0,function(err,d){
                                                                                                        if (err) {
                                                                                                            cb(err, null);
                                                                                                        }
                                                                                                        callback();
                                                                                                    });
                                                                                                }
                                                                                            }else{
                                                                                                cb(new Error('No fue posible insertar la relacion ' +
                                                                                                    'Destino (' + destino.iddestino + ') con' +
                                                                                                    'Texto (' + t.idtexto + ')'),null);
                                                                                            }
                                                                                        });
                                                                                    }else{
                                                                                        cb(new Error('No se pudo insertar el texto : ' + elemento.NOMBRE),null);
                                                                                    }
                                                                                });
                                                                            }else{
                                                                                cb(new Error('No se encontro ningun tipo de texto del tipo TITULO'),null);
                                                                            }
                                                                        });
                                                                    }else{
                                                                        cb(new Error('No fue posible insertar la relacion ' +
                                                                            'subcategoria (' + subcategoria.idsubcategoria + ') con' +
                                                                            'destino (' + destino.iddestino + ')'),null);
                                                                    }
                                                                });
                                                            }
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
                        if (contObj >0 ){
                            if(response.elements === undefined) {
                                response["result"] = "OK";
                            }
                            cb(null, response);
                        }else{
                            cb(null, {result:"Json invalid"});
                        }
                    });
                });
            });
        }else{
            cb(null, {result:"Json invalid"});
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
        if (!!value && filtro != "string" && filtro != "object" && !isNumeric(value) )
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