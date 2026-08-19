const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = {
  async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE username = ?', [username.toLowerCase()]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ username, password }) {
    const existing = await this.findByUsername(username);
    if (existing) throw new Error('Admin account already exists');

    const salt   = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username.toLowerCase(), hashed]
    );
    return this.findById(result.insertId);
  },

  async matchPassword(admin, enteredPassword) {
    return bcrypt.compare(enteredPassword, admin.password);
  },
};

module.exports = Admin;
