const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = new Project({
      name,
      description,
      members: [{ user: req.user.id, role: 'Admin' }]
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user.id }).populate('members.user', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectDetails = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members.user', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const isMember = project.members.find(m => m.user._id.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMember = async (req, res) => {
  const { email, role } = req.body;
  try {
    const project = req.project; // From middleware
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found by email' });

    const isMember = project.members.find(m => m.user.toString() === user.id);
    if (isMember) return res.status(400).json({ message: 'User is already a member' });

    project.members.push({ user: user.id, role: role || 'Member' });
    await project.save();
    
    // Return populated project
    const updatedProject = await Project.findById(project._id).populate('members.user', 'name email');
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeMember = async (req, res) => {
  const { memberId } = req.params;
  try {
    const project = req.project;

    if (memberId === req.user.id) {
      return res.status(400).json({ message: "You cannot remove yourself from the project" });
    }

    const memberIndex = project.members.findIndex(m => m.user.toString() === memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'User is not a member of this project' });
    }

    project.members.splice(memberIndex, 1);
    await project.save();
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
