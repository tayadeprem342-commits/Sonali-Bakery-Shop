-- Run this once on your TiDB Cloud cluster to create all tables

CREATE DATABASE IF NOT EXISTS sonali_bakery;
USE sonali_bakery;

-- ── ADMINS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── MENU ITEMS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id          INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  image       TEXT,
  category    VARCHAR(100)  NOT NULL DEFAULT 'Other',
  available   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── ORDERS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id       VARCHAR(20)  NOT NULL UNIQUE,
  customer_name  VARCHAR(255) NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  address        TEXT         NOT NULL,
  subtotal       DECIMAL(10,2) NOT NULL DEFAULT 0,
  gst_amount     DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee   DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price    DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cod','online') NOT NULL DEFAULT 'cod',
  status         ENUM('pending','accepted','preparing','out_for_delivery','delivered','cancelled')
                              NOT NULL DEFAULT 'pending',
  notes          TEXT,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── ORDER ITEMS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id     VARCHAR(20)   NOT NULL,
  menu_item_id INT,
  name         VARCHAR(255)  NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  quantity     INT           NOT NULL DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
