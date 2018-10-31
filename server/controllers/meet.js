const DB = require('../config')

async function add(ctx) {
    const query = JSON.parse(ctx.query.formData);
    const title = query.title,
        hoster = query.hoster,
        recorder = query.recorder,
        persons = query.persons,
        time = query.time,
        content = query.content,
        meettype=query.meettype,
        userid = query.userid;
    await DB('meetrecord').insert({
        'hostmemberid': hoster,
        'recordmemberid': recorder,
        'title': title,
        'content': content,
        'createtime': time,
        'members': persons.toString(),
        'userid': userid,
        'meettype':meettype
    }).then(res => {
        ctx.state.msg = "添加成功"
    })
}
async function query(ctx) {
    const query = ctx.query;
    const id = query.id;
    if (id) {
        await DB.select('*').from('meetrecord').join('enums', function () {
            this.on('meetrecord.meettype', 'enums.value');
        }).where('meetrecord.id',id).then(res => {
            ctx.state.data = res;
        })
    } else {
        await DB.select('*').from('meetrecord').join('enums', function () {
            this.on('meetrecord.meettype', 'enums.value');
        }).where({'enums.companyid': '1'},{'enums.type':'meettype'}).then(res => {
            ctx.state.data = res;
        })
    }
}


module.exports = {
    add,
    query
}