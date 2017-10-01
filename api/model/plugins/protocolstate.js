module.exports.provides = "ProtocolState";
module.exports.create = (sequelize, db) => {
    //a protocol state entry describe a progress which was made
    //in a protocol
    //it links back to last result/instruction
    //it also belongs to a user since each user should be able track
    //their own state
    //all of its properties are relations therefore create an empty table here
    return db.define('state', {});
}

module.exports.relations = ({ProtocolState, Protocol, User, Instruction, Result}) => {
    //each state belongs to a protocol. duh!
    ProtocolState.belongsTo(Protocol, {
        as: 'protocol'
    });
    //each Protocol state belongs to one user.
    ProtocolState.belongsTo(User, {
        as: 'user'
    });
    //a protocol state has either a last instruction
    ProtocolState.belongsTo(Instruction, {
        as: 'lastInstruction',
        constraints: false,
        allowNull: true
    });
    //or a last result. Which mark the point of continuation.
    ProtocolState.belongsTo(Result, {
        as: 'lastResult',
        constraints: false,
        allowNull: true
    });

}
