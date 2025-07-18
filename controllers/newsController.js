const News = require('../models/News');

exports.getAllAdmin = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ error: 'News not found' });
    res.json({ news: newsItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ error: 'News not found' });
    res.json({ news: newsItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.create = async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json({ message: 'News created', news });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News updated', news });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete news' });
  }
}; 