const express = require('express');
const router = express.Router();
const pressController = require('../controllers/pressController');
const auth = require('../middleware/auth');

// Public routes
router.get('/public', pressController.getAllPublic);
router.get('/public/:id', pressController.getOnePublic);

// Admin routes (protected)
router.get('/admin', auth, pressController.getAllAdmin);
router.get('/admin/:id', auth, pressController.getOneAdmin);
router.post('/', auth, pressController.create);
router.patch('/:id', auth, pressController.update);
router.delete('/:id', auth, pressController.remove);

module.exports = router; 