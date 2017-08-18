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

//Relationships
//each protocol has one first instruction.
Protocol.hasOne(Instruction, { as: 'firstInstruction'} );
//each instruction has one or more results
Instruction.hasMany(Result, { as: 'results'} );
//or it has a nextInstruction when the result is unambigous
Instruction.hasOne(Instruction, { as: 'nextInstruction', constraints: false, allowNull: true})
//each result has a resulting instruction
Result.hasOne(Instruction, { as: 'nextInstruction', constraints: false});
//each result belongs to a instruction which lead to the result.
//Result.belongsTo(Instruction, { as: 'originInstruction' })


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
    Result: Result
}

