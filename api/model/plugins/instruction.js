module.exports.provides = 'Instruction'
module.exports.create = (sequelize, db) => {
    // each instruction has a description
    // and a flag whether or not its the first intruction
    // and an optional equation if the client should display a summary of calculated values
    // and an optional timerDuration in seconds for which the client should wait
    // for the corresponding protocol
    return db.define('instruction', {
        description: {
            type: sequelize.TEXT,
            allowNull: false
        },
        isFirst: {
            type: sequelize.BOOLEAN,
            defaultValue: false
        },
        equation: {
            type: sequelize.TEXT,
            allowNull: true,
            defaultValue: null
        },
        timerDuration: {
            type: sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: { min: 0 }
        }
    }, {
        validate: {
            eitherEquationOrTimer () {
                if (this.equation != null && this.timerDuration != null) {
                    throw new Error('Define either a timerDuration or equation but not both.')
                }
            }
        }
    })
}

module.exports.relations = ({Instruction, Protocol, Result, Image, IOAction, ...ctx}) => {
    // each Instruction belongs to a protocol
    Instruction.belongsTo(Protocol, {
        as: 'protocol',
        foreignKey: 'protocolId'
    })

    // each Instruction has one or no image.
    Instruction.belongsTo(Image, {
        as: 'image',
        allowNull: true
    })

    // each instruction may have one or more
    // IOAction associated with it
    Instruction.hasMany(IOAction, {
        as: 'actions',
        foreignKey: 'instructionId',
        allowNull: true
    })

    // each instruction has one or more results
    // to which it leads
    Instruction.hasMany(Result, {
        as: 'results',
        foreignKey: 'sourceInstructionId'
    })

    // each instruction is the target of an result
    Instruction.hasOne(Result, {
        as: 'sourceResult',
        foreignKey: 'targetInstructionId',
        allowNull: true
        // constraints: false
    })
}
