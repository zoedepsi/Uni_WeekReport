const DB = require('../config')

async function queryEnums(ctx) {
    const query = ctx.query;
    const id = query.companyId;
    const type = query.type;
    await DB.select('*').from('enums').where({
        'type': type
    }, {
        'companyId': id
    }).then(res => {
        ctx.state.data = res;
    })
}


module.exports = {
    queryEnums
}