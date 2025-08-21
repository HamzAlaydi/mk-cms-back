const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    const news = await NewsModel.find().sort({ createdAt: -1 });
    
    // Enhance news articles with shared file references
    const enhancedNews = await Promise.all(
      news.map(async (newsArticle) => {
        const sharedFiles = await FileSharingService.getSharedFiles('news', newsArticle._id, language);
        return {
          ...newsArticle.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ news: enhancedNews, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    const news = await NewsModel.find().sort({ createdAt: -1 });
    
    // Enhance news articles with shared file references
    const enhancedNews = await Promise.all(
      news.map(async (newsArticle) => {
        const sharedFiles = await FileSharingService.getSharedFiles('news', newsArticle._id, language);
        return {
          ...newsArticle.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ news: enhancedNews, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    const newsArticle = await NewsModel.findById(req.params.id);
    if (!newsArticle) return res.status(404).json({ error: 'News article not found' });
    
    // Enhance news article with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('news', newsArticle._id, language);
    const enhancedNewsArticle = {
      ...newsArticle.toObject(),
      ...sharedFiles
    };
    
    res.json({ news: enhancedNewsArticle, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    const newsArticle = await NewsModel.findById(req.params.id);
    if (!newsArticle) return res.status(404).json({ error: 'News article not found' });
    
    // Enhance news article with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('news', newsArticle._id, language);
    const enhancedNewsArticle = {
      ...newsArticle.toObject(),
      ...sharedFiles
    };
    
    res.json({ news: enhancedNewsArticle, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    
    // Create the news article first
    const newsArticle = new NewsModel(req.body);
    await newsArticle.save();
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.processFileFields('news', newsArticle._id, language, req.body);
    
    // Update the news article with processed data if needed
    if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
      Object.assign(newsArticle, processedData);
      await newsArticle.save();
    }
    
    // Get the enhanced news article with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('news', newsArticle._id, language);
    const enhancedNewsArticle = {
      ...newsArticle.toObject(),
      ...sharedFiles
    };
    
    res.status(201).json({ message: 'News article created', news: enhancedNewsArticle, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.updateSharedFiles('news', req.params.id, language, req.body);
    
    // Update the news article
    const newsArticle = await NewsModel.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );
    
    if (!newsArticle) return res.status(404).json({ error: 'News article not found' });
    
    // Get the enhanced news article with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('news', newsArticle._id, language);
    const enhancedNewsArticle = {
      ...newsArticle.toObject(),
      ...sharedFiles
    };
    
    res.json({ message: 'News article updated', news: enhancedNewsArticle, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    
    // Remove shared file references first
    await FileSharingService.removeSharedFiles('news', req.params.id);
    
    // Then remove the news article
    const newsArticle = await NewsModel.findByIdAndDelete(req.params.id);
    if (!newsArticle) return res.status(404).json({ error: 'News article not found' });
    
    res.json({ message: 'News article deleted', language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete news article' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const NewsModel = getModel('news', language);
    const totalNews = await NewsModel.countDocuments();
    const publishedNews = await NewsModel.countDocuments({ status: 'published' });
    const draftNews = await NewsModel.countDocuments({ status: 'draft' });
    const featuredNews = await NewsModel.countDocuments({ featured: true });
    
    // Get news articles created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newsThisMonth = await NewsModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalNews,
      published: publishedNews,
      draft: draftNews,
      featured: featuredNews,
      thisMonth: newsThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news statistics' });
  }
}; 