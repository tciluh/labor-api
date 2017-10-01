module.exports.provides = "User";
module.exports.create = (sequelize, db) => {
    //user object tracks names and email for easy identification
    return db.define('user', {
        firstName: {
            type: sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize.STRING,
            validate: {
                isEmail: true
            },
            allowNull: false,
            unique: true,
        }
    });
}

module.exports.relations = (context) => {
    //stub
}
