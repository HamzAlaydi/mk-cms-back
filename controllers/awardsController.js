const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    const awards = await AwardModel.find().sort({ createdAt: -1 });
    
    // Enhance awards with shared file references
    const enhancedAwards = await Promise.all(
      awards.map(async (award) => {
        try {
          const sharedFiles = await FileSharingService.getSharedFiles('award', award._id, language);
          return {
            ...award.toObject(),
            ...sharedFiles
          };
        } catch (error) {
          console.error('Error getting shared files for award:', award._id, error);
          return award.toObject();
        }
      })
    );
    
    res.json({ awards: enhancedAwards, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch awards' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    const awards = await AwardModel.find().sort({ createdAt: -1 });
    
    // Enhance awards with shared file references
    const enhancedAwards = await Promise.all(
      awards.map(async (award) => {
        try {
          const sharedFiles = await FileSharingService.getSharedFiles('award', award._id, language);
          return {
            ...award.toObject(),
            ...sharedFiles
          };
        } catch (error) {
          console.error('Error getting shared files for award:', award._id, error);
          return award.toObject();
        }
      })
    );
    
    res.json({ awards: enhancedAwards, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch awards' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    const award = await AwardModel.findById(req.params.id);
    if (!award) return res.status(404).json({ error: 'Award not found' });
    
    // Enhance award with shared file references
    try {
      const sharedFiles = await FileSharingService.getSharedFiles('award', award._id, language);
      const enhancedAward = {
        ...award.toObject(),
        ...sharedFiles
      };
      res.json({ award: enhancedAward, language });
    } catch (error) {
      console.error('Error getting shared files for award:', award._id, error);
      // Return award without shared files if there's an error
      res.json({ award: award.toObject(), language });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch award' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    const award = await AwardModel.findById(req.params.id);
    if (!award) return res.status(404).json({ error: 'Award not found' });
    
    // Enhance award with shared file references
    try {
      const sharedFiles = await FileSharingService.getSharedFiles('award', award._id, language);
      const enhancedAward = {
        ...award.toObject(),
        ...sharedFiles
      };
      res.json({ award: enhancedAward, language });
    } catch (error) {
      console.error('Error getting shared files for award:', award._id, error);
      // Return award without shared files if there's an error
      res.json({ award: award.toObject(), language });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch award' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    
    console.log('[AWARDS][CREATE] Starting award creation...');
    console.log('[AWARDS][CREATE] Language:', language);
    console.log('[AWARDS][CREATE] Request body:', JSON.stringify(req.body, null, 2));
    
    // Debug file fields specifically
    console.log('[AWARDS][CREATE] Image field:', req.body.image);
    console.log('[AWARDS][CREATE] Documents field:', req.body.documents);
    console.log('[AWARDS][CREATE] Image type:', typeof req.body.image);
    console.log('[AWARDS][CREATE] Documents type:', typeof req.body.documents);
    console.log('[AWARDS][CREATE] Image is array:', Array.isArray(req.body.image));
    console.log('[AWARDS][CREATE] Documents is array:', Array.isArray(req.body.documents));
    
    // Create the award first
    const award = new AwardModel(req.body);
    await award.save();
    
    console.log('[AWARDS][CREATE] Award saved to database:', award._id);
    
    // Process file fields and create shared references
    try {
      console.log('[AWARDS][CREATE] Processing file fields...');
      const processedData = await FileSharingService.processFileFields('award', award._id, language, req.body);
      
      console.log('[AWARDS][CREATE] File fields processed:', JSON.stringify(processedData, null, 2));
      
      // Update the award with processed data if needed
      if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
        console.log('[AWARDS][CREATE] Updating award with processed data...');
        Object.assign(award, processedData);
        await award.save();
        console.log('[AWARDS][CREATE] Award updated with processed data');
      }
    } catch (fileError) {
      console.error('[AWARDS][CREATE] File processing error (non-fatal):', fileError);
      // Continue without file sharing if there's an error
    }
    
    // Get the enhanced award with shared files
    let enhancedAward;
    try {
      const sharedFiles = await FileSharingService.getSharedFiles('award', award._id, language);
      console.log('[AWARDS][CREATE] Shared files retrieved:', JSON.stringify(sharedFiles, null, 2));
      enhancedAward = {
        ...award.toObject(),
        ...sharedFiles
      };
      console.log('[AWARDS][CREATE] Award enhanced with shared files');
    } catch (sharedError) {
      console.error('[AWARDS][CREATE] Shared files error (non-fatal):', sharedError);
      // Return award without shared files if there's an error
      enhancedAward = award.toObject();
    }
    
    console.log('[AWARDS][CREATE] Sending success response...');
    res.status(201).json({ message: 'Award created', award: enhancedAward, language });
    
  } catch (error) {
    console.error('[AWARDS][CREATE] Fatal error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    
    console.log('[AWARDS][UPDATE] Starting award update...');
    console.log('[AWARDS][UPDATE] Award ID:', req.params.id);
    console.log('[AWARDS][UPDATE] Language:', language);
    
    // Process file fields and create shared references
    let processedData = req.body;
    try {
      console.log('[AWARDS][UPDATE] Processing file fields...');
      processedData = await FileSharingService.updateSharedFiles('award', req.params.id, language, req.body);
      console.log('[AWARDS][UPDATE] File fields processed');
    } catch (fileError) {
      console.error('[AWARDS][UPDATE] File processing error (non-fatal):', fileError);
      // Continue without file sharing if there's an error
    }
    
    // Update the award
    const award = await AwardModel.findByIdAndUpdate(
      req.params.id, 
      processedData, 
      { new: true, runValidators: true }
    );
    
    if (!award) return res.status(404).json({ error: 'Award not found' });
    
    console.log('[AWARDS][UPDATE] Award updated in database');
    
    // Get the enhanced award with shared files
    let enhancedAward;
    try {
      const sharedFiles = await FileSharingService.getSharedFiles('award', award._id, language);
      enhancedAward = {
        ...award.toObject(),
        ...sharedFiles
      };
      console.log('[AWARDS][UPDATE] Award enhanced with shared files');
    } catch (sharedError) {
      console.error('[AWARDS][UPDATE] Shared files error (non-fatal):', sharedError);
      // Return award without shared files if there's an error
      enhancedAward = award.toObject();
    }
    
    console.log('[AWARDS][UPDATE] Sending success response...');
    res.json({ message: 'Award updated', award: enhancedAward, language });
    
  } catch (error) {
    console.error('[AWARDS][UPDATE] Fatal error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    
    console.log('[AWARDS][DELETE] Starting award deletion...');
    console.log('[AWARDS][DELETE] Award ID:', req.params.id);
    
    // Remove shared file references first
    try {
      await FileSharingService.removeSharedFiles('award', req.params.id);
      console.log('[AWARDS][DELETE] Shared files removed');
    } catch (fileError) {
      console.error('[AWARDS][DELETE] File removal error (non-fatal):', fileError);
      // Continue with deletion even if file removal fails
    }
    
    // Then remove the award
    const award = await AwardModel.findByIdAndDelete(req.params.id);
    if (!award) return res.status(404).json({ error: 'Award not found' });
    
    console.log('[AWARDS][DELETE] Award deleted from database');
    res.json({ message: 'Award deleted', language });
    
  } catch (error) {
    console.error('[AWARDS][DELETE] Fatal error:', error);
    res.status(500).json({ error: 'Failed to delete award' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const AwardModel = getModel('award', language);
    const totalAwards = await AwardModel.countDocuments();
    const publishedAwards = await AwardModel.countDocuments({ status: 'published' });
    const draftAwards = await AwardModel.countDocuments({ status: 'draft' });
    const featuredAwards = await AwardModel.countDocuments({ featured: true });
    
    // Get awards created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const awardsThisMonth = await AwardModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalAwards,
      published: publishedAwards,
      draft: draftAwards,
      featured: featuredAwards,
      thisMonth: awardsThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch award statistics' });
  }
}; 