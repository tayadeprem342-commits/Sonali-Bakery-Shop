const MenuItem = require('../models/MenuItem');

const getMenu = async (req, res, next) => {
  try {
    const items = await MenuItem.findAll();
    res.status(200).json(items);
  } catch (error) { next(error); }
};

const addMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, image, category, available } = req.body;
    const item = await MenuItem.create({ name, description, price, image, category, available });
    res.status(201).json(item);
  } catch (error) { next(error); }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.updateById(req.params.id, req.body);
    if (!item) { res.status(404); throw new Error('Menu item not found'); }
    res.status(200).json(item);
  } catch (error) { next(error); }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.deleteById(req.params.id);
    if (!item) { res.status(404); throw new Error('Menu item not found'); }
    res.status(200).json({ message: 'Item removed from menu' });
  } catch (error) { next(error); }
};

const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.toggleAvailable(req.params.id);
    if (!item) { res.status(404); throw new Error('Menu item not found'); }
    res.status(200).json(item);
  } catch (error) { next(error); }
};

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability };
