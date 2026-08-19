const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) { res.status(401); return next(new Error('Not authorised, no token')); }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) { res.status(401); return next(new Error('Admin not found')); }
    next();
  } catch {
    res.status(401); next(new Error('Not authorised, token failed'));
  }
};

module.exports = { protect };
