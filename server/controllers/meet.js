const DB = require('../config')

async function add(ctx) {
    const query = JSON.parse(ctx.query.formData);
    const title = query.title,
        hoster = query.hoster,
        recorder = query.recorder,
        persons = query.persons,
        time = query.time,
        content = query.content,
        meettype = query.meettype,
        visiable = query.visiable,
        userid = query.userid;
    await DB('meetrecord').insert({
        'hostmemberid': hoster,
        'recordmemberid': recorder,
        'title': title,
        'content': content,
        'createtime': time,
        'members': persons.toString(),
        'userid': userid,
        'meettype': meettype,
        'visiable': visiable
    }).then(res => {
        ctx.state.msg = "添加成功"
    })
}
async function query(ctx) {
    const query = ctx.query;
    const id = query.id;
    const userid = query.userId;
    if (id) {
        await DB.select('*').from('meetrecord').join('enums', function () {
            this.on('meetrecord.meettype', 'enums.value');
        }).where('meetrecord.id', id).then(res => {
            ctx.state.data = res;
        })
    } else {
        await DB.select('*').from('meetrecord').then(res => {
            var arr = [];
            for (var i in res) {
                if (res[i].visiable == '1') {
                    if (res[i].userid == userid) {
                        arr.push(res[i]);
                    }
                } else if (res[i].visiable == '2') {
                    //仅参会人可见                    
                } else {
                    arr.push(res[i])
                }
            }
            ctx.state.data = arr;
        })
    }
}


module.exports = {
    add,
    query
}