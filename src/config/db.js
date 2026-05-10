import pkg from 'pg';

const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();



console.log('DB host:', process.env.DB_HOST)
console.log('DB name:', process.env.DB_NAME)


const pool = new Pool({
    user:process.env.DB_USER,
    host: process.env.DB_HOST,  
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export default pool;



