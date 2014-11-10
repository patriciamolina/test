/**
 * Created by Felipe on 06-11-2014.
 */
var crypto = require('crypto'),
    path = require('path'),
    fs = require("fs");

exports.privateKey = fs.readFileSync(path.join(__dirname, './private/privatekey.pem')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './private/certificate.pem')).toString();

exports.credentials = crypto.createCredentials({key: exports.privateKey, cert: exports.certificate});