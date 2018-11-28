// const DB = require('knex')({
//     client: 'mysql',
//     connection: {
//         host: 'cdb-7iitlcjq.cd.tencentcdb.com',
//         port: 10017,
//         user: 'root',
//         password: 'minishop1234',
//         database: 'weeklyReport',
//         charset: 'utf8mb4',
//         multipleStatements: true
//     }
// })
const DB = require('knex')({
    client: 'mysql',
    connection: {
        host: '10.159.42.38',
        port: 3306,
        user: 'root',
        password: 'jDydVJ8hxAGEJ8Fg',
        database: 'weeklyReport',
        charset: 'utf8mb4',
        multipleStatements: true
    }
})
module.exports = DB