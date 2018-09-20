const router = require('koa-router')()

router.prefix('/users')
// 登录接口
router.post('/login', async function (ctx) {
  console.log(ctx.request.body)
  ctx.body=(ctx.request.body)
})
// 注册接口,用户名、密码、选择group
router.post('/register',async (ctx)=>{
  console.log(ctx.request.body);
  ctx.state.data=ctx.request.body;
})

module.exports = router
