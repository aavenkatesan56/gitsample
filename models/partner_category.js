const { Model, DataTypes } = require('sequelize')

class Partner_category extends Model {}

module.exports = (sq) => {
    Partner_category.init({
        partnerCategoryId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryName: {
            type: DataTypes.STRING,
        },
        sort: {
            type: DataTypes.INTEGER,
        },
    }, {
        sequelize: sq,
        tableName: 'partner_category',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['partnerCategoryId'] }]
    })
    return { PartnerCategory: Partner_category }
}