/**
 * Created by Felipe on 24-11-2014.
 */
var server = require('./server');
var dataSource = server.dataSources.INFOSESION;

dataSource.automigrate(['User', 'Application', 'Role', 'ACL'], function(er) {
    if (er) throw er;
});