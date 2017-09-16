'use strict;' //use strict mode. see main.js

//sequelize import 
const Sequelize = require('sequelize');
//init db connection
const db = new Sequelize('sop', 'sop_user', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'sop.sqlite'
});

//define all database objects
//for each SOP there is one Protocol entry which holds all metadata and the first instruction
const Protocol = db.define('protocol', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});


//each instruction only has a description right now
const Instruction = db.define('instruction', {
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    isFirst: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});


//each instruction results in one or more results (like the beer went dark or light)
const Result = db.define('result', {
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});


//there are users
//needed for logging purposes so that we can track who used a protocol
const User = db.define('user', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false,
        unique: true,
    }
});

//An Image which can either belong to an result or an instruction
const Image = db.define('image', {
    filename: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    contentType: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Action describes a shell script/command to be executed on completion/begin of an
//instruction or result.
const Action = db.define('action', {
    uid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    workingDirectory: {
        type: Sequelize.STRING,
        allowNull: false
    },
    script: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//A table which records the progress of an protocol for a certain user
const ProtocolState = db.define('state', {});

//Relationships
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
//each Instruction can have an associated action.
Instruction.belongsTo(Action, {
    as: 'action',
    constraints: false,
    allowNull: true
});
//each Result can have one associated action.
Result.belongsTo(Action, {
    as: 'action',
    constraints: false,
    allowNull: true
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
//each ProtocolState belongs to one Protocol. Duh!
ProtocolState.belongsTo(Protocol, {
    as: 'protocol'
});
//each Protocol state belongs to one user.
ProtocolState.belongsTo(User, {
    as: 'user'
});
//a protocol state has either a last instruction
//or a last result. Which mark the point of continuation.
ProtocolState.belongsTo(Instruction, {
    as: 'lastInstruction',
    constraints: false,
    allowNull: true
});
ProtocolState.belongsTo(Result, {
    as: 'lastResult',
    constraints: false,
    allowNull: true
});

//test the database connection by authenticating
db.authenticate().then(() => console.log("db connection succesful"));
//sync the database (meaning creating the tables if not existent)
db.sync({
        force: true
    })
    .then(() => console.log('db succesfully synced'))
    .catch((error) => console.error("db sync failed with error: " + error));

//export the Model Objects
module.exports = {
    User: User,
    Protocol: Protocol,
    Instruction: Instruction,
    Result: Result,
    ProtocolState: ProtocolState,
    Action: Action,
    Image: Image
}
