const Award = require('../models/Award');

exports.getAllAdmin = async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    res.json({ awards });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch awards' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    res.json({ awards });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch awards' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) return res.status(404).json({ error: 'Award not found' });
    res.json({ award });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch award' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) return res.status(404).json({ error: 'Award not found' });
    res.json({ award });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch award' });
  }
};

exports.create = async (req, res) => {
  try {
    const award = new Award(req.body);
    await award.save();
    res.status(201).json({ message: 'Award created', award });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const award = await Award.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!award) return res.status(404).json({ error: 'Award not found' });
    res.json({ message: 'Award updated', award });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);
    if (!award) return res.status(404).json({ error: 'Award not found' });
    res.json({ message: 'Award deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete award' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const totalAwards = await Award.countDocuments();
    const publishedAwards = await Award.countDocuments({ status: 'published' });
    const draftAwards = await Award.countDocuments({ status: 'draft' });
    const featuredAwards = await Award.countDocuments({ featured: true });
    
    // Get awards created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const awardsThisMonth = await Award.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalAwards,
      published: publishedAwards,
      draft: draftAwards,
      featured: featuredAwards,
      thisMonth: awardsThisMonth
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch award statistics' });
  }
}; 