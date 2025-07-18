const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadService = require('../services/uploadService');

const router = express.Router();

// Single file upload
router.post('/single', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const uploadResult = await uploadService.processAndUpload(req.file);
    res.json({ success: true, file: uploadResult });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', message: error.message });
  }
});

// Multiple file upload
router.post('/multiple', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const uploadPromises = req.files.map(file => uploadService.processAndUpload(file));
    const uploadResults = await Promise.all(uploadPromises);
    res.json({ success: true, files: uploadResults });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', message: error.message });
  }
});

module.exports = router; 