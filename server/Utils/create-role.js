/**
 * Created by Felipe on 27-11-2014.
 */
module.exports = function(server) {
    var Role = server.models.Role;
    Role.create({id: 1, name: 'admin', description: 'El rol de Administrador permite a un usuario hacer cualquier acción (Crear, Leer, Editar, Borrar) y ademas gestionar Usuarios dentro de la API.'},
        function (err, role) {
            if (err) return console.error(err);
            console.error(role);
        }
    );

    Role.create({id: 2, name: 'creador', description: 'El rol de creador permite a un usuario crear registros dentro de la API.'},
        function (err, role) {
            if (err) return console.error(err);
            console.error(role);
        }
    );

    Role.create({id: 3, name: 'editor', description: 'El rol de Editor permite a un usuario editar registros dentro de la API.'},
        function (err, role) {
            if (err) return console.error(err);
            console.error(role);
        }
    );

    Role.create({id: 4, name: 'lector', description: 'El rol de Lector permite a un usuario leer registros dentro de la API.'},
        function (err, role) {
            if (err) return console.error(err);
            console.error(role);
        }
    );

    Role.create({id: 5, name: 'eliminador', description: 'El rol de Eliminador permite a un usuario Eliminar registros dentro de la API.'},
        function (err, role) {
            if (err) return console.error(err);
            console.error(role);
        }
    );


};