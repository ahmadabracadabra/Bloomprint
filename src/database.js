import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getPlants() {
    const [rows] = await pool.query("SELECT * FROM Native_Plant_List");
    return rows;
}

export async function getPlant(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM Native_Plant_List
        WHERE id = ?
    `, [id]);
    return rows[0];
}

export async function createPlant(Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, Bloom_end, Hardiness_zone, Soil_moisture) {
    const [result] = await pool.query(`INSERT INTO Native_Plant_List (Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, Bloom_end, 
        Hardiness_zone, Soil_moisture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, 
            Bloom_end, Hardiness_zone, Soil_moisture]);
        const id = result.insertId 
        return getPlant(id) 
}

export async function deletePlant(id) {
    const [result] = await pool.query(`
        DELETE FROM Native_Plant_List 
        WHERE id = ?
    `, [id]);
    return result.affectedRows > 0;
}


export async function updatePlant(id, Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, Bloom_end, Hardiness_zone, Soil_moisture) {
    const [result] = await pool.query(`
        UPDATE Native_Plant_List 
        SET Scientific_name = ?, Common_name = ?, Type = ?, Height = ?, Width = ?, Spacing = ?, Bloom_color = ?, Light_intensity = ?, Bloom_start = ?, Bloom_end = ?, Hardiness_zone = ?, Soil_moisture = ?
        WHERE id = ?
    `, [Scientific_name, Common_name, Type, Height, Width, Spacing, Bloom_color, Light_intensity, Bloom_start, Bloom_end, Hardiness_zone, Soil_moisture, id]);
    return result.affectedRows > 0 ? getPlant(id) : null;
}