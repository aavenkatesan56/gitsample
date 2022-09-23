const { Model, DataTypes } = require('sequelize')

class AdminLog extends Model {}

module.exports = (sq) => {
    AdminLog.init({
        adminLogId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        request: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    }, {
        sequelize: sq,
        tableName: 'admin_log',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['adminLogId'] }]
    })
    return { AdminLog }
}