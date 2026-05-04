const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { checkProjectAdmin, checkProjectMember } = require('../middleware/role');

router.post('/', auth, checkProjectAdmin, taskController.createTask);
router.get('/', auth, checkProjectMember, taskController.getTasks);
router.put('/:id', auth, checkProjectMember, taskController.updateTask);
router.delete('/:id', auth, checkProjectAdmin, taskController.deleteTask);

module.exports = router;
