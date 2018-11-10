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

function getLastWeekFirstDay(day) {
    var date = new Date(day);
    date.setDate(date.getDate() - 6 - date.getDay());
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
}

function getLastWeekLastDay(day) {
    var date = new Date(day);
    date.setDate(date.getDate() - date.getDay());
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
}
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
    await DB.select('*').from('report').where('userId', userId).andWhere('createTime', '>=', startTime).andWhere('createTime', '<=', endTime).orderBy('createTime', 'desc').then(res => {
        ctx.state.data = res;
    })
}

async function getLastWeekReport(ctx) {
    const userId = ctx.query.userId;
    let date = new Date();
    const endTime = getWeekFirstDay(date);
    const startTime = getLastWeekFirstDay(date);
    await DB.select('*').from('report').where('userId', userId).andWhere('createTime', '>=', startTime).andWhere('createTime', '<', endTime).orderBy('createTime', 'desc').then(res => {
        ctx.state.data = res;
    })
}

async function getReportById(ctx) {
    const id = ctx.query.id;
    await DB.select('*').from('report').where('id', id).then(res => {
        ctx.state.data = res;
    })
}

async function getReportsByGroup(ctx) {
    var date = new Date();
    var firstDay = getWeekFirstDay(date);
    var lastDay = getWeekLastDay(date);

    const groupId = ctx.query.groupId;
    const startTime = ctx.query.startTime ? ctx.query.startTime : firstDay;
    const endTime = (ctx.query.endTime ? ctx.query.endTime : lastDay) + ' ' + '24:00:00';
    const lastWeekfirstDay = getLastWeekFirstDay(new Date(startTime));
    const lastWeeklastDay = getLastWeekLastDay(new Date(startTime));
    const userId = ctx.query.userId;
    //通过groupId遍历userID
    var data = {};
    if (groupId == '1' && (!userId || userId == '99999')) {
        await DB.select('id', 'truename').from('user').then(async res => {
            var userArr = res;
            for (var i = 0; i < userArr.length; i++) {
                await DB.select('*').from('report').where('userId', userArr[i].id).andWhere('createTime', '>=', startTime).andWhere('createTime', '<=', endTime).then(res => {
                    if (res.length > 0) {
                        data[userArr[i].truename] = res;
                    }
                })
            }
        })
    } else if (groupId != '1' && (!userId || userId == '99999')) {
        await DB.select('id', 'truename').from('user').where('groupid', groupId).then(async res => {
            var userArr = res;
            for (var i = 0; i < userArr.length; i++) {
                await DB.select('*').from('report').where('userId', userArr[i].id).andWhere('createTime', '>=', startTime).andWhere('createTime', '<=', endTime).then(res => {
                    if (res.length > 0) {
                        data[userArr[i].truename] = res;
                    }
                })
            }
        })
    } else {
        await DB.select('truename').from('user').where('id', userId).then(async res => {
            var truename = res[0].truename;
            await DB.select('*').from('report').where('userId', userId).andWhere('createTime', '>=', startTime).andWhere('createTime', '<=', endTime).then(res => {
                data[truename] = res;
            })
        })
    }

    ctx.state.data = data;

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
    const id = ctx.query.id;
    const content = ctx.query.content;
    await DB('report').update({
        'content': content
    }).where('id', id).then(res => {
        ctx.state.data = res;
    })
}

async function queryCount(ctx) {
    var data = {};
    var startTime = getLastWeekFirstDay(new Date());
    var endTime = getLastWeekLastDay(new Date());
    await DB.count('id').from('report').where('createTime', '>', startTime).andWhere('createTime', '<', endTime).then(res => {
        data.totalCount = res[0]["count(`id`)"];
    })
    await DB('report').count('report.id').innerJoin('user', function () {
        this.on('user.id', '=', 'report.userId')
    }).where('user.groupId', "5").andWhere('report.createTime', '>', startTime).andWhere('report.createTime', '<', endTime).then(res => {
        data.requireCount = res[0]["count(`report`.`id`)"];
    })
    await DB('report').count('report.id').innerJoin('user', function () {
        this.on('user.id', '=', 'report.userId')
    }).where('user.groupId',"<>", "5").andWhere('report.createTime', '>', startTime).andWhere('report.createTime', '<', endTime).then(res => {
        data.devCount = res[0]["count(`report`.`id`)"];
    })
    ctx.state.data = data;
}

module.exports = {
    getReports,
    addReports,
    updateReports,
    getReportsByGroup,
    getReportById,
    getLastWeekReport,
    queryCount
}