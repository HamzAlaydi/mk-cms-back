const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);
    const companies = await CompanyModel.find().sort({ order: 1, createdAt: -1 });
    
    // Enhance companies with shared file references
    const enhancedCompanies = await Promise.all(
      companies.map(async (company) => {
        const sharedFiles = await FileSharingService.getSharedFiles('company', company._id, language);
        return {
          ...company.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ companies: enhancedCompanies, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);
    const companies = await CompanyModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    // Enhance companies with shared file references
    const enhancedCompanies = await Promise.all(
      companies.map(async (company) => {
        const sharedFiles = await FileSharingService.getSharedFiles('company', company._id, language);
        return {
          ...company.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ companies: enhancedCompanies, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);
    const company = await CompanyModel.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    
    // Enhance company with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('company', company._id, language);
    const enhancedCompany = {
      ...company.toObject(),
      ...sharedFiles
    };
    
    res.json({ company: enhancedCompany, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);
    const company = await CompanyModel.findById(req.params.id);
    if (!company || !company.isActive) return res.status(404).json({ error: 'Company not found' });
    
    // Enhance company with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('company', company._id, language);
    const enhancedCompany = {
      ...company.toObject(),
      ...sharedFiles
    };
    
    res.json({ company: enhancedCompany, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);
    
    // Create the company first
    const company = new CompanyModel(req.body);
    await company.save();
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.processFileFields('company', company._id, language, req.body);
    
    // Update the company with processed data if needed
    if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
      Object.assign(company, processedData);
      await company.save();
    }
    
    // Get the enhanced company with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('company', company._id, language);
    const enhancedCompany = {
      ...company.toObject(),
      ...sharedFiles
    };
    
    res.status(201).json({ message: 'Company created', company: enhancedCompany, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);

    // Process file fields and create shared references
    const processedData = await FileSharingService.updateSharedFiles('company', req.params.id, language, req.body);
    
    const updateData = { ...processedData };
    const updateOps = { $set: updateData };
    const unsetOps = {};

    // Allow clearing order when explicitly requested or set to null/empty
    if (req.body.removeOrder === true || req.body.order === null || req.body.order === '') {
      unsetOps.order = "";
      delete updateOps.$set.order;
    }

    // Allow removing logo when explicitly requested or set to null
    if (req.body.removeLogo === true || req.body.logo === null) {
      unsetOps.logo = "";
      delete updateOps.$set.logo;
    }

    if (Object.keys(unsetOps).length > 0) {
      updateOps.$unset = unsetOps;
    }

    const company = await CompanyModel.findByIdAndUpdate(
      req.params.id,
      updateOps,
      { new: true, runValidators: true }
    );
    
    if (!company) return res.status(404).json({ error: 'Company not found' });
    
    // Get the enhanced company with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('company', company._id, language);
    const enhancedCompany = {
      ...company.toObject(),
      ...sharedFiles
    };
    
    res.json({ message: 'Company updated', company: enhancedCompany, language });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);
    
    // Remove shared file references first
    await FileSharingService.removeSharedFiles('company', req.params.id);
    
    // Then remove the company
    const company = await CompanyModel.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    
    res.json({ message: 'Company deleted', language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const CompanyModel = getModel('company', language);
    const totalCompanies = await CompanyModel.countDocuments();
    const activeCompanies = await CompanyModel.countDocuments({ isActive: true });
    const inactiveCompanies = await CompanyModel.countDocuments({ isActive: false });
    
    // Get companies created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const companiesThisMonth = await CompanyModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalCompanies,
      active: activeCompanies,
      inactive: inactiveCompanies,
      thisMonth: companiesThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company statistics' });
  }
};


