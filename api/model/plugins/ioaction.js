module.exports.provides = 'IOAction'
module.exports.create = (sequelize, db) => {
    // A Table which contains all IOPlugin Steps associated with an Instruction
    return db.define('ioaction',
        {
            plugin: {
                type: sequelize.STRING,
                validate: {
                    notEmpty: true
                },
                allowNull: false
            },
            action: {
                type: sequelize.STRING,
                validate: {
                    notEmpty: true
                },
                allowNull: false
            },
            humanReadableName: {
                type: sequelize.STRING,
                validate: {
                    notEmpty: true 
                },
                allowNull: false
            },
            arguments: {
                type: sequelize.JSON,
                allowNull: true
            },
            equationIdentifier: {
                type: sequelize.STRING,
                allowNull: true,
                validate: {
                    notEmpty: true
                }
            }

        }
    )
}

module.exports.relations = ({IOAction, Instruction, ...ctx}) => {
    // each IOAction belongs to a instruction
    IOAction.belongsTo(Instruction, {
        as: 'instruction',
        foreignKey: 'instructionId'
    })
}
