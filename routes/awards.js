const express = require('express');
const auth = require('../middleware/auth');
const awardController = require('../controllers/awardsController');

const router = express.Router();

router.get('/admin', auth, awardController.getAllAdmin);
router.get('/public', awardController.getAllPublic);
router.get('/admin/:id', auth, awardController.getOneAdmin);
router.get('/public/:id', awardController.getOnePublic);
router.post('/', auth, awardController.create);
router.patch('/:id', auth, awardController.update);
router.delete('/:id', auth, awardController.remove);
router.get('/stats/admin', auth, awardController.getStats);

module.exports = router; 