const debug = require('debug')

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    try {
        ctx.set('Access-Control-Allow-Origin', '*');
        // 调用下一个 middleware
        await next()

        // 处理响应结果
        // 如果直接写入在 body 中，则不作处理
        // 如果写在 ctx.body 为空，则使用 state 作为响应
        ctx.body = ctx.body ? ctx.body : {
            code: ctx.state.code !== undefined ? ctx.state.code : '00000',
            data: ctx.state.data !== undefined ? ctx.state.data : {},
            msg: ctx.state.msg !== undefined ? ctx.state.msg : ''

        }
    } catch (e) {
        // catch 住全局的错误信息
        debug('Catch Error: %o', e)

        // 设置状态码为 200 - 服务端错误
        ctx.status = 200

        // 输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
}
