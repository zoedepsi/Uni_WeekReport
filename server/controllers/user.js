const DB = require('../config')

/**
 *登录接口
 *
 * @param {} username
 * @param {} password 
 */
async function login(ctx) {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    await DB.select('*').from('user').then(res => {
        const usernames = res.filter(item => item.name == username);
        if (usernames.length == 0) {
            ctx.state.code = 1000;
            ctx.state.msg = "用户名错误，请检查用户名是否正确"
            return;
        } else {
            const users = usernames.filter(item => item.password == password);
            if (users.length == 0) {
                ctx.state.code = 1000;
                ctx.state.msg = "密码错误，请检查密码是否正确"
                return;
            } else {
                ctx.state.msg = "登录成功";
                ctx.state.data = users;
                return;
            }
        }
    })
}
/**
 * 注册接口
 * @param {用户名} username
 * @param {密码} password
 * @param {公司} company
 * @param department
 * @param group
 */
async function register(ctx) {
    const params = ctx.request.body;
    const username = params.username;
    const password = params.password;
    const groupId = params.groupId;
    //检查参数
    if (!username || !password || !groupId) {
        ctx.state.code = 1000;
        ctx.state.msg = "参数不全，请补充参数";
        return;
    }

    await DB.insert({
        'name': username,
        'password': password,
        'groupId': groupId
    }).into('user').then(res => {
        ctx.state.data = res;
    })
}
/**
 * 重置密码接口（仅管理员调用）
 * @param {userId} id 
 */
async function resetpass(ctx){
    const id=ctx.request.body.id;
    await DB('user').update({
        "password":'123456'
    }).where('id',id).then(res => {
        ctx.state.data=res;
    })
}


module.exports = {
    login,
    register,
    resetpass
}