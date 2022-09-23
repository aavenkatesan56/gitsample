const { Model, DataTypes } = require('sequelize')

class Partner extends Model {}

module.exports = (sq) => {
    Partner.init({
        partnerId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        partnerName: {
            type: DataTypes.STRING
        },
        partnerCategory: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        designation: {
            type: DataTypes.STRING
        },
        logoFileId: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('active','deactivate')
        },
        uuid: {
            type: DataTypes.STRING
        },
        uuidName: {
            type: DataTypes.STRING
        },
        totalBalance: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize: sq,
        tableName: 'partner',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['partnerId'] }]
    })
    return { Partner }
}