'use strict;' //use strict mode. see main.js

//sequelize import
const Sequelize = require('sequelize');

//init db connection
const db = new Sequelize('sop', 'sop_user', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'sop.sqlite'
});


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

Protocol.hasOne(Instruction, { as: 'firstInstruction'} );

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

Instruction.hasMany(Result, { as: 'results'} );

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

Result.hasOne(Instruction, { as: 'nextInstruction' });
Result.belongsTo(Instruction, { as: 'originInstruction' })

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
        }
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        }
});

db.authenticate().then(() => console.log("db connection succesful"));
db.sync()
    .then(() => console.log('db succesfully synced'))
    .catch((error) => console.error("db sync failed with error: " + error));


module.exports = {
    User: User,
    Protocol: Protocol,
    Instruction: Instruction,
    Result: Result
}

