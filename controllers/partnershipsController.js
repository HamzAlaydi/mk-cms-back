const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    const partnerships = await PartnershipModel.find().sort({ createdAt: -1 });
    
    // Enhance partnerships with shared file references
    const enhancedPartnerships = await Promise.all(
      partnerships.map(async (partnership) => {
        const sharedFiles = await FileSharingService.getSharedFiles('partnership', partnership._id, language);
        return {
          ...partnership.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ partnerships: enhancedPartnerships, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    const partnerships = await PartnershipModel.find().sort({ createdAt: -1 });
    
    // Enhance partnerships with shared file references
    const enhancedPartnerships = await Promise.all(
      partnerships.map(async (partnership) => {
        const sharedFiles = await FileSharingService.getSharedFiles('partnership', partnership._id, language);
        return {
          ...partnership.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ partnerships: enhancedPartnerships, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    const partnership = await PartnershipModel.findById(req.params.id);
    if (!partnership) return res.status(404).json({ error: 'Partnership not found' });
    
    // Enhance partnership with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('partnership', partnership._id, language);
    const enhancedPartnership = {
      ...partnership.toObject(),
      ...sharedFiles
    };
    
    res.json({ partnership: enhancedPartnership, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnership' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    const partnership = await PartnershipModel.findById(req.params.id);
    if (!partnership) return res.status(404).json({ error: 'Partnership not found' });
    
    // Enhance partnership with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('partnership', partnership._id, language);
    const enhancedPartnership = {
      ...partnership.toObject(),
      ...sharedFiles
    };
    
    res.json({ partnership: enhancedPartnership, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnership' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    
    // Create the partnership first
    const partnership = new PartnershipModel(req.body);
    await partnership.save();
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.processFileFields('partnership', partnership._id, language, req.body);
    
    // Update the partnership with processed data if needed
    if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
      Object.assign(partnership, processedData);
      await partnership.save();
    }
    
    // Get the enhanced partnership with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('partnership', partnership._id, language);
    const enhancedPartnership = {
      ...partnership.toObject(),
      ...sharedFiles
    };
    
    res.status(201).json({ message: 'Partnership created', partnership: enhancedPartnership, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.updateSharedFiles('partnership', req.params.id, language, req.body);
    
    // Update the partnership
    const partnership = await PartnershipModel.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );
    
    if (!partnership) return res.status(404).json({ error: 'Partnership not found' });
    
    // Get the enhanced partnership with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('partnership', partnership._id, language);
    const enhancedPartnership = {
      ...partnership.toObject(),
      ...sharedFiles
    };
    
    res.json({ message: 'Partnership updated', partnership: enhancedPartnership, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    
    // Remove shared file references first
    await FileSharingService.removeSharedFiles('partnership', req.params.id);
    
    // Then remove the partnership
    const partnership = await PartnershipModel.findByIdAndDelete(req.params.id);
    if (!partnership) return res.status(404).json({ error: 'Partnership not found' });
    
    res.json({ message: 'Partnership deleted', language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete partnership' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const PartnershipModel = getModel('partnership', language);
    const totalPartnerships = await PartnershipModel.countDocuments();
    const activePartnerships = await PartnershipModel.countDocuments({ isActive: true });
    const featuredPartnerships = await PartnershipModel.countDocuments({ featured: true });
    
    // Get partnerships created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const partnershipsThisMonth = await PartnershipModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalPartnerships,
      active: activePartnerships,
      featured: featuredPartnerships,
      thisMonth: partnershipsThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partnership statistics' });
  }
}; 