module.exports = function(app) {
    var    Destino = app.models.Destino
        ,   Cliente = app.models.Cliente
        ,   User = app.models.User;

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
                    console.log(ctx.req);
                    Destino.find({  include: { textos: [ 'texto', 'tipotexto' ]}, where: {idcliente:cliente.idcliente}}, function(err, destinos){
                        ctx.result = destinos;
                        next();
                    });
                });
            });

        });
    });

};