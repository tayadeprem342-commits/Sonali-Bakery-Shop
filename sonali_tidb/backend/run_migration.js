// One-time migration runner — adds the new pricing/payment columns
// to the existing `orders` table using your existing .env credentials.
//
// Run from the backend/ folder:
//   node run_migration.js

const { pool } = require('./config/db');

const statements = [
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER address`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS gst_amount DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER subtotal`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER gst_amount`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method ENUM('cod','online') NOT NULL DEFAULT 'cod' AFTER total_price`,
  `UPDATE orders SET subtotal = total_price WHERE subtotal = 0 AND total_price > 0`,
];

(async () => {
  console.log('Running migration against your TiDB database...\n');
  for (const sql of statements) {
    try {
      await pool.query(sql);
      console.log('✅', sql.slice(0, 70) + (sql.length > 70 ? '...' : ''));
    } catch (err) {
      console.error('❌ Failed:', sql.slice(0, 70));
      console.error('   ', err.message);
    }
  }
  console.log('\nDone. You can now restart the backend and place an order.');
  process.exit(0);
})();
