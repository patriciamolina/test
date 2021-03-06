module.exports = function(Cliente) {

    Cliente.remoteMethod(
        'cargaMasiva',
        {
            description: 'Carga Masiva de Información',
            accepts: [
                {arg: 'req', type: 'object', http: {source: 'req'}},
                {arg: 'data', type: ['DestinoMasivo'], required: true, http: {source: 'body'}}
            ],
            returns: {
                arg: 'response', type: 'object', root: true
            },
            http: {verb: 'post', path: '/cargaMasiva'}
        });

    Cliente.remoteMethod(
        'cargaUnoCompleto',
        {
            description: 'Carga Masiva de Información',
            accepts: [
                {arg: 'req', type: 'object', http: {source: 'req'}},
                {arg: 'data', type: 'DestinoUnoCompleto', required: true, http: {source: 'body'}}
            ],
            returns: {
                arg: 'response', type: 'object', root: true
            },
            http: {verb: 'post', path: '/cargaUnoCompleto'}
        });

};
