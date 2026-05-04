const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { checkProjectAdmin } = require('../middleware/role');
const taskRoutes = require('./taskRoutes');

router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getProjects);
router.get('/:id', auth, projectController.getProjectDetails);
router.post('/:projectId/members', auth, checkProjectAdmin, projectController.addMember);
router.delete('/:projectId/members/:memberId', auth, checkProjectAdmin, projectController.removeMember);

// Mount task routes under projects
router.use('/:projectId/tasks', taskRoutes);

module.exports = router;
