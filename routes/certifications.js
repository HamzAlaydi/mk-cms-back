const express = require('express');
const auth = require('../middleware/auth');
const certificationsController = require('../controllers/certificationsController');

const router = express.Router();

router.get('/admin', auth, certificationsController.getAllAdmin);
router.get('/public', certificationsController.getAllPublic);
router.get('/admin/:id', auth, certificationsController.getOneAdmin);
router.get('/public/:id', certificationsController.getOnePublic);
router.post('/', auth, certificationsController.create);
router.put('/:id', auth, certificationsController.update);
router.delete('/:id', auth, certificationsController.remove);

module.exports = router; 