const Career = require('../models/Career');

exports.getAllAdmin = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json({ careers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ careers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.json({ career });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career || !career.isActive) return res.status(404).json({ error: 'Career not found' });
    res.json({ career });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career' });
  }
};

exports.create = async (req, res) => {
  try {
    const career = new Career(req.body);
    await career.save();
    res.status(201).json({ message: 'Career created', career });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.json({ message: 'Career updated', career });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.json({ message: 'Career deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete career' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const totalCareers = await Career.countDocuments();
    const activeCareers = await Career.countDocuments({ isActive: true });
    const inactiveCareers = await Career.countDocuments({ isActive: false });
    const featuredCareers = await Career.countDocuments({ featured: true });
    
    // Get careers created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const careersThisMonth = await Career.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalCareers,
      active: activeCareers,
      inactive: inactiveCareers,
      featured: featuredCareers,
      thisMonth: careersThisMonth
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career statistics' });
  }
}; 