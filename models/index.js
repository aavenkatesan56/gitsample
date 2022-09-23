const { Sequelize } = require('sequelize')

const sq = new Sequelize(process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD == '' ? null : process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        timezone: '+09:00', // 타임존을 설정
        dialect: 'mysql',
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
        },
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
        pool: {
            min: 1,
            max: 10,
            idle: 5000,
        },
        logging: process.env.NODE_ENV == 'prod' ? false : console.log 
    }
)

const { File } = require('./file')(sq)
const { Partner } = require('./partner')(sq)
//const { Entity } = require('./entity')(sq)
const { Outlet } = require('./outlet')(sq)
const { PartnerCategory } = require('./partner_category')(sq)
const { SalesCounter } = require('./sales_counter')(sq)
const { AdminLog } = require('./admin_log')(sq)

const DB = {
    sq,
    File,
    Partner,
    //Entity,
    Outlet,
    PartnerCategory,
    SalesCounter,
    AdminLog
}

if (process.env.SYNC_DB == '2') {
    sq.sync({ force: true }).then(function () {
        console.log("All models were synchronized successfully.")
    })
} else if (process.env.SYNC_DB == '1') {
    sq.sync({ alter: true }).then(function () {
        console.log("All models were synchronized successfully.")
    })
}

module.exports = { DB }