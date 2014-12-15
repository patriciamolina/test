module.exports = function(app) {

    var     Customer = app.models.Customer
        ,   RoleMapping = app.models.MapeoRol
        ,   Rol = app.models.Role
        ,   Utils = require('../index')
        ,   async = require('async');

    Customer.afterRemote('find', function (ctx, affectedModelInstance, next) {

        if(ctx.req.accessToken)
            var token = ctx.req.accessToken;

        Customer.relations.accessTokens.modelTo.findById(token.id, function(err, accessToken) {
            if (err) {
                ctx.result = {data: ctx.result};
                return next(err);
            }
            if ( !accessToken) {
                ctx.result = {data: ctx.result};
                return next(new Error('could not find accessToken'));
            }

            // Look up the user associated with the accessToken
            Customer.findById(accessToken.userId, function (err, user) {
                if (err) {
                    ctx.result = {data: ctx.result};
                    return next(err);
                }
                if ( ! user) {
                    ctx.result = {data: ctx.result};
                    console.log(user);
                    return next(new Error('could not find a valid user'));
                }

                if(user.idcliente !=0) {

                    var idcliente = user.idcliente
                        , customerFinal = [];

                    async.each(affectedModelInstance, function (element, callback) {
                        if (element.idcliente == idcliente) {
                            element.rol = [];
                            RoleMapping.find({where: {principalId: element.id}}, function (err, roles) {
                                if (err) console.error(err);
                                var count = 0;
                                async.each(roles, function (rol, callbackRol) {
                                    Rol.find({where: {id: rol.roleId}}, function (err, role) {
                                        if (err) console.error(err);
                                        var roltemp = {};
                                        roltemp["id"] = role[0].id;
                                        roltemp["name"] = role[0].name;
                                        element.rol[count] = roltemp;
                                        count++;
                                        callbackRol();
                                    });
                                }, function (err) {
                                    if (err) {
                                        console.error(err);
                                    }
                                    customerFinal.push(element);
                                    callback();
                                });
                            });
                        } else {
                            callback();
                        }
                    }, function (err) {
                        if (err)console.error(err);
                        ctx.result = customerFinal;
                        next();
                    });
                }else{
                    async.each(affectedModelInstance, function (element, callback) {
                        element.rol = [];
                        RoleMapping.find({where: {principalId: element.id}}, function (err, roles) {
                            if (err) console.error(err);
                            var count = 0;
                            async.each(roles, function (rol, callbackRol) {
                                Rol.find({where: {id: rol.roleId}}, function (err, role) {
                                    if (err) console.error(err);
                                    var roltemp = {};
                                    roltemp["id"] = role[0].id;
                                    roltemp["name"] = role[0].name;
                                    element.rol[count] = roltemp;
                                    count++;
                                    callbackRol();
                                });
                            }, function (err) {
                                if (err) {
                                    console.error(err);
                                }
                                callback();
                            });
                        });
                    }, function (err) {
                        if (err)console.error(err);
                        next();
                    });
                }
            });

        });
    });

    Customer.afterRemote('create', function (ctx, affectedModelInstance, next) {
        var AccessToken = app.models.AccessToken;
        AccessToken.findById(ctx.req.accessToken,function(err,token) {
            if(err){
                console.error(err);
                next();
            }
            if (affectedModelInstance.rol !== undefined) {
                async.each(affectedModelInstance.rol, function (rol, callback) {
                    RoleMapping.create({
                        "principalType": "USER",
                        "principalId": affectedModelInstance.id,
                        "roleId": rol
                    }, function (err) {
                        if (err) console.error(err);
                    });
                    callback();
                }, function (err) {
                    if (err)console.error(err);
                    next();
                });
            } else {
                next();
            }
        });
    });

    Customer.afterRemote('findById', function (ctx, customer, next) {
        if(!Utils.isEmpty(customer)) {
            customer["rol"]=[];
            RoleMapping.find({where: {principalId: customer.id}}, function (err, roles) {
                var count = 0;
                async.each(roles, function (rol, callbackRol) {
                    Rol.find({where: {id: rol.roleId}}, function (err, role) {
                        var roltemp = {};
                        roltemp["id"] = role[0].id;
                        roltemp["name"] = role[0].name;
                        customer.rol[count] = roltemp;
                        count++;
                        callbackRol();
                    });
                }, function (err) {
                    if (err) {
                        console.error(err);
                    }
                    ctx.result = customer;
                    next();
                });
            });
        }else{
            next();
        }
    });

};