module.exports.provides = "Protocol";
module.exports.create = (sequelize, db) => {
    //each protocol has a name and a description
    return db.define('protocol', {
        name: {
            type: sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize.TEXT,
            allowNull: false
        }
    });
}

module.exports.relations = ({Instruction, Protocol, ...ctx}) => {
    //each Protocol has many Instructions
    Protocol.hasMany(Instruction, {
        as: 'instructions',
        foreignKey: 'protocolId'
    });

}
