const DB = require('knex')({
    client: 'mysql',
    connection: {
        host: 'cdb-7iitlcjq.cd.tencentcdb.com',
        port: 10017,
        user: 'root',
        password: 'minishop1234',
        database: 'weeklyReport',
        charset: 'utf8mb4',
        multipleStatements: true
    }
})
module.exports = DB