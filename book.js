const { Model, DataTypes } = require('sequelize')

class Book extends Model {}

module.exports = (sq) => {
  Book.init({
        bookId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        serialNo: {
            type: DataTypes.STRING,
        }
    }, {
        sequelize: sq,
        tableName: 'book',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        indexes: [{ fields: ['bookId'] }]
    })
    return { Book }
}