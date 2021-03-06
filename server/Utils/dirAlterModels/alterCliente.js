module.exports = function(app) {

    var Cliente = app.models.Cliente
        ,   Destino = app.models.Destino
        ,   Customer = app.models.Customer
        ,   Categoria = app.models.Categoria
        ,   Subcategoria = app.models.Subcategoria
        ,   SubcategoriaTieneDestinos = app.models.SubcategoriaTieneDestino
        ,   Texto = app.models.Texto
        ,   DestinoTieneTexto = app.models.DestinoTieneTexto
        ,   Tipotexto = app.models.Tipotexto
        ,   Container = app.models.Container
        ,   filtroCamposMasivo = app.models.DestinoMasivo.definition.rawProperties
        ,   filtroCamposUno = app.models.DestinoUnoCompleto.definition.rawProperties
        ,   Utils = require('../index')
        ,   async = require('async')
        ,   isNumeric = require("isnumeric")
        ,   md5 = require('MD5')
        ,   moderado = 2;

    Cliente.cargaMasiva = function (req, data, cb){
        data = data.data || data;
        var response = {}
            ,   token = req.accessToken;
        if(Utils.isEmpty(data))
            cb(null, {result:"Json empty"});
        else if(Utils.isValidJson(data) && data instanceof Array){
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
                    async.each(data, function (elemento, callback) {
                        contObj++;
                        var result = validador(elemento,filtroCamposMasivo);
                        if (result) {
                            Categoria.findOne({
                                where: {
                                    nombre: elemento.CATEGORIA.toLowerCase()
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
                                if(categoria == null && categoria.idcliente != user.idcliente){
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
                                            nombre: elemento.SUBCATEGORIA.toLowerCase()
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

                                        if (subcategoria != null && subcategoria.idcliente == user.idcliente) {
                                            var nombre = "" + user.idcliente + ""
                                                    + categoria.idcategoria + ""
                                                    + subcategoria.idsubcategoria + ""
                                                    + elemento.NOMBRE.toLowerCase()
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
                                                        geometria: "POINT(" + elemento.LONGITUD + " " + elemento.LATITUD + ")"
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
                                                                                                        if(validacionTexto(elementotext)){
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
                                                                                                        }else{
                                                                                                            console.error("el elemento: ("+elementotext.tipotexto+") no fue insertado");
                                                                                                            callbacktexto();
                                                                                                        }
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

    Cliente.cargaUnoCompleto = function (req, data, cb){
        var response = {}
            ,   token = req.accessToken
            ,   elemento = data;
        if(Utils.isEmpty(elemento))
            cb(null, {result:"Json empty"});
        else if(Utils.isValidJson(elemento) && !(data instanceof Array)){
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
                    var result = validador(elemento, filtroCamposUno);
                    if (result) {
                        Categoria.findById(elemento.CATEGORIA
                        , function (err, categoria) {
                            if (err){
                                if (response.result === undefined
                                    && response.elements === undefined) {

                                    response["result"] = "Problems";
                                    response["elements"] = [];
                                }
                                elemento["PROBLEMA"] = "error";
                                response.elements.push(elemento);
                                cb(null, response);
                            }
                            if(categoria == null && categoria.idcliente != user.idcliente){
                                if (response.result === undefined
                                    && response.elements === undefined) {

                                    response["result"] = "Problems";
                                    response["elements"] = [];
                                }
                                elemento["PROBLEMA"] = "Categoria No existe";
                                response.elements.push(elemento);
                                cb(null, response);
                            }else {
                                Subcategoria.findById(elemento.SUBCATEGORIA
                                , function (err, subcategoria) {
                                    if (err) {
                                        if (response.result === undefined
                                            && response.elements === undefined) {

                                            response["result"] = "Problems";
                                            response["elements"] = [];
                                        }
                                        elemento["PROBLEMA"] = "error";
                                        response.elements.push(elemento);
                                        cb(null, response);
                                    }

                                        if (subcategoria != null && subcategoria.idcliente == user.idcliente) {
                                            var nombre = "" + user.idcliente + ""
                                                    + categoria.idcategoria + ""
                                                    + subcategoria.idsubcategoria + ""
                                                    + elemento.NOMBRE.toLowerCase()
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
                                                    cb(null, response);
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
                                                        tipogeometria: elemento.TIPOGEOMETRIA,
                                                        geometria: elemento.GEOMETRIA
                                                    },function(err,destino){
                                                        if (err) {
                                                            if (response.result === undefined
                                                                && response.elements === undefined) {

                                                                response["result"] = "Problems";
                                                                response["elements"] = [];
                                                            }
                                                            elemento["PROBLEMA"] = "error";
                                                            response.elements.push(elemento);
                                                            cb(null, response);
                                                        }else{
                                                            if(destino == null){
                                                                if (response.result === undefined
                                                                    && response.elements === undefined) {

                                                                    response["result"] = "Problems";
                                                                    response["elements"] = [];
                                                                }
                                                                elemento["PROBLEMA"] = "Elemento Ya existe";
                                                                response.elements.push(elemento);
                                                                cb(null, response);
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
                                                                                                        if(validacionTexto(elementotext)){
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
                                                                                                        }else{
                                                                                                            callbacktexto();
                                                                                                        }
                                                                                                    }, function (err) {
                                                                                                        if (err) {
                                                                                                            cb(err, null);
                                                                                                        }
                                                                                                        if(response.elements === undefined) {
                                                                                                            response["result"] = "OK";
                                                                                                            response["destino"] = destino;
                                                                                                        }
                                                                                                        cb(null, response);
                                                                                                    });
                                                                                                }else{
                                                                                                    destino.updateAttributes("tienepanel", 0,function(err,d){
                                                                                                        if (err) {
                                                                                                            cb(err, null);
                                                                                                        }
                                                                                                        if(response.elements === undefined) {
                                                                                                            response["result"] = "OK";
                                                                                                            response["destino"] = destino;
                                                                                                        }
                                                                                                        cb(null, response);
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
                                            cb(null, response);
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
                        cb(null, response);
                    }
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

    function validador(data, filtroCampos) {


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

    function validacionTexto(elemTexto){
        var esTextoValido = false;
        if(elemTexto != {}){
            if(elemTexto.tipotexto !== undefined && elemTexto.texto !== undefined){
                switch(elemTexto.tipotexto){
                    case    'REGION'                :
                    case    'PROVINCIA'             :
                    case    'COMUNA'                :
                    case    'NUMERO'                :
                        if(typeof elemTexto.texto == "string" && elemTexto.texto.length < 150 && elemTexto.texto.length > 0){
                            esTextoValido = true;
                        }
                        break;
                    case    'LOCALIDADES CERCANAS'  :
                    case    'DIRECCION'             :
                        if(typeof elemTexto.texto == "string" && elemTexto.texto.length < 450 && elemTexto.texto.length > 0){
                            esTextoValido = true;
                        }
                        break;
                    case    'TELEFONO'              :
                    case    'CORREO'                :
                        if(typeof elemTexto.texto == "string" && elemTexto.texto.length < 100 && elemTexto.texto.length > 0){
                            esTextoValido = true;
                        }
                        break;
                    case    'DESCRIPCION'           :
                        if(typeof elemTexto.texto == "string" && elemTexto.texto.length < 700 && elemTexto.texto.length > 0){
                            esTextoValido = true;
                        }
                        break;
                }
                return esTextoValido;
            }else{
                return esTextoValido;
            }
        }else{
            return esTextoValido;
        }
    }
};