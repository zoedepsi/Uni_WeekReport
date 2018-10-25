const controllers = require('../controllers')

const router = require('koa-router')({
  prefix: '/weeklyserver'
})
//用户类接口
router.post('/login',controllers.user.login)
router.post('/register',controllers.user.register)
router.post('/password/reset',controllers.user.resetpass)
router.post('/user/getbygroup',controllers.user.getusersbygroupid)


//周报接口
router.post('/report/get',controllers.report.getReports)
router.post('/report/getbyid',controllers.report.getReportById)
router.post('/report/add',controllers.report.addReports)
router.post('/report/update',controllers.report.updateReports)
router.post('/report/getbygroup',controllers.report.getReportsByGroup)
router.post('/report/getLastWeekReport',controllers.report.getLastWeekReport)

module.exports = router
