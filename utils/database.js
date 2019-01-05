const mysql = require('mysql2/promise');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql123456',
    port: 3306,
    database: 'justyeh'
});

exports.query = async (sql, params) => {
    try {
        var connection = await pool.getConnection();
        var [rows, fields] = await connection.query(sql, params);
        connection.release();
        if (rows) {
            return rows
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}
