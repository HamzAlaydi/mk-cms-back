const Certification = require('../models/Certification');

exports.getAllAdmin = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.json({ certifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.json({ certifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    res.json({ certification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    res.json({ certification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
};

exports.create = async (req, res) => {
  try {
    const certification = new Certification(req.body);
    await certification.save();
    res.status(201).json({ message: 'Certification created', certification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    res.json({ message: 'Certification updated', certification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete certification' });
  }
}; 