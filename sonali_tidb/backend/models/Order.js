const { pool } = require('../config/db');

const Order = {
  // Shape a DB row + its items into the object the frontend expects
  _format(order, items = []) {
    return {
      _id:          order.id,
      orderId:      order.order_id,
      customerName: order.customer_name,
      phone:        order.phone,
      address:      order.address,
      subtotal:     parseFloat(order.subtotal || 0),
      gstAmount:    parseFloat(order.gst_amount || 0),
      deliveryFee:  parseFloat(order.delivery_fee || 0),
      totalPrice:   parseFloat(order.total_price),
      paymentMethod: order.payment_method || 'cod',
      status:       order.status,
      notes:        order.notes || '',
      createdAt:    order.created_at,
      updatedAt:    order.updated_at,
      items: items.map(i => ({
        _id:        i.id,
        menuItemId: i.menu_item_id,
        name:       i.name,
        price:      parseFloat(i.price),
        quantity:   i.quantity,
      })),
    };
  },

  async _getItems(orderId) {
    const [rows] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?', [orderId]
    );
    return rows;
  },

  async findAll() {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const results = [];
    for (const o of orders) {
      const items = await this._getItems(o.order_id);
      results.push(this._format(o, items));
    }
    return results;
  },

  async findByOrderId(orderId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    if (!rows[0]) return null;
    const items = await this._getItems(orderId);
    return this._format(rows[0], items);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!rows[0]) return null;
    const items = await this._getItems(rows[0].order_id);
    return this._format(rows[0], items);
  },

  async create({ orderId, customerName, phone, address, items, subtotal = 0, gstAmount = 0, deliveryFee = 0, totalPrice, paymentMethod = 'cod', notes = '' }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `INSERT INTO orders (order_id, customer_name, phone, address, subtotal, gst_amount, delivery_fee, total_price, payment_method, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, customerName, phone, address, subtotal, gstAmount, deliveryFee, totalPrice, paymentMethod, notes]
      );

      for (const item of items) {
        await conn.query(
          `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.menuItemId || null, item.name, item.price, item.quantity]
        );
      }

      await conn.commit();
      return this.findByOrderId(orderId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  },

  async deleteAll() {
    // order_items cascades automatically via its FK ON DELETE CASCADE
    await pool.query('DELETE FROM orders');
  },
};

module.exports = Order;
