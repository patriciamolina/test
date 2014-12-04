/**
 * Created by Felipe on 03-12-2014.
 */

var utils = {};

utils.jsonextend = function (target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};

utils.getSizeJson = function (jsonElement){
    var key, count = 0;
    for(key in jsonElement) {
        if(jsonElement.hasOwnProperty(key)) {
            count++;
        }
    }
    return count;
};

utils.alterModels = require('./alterModels.js');
utils.routes = require('./routes.js');
utils.migrateData = require('./migrate-data-mysql.js');
utils.createRole = require('./create-role.js');

module.exports = utils;

