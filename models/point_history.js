const { Model, DataTypes } = require('sequelize')

class PointHistory extends Model { }

module.exports = (sq) => {
    PointHistory.init({
        pointHistId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        oriPointHistId: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        accountId: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        historyType: {
            type: DataTypes.ENUM(['earn', 'use', 'cancel']),
            allowNull: false,
        },
        actionType: {
            type: DataTypes.ENUM(['buy', 'use', 'pay', 'refund', 'send', 'swap', 'points', 'expired']),
            defaultValue: 'buy',
            allowNull: false,
        },
        expireDate: {
            type: DataTypes.DATE,
        },
        partnerId: {
            type: DataTypes.INTEGER,
        },
        partnerName: {
            type: DataTypes.STRING,
        },
        entityId: {
            type: DataTypes.INTEGER,
        },
        entityName: {
            type: DataTypes.STRING,
        },
        outletId: {
            type: DataTypes.INTEGER,
        },
        outletName: {
            type: DataTypes.STRING,
        },
        counterId: {
            type: DataTypes.INTEGER,
        },
        counterName: {
            type: DataTypes.STRING,
        },
        rewardId: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        rewardName: {
            type: DataTypes.STRING,
        },
        orderId: {
            type: DataTypes.STRING,
        },
        productName: {
            type: DataTypes.STRING,
        },
        swapStatus: {
            type: DataTypes.ENUM(['pending', 'processing', 'success', 'failed']),
            defaultValue: 'pending',
        },
        swapTransactionId: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING
        },
        nickName: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize: sq,
        tableName: 'point_history',
        //charset: 'utf8mb4',
        //collate: 'utf8mb4_0900_ai_ci',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['userId'] }, { fields: ['partnerId'] }, { fields: ['historyType','actionType','swapStatus'] }]
    })
    return { PointHistory }
}