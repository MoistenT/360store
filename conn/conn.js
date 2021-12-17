const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "360store",
});

function query(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

module.exports = {
  query
};