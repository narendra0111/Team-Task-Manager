const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignee } = req.body;
  const projectId = req.body.projectId || req.params.projectId; // Verified by Admin middleware
  
  try {
    const task = new Task({
      title, description, dueDate, priority, status, project: projectId, assignee
    });
    await task.save();
    
    const populatedTask = await Task.findById(task._id).populate('assignee', 'name email');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    // Member verified by middleware (req.project is set)
    const projectId = req.project._id;
    const tasks = await Task.find({ project: projectId }).populate('assignee', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignee } = req.body;
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Verify task belongs to the project in the URL
    if (task.project.toString() !== req.project._id.toString()) {
       return res.status(400).json({ message: 'Task does not belong to this project' });
    }

    const project = req.project; 
    const member = project.members.find(m => m.user.toString() === req.user.id);
    
    if (member.role === 'Member') {
      if (task.assignee && task.assignee.toString() !== req.user.id) {
         return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      // Members can only update status
      task.status = status || task.status;
    } else {
      // Admin
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      if (assignee !== undefined) task.assignee = assignee ? assignee : null;
    }
    
    await task.save();
    const populatedTask = await Task.findById(task._id).populate('assignee', 'name email');
    res.json(populatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (task.project.toString() !== req.project._id.toString()) {
      return res.status(400).json({ message: 'Task does not belong to this project' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
