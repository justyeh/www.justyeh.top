const mysql = require('mysql2/promise');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'test'
});

exports.query = async (sql, params) => {
    try {
        let connection = await pool.getConnection();
        let [rows] = await connection.query(sql, params);
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
