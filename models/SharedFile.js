const mongoose = require('mongoose');

const sharedFileSchema = new mongoose.Schema({
  entityType: { 
    type: String, 
    required: true, 
    enum: ['award', 'project', 'career', 'certification', 'partnership', 'press', 'news', 'company'],
    index: true 
  },
  entityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    index: true 
  },
  fieldName: { 
    type: String, 
    required: true 
  },
  fileData: {
    url: { type: String, required: true },
    name: String,
    type: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  },
  language: { 
    type: String, 
    enum: ['en', 'ar'], 
    required: true,
    index: true 
  },
  isShared: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true,
  // Compound index to ensure unique file references per entity field
  indexes: [
    { entityType: 1, entityId: 1, fieldName: 1, language: 1 }
  ]
});

// Method to get shared file for a specific entity and field
sharedFileSchema.statics.getSharedFile = async function(entityType, entityId, fieldName, language) {
  console.log(`[SharedFile][getSharedFile] Looking for ${entityType}:${entityId}, field: ${fieldName}, lang: ${language}`);
  
  // First try to find a shared file for the other language
  const otherLanguage = language === 'en' ? 'ar' : 'en';
  
  let sharedFile = await this.findOne({
    entityType,
    entityId,
    fieldName,
    language: otherLanguage,
    isShared: true
  });

  console.log(`[SharedFile][getSharedFile] Found for other language (${otherLanguage}):`, sharedFile ? 'YES' : 'NO');

  // If no shared file exists, create one for the current language
  if (!sharedFile) {
    sharedFile = await this.findOne({
      entityType,
      entityId,
      fieldName,
      language,
      isShared: true
    });
    console.log(`[SharedFile][getSharedFile] Found for current language (${language}):`, sharedFile ? 'YES' : 'NO');
  }

  return sharedFile;
};

// Method to create or update shared file
sharedFileSchema.statics.setSharedFile = async function(entityType, entityId, fieldName, language, fileData) {
  console.log(`[SharedFile][setSharedFile] Starting for ${entityType}:${entityId}, field: ${fieldName}, lang: ${language}`);
  console.log(`[SharedFile][setSharedFile] File data:`, JSON.stringify(fileData, null, 2));
  
  try {
    // Validate fileData
    if (!fileData || !fileData.url) {
      console.log(`[SharedFile][setSharedFile] Invalid fileData, skipping:`, fileData);
      return null;
    }
    
    // Remove any existing shared files for this entity field
    const deleteResult = await this.deleteMany({
      entityType,
      entityId,
      fieldName
    });
    console.log(`[SharedFile][setSharedFile] Deleted ${deleteResult.deletedCount} existing files`);

    // Create shared file for both languages
    const sharedFiles = [];
    
    // Create for current language
    const currentLangFile = new this({
      entityType,
      entityId,
      fieldName,
      language,
      fileData,
      isShared: true
    });
    sharedFiles.push(currentLangFile);
    console.log(`[SharedFile][setSharedFile] Created file for ${language}`);

    // Create for other language
    const otherLanguage = language === 'en' ? 'ar' : 'en';
    const otherLangFile = new this({
      entityType,
      entityId,
      fieldName,
      language: otherLanguage,
      fileData,
      isShared: true
    });
    sharedFiles.push(otherLangFile);
    console.log(`[SharedFile][setSharedFile] Created file for ${otherLanguage}`);

    // Save all shared files
    console.log(`[SharedFile][setSharedFile] Inserting ${sharedFiles.length} shared files`);
    // Use the model constructor to avoid binding issues
    const insertResult = await this.constructor.insertMany(sharedFiles);
    console.log(`[SharedFile][setSharedFile] Successfully inserted ${insertResult.length} files`);
    return insertResult;
  } catch (error) {
    console.error(`[SharedFile][setSharedFile] Error:`, error);
    throw error;
  }
};

// Method to remove shared files for an entity
sharedFileSchema.statics.removeEntityFiles = async function(entityType, entityId) {
  return await this.deleteMany({
    entityType,
    entityId
  });
};

// Method to list all shared files for debugging
sharedFileSchema.statics.listAllFiles = async function() {
  const allFiles = await this.find({}).sort({ createdAt: -1 });
  console.log(`[SharedFile][listAllFiles] Total files in database: ${allFiles.length}`);
  allFiles.forEach((file, index) => {
    console.log(`[SharedFile][listAllFiles] File ${index + 1}:`, {
      entityType: file.entityType,
      entityId: file.entityId,
      fieldName: file.fieldName,
      language: file.language,
      url: file.fileData?.url,
      createdAt: file.createdAt
    });
  });
  return allFiles;
};

module.exports = mongoose.model('SharedFile', sharedFileSchema);
