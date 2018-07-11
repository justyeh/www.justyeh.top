const mysql = require('mysql2/promise');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'justyeh.top'
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