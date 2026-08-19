const { pool } = require('../config/db');

const MenuItem = {
  // Shape a DB row into the object the frontend expects (adds _id to match Order's convention)
  _format(row) {
    return { ...row, _id: row.id, available: !!row.available };
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM menu_items ORDER BY category, name'
    );
    return rows.map(r => this._format(r));
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return this._format(rows[0]);
  },

  async create({ name, description = '', price, image = '', category = 'Other', available = true }) {
    const [result] = await pool.query(
      'INSERT INTO menu_items (name, description, price, image, category, available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image, category, available ? 1 : 0]
    );
    return this.findById(result.insertId);
  },

  async updateById(id, fields) {
    const allowed = ['name','description','price','image','category','available'];
    const sets = [];
    const vals = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = ?`);
        vals.push(key === 'available' ? (fields[key] ? 1 : 0) : fields[key]);
      }
    }
    if (!sets.length) return this.findById(id);
    vals.push(id);
    await pool.query(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = ?`, vals);
    return this.findById(id);
  },

  async deleteById(id) {
    const item = await this.findById(id);
    if (!item) return null;
    await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
    return item;
  },

  async toggleAvailable(id) {
    await pool.query(
      'UPDATE menu_items SET available = NOT available WHERE id = ?', [id]
    );
    return this.findById(id);
  },

  async insertMany(items) {
    for (const item of items) {
      await this.create(item);
    }
  },

  async deleteMany() {
    await pool.query('DELETE FROM menu_items');
  },
};

module.exports = MenuItem;
