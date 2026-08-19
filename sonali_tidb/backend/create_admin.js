/**
 * create_admin.js — Run once to create the admin account
 * Usage: node create_admin.js
 * 
 * Edit the username and password below before running!
 */
const dotenv = require('dotenv');
dotenv.config();
const { connectDB, pool } = require('./config/db');
const Admin = require('./models/Admin');

// ── SET YOUR CREDENTIALS HERE ─────────────────
const ADMIN_USERNAME = 'sonali_admin';
const ADMIN_PASSWORD = 'Sonali@2024';
// ──────────────────────────────────────────────

const run = async () => {
  try {
    await connectDB();

    // Check if already exists
    const existing = await Admin.findByUsername(ADMIN_USERNAME);
    if (existing) {
      console.log(`⚠️  Admin "${ADMIN_USERNAME}" already exists. Nothing created.`);
      console.log('   To reset password, delete the row from admins table and run again.');
      await pool.end();
      process.exit(0);
    }

    const admin = await Admin.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    console.log('');
    console.log('✅ Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Username : ${ADMIN_USERNAME}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('─────────────────────────────────────');
    console.log('   👉 Login at: http://localhost:5173/login');
    console.log('   ⚠️  Delete this file after use for security!');
    console.log('');

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
};

run();
