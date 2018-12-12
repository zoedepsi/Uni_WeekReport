const DB = require('../config')

function getWeekFirstDay(day) {
    var date = new Date(day);
    date.setDate(date.getDate() + 1 - date.getDay());
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
}

function getWeekLastDay(day) {
    var date = new Date(day);
    date.setDate(date.getDate() + 7 - date.getDay());
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
}

async function add(ctx) {
    const query = JSON.parse(ctx.request.body.formData);
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
    const userid = query.userId;
    const meettype = query.meettype;
    const title = '%' + query.title + '%';
    const hoster = '%' + query.hoster + '%';
    const pageNo=query.pageNo*15;

    if (!meettype||meettype=='0') {
        await DB.select('*').from('meetrecord').where('title', 'like', title).andWhere('hostmemberid','like',hoster).orWhere('recordmemberid','like',hoster).orderBy('createtime', 'desc').limit(pageNo).then(res => {
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
            ctx.state.count=arr.length;
        })
    } else {
        await DB.select('*').from('meetrecord').where('meettype', meettype).andWhere('title', 'like', title).andWhere('hostmemberid','like',hoster).orWhere('recordmemberid','like',hoster).orderBy('createtime', 'desc').limit(pageNo).then(res => {
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
            ctx.state.list = arr;
            ctx.state.count=arr.length;
        })
    }

}

async function queryCount(ctx) {
    var data = {};
    var startTime = getWeekFirstDay(new Date());
    var endTime = getWeekLastDay(new Date());
    await DB.count('id').from('meetrecord').where('createtime', '>', startTime).andWhere('meetrecord.createtime', '<', endTime).then(res => {
        data.totalCount = res[0]["count(`id`)"];
    })
    await DB.count('id').from('meetrecord').where('createtime', '>', startTime).andWhere('meetrecord.createtime', '<', endTime).andWhere('meettype', '需求讨论会').then(res => {
        data.requireCount = res[0]["count(`id`)"];
    })
    await DB.count('id').from('meetrecord').where('createtime', '>', startTime).andWhere('meetrecord.createtime', '<', endTime).andWhere('meettype', '研发讨论会').then(res => {
        data.devCount = res[0]["count(`id`)"];
    })
    ctx.state.data = data;
}
async function addMeetDiscuss(ctx) {
    var relateid = ctx.query.relateid;
    var content = ctx.query.content;
    var createdby = ctx.query.createdby;
    await DB.insert({
        'relateid': relateid,
        'content': content,
        'createdby': createdby
    }).into('meetdiscuss').then(res => {
        ctx.state.data = res;
    })
}

async function queryDiscuss(ctx) {
    var id = ctx.query.relateid;
    await DB.select('meetdiscuss.content', 'user.truename', 'meetdiscuss.createtime').from('meetdiscuss').innerJoin('meetrecord', function () {
        this.on('meetdiscuss.relateid', '=', 'meetrecord.id')
    }).innerJoin('user', function () {
        this.on('user.id', '=', 'meetdiscuss.createdby')
    }).where('meetdiscuss.relateid', id).orderBy('createtime', 'desc').then(res => {
        ctx.state.data = res;
    })
}


module.exports = {
    add,
    query,
    queryCount,
    addMeetDiscuss,
    queryDiscuss
}