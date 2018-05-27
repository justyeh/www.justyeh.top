const mysql = require('mysql2/promise');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'justyeh'
});


exports.query = async(sql, params) => {
    try {
        var connection = await pool.getConnection();
        var rows = await connection.query(sql, params);
        connection.release();
        return rows
    } catch (error) {
        return false;
    }
}