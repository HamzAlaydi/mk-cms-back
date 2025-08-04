const express = require('express');
const auth = require('../middleware/auth');
const careerController = require('../controllers/careersController');

const router = express.Router();

router.get('/admin', auth, careerController.getAllAdmin);
router.get('/public', careerController.getAllPublic);
router.get('/admin/:id', auth, careerController.getOneAdmin);
router.get('/public/:id', careerController.getOnePublic);
router.post('/', auth, careerController.create);
router.patch('/:id', careerController.update);
router.delete('/:id', auth, careerController.remove);
router.get('/stats/admin', auth, careerController.getStats);

module.exports = router; 