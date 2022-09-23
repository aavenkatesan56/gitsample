const { Model, DataTypes } = require('sequelize')

class UserReward extends Model {}

module.exports = (sq) => {
    UserReward.init({
        userRewardId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        rewardId: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        orderId: {
            type: DataTypes.STRING,
        },
        pointHistId: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.INTEGER
        },
        expireDate: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'completed', 'failed', 'expired', 'cancelled', 'voided', 'waiting_for_clearing')
        },
        couponNo: {
            type: DataTypes.STRING
        },
        transactionNo: {
            type: DataTypes.STRING
        },
        partnerId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        }
    }, {
        sequelize: sq,
        tableName: 'user_reward',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['userRewardId'], fields: ['userId'], fields: ['partnerId'] }]
    })
    return { UserReward }
}