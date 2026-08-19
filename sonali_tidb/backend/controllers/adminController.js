const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) { res.status(400); throw new Error('Please provide username and password'); }

    const admin = await Admin.findByUsername(username);
    if (!admin || !(await Admin.matchPassword(admin, password))) {
      res.status(401); throw new Error('Invalid username or password');
    }

    res.status(200).json({ _id: admin.id, username: admin.username, token: generateToken(admin.id) });
  } catch (error) { next(error); }
};

const createAdmin = async (req, res, next) => {
  try {
    const { username, password, setupKey } = req.body;
    if (setupKey !== process.env.ADMIN_SETUP_KEY) { res.status(403); throw new Error('Invalid setup key'); }

    const admin = await Admin.create({ username, password });
    res.status(201).json({ _id: admin.id, username: admin.username, token: generateToken(admin.id) });
  } catch (error) { next(error); }
};

const getAdminProfile = (req, res) => {
  res.status(200).json({ _id: req.admin.id, username: req.admin.username });
};

module.exports = { loginAdmin, createAdmin, getAdminProfile };
