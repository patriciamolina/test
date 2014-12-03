/**
 * Created by Felipe on 03-12-2014.
 */
module.exports = function(app) {

    var alterDestinos = require ('dirAlterModels/alterDestinos.js')
        ;

    alterDestinos(app);
};