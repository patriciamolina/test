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

utils.isEmpty = function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

utils.isValidJson = function isValidJson(jsonObject){
    var json = JSON.stringify(jsonObject);
    if (/^[\],:{}\s]*$/.test(json.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        return true;

    }else{

        return false;

    }
}

utils.alterModels = require('./alterModels.js');
utils.routes = require('./routes.js');
utils.migrateData = require('./migrate-data-mysql.js');
utils.createRole = require('./create-role.js');
utils.prueba = require('./prueba.js');

module.exports = utils;

