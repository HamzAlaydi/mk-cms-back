const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    const certifications = await CertificationModel.find().sort({ createdAt: -1 });
    
    // Enhance certifications with shared file references
    const enhancedCertifications = await Promise.all(
      certifications.map(async (certification) => {
        const sharedFiles = await FileSharingService.getSharedFiles('certification', certification._id, language);
        return {
          ...certification.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ certifications: enhancedCertifications, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    const certifications = await CertificationModel.find().sort({ createdAt: -1 });
    
    // Enhance certifications with shared file references
    const enhancedCertifications = await Promise.all(
      certifications.map(async (certification) => {
        const sharedFiles = await FileSharingService.getSharedFiles('certification', certification._id, language);
        return {
          ...certification.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ certifications: enhancedCertifications, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    const certification = await CertificationModel.findById(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    
    // Enhance certification with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('certification', certification._id, language);
    const enhancedCertification = {
      ...certification.toObject(),
      ...sharedFiles
    };
    
    res.json({ certification: enhancedCertification, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    const certification = await CertificationModel.findById(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    
    // Enhance certification with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('certification', certification._id, language);
    const enhancedCertification = {
      ...certification.toObject(),
      ...sharedFiles
    };
    
    res.json({ certification: enhancedCertification, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    
    // Create the certification first
    const certification = new CertificationModel(req.body);
    await certification.save();
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.processFileFields('certification', certification._id, language, req.body);
    
    // Update the certification with processed data if needed
    if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
      Object.assign(certification, processedData);
      await certification.save();
    }
    
    // Get the enhanced certification with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('certification', certification._id, language);
    const enhancedCertification = {
      ...certification.toObject(),
      ...sharedFiles
    };
    
    res.status(201).json({ message: 'Certification created', certification: enhancedCertification, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.updateSharedFiles('certification', req.params.id, language, req.body);
    
    // Update the certification
    const certification = await CertificationModel.findByIdAndUpdate(
      req.params.id,
      processedData,
      { new: true, runValidators: true }
    );
    
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    
    // Get the enhanced certification with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('certification', certification._id, language);
    const enhancedCertification = {
      ...certification.toObject(),
      ...sharedFiles
    };
    
    res.json({ message: 'Certification updated', certification: enhancedCertification, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    
    // Remove shared file references first
    await FileSharingService.removeSharedFiles('certification', req.params.id);
    
    // Then remove the certification
    const certification = await CertificationModel.findByIdAndDelete(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    
    res.json({ message: 'Certification deleted', language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete certification' });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CertificationModel = getModel('certification', language);
    const totalCertifications = await CertificationModel.countDocuments();
    const activeCertifications = await CertificationModel.countDocuments({ isActive: true });
    const featuredCertifications = await CertificationModel.countDocuments({ featured: true });
    
    // Get certifications created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const certificationsThisMonth = await CertificationModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalCertifications,
      active: activeCertifications,
      featured: featuredCertifications,
      thisMonth: certificationsThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification statistics' });
  }
}; 