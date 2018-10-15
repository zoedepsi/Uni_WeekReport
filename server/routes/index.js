const controllers = require('../controllers')

const router = require('koa-router')({
  prefix: '/weekly'
})
//用户类接口
router.post('/login',controllers.user.login)
router.post('/register',controllers.user.register)
router.post('/password/reset',controllers.user.resetpass)
router.post('/user/getbygroup',controllers.user.getusersbygroupid)


//周报接口
router.post('/report/get',controllers.report.getReports)
router.post('/report/add',controllers.report.addReports)
router.post('/report/getbygroup',controllers.report.getReportsByGroup)
module.exports = router
