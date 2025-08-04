const Partnership = require('../models/Partnership');

exports.getAllAdmin = async (req, res) => {
  try {
    const partnerships = await Partnership.find().sort({ createdAt: -1 });
    res.json({ partnerships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const partnerships = await Partnership.find().sort({ createdAt: -1 });
    res.json({ partnerships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) return res.status(404).json({ error: 'Partnership not found' });
    res.json({ partnership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnership' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) return res.status(404).json({ error: 'Partnership not found' });
    res.json({ partnership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnership' });
  }
};

exports.create = async (req, res) => {
  try {
    const partnership = new Partnership(req.body);
    await partnership.save();
    res.status(201).json({ message: 'Partnership created', partnership });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const partnership = await Partnership.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!partnership) return res.status(404).json({ error: 'Partnership not found' });
    res.json({ message: 'Partnership updated', partnership });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const partnership = await Partnership.findByIdAndDelete(req.params.id);
    if (!partnership)
      return res.status(404).json({ error: "Partnership not found" });
    res.json({ message: "Partnership deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete partnership" });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const totalPartnerships = await Partnership.countDocuments();
    const publishedPartnerships = await Partnership.countDocuments({
      status: "published",
    });
    const draftPartnerships = await Partnership.countDocuments({
      status: "draft",
    });
    const featuredPartnerships = await Partnership.countDocuments({
      featured: true,
    });

    // Get partnerships created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const partnershipsThisMonth = await Partnership.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.json({
      total: totalPartnerships,
      published: publishedPartnerships,
      draft: draftPartnerships,
      featured: featuredPartnerships,
      thisMonth: partnershipsThisMonth,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch partnership statistics" });
  }
}; 