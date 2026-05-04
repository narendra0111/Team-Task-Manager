const Project = require('../models/Project');

const checkProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
    if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const member = project.members.find(m => m.user.toString() === req.user.id);
    if (!member || member.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied: Requires Admin role' });
    }
    
    req.project = project;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error checkProjectAdmin' });
  }
};

const checkProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
    if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const member = project.members.find(m => m.user.toString() === req.user.id);
    if (!member) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this project' });
    }
    
    req.project = project;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error checkProjectMember' });
  }
};

module.exports = { checkProjectAdmin, checkProjectMember };
