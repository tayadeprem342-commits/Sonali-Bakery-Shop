const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host:     process.env.TIDB_HOST,
  port:     parseInt(process.env.TIDB_PORT || '4000'),
  user:     process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: { rejectUnauthorized: true },   // TiDB Cloud requires TLS
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ TiDB Cloud connected: ${process.env.TIDB_HOST}`);
    conn.release();
  } catch (err) {
    console.error('❌ TiDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
