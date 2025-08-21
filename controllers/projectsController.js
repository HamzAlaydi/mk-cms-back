const { getModel, getBothLanguageModels } = require('../models/modelFactory');
const FileSharingService = require('../services/fileSharingService');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

exports.getAllAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const ProjectModel = getModel('project', language);
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    
    // Enhance projects with shared file references
    const enhancedProjects = await Promise.all(
      projects.map(async (project) => {
        const sharedFiles = await FileSharingService.getSharedFiles('project', project._id, language);
        return {
          ...project.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ projects: enhancedProjects, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const ProjectModel = getModel('project', language);
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    
    // Enhance projects with shared file references
    const enhancedProjects = await Promise.all(
      projects.map(async (project) => {
        const sharedFiles = await FileSharingService.getSharedFiles('project', project._id, language);
        return {
          ...project.toObject(),
          ...sharedFiles
        };
      })
    );
    
    res.json({ projects: enhancedProjects, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const language = getLanguage(req);
    const ProjectModel = getModel('project', language);
    const project = await ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Enhance project with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('project', project._id, language);
    const enhancedProject = {
      ...project.toObject(),
      ...sharedFiles
    };
    
    res.json({ project: enhancedProject, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const language = getLanguage(req);
    const ProjectModel = getModel('project', language);
    const project = await ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Enhance project with shared file references
    const sharedFiles = await FileSharingService.getSharedFiles('project', project._id, language);
    const enhancedProject = {
      ...project.toObject(),
      ...sharedFiles
    };
    
    res.json({ project: enhancedProject, language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.create = async (req, res) => {
  try {
    const language = getLanguage(req);
    const ProjectModel = getModel('project', language);
    console.log('[PROJECTS][CREATE] Language detected:', language);
    console.log('[PROJECTS][CREATE] Using model:', ProjectModel.modelName);
    try {
      console.log('[PROJECTS][CREATE] Request body:', JSON.stringify(req.body));
    } catch (_) {
      console.log('[PROJECTS][CREATE] Request body not serializable');
    }
    
    // Create the project first
    const project = new ProjectModel(req.body);
    await project.save();
    console.log('[PROJECTS][CREATE] Created project id:', project._id);
    
    // Process file fields and create shared references
    const processedData = await FileSharingService.processFileFields('project', project._id, language, req.body);
    
    // Update the project with processed data if needed
    if (JSON.stringify(processedData) !== JSON.stringify(req.body)) {
      Object.assign(project, processedData);
      await project.save();
    }
    
    // Get the enhanced project with shared files
    const sharedFiles = await FileSharingService.getSharedFiles('project', project._id, language);
    const enhancedProject = {
      ...project.toObject(),
      ...sharedFiles
    };
    
    res.status(201).json({ message: 'Project created', project: enhancedProject, language });
  } catch (error) {
    console.error('[PROJECTS][CREATE] Error:', error && error.message);
    if (error && error.errors) {
      try { console.error('[PROJECTS][CREATE] Validation errors:', JSON.stringify(error.errors)); } catch (_) {}
    }
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log('=== PROJECT UPDATE REQUEST ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const language = getLanguage(req);
    console.log('Language detected:', language);
    
    // Validate required fields
    const requiredFields = ['title', 'summary', 'description', 'location', 'area', 'startDate', 'endDate', 'status'];
    const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // Validate and convert date fields to Date objects if they're strings
    const dateFields = ['startDate', 'endDate'];
    for (const field of dateFields) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        const dateObj = new Date(req.body[field]);
        if (isNaN(dateObj.getTime())) {
          console.log(`Invalid ${field} format:`, req.body[field]);
          return res.status(400).json({ error: `Invalid ${field} format` });
        }
        req.body[field] = dateObj;
        console.log(`Converted ${field} to Date object:`, req.body[field]);
      }
    }
    
    const ProjectModel = getModel('project', language);
    console.log('Project model:', ProjectModel.modelName);
    
    // Check if the project exists before updating
    const existingProject = await ProjectModel.findById(req.params.id);
    if (!existingProject) {
      console.log('Project not found with ID:', req.params.id);
      return res.status(404).json({ error: "Project not found" });
    }
    console.log('Existing project found:', {
      id: existingProject._id,
      title: existingProject.title,
      language: existingProject.lang
    });
    
    // Process file fields and create shared references
    console.log('Processing file fields...');
    const processedData = await FileSharingService.updateSharedFiles('project', req.params.id, language, req.body);
    console.log('File fields processed successfully');
    console.log('Processed data keys:', Object.keys(processedData));
    
    // Update the project
    console.log('Updating project...');
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      { $set: processedData }, // Add $set operator for partial updates
      { new: true, runValidators: true }
    );
    
    if (!project) {
      console.log('Project not found after update');
      return res.status(404).json({ error: "Project not found" });
    }
    
    console.log('Project updated successfully');
    
    // Get the enhanced project with shared files
    console.log('Getting shared files...');
    const sharedFiles = await FileSharingService.getSharedFiles('project', project._id, language);
    console.log('Shared files retrieved');
    
    const enhancedProject = {
      ...project.toObject(),
      ...sharedFiles
    };
    
    console.log('Update completed successfully');
    res.json({ message: "Project updated", project: enhancedProject, language });
  } catch (error) {
    console.error('Project update error:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const language = getLanguage(req);
    const ProjectModel = getModel('project', language);
    
    // Remove shared file references first
    await FileSharingService.removeSharedFiles('project', req.params.id);
    
    // Then remove the project
    const project = await ProjectModel.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted", language });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const language = getLanguage(req);
    const ProjectModel = getModel('project', language);
    const totalProjects = await ProjectModel.countDocuments();
    const completedProjects = await ProjectModel.countDocuments({ status: 'completed' });
    const inProgressProjects = await ProjectModel.countDocuments({ status: 'in-progress' });
    const planningProjects = await ProjectModel.countDocuments({ status: 'planning' });
    
    // Get projects created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const projectsThisMonth = await ProjectModel.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      total: totalProjects,
      completed: completedProjects,
      inProgress: inProgressProjects,
      planning: planningProjects,
      thisMonth: projectsThisMonth,
      language
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project statistics' });
  }
}; 