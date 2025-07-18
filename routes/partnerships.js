const express = require('express');
const auth = require('../middleware/auth');
const partnershipsController = require('../controllers/partnershipsController');

const router = express.Router();

router.get('/admin', auth, partnershipsController.getAllAdmin);
router.get('/public', partnershipsController.getAllPublic);
router.get('/admin/:id', auth, partnershipsController.getOneAdmin);
router.get('/public/:id', partnershipsController.getOnePublic);
router.post('/', auth, partnershipsController.create);
router.put('/:id', auth, partnershipsController.update);
router.delete('/:id', auth, partnershipsController.remove);

module.exports = router; 