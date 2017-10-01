module.exports = (sequelize, db, context) => {
    //A Table which contains every result ever retrieved from an IOPlugin
    const IOResult = db.define('ioresult',
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

    //A Table which contains all IOPlugin Steps associated with an Instruction
    const IOAction = db.define('ioaction',
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

        }
    );

    //add exports to context
    context.IOResult = IOResult;
    context.IOAction = IOAction;
}
