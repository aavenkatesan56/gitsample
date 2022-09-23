const { Model, DataTypes } = require('sequelize')

class File extends Model {}

module.exports = (sq) => {
    File.init({
        fileId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        originalName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serverPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
        }
    }, {
        sequelize: sq,
        tableName: 'file',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['fileId'] }]
    })
    return { File }
}