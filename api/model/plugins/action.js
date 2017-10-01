module.exports.provides = 'Action';
module.exports.create = (sequelize, db) => {
    //Action describes a shell script/command to be executed on completion/begin of an
    //instruction or result.
    return db.define('action', {
        uid: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        gid: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        workingDirectory: {
            type: sequelize.STRING,
            allowNull: false
        },
        script: {
            type: sequelize.TEXT,
            allowNull: false
        }
    });

}

module.exports.relations = (context) => {
    //TODO: implement this
    //each action should belong to either a result or an instruction
}
