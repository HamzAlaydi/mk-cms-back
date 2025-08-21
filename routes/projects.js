const express = require('express');
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectsController');
const { allowAllButRestrictDelete } = require('../middleware/roles');

const router = express.Router();

router.get('/admin', auth, projectController.getAllAdmin);
router.get('/public', projectController.getAllPublic);
router.get('/admin/:id', auth, projectController.getOneAdmin);
router.get('/public/:id', projectController.getOnePublic);
router.post('/', auth, projectController.create);
router.patch("/:id", projectController.update);
router.delete("/:id", auth, allowAllButRestrictDelete, projectController.remove);
router.get("/stats/admin", auth, projectController.getStats);

module.exports = router; 