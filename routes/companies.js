const express = require('express');
const auth = require('../middleware/auth');
const companiesController = require('../controllers/companiesController');
const { allowAllButRestrictDelete } = require('../middleware/roles');

const router = express.Router();

router.get('/stats/admin', auth, companiesController.getStats);
router.get('/admin', auth, companiesController.getAllAdmin);
router.get('/admin/:id', auth, companiesController.getOneAdmin);
router.get('/public', companiesController.getAllPublic);
router.get('/public/:id', companiesController.getOnePublic);
router.post('/', auth, companiesController.create);
router.patch('/:id', auth, companiesController.update);
router.delete('/:id', auth, allowAllButRestrictDelete, companiesController.remove);

module.exports = router;


