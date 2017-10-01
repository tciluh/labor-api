module.exports.provides = "IOResult";
module.exports.create = (sequelize, db) => {
    //a table which contains all results ever recieved
    //from any plugin handler 
    return db.define('ioresult',
        {
            identifier: {
                type:sequelize.STRING,
                validate: {
                    notEmpty: true
                },
                allowNull: false
            },
            action: {
                type:sequelize.STRING,
                validate: {
                    notEmpty: true
                },
                allowNull: false
            },
            arguments: {
                type: sequelize.JSON,
                allowNull: true
            },
            rawValue: {
                type: sequelize.JSON,
            },
            value: {
                type: sequelize.VIRTUAL,
                get: function() {
                    //unwrap the json object/literal value
                    const json = this.getDataValue('rawValue');
                    return (json && json.value) ? json.value : null;
                },
                set: function(val) {
                    //wrap the value inside an object
                    //this is needed since just a string/value literal is
                    //not valid json. only array/object are valid json top
                    //level objects
                    this.setDataValue('rawValue', {
                        value: val
                    });
                }
            }
        },
    );
}

module.exports.relations = (context) => {
    //stub
}
