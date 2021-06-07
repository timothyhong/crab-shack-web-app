const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'YOUR_USERNAME_HERE',
  password        : 'YOUR_PASSWORD_HERE',
  database        : 'YOUR_DB_HERE'
});

module.exports.pool = pool;