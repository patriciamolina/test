/**
 * Created by Felipe on 27-11-2014.
 */

//Utils.createRole(app,{id: 1, name: 'rolEjemplo', description: 'ejemplo de descripcion'});

module.exports = function(server) {
    var sources = [].slice.call(arguments, 1);
    var Role = server.models.Role;

    sources.forEach(function (source) {
        Role.create(source,
            function (err, role) {
                if (err) return console.error(err);
                console.log(role);
            }
        );
    });

};