const debug = require('debug')

// 相应处理模块
module.exports = async function (ctx, next) {
    try {
        //调用下一个middleware
        await next()
        //处理响应结果，如果直接写在ctx.body中，则不作处理
        //如果ctx.body为空，则使用state作为响应
        ctx.body = ctx.body ? ctx.body : {
            code: ctx.state.code !== undefined ? ctx.state.code : 0,
            data: ctx.state.data !== undefined ? ctx.state.data : {}
        }
    } catch (e) {
        //catch住全局的错误信息
        debug('Catch Error: %o', e)

        //设置状态码为200 -服务端错误
        ctx.status = 200
        //输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
}