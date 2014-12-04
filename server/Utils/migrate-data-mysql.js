/**
 * Created by Felipe on 24-11-2014.
 */

module.exports = function(app){
    var sources = [].slice.call(arguments, 1);
    var dataSource = app.dataSources.INFOSESION;
    sources.forEach(function (source) {
        if(source === String) {
            dataSource.automigrate([source], function (er) {
                if (er) throw er;
            });
        }
    });
};

