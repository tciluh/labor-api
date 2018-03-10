module.exports.provides = 'Image'
module.exports.create = (sequelize, db) => {
    // each image has a correponding filename on the disk
    // and a contentType which is needed for sendFile(..)'ing
    // the file back via express
    // since express otherwise determines the content type via the file extension
    return db.define('image', {
        filename: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        contentType: {
            type: sequelize.STRING,
            allowNull: false
        }
    })
}

module.exports.relations = (context) => {

}
