const mongoose = require('mongoose');
const SharedFile = require('./models/SharedFile');

// Test the SharedFile model directly
async function testSharedFile() {
  try {
    console.log('🔍 Testing SharedFile model...');
    
    // Test data
    const testData = {
      entityType: 'award',
      entityId: new mongoose.Types.ObjectId(),
      fieldName: 'image',
      language: 'en',
      fileData: {
        url: 'https://example.com/test-image.jpg',
        name: 'test-image.jpg',
        type: 'image/jpeg',
        size: 1024000
      }
    };
    
    console.log('📝 Test data:', JSON.stringify(testData, null, 2));
    
    // Test setSharedFile method
    console.log('\n🔄 Testing setSharedFile...');
    const result = await SharedFile.setSharedFile(
      testData.entityType,
      testData.entityId,
      testData.fieldName,
      testData.language,
      testData.fileData
    );
    
    console.log('✅ setSharedFile result:', result);
    
    // Check what's in the database
    console.log('\n📊 Checking database contents...');
    const allFiles = await SharedFile.listAllFiles();
    
    // Test getSharedFiles
    console.log('\n🔍 Testing getSharedFiles...');
    const sharedFiles = await SharedFile.find({
      entityType: testData.entityType,
      entityId: testData.entityId
    });
    
    console.log('📁 Found shared files:', sharedFiles.length);
    sharedFiles.forEach((file, index) => {
      console.log(`  File ${index + 1}:`, {
        entityType: file.entityType,
        entityId: file.entityId,
        fieldName: file.fieldName,
        language: file.language,
        url: file.fileData?.url,
        createdAt: file.createdAt
      });
    });
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await SharedFile.deleteMany({ entityType: 'award' });
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSharedFile();
