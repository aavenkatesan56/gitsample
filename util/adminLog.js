const { DB } = require('../models')

module.exports = {
    saveAdminLog: async function (req, res, next) {
        if (req?.adminInfo?.userId) {
            DB.AdminLog.create({
                userId  : req.adminInfo.userId,
                url     : req.url,
                request : JSON.stringify(req.body) || ''
            })
        }
        next()
    }
}