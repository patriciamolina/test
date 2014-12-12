module.exports = function(app) {

    var     Cliente = app.models.Cliente
        ,   Customer = app.models.User
        ,   RoleMapping = app.models.MapeoRol
        ,   Rol = app.models.Role
        ,   findClientes = Customer.find
        ,   Utils = require('../index')
        ,   async = require('async');

    function findNada(filter, cb) {
        Customer.find = findClientes;
        cb(null,{});
    }

    Customer.find = findNada;

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

                Cliente.findById(user.idcliente, function (err, cliente){
                    if (err) {
                        ctx.result = {data: ctx.result};
                        return next(err);
                    }
                    if ( ! cliente) {
                        ctx.result = {data: ctx.result};
                        return next(new Error('could not find a valid client'));
                    }

                    var query = {};

                    if(ctx.req.query['filter'] !== undefined) {
                        if(ctx.req.query.filter['include'] !== undefined)
                            query['include'] = ctx.req.query.filter.include;
                        if(ctx.req.query.filter['fields'] !== undefined)
                            query['fields'] = ctx.req.query.filter.fields;
                        if(ctx.req.query.filter['limit'] !== undefined)
                            query['limit'] = ctx.req.query.filter.limit;
                        if(ctx.req.query.filter['order'] !== undefined)
                            query['order'] = ctx.req.query.filter.order;
                        if(ctx.req.query.filter['skip'] !== undefined)
                            query['skip'] = ctx.req.query.filter.skip;
                        if(ctx.req.query.filter['where'] !== undefined) {
                            query['where'] = ctx.req.query.filter.where;
                            if (cliente.idcliente != 0){
                                if (query.where['and'] !== undefined) {
                                    query.where.and['idcliente'] = cliente.idcliente;
                                } else if (query.where['or'] !== undefined) {
                                    var ortemp = query.where['or'];
                                    delete query.where['or'];
                                    query.where['and'] = {idcliente: cliente.idcliente };
                                    query.where.and['or'] = ortemp;
                                } else {
                                    var temp = query.where;
                                    delete query['where'];
                                    query['where'] = {};
                                    query.where['and'] = [ Utils.jsonextend(temp, {idcliente: cliente.idcliente}) ];
                                }
                            }
                        }
                    }else if (cliente.idcliente != 0){
                        query['where'] = {idcliente: cliente.idcliente };
                    }

                    Customer.find(query, function(err, customers){
                        Customer.find = findNada;
                        async.each(customers,function(customer, callback){
                            customer["rol"]=[];
                            RoleMapping.find({where: {principalId: customer.id}},function(err,roles){
                                var count = 0;
                                async.each(roles,function(rol,callbackRol){
                                    Rol.find({where: {id: rol.roleId}}, function (err, role) {
                                        var roltemp = {};
                                        roltemp["id"] = role[0].id;
                                        roltemp["name"] = role[0].name;
                                        customer.rol[count] = roltemp;
                                        count++;
                                        callbackRol();
                                    });
                                }, function(err){
                                    if(err){
                                        console.error(err);
                                    }
                                    callback();
                                });
                            });
                        }, function(err){
                            if(err){
                                console.error(err);
                            }
                            ctx.result = customers;
                            next();
                        });
                    });
                });
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

    Customer.afterRemote('login',function( ctx, customer, next) {
        console.log("aquiiiiiiiiiii");
        Customer.findById(customer.userId,function(err, user){
            if (err) console.error(err);
            customer["customer"]=user;
            next();
        });
    });

};