const controllers = require('../controllers')

const router = require('koa-router')({
  prefix: '/weekly'
})
//用户类接口
router.post('/login',controllers.user.login)
router.post('/register',controllers.user.register)
router.post('/password/reset',controllers.user.resetpass)

//周报接口
router.post('/report/get',controllers.report.getReports)

module.exports = router
