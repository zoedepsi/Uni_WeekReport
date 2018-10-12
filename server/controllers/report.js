const DB = require('../config')

/**
 *获取所有周报数据
 *
 * @param {} username
 * @param {} password 
 */
async function getReports(ctx) {

    const userId = ctx.query.userId;
    const startTime = ctx.query.startTime ? ctx.query.startTime : '0000-00-00';
    const endTime = (ctx.query.endTime ? ctx.query.endTime : '9999-99-99') + ' ' + '24:00:00';
    await DB.select('*').from('report').where('userId', userId).andWhere('createTime', '>=', startTime).andWhere('createTime', '<=', endTime).then(res => {
        ctx.state.data = res;
    })
}
/**
 *添加周报接口
 * 
 * @param {*} userId
 * @param {*} content
 */
async function addReports(ctx) {
    const userId = ctx.query.userId;
    const content = ctx.query.content;
    await DB.insert({
        'content': content,
        'userId': userId
    }).into('report').then(res => {
        ctx.state.data = res;
    })
}

//更新周报接口
// * @param {*} userId
// * @param {*} content
async function updateReports(ctx) {
    const id = ctx.request.body.id;
    const content = ctx.request.body.content;
    await DB('report').update({
        'content': content
    }).where('id', id).then(res => {
        ctx.state.data = res;
    })
}

module.exports = {
    getReports,
    addReports,
    updateReports
}