const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_hongti',
  password        : '9183',
  database        : 'cs340_hongti'
});

module.exports.pool = pool;