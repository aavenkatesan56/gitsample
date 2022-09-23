const { Model, DataTypes } = require('sequelize')

class SalesCounter extends Model {}

module.exports = (sq) => {
    SalesCounter.init({
        salesCounterId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        outletId: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        salesCounterName: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('active','deactivate')
        },
        uuid: {
            type: DataTypes.STRING
        },
        totalBalance: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize: sq,
        tableName: 'sales_counter',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['salesCounterId'] }]
    })
    return { SalesCounter }
}