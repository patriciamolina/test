/**
 * Created by Felipe on 03-12-2014.
 */
module.exports = function(app) {

    var fs = require("fs");

    fs.readdir('server/Utils/dirAlterModels', function(err, files) {
        if (err) {
            throw err;
        }
        files.forEach(function(file) {
            var alter = require ('./dirAlterModels/' + file);
            alter(app);
        });
    });
};