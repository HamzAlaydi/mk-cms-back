const express = require('express');
const auth = require('../middleware/auth');
const FileSharingService = require('../services/fileSharingService');
const SharedFile = require('../models/SharedFile');

const router = express.Router();

// Test endpoint to verify file sharing is working
router.get('/test', async (req, res) => {
  try {
    console.log('[FileSharing][TEST] Testing file sharing system...');
    
    // Test database connection
    const dbState = require('mongoose').connection.readyState;
    console.log('[FileSharing][TEST] Database state:', dbState);
    
    // Test SharedFile model
    const testEntityId = require('mongoose').Types.ObjectId();
    const testFileData = {
      url: 'https://example.com/test.jpg',
      name: 'test.jpg',
      type: 'image/jpeg',
      size: 1024000
    };
    
    console.log('[FileSharing][TEST] Creating test shared file...');
    const result = await SharedFile.setSharedFile('award', testEntityId, 'image', 'en', testFileData);
    console.log('[FileSharing][TEST] Test file created:', result);
    
    // Check what's in database
    const allFiles = await SharedFile.listAllFiles();
    console.log('[FileSharing][TEST] Total files in database:', allFiles.length);
    
    // Clean up test data
    await SharedFile.deleteMany({ entityType: 'award' });
    console.log('[FileSharing][TEST] Test data cleaned up');
    
    res.json({ 
      success: true, 
      message: 'File sharing system is working!',
      databaseState: dbState,
      testResult: result,
      totalFiles: allFiles.length
    });
  } catch (error) {
    console.error('[FileSharing][TEST] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'File sharing test failed', 
      message: error.message,
      databaseState: require('mongoose').connection.readyState
    });
  }
});

// Get shared files for an entity
router.get('/:entityType/:entityId/:language', auth, async (req, res) => {
  try {
    const { entityType, entityId, language } = req.params;
    const sharedFiles = await FileSharingService.getSharedFiles(entityType, entityId, language);
    res.json({ sharedFiles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared files', message: error.message });
  }
});

// Sync file references between language models
router.post('/sync/:entityType/:entityId', auth, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { sourceLanguage, targetLanguage } = req.body;
    
    if (!sourceLanguage || !targetLanguage) {
      return res.status(400).json({ error: 'Source and target languages are required' });
    }
    
    await FileSharingService.syncFileReferences(entityType, entityId, sourceLanguage, targetLanguage);
    res.json({ message: 'File references synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync file references', message: error.message });
  }
});

// Get file statistics for admin dashboard
router.get('/stats/admin', auth, async (req, res) => {
  try {
    const stats = await FileSharingService.getFileStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file statistics', message: error.message });
  }
});

// Remove shared files for an entity (used when entity is deleted)
router.delete('/:entityType/:entityId', auth, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    await FileSharingService.removeSharedFiles(entityType, entityId);
    res.json({ message: 'Shared files removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove shared files', message: error.message });
  }
});

module.exports = router;
