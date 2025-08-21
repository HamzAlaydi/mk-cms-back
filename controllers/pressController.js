const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PressModel = getModel('press', language);
    const press = await PressModel.find().sort({ createdAt: -1 });
    
    // Enhance press articles with shared file references
    const enhancedPress = await Promise.all(
      press.map(async (pressArticle) => {
        const sharedFiles = await FileSharingService.getSharedFiles('press', pressArticle._id, language);
        return {
          ...pressArticle.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ press: enhancedPress, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch press articles' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PressModel = getModel('press', language);
    const press = await PressModel.find().sort({ createdAt: -1 });
    
    // Enhance press articles with shared file references
    const enhancedPress = await Promise.all(
      press.map(async (pressArticle) => {
        const sharedFiles = await FileSharingService.getSharedFiles('press', pressArticle._id, language);
        return {
          ...pressArticle.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ press: enhancedPress, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch press articles' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PressModel = getModel('press', language);
    const pressArticle = await PressModel.findById(req.params.id);
    if (!pressArticle) return res.status(404).json({ error: 'Press article not found' });
    
    // Enhance press article with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('press', pressArticle._id, language);
    const enhancedPressArticle = {
      ...pressArticle.toObject(),
      ...sharedFiles
    };
    
    res.json({ press: enhancedPressArticle, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch press article' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PressModel = getModel('press', language);
    const pressArticle = await PressModel.findById(req.params.id);
    if (!pressArticle) return res.status(404).json({ error: 'Press article not found' });
    
    // Enhance press article with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('press', pressArticle._id, language);
    const enhancedPressArticle = {
      ...pressArticle.toObject(),
      ...sharedFiles
    };
    
    res.json({ press: enhancedPressArticle, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch press article' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PressModel = getModel('press', language);
    
    // Create the press article first
    const pressArticle = new PressModel(req.body);
    await pressArticle.save();
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.processFileFields('press', pressArticle._id, language, req.body);
    
    // Update the press article with processed data if needed
    if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
      Object.assign(pressArticle, processedData);
      await pressArticle.save();
    }
    
    // Get the enhanced press article with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('press', pressArticle._id, language);
    const enhancedPressArticle = {
      ...pressArticle.toObject(),
      ...sharedFiles
    };
    
    res.status(201).json({ message: 'Press article created', press: enhancedPressArticle, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log('=== PRESS UPDATE REQUEST ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const language = getLanguage(req);
    console.log('Language detected:', language);
    
    // Validate required fields
    const requiredFields = ['title', 'summary', 'content', 'author', 'publication', 'publishDate'];
    const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Validate and convert publishDate to Date object if it's a string
    if (req.body.publishDate && typeof req.body.publishDate === 'string') {
      const dateObj = new Date(req.body.publishDate);
      if (isNaN(dateObj.getTime())) {
        console.log('Invalid publishDate format:', req.body.publishDate);
        return res.status(400).json({ error: 'Invalid publishDate format' });
      }
      req.body.publishDate = dateObj;
      console.log('Converted publishDate to Date object:', req.body.publishDate);
    }
    
    const PressModel = getModel('press', language);
    console.log('Press model:', PressModel.modelName);
    
    // Check if the press article exists before updating
    const existingPress = await PressModel.findById(req.params.id);
    if (!existingPress) {
      console.log('Press article not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Press article not found' });
    }
    console.log('Existing press article found:', {
      id: existingPress._id,
      title: existingPress.title,
      language: existingPress.lang
    });
    
    // Process file fields and create shared references
    console.log('Processing file fields...');
    const processedData = await FileSharingService.updateSharedFiles('press', req.params.id, language, req.body);
    console.log('File fields processed successfully');
    console.log('Processed data keys:', Object.keys(processedData));
    
    // Update the press article
    console.log('Updating press article...');
    const pressArticle = await PressModel.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );
    
    if (!pressArticle) {
      console.log('Press article not found after update');
      return res.status(404).json({ error: 'Press article not found' });
    }
    
    console.log('Press article updated successfully');
    
    // Get the enhanced press article with shared files
    console.log('Getting shared files...');
    const sharedFiles = await FileSharingService.getSharedFiles('press', pressArticle._id, language);
    console.log('Shared files retrieved');
    
    const enhancedPressArticle = {
      ...pressArticle.toObject(),
      ...sharedFiles
    };
    
    console.log('Update completed successfully');
    res.json({ message: 'Press article updated', press: enhancedPressArticle, language });
  } catch (error) {
    console.error('Press update error:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PressModel = getModel('press', language);
    
    // Remove shared file references first
    await FileSharingService.removeSharedFiles('press', req.params.id);
    
    // Then remove the press article
    const pressArticle = await PressModel.findByIdAndDelete(req.params.id);
    if (!pressArticle) return res.status(404).json({ error: 'Press article not found' });
    
    res.json({ message: 'Press article deleted', language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete press article' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PressModel = getModel('press', language);
    const totalPress = await PressModel.countDocuments();
    const activePress = await PressModel.countDocuments({ isActive: true });
    const featuredPress = await PressModel.countDocuments({ featured: true });
    
    // Get press articles created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const pressThisMonth = await PressModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalPress,
      active: activePress,
      featured: featuredPress,
      thisMonth: pressThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch press statistics' });
  }
}; 