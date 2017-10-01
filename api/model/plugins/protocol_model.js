module.exports = (sequelize, db, context) => {
    //for each SOP there is one Protocol entry which holds all metadata and the first instruction
    const Protocol = db.define('protocol', {
        name: {
            type: sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize.TEXT,
            allowNull: false
        }
    });
    //each instruction only has a description right now
    const Instruction = db.define('instruction', {
        description: {
            type: sequelize.TEXT,
            allowNull: false,
        },
        isFirst: {
            type: sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    //each Protocol has many Instructions
    Protocol.hasMany(Instruction, {
        as: 'instructions',
        foreignKey: 'protocolId'
    });
    //each Instruction belongs to a protocol
    Instruction.belongsTo(Protocol, {
        as: 'protocol',
        foreignKey: 'protocolId'
    });

    //each instruction results in one or more results (like the beer went dark or light)
    const Result = db.define('result', {
        description: {
            type: sequelize.TEXT,
            allowNull: false,
        }
    });
    //each Result belongs to a protocol
    Result.belongsTo(Protocol, {
        as: 'protocol',
        foreignKey: 'protocolId'
    });
    //each instruction has one or more results
    Instruction.hasMany(Result, {
        as: 'results',
        foreignKey: 'sourceInstructionId'
    });
    //the other way around. Each Result belongs to one source instruction.
    Result.belongsTo(Instruction, {
        as: 'sourceInstruction',
        foreignKey: 'sourceInstructionId'
    })
    //each instruction is the target of an result
    Instruction.hasOne(Result, {
        as: 'sourceResult',
        foreignKey: 'targetInstructionId',
        allowNull: true
        //constraints: false
    });
    //the other way around each result has one target instruction
    Result.belongsTo(Instruction, {
        as: 'targetInstruction',
        foreignKey: 'targetInstructionId',
        allowNull: true,
        //constraints: false
    });

    //An Image which can either belong to an result or an instruction
    const Image = db.define('image', {
        filename: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        contentType: {
            type: sequelize.STRING,
            allowNull: false
        }
    });
    //each Instruction has one or no image.
    Instruction.belongsTo(Image, {
        as: 'image',
        allowNull: true
    });
    //each Result has one or no image.
    Result.belongsTo(Image, {
        as: 'image',
        allowNull: true
    });

    //add exports to context
    context.Protocol = Protocol;
    context.Instruction = Instruction;
    context.Result = Result;
    context.Image = Image;
}
