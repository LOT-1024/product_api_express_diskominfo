import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

dotenv.config();

const db = mysql.createPool({
    host: process.env.HOST_DB, 
    user: process.env.USER_DB, 
    password: process.env.PASSWORD_DB, 
    database: process.env.DB, 
});

export default db;
