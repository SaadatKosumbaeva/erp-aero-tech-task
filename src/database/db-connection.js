import mysql from 'mysql';
import dotenv from 'dotenv';
import { ENV } from '../lib/constants.js';

dotenv.config();

const dbConnection = mysql.createConnection({
  host: process.env[ENV.DB_HOST],
  user: process.env[ENV.DB_USER],
  password: process.env[ENV.DB_PASSWORD],
  database: process.env[ENV.DB_NAME],
  port: process.env[ENV.DB_PORT],
});

dbConnection.connect((error) => {
  if (error) {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (error.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  } else {
    console.log('Successfully connected to MySQL');
  }
});

export default dbConnection;
