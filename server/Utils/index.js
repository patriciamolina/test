/**
 * Created by Felipe on 03-12-2014.
 */

var utils = {};

utils.jsonextend = function jsonextend(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    };

utils.alterModels = require('./alterModels.js');
utils.routes = require('./routes.js');

module.exports = utils;

