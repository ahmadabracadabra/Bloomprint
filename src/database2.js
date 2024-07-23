import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST2,
    user: process.env.MYSQL_USER2,
    password: process.env.MYSQL_PASSWORD2,
    database: process.env.MYSQL_DATABASE2
}).promise();

export async function getMessages() {
    const [rows] = await pool.query("SELECT * FROM visitor_log");
    return rows;
}

export async function getMessage(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM visitor_log
        WHERE id = ?
    `, [id]);
    return rows[0];
}

export async function createMessage(name, email, message) {
    const [result] = await pool.query(`INSERT INTO visitor_log(name, email, message) VALUES (?, ?, ?)`, [name, email, message]);
    const id = result.insertId;
    return getMessage(id);
}

export async function deleteMessage(id) {
    const [result] = await pool.query(`
        DELETE FROM visitor_log
        WHERE id = ?
    `, [id]);
    return result.affectedRows > 0;
}

export async function updateMessage(id, name, email, message) {
    const [result] = await pool.query(`
        UPDATE visitor_log
        SET name = ?, email = ?, message = ?
        WHERE id = ?
    `, [name, email, message, id]);
    return result.affectedRows > 0 ? getMessage(id) : null;
}

