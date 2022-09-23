const { Model, DataTypes } = require('sequelize')

class User extends Model { }

module.exports = (sq) => {
    User.init({
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nickName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        dupInfo: {
            type: DataTypes.STRING,
        },
        connInfo: {
            type: DataTypes.STRING,
        },
        birthday: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        nationalInfo: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        grade: {
            type: DataTypes.ENUM('blue', 'silver', 'gold', 'black'),
            defaultValue: 'blue',
        },
        type: {
            type: DataTypes.ENUM('normal', 'test'),
            defaultValue: 'normal',
        },
        gcdmId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gcdmAccessToken: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'inactive', 'deactivated', 'withdraw'),
            defaultValue: 'pending',
            allowNull: false,
        },
        onBoarding:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        withdrawDate:{
            type: DataTypes.DATE,
        },
        fcmToken: {
            type: DataTypes.STRING,
        },
        tokenArn: {
            type: DataTypes.STRING,
        },
        excellenceBadge: {
            type: DataTypes.DATE,
        },
        mBadge: {
            type: DataTypes.DATE,
        },
        iBadge: {
            type: DataTypes.DATE,
        },
        lastLoginDate:{
            type: DataTypes.DATE,
        },
        membershipExpireDate:{
            type: DataTypes.DATE,
        },
        membershipAmount:{
            type: DataTypes.BIGINT.UNSIGNED,
        },
    }, {
        sequelize: sq,
        tableName: 'user',
        //charset: 'utf8mb4',
        //collate: 'utf8mb4_0900_ai_ci',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['userId'] }]
    })
    return { User }
}