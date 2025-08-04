const Press = require('../models/Press');

// Get all press articles (public)
const getAllPublic = async (req, res) => {
  try {
    const press = await Press.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ press });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one press article (public)
const getOnePublic = async (req, res) => {
  try {
    const press = await Press.findOne({ _id: req.params.id, isActive: true });
    if (!press) {
      return res.status(404).json({ error: 'Press article not found' });
    }
    res.json({ press });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all press articles (admin)
const getAllAdmin = async (req, res) => {
  try {
    const press = await Press.find().sort({ createdAt: -1 });
    res.json({ press });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one press article (admin)
const getOneAdmin = async (req, res) => {
  try {
    const press = await Press.findById(req.params.id);
    if (!press) {
      return res.status(404).json({ error: 'Press article not found' });
    }
    res.json({ press });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new press article
const create = async (req, res) => {
  try {
    const press = new Press(req.body);
    await press.save();
    res.status(201).json({ press });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update press article
const update = async (req, res) => {
  try {
    const press = await Press.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!press) {
      return res.status(404).json({ error: 'Press article not found' });
    }
    res.json({ press });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete press article
const remove = async (req, res) => {
  try {
    const press = await Press.findByIdAndDelete(req.params.id);
    if (!press) {
      return res.status(404).json({ error: 'Press article not found' });
    }
    res.json({ message: 'Press article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPublic,
  getOnePublic,
  getAllAdmin,
  getOneAdmin,
  create,
  update,
  remove,
}; 