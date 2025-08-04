const Project = require('../models/Project');

exports.getAllAdmin = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getAllPublic = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.getOnePublic = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Add $set operator for partial updates
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated", project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// Stats endpoint for admin dashboard
exports.getStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const publishedProjects = await Project.countDocuments({
      status: "published",
    });
    const draftProjects = await Project.countDocuments({ status: "draft" });
    const featuredProjects = await Project.countDocuments({ featured: true });

    // Get projects created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const projectsThisMonth = await Project.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.json({
      total: totalProjects,
      published: publishedProjects,
      draft: draftProjects,
      featured: featuredProjects,
      thisMonth: projectsThisMonth,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project statistics" });
  }
}; 