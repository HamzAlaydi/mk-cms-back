const SharedFile = require('../models/SharedFile');
const mongoose = require('mongoose');

class FileSharingService {
  /**
   * Check if database is connected and retry if needed
   */
  static async ensureConnection() {
    if (mongoose.connection.readyState !== 1) {
      console.log(`[FileSharingService] Database not ready, waiting... Current state: ${mongoose.connection.readyState}`);
      // Wait for connection to be ready
      await new Promise((resolve) => {
        if (mongoose.connection.readyState === 1) {
          resolve();
        } else {
          mongoose.connection.once('connected', resolve);
        }
      });
      console.log(`[FileSharingService] Database connection ready`);
    }
  }

  /**
   * Process file fields and create shared file references
   * @param {string} entityType - The type of entity (award, project, etc.)
   * @param {string} entityId - The ID of the entity
   * @param {string} language - The current language
   * @param {Object} data - The entity data with file fields
   * @returns {Object} - The processed data with shared file references
   */
  static async processFileFields(entityType, entityId, language, data) {
    try {
      // Ensure database connection is ready
      await this.ensureConnection();
      
      console.log(`[FileSharingService] Processing file fields for ${entityType}:${entityId} in ${language}`);
      console.log(`[FileSharingService] Data keys:`, Object.keys(data));
      console.log(`[FileSharingService] Full data:`, JSON.stringify(data, null, 2));
      
      const processedData = { ...data };
      
      // Define file fields for each entity type
      const fileFields = {
        award: ['image', 'documents'],
        project: ['images', 'videos', 'documents'],
        career: ['image', 'documents'],
        certification: ['image', 'documents'],
        partnership: ['image', 'attachments'],
        press: ['image', 'documents'],
        news: ['image', 'documents'],
        company: ['logo']
      };

      const entityFileFields = fileFields[entityType] || [];
      console.log(`[FileSharingService] File fields for ${entityType}:`, entityFileFields);
      
      for (const fieldName of entityFileFields) {
        console.log(`[FileSharingService] Processing field: ${fieldName}`);
        console.log(`[FileSharingService] Field value:`, data[fieldName]);
        console.log(`[FileSharingService] Field value type:`, typeof data[fieldName]);
        console.log(`[FileSharingService] Field value is array:`, Array.isArray(data[fieldName]));
        
        // Skip if field is null, undefined, or empty array
        if (!data[fieldName] || (Array.isArray(data[fieldName]) && data[fieldName].length === 0)) {
          console.log(`[FileSharingService] Skipping empty field: ${fieldName}`);
          continue;
        }
        
        if (Array.isArray(data[fieldName])) {
          // Handle array fields (documents, images, etc.)
          console.log(`[FileSharingService] Processing array field: ${fieldName} with ${data[fieldName].length} items`);
          const processedFiles = [];
          
          for (const file of data[fieldName]) {
            console.log(`[FileSharingService] Processing file:`, file);
            console.log(`[FileSharingService] File has URL:`, file && file.url);
            if (file && file.url) {
              try {
                // Create shared file reference
                console.log(`[FileSharingService] Creating shared file reference for ${fieldName}`);
                await SharedFile.setSharedFile(entityType, entityId, fieldName, language, file);
                console.log(`[FileSharingService] Shared file reference created successfully`);
                processedFiles.push(file);
              } catch (error) {
                console.error(`[FileSharingService] Error creating shared file reference:`, error);
                // Continue with the file even if sharing fails
                processedFiles.push(file);
              }
            } else {
              console.log(`[FileSharingService] File skipped (no URL):`, file);
              processedFiles.push(file);
            }
          }
          
          processedData[fieldName] = processedFiles;
          console.log(`[FileSharingService] Array field ${fieldName} processed:`, processedFiles.length, 'files');
        } else if (typeof data[fieldName] === 'object' && data[fieldName].url) {
          // Handle single file fields (image, logo, etc.)
          console.log(`[FileSharingService] Processing single file field: ${fieldName}`);
          console.log(`[FileSharingService] Single file data:`, JSON.stringify(data[fieldName], null, 2));
          try {
            await SharedFile.setSharedFile(entityType, entityId, fieldName, language, data[fieldName]);
            console.log(`[FileSharingService] Single file shared successfully`);
            processedData[fieldName] = data[fieldName];
          } catch (error) {
            console.error(`[FileSharingService] Error sharing single file:`, error);
            // Keep the original file data even if sharing fails
            processedData[fieldName] = data[fieldName];
          }
        } else {
          console.log(`[FileSharingService] Field ${fieldName} is not a valid file object, skipping`);
        }
      }
      
      console.log(`[FileSharingService] File processing completed for ${entityType}:${entityId}`);
      return processedData;
    } catch (error) {
      console.error(`[FileSharingService] Error processing file fields:`, error);
      throw error;
    }
  }

  /**
   * Get shared file references for an entity
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   * @param {string} language - The current language
   * @returns {Object} - Object with file field names as keys and file data as values
   */
  static async getSharedFiles(entityType, entityId, language) {
    try {
      // Ensure database connection is ready
      await this.ensureConnection();
      
      console.log(`[FileSharingService] Getting shared files for ${entityType}:${entityId} in ${language}`);
      
      const sharedFiles = await SharedFile.find({
        entityType,
        entityId,
        language
      });

      console.log(`[FileSharingService] Found ${sharedFiles.length} shared files`);

      const result = {};
      for (const sharedFile of sharedFiles) {
        result[sharedFile.fieldName] = sharedFile.fileData;
        console.log(`[FileSharingService] Added shared file for field: ${sharedFile.fieldName}`);
      }

      console.log(`[FileSharingService] Shared files result:`, Object.keys(result));
      return result;
    } catch (error) {
      console.error(`[FileSharingService] Error getting shared files:`, error);
      throw error;
    }
  }

  /**
   * Update shared file references when entity is updated
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   * @param {string} language - The current language
   * @param {Object} data - The updated entity data
   * @returns {Object} - The processed data with updated file references
   */
  static async updateSharedFiles(entityType, entityId, language, data) {
    try {
      console.log(`[FileSharingService] Updating shared files for ${entityType}:${entityId} in ${language}`);
      return await this.processFileFields(entityType, entityId, language, data);
    } catch (error) {
      console.error(`[FileSharingService] Error updating shared files:`, error);
      throw error;
    }
  }

  /**
   * Remove shared file references when entity is deleted
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   */
  static async removeSharedFiles(entityType, entityId) {
    try {
      // Ensure database connection is ready
      await this.ensureConnection();
      
      console.log(`[FileSharingService] Removing shared files for ${entityType}:${entityId}`);
      const result = await SharedFile.removeEntityFiles(entityType, entityId);
      console.log(`[FileSharingService] Removed ${result.deletedCount} shared file references`);
      return result;
    } catch (error) {
      console.error(`[FileSharingService] Error removing shared files:`, error);
      throw error;
    }
  }

  /**
   * Sync file references between language models
   * @param {string} entityType - The type of entity
   * @param {string} entityId - The ID of the entity
   * @param {string} sourceLanguage - The source language
   * @param {string} targetLanguage - The target language
   */
  static async syncFileReferences(entityType, entityId, sourceLanguage, targetLanguage) {
    try {
      // Ensure database connection is ready
      await this.ensureConnection();
      
      console.log(`[FileSharingService] Syncing files from ${sourceLanguage} to ${targetLanguage} for ${entityType}:${entityId}`);
      
      const sourceFiles = await SharedFile.find({
        entityType,
        entityId,
        language: sourceLanguage
      });

      console.log(`[FileSharingService] Found ${sourceFiles.length} source files to sync`);

      for (const sourceFile of sourceFiles) {
        try {
          await SharedFile.setSharedFile(
            entityType,
            entityId,
            sourceFile.fieldName,
            targetLanguage,
            sourceFile.fileData
          );
          console.log(`[FileSharingService] Synced file for field: ${sourceFile.fieldName}`);
        } catch (error) {
          console.error(`[FileSharingService] Error syncing file for field ${sourceFile.fieldName}:`, error);
        }
      }

      console.log(`[FileSharingService] File sync completed`);
    } catch (error) {
      console.error(`[FileSharingService] Error syncing file references:`, error);
      throw error;
    }
  }

  /**
   * Get file statistics for admin dashboard
   * @returns {Object} - File usage statistics
   */
  static async getFileStats() {
    try {
      // Ensure database connection is ready
      await this.ensureConnection();
      
      console.log(`[FileSharingService] Getting file statistics`);
      
      const stats = await SharedFile.aggregate([
        {
          $group: {
            _id: {
              entityType: '$entityType',
              language: '$language'
            },
            count: { $sum: 1 },
            totalSize: { $sum: '$fileData.size' }
          }
        },
        {
          $group: {
            _id: '$_id.entityType',
            languages: {
              $push: {
                language: '$_id.language',
                count: '$count',
                totalSize: '$totalSize'
              }
            },
            totalFiles: { $sum: '$count' },
            totalSize: { $sum: '$totalSize' }
          }
        }
      ]);

      console.log(`[FileSharingService] File statistics retrieved:`, stats.length, 'entity types');
      return stats;
    } catch (error) {
      console.error(`[FileSharingService] Error getting file statistics:`, error);
      throw error;
    }
  }
}

module.exports = FileSharingService;