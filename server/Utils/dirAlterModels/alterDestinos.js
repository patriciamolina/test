module.exports = function(app) {

    var    Destino = app.models.Destino
        ,   Cliente = app.models.Cliente
        ,   findDestinos = Destino.find
        ,   Customer = app.models.Customer
        ,   Utils = require('../index');

    function findNada(filter, cb) {
        Destino.find = findDestinos;
        cb(null,{});
    }

    Destino.find = findNada;

    Destino.afterRemote('find', function (ctx, affectedModelInstance, next) {

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
                            if(query.where['and'] !== undefined){
                                query.where.and['idcliente'] = cliente.idcliente;
                            }else if(query.where['or'] !== undefined){
                                var ortemp = query.where['or'];
                                delete query.where['or'];
                                query.where['and'] = {idcliente: cliente.idcliente };
                                query.where.and['or'] = ortemp;
                            }else{
                                var temp = query.where;
                                delete query['where'];
                                query['where']= {};
                                query.where['and'] = [ Utils.jsonextend(temp, {idcliente: cliente.idcliente}) ];
                            }
                        }
                    }else{
                        query['where'] = {idcliente: cliente.idcliente };
                    }
                    Destino.find(query, function(err, destinos){
                        ctx.result = destinos;
                        Destino.find = findNada;
                        next();
                    });
                });
            });

        });
    });

};