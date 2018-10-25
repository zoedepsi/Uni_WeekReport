const DB = require('../config')

/**
 *登录接口
 *
 * @param {} username
 * @param {} password 
 */
async function add(ctx) {
    const query = JSON.parse(ctx.query.formData);
    const title = query.title,
        hoster = query.hoster,
        recorder = query.recorder,
        persons = query.persons,
        time = query.time,
        content = query.content,
        toDeal = query.toDeal,
        userid = query.userid,
        dealed = query.dealed;
    await DB('meetrecord').insert({
        'hostmemberid': hoster,
        'recordmemberid': recorder,
        'title': title,
        'content': content,
        'createtime': time,
        'members': persons.toString(),
        'notDeal': toDeal,
        'dealed': dealed,
        'userid': userid
    }).then(res => {
        ctx.state.msg = "添加成功"
    })
}
async function query(ctx) {
    const query = ctx.query;
    const id = query.id;
    if (id) {
        await DB.select('*').from('meetrecord').where('id', id).then(res => {
            ctx.state.data = res;
        })
    } else {
        await DB.select('*').from('meetrecord').then(res => {
            ctx.state.data = res;
        })
    }
}


module.exports = {
    add,
    query
}