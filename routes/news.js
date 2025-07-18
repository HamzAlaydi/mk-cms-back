const express = require('express');
const auth = require('../middleware/auth');
const newsController = require('../controllers/newsController');

const router = express.Router();

router.get('/admin', auth, newsController.getAllAdmin);
router.get('/public', newsController.getAllPublic);
router.get('/admin/:id', auth, newsController.getOneAdmin);
router.get('/public/:id', newsController.getOnePublic);
router.post('/', auth, newsController.create);
router.put('/:id', auth, newsController.update);
router.delete('/:id', auth, newsController.remove);

module.exports = router; 