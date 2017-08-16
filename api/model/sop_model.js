'use strict;' //use strict mode. see main.js

//sequelize import
const Sequelize = require('sequelize');

//init db connection
const db = new Sequelize('sop', 'sop_user', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'sop.sqlite'
});

db.authenticate().then(() => console.log("db connection succesful"));


const Protocol = db.define('protocol', {
        protocolID: {
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

const Instruction = db.define('instruction', {
    instructionID: {
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

const Result = db.define('result', {
    resultID: {
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

Result.hasOne(Instruction, { as: 'NextInstruction' });
Result.belongsTo(Instruction, { as: 'originInstruction' })


const User = db.define('user', {
        userID: {
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

const LogEntry = db.define('logentry', {



});

module.exports = User;

