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

utils.jsonorder = function (jsonElement){
    var target = [];
    console.log(utils.getSizeJson(jsonElement));
    for (var prop in jsonElement) {
        target[prop] = jsonElement[prop] ;
    }
    return target;
};

utils.alterModels = require('./alterModels.js');
utils.routes = require('./routes.js');

module.exports = utils;

