const { Model, DataTypes } = require('sequelize')

class Entity extends Model {}

module.exports = (sq) => {
    Entity.init({
        entityId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        partnerId: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        entityName: {
            type: DataTypes.STRING
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
        status: {
            type: DataTypes.ENUM('active','deactivate')
        },
        totalBalance: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize: sq,
        tableName: 'entity',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['entityId'] }]
    })
    return { Entity }
}