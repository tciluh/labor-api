module.exports.provides = 'Result'
module.exports.create = (sequelize, db) => {
    // a result has a description
    return db.define('result', {
        description: {
            type: sequelize.TEXT,
            allowNull: false
        }
    })
}

module.exports.relations = ({Result, Image, Protocol, Instruction, ...ctx}) => {
    // each Result belongs to a protocol
    Result.belongsTo(Protocol, {
        as: 'protocol',
        foreignKey: 'protocolId'
    })

    // each Result has one or no image.
    Result.belongsTo(Image, {
        as: 'image',
        allowNull: true
    })

    // the other way around. Each Result belongs to one source instruction.
    Result.belongsTo(Instruction, {
        as: 'sourceInstruction',
        foreignKey: 'sourceInstructionId'
    })

    // the other way around each result has one target instruction
    Result.belongsTo(Instruction, {
        as: 'targetInstruction',
        foreignKey: 'targetInstructionId',
        allowNull: true
        // constraints: false
    })
}
