const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    const careers = await CareerModel.find().sort({ createdAt: -1 });
    
    // Enhance careers with shared file references
    const enhancedCareers = await Promise.all(
      careers.map(async (career) => {
        const sharedFiles = await FileSharingService.getSharedFiles('career', career._id, language);
        return {
          ...career.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ careers: enhancedCareers, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    const careers = await CareerModel.find().sort({ createdAt: -1 });
    
    // Enhance careers with shared file references
    const enhancedCareers = await Promise.all(
      careers.map(async (career) => {
        const sharedFiles = await FileSharingService.getSharedFiles('career', career._id, language);
        return {
          ...career.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ careers: enhancedCareers, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    const career = await CareerModel.findById(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    
    // Enhance career with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('career', career._id, language);
    const enhancedCareer = {
      ...career.toObject(),
      ...sharedFiles
    };
    
    res.json({ career: enhancedCareer, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    const career = await CareerModel.findById(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    
    // Enhance career with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('career', career._id, language);
    const enhancedCareer = {
      ...career.toObject(),
      ...sharedFiles
    };
    
    res.json({ career: enhancedCareer, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    
    // Create the career first
    const career = new CareerModel(req.body);
    await career.save();
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.processFileFields('career', career._id, language, req.body);
    
    // Update the career with processed data if needed
    if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
      Object.assign(career, processedData);
      await career.save();
    }
    
    // Get the enhanced career with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('career', career._id, language);
    const enhancedCareer = {
      ...career.toObject(),
      ...sharedFiles
    };
    
    res.status(201).json({ message: 'Career created', career: enhancedCareer, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.updateSharedFiles('career', req.params.id, language, req.body);
    
    // Update the career
    const career = await CareerModel.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );
    
    if (!career) return res.status(404).json({ error: 'Career not found' });
    
    // Get the enhanced career with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('career', career._id, language);
    const enhancedCareer = {
      ...career.toObject(),
      ...sharedFiles
    };
    
    res.json({ message: 'Career updated', career: enhancedCareer, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    
    // Remove shared file references first
    await FileSharingService.removeSharedFiles('career', req.params.id);
    
    // Then remove the career
    const career = await CareerModel.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    
    res.json({ message: 'Career deleted', language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete career' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CareerModel = getModel('career', language);
    const totalCareers = await CareerModel.countDocuments();
    const activeCareers = await CareerModel.countDocuments({ isActive: true });
    const featuredCareers = await CareerModel.countDocuments({ featured: true });
    
    // Get careers created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const careersThisMonth = await CareerModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalCareers,
      active: activeCareers,
      featured: featuredCareers,
      thisMonth: careersThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career statistics' });
  }
}; 