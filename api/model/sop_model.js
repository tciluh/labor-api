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
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
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
//TODO: support images
const Instruction = db.define('instruction', {
    id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});


//each instruction results in one or more results (like the beer went dark or light)
const Result = db.define('result', {
    id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});


//there are users
//needed for logging purposes so that we can track who used a protocol
const User = db.define('user', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
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
            allowNull: false,
        }
});

const Action = db.define({
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
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
        }
        script:{
            type: Sequelize.TEXT,
            allowNull: false
        }
});

const ProtocolState = db.define({
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        }
});

//Relationships
//each protocol has one first instruction.
Protocol.hasOne(Instruction, { as: 'firstInstruction'} );
//each instruction has one or more results
Instruction.hasMany(Result, { as: 'results'} );
//or it has a nextInstruction when the result is unambigous
Instruction.hasOne(Instruction, { as: 'nextInstruction', constraints: false, allowNull: true})
//each result has a resulting instruction
Result.hasOne(Instruction, { as: 'nextInstruction', constraints: false, allowNull:true});
//each Instruction can have an associated action.
Instruction.hasOne(Action, {as: 'action', constraints: false, allowNull: true});
//each Result can have one associated action.
Result.hasOne(Action, {as: 'action', constraints: false, allowNull: true});
//each ProtocolState belongs to one Protocol. Duh!
ProtocolState.belongsTo(Protocol, {as: 'protocol'});
//each Protocol state belongs to one user.
ProtocolState.belongsTo(User, {as: 'user'});
//a protocol state has either a last instruction
//or a last result. Which mark the point of continuation.
ProtocolState.hasOne(Instruction, {as: 'lastInstruction', constraints: false, allowNull: true});
ProtocolState.hasOne(Result, {as: 'lastResult', constraints: false, allowNull: true});

//test the database connection by authenticating
db.authenticate().then(() => console.log("db connection succesful"));
//sync the database (meaning creating the tables if not existent)
db.sync()
    .then(() => console.log('db succesfully synced'))
    .catch((error) => console.error("db sync failed with error: " + error));


//export the Model Objects
module.exports = {
    User: User,
    Protocol: Protocol,
    Instruction: Instruction,
    Result: Result,
    ProtocolState: ProtocolState,
    Action: Action
}

