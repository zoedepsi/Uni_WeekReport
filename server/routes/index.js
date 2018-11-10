const controllers = require('../controllers')

const router = require('koa-router')({
  prefix: '/weeklyserver'
})
//公共接口
router.post('/queryEnums',controllers.common.queryEnums)
//用户类接口
router.post('/login',controllers.user.login)
router.post('/register',controllers.user.register)
router.post('/password/reset',controllers.user.resetpass)
router.post('/user/getbygroup',controllers.user.getusersbygroupid)
router.post('/user/getuseridbyname',controllers.user.getuseridbyname)
router.post('/user/updateUserInfo',controllers.user.updateUserInfo)
router.post('/user/updatePassword', controllers.user.updatePassword)
router.get('/user/getGroup',controllers.user.getGroup)


//周报接口
router.post('/report/get',controllers.report.getReports)
router.post('/report/getbyid',controllers.report.getReportById)
router.post('/report/add',controllers.report.addReports)
router.post('/report/update',controllers.report.updateReports)
router.post('/report/getbygroup',controllers.report.getReportsByGroup)
router.post('/report/getLastWeekReport', controllers.report.getLastWeekReport)
router.get('/report/queryCount',controllers.report.queryCount)


//会议纪要接口
router.post('/meet/add', controllers.meet.add)
router.post('/meet/query', controllers.meet.query)
router.get('/meet/queryCount', controllers.meet.queryCount)
router.post('/meet/addMeetDiscuss', controllers.meet.addMeetDiscuss)
router.post('/meet/queryDiscuss', controllers.meet.queryDiscuss)
module.exports = router

