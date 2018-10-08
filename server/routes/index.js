const controllers=require('../controller')

const router = require('koa-router')({
  prefix:'/user'
})

router.post('/login', controllers.user.post)


module.exports = router
