const { Model, DataTypes } = require('sequelize')

class Outlet extends Model {}

module.exports = (sq) => {
    Outlet.init({
        outletId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        entityId: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        outletName: {
            type: DataTypes.STRING
        },
        numberOfSalesCounters: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.ENUM('active','deactivate')
        },
        totalBalance: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize: sq,
        tableName: 'outlet',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['outletId'] }]
    })
    return { Outlet }
}