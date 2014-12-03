module.exports = function(app) {

    var    Destino = app.models.Destino
        ,   Cliente = app.models.Cliente
        ,   findDestinos = Destino.find
        ,   User = app.models.User
        ;

    function findNada(filter, cb) {
        Destino.find = findDestinos;
        cb(null,{});
    }

    Destino.find = findNada;

    Destino.afterRemote('find', function (ctx, affectedModelInstance, next) {

        if(ctx.req.accessToken)
            var token = ctx.req.accessToken;

        User.relations.accessTokens.modelTo.findById(token.id, function(err, accessToken) {
            if (err) {
                ctx.result = {data: ctx.result};
                return next(err);
            }
            if ( !accessToken) {
                ctx.result = {data: ctx.result};
                return next(new Error('could not find accessToken'));
            }

            // Look up the user associated with the accessToken
            User.findById(accessToken.userId, function (err, user) {
                if (err) {
                    ctx.result = {data: ctx.result};
                    return next(err);
                }
                if ( ! user) {
                    ctx.result = {data: ctx.result};
                    return next(new Error('could not find a valid user'));
                }

                Cliente.findById(user.id, function (err, cliente){
                    if (err) {
                        ctx.result = {data: ctx.result};
                        return next(err);
                    }
                    if ( ! cliente) {
                        ctx.result = {data: ctx.result};
                        return next(new Error('could not find a valid user'));
                    }
                    Destino.find({  include: { textos: [ 'texto', 'tipotexto' ]}, where: {idcliente:cliente.idcliente}}, function(err, destinos){
                        ctx.result = destinos;
                        Destino.find = findNada;
                        next();
                    });
                });
            });

        });
    });

};