module.exports = (sequelize, db, context) => {
    
    //there are users
    //needed for logging purposes so that we can track who used a protocol
    const User = db.define('user', {
        firstName: {
            type: sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize.STRING,
            validate: {
                isEmail: true
            },
            allowNull: false,
            unique: true,
        }
    });

    //A table which records the progress of an protocol for a certain user
    const ProtocolState = db.define('state', {});
    //each ProtocolState belongs to one Protocol. Duh!
    ProtocolState.belongsTo(context.Protocol, {
        as: 'protocol'
    });
    //each Protocol state belongs to one user.
    ProtocolState.belongsTo(User, {
        as: 'user'
    });
    //a protocol state has either a last instruction
    //or a last result. Which mark the point of continuation.
    ProtocolState.belongsTo(context.Instruction, {
        as: 'lastInstruction',
        constraints: false,
        allowNull: true
    });
    ProtocolState.belongsTo(context.Result, {
        as: 'lastResult',
        constraints: false,
        allowNull: true
    });

    //Action describes a shell script/command to be executed on completion/begin of an
    //instruction or result.
    const Action = db.define('action', {
        uid: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        gid: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        workingDirectory: {
            type: sequelize.STRING,
            allowNull: false
        },
        script: {
            type: sequelize.TEXT,
            allowNull: false
        }
    });

    //add orm's to context
    context.User = User;
    context.Action = Action;
    context.ProtocolState = ProtocolState;
}

