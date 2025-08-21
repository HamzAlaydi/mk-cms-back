# File Sharing System Documentation

## Overview

The File Sharing System allows uploaded files (images, PDFs, etc.) to be shared between both language models of the same entity. This eliminates the need to upload the same file twice when creating content in both English and Arabic.

## How It Works

### 1. File Upload Process
- When a file is uploaded during entity creation/update, it's stored in the regular file storage
- A reference to the file is created in the `SharedFile` collection
- The reference is automatically linked to both language models (EN/AR)

### 2. File Sharing Flow
```
1. Admin uploads file in English entity
2. File is stored in S3/file system
3. SharedFile record is created for both EN and AR
4. When creating Arabic version, files are automatically linked
5. No duplicate uploads needed
```

### 3. Supported Entity Types
- **Awards**: `image`, `documents`
- **Projects**: `images`, `videos`, `documents`
- **Careers**: `image`, `documents`
- **Certifications**: `image`, `documents`
- **Partnerships**: `image`, `attachments`
- **Press**: `image`, `documents`
- **News**: `image`, `documents`
- **Companies**: `logo`

## Database Schema

### SharedFile Model
```javascript
{
  entityType: String,        // 'award', 'project', etc.
  entityId: ObjectId,        // Reference to the entity
  fieldName: String,         // 'image', 'documents', etc.
  fileData: {
    url: String,             // File URL
    name: String,            // Original filename
    type: String,            // MIME type
    size: Number,            // File size in bytes
    uploadedAt: Date         // Upload timestamp
  },
  language: String,          // 'en' or 'ar'
  isShared: Boolean,         // Always true for shared files
  timestamps: true
}
```

## API Endpoints

### File Sharing Routes
```
GET    /api/filesharing/:entityType/:entityId/:language
POST   /api/filesharing/sync/:entityType/:entityId
GET    /api/filesharing/stats/admin
DELETE /api/filesharing/:entityType/:entityId
```

### Controller Updates
All entity controllers now automatically:
- Process file fields during creation/update
- Create shared file references
- Enhance responses with shared file data
- Clean up shared files on deletion

## Frontend Integration

### File Sharing API Service
```javascript
import fileSharingApi from '@/shared/fileSharingApi';

// Check if entity has shared files
const fileStatus = await fileSharingApi.checkFileSharing('award', awardId, 'en');

// Sync files between languages
await fileSharingApi.syncFileReferences('award', awardId, 'en', 'ar');
```

### Automatic File Linking
- Files uploaded in one language automatically appear in the other
- No manual file selection needed for translations
- File references are maintained across language switches

## Benefits

### 1. Reduced Storage
- Files are uploaded only once
- Shared references instead of duplicate files
- Lower storage costs and bandwidth usage

### 2. Improved User Experience
- No need to re-upload files for translations
- Consistent file references across languages
- Faster content creation workflow

### 3. Better Data Consistency
- Files stay synchronized between language versions
- No risk of different files being used in different languages
- Easier content management

## Implementation Details

### Backend Changes
1. **New Models**: `SharedFile` model for file references
2. **New Service**: `FileSharingService` for file operations
3. **Updated Controllers**: All entity controllers now use file sharing
4. **New Routes**: File sharing API endpoints

### Frontend Changes
1. **New API Service**: `fileSharingApi` for file sharing operations
2. **Automatic Integration**: Files are automatically shared between languages
3. **Enhanced UI**: File sharing status indicators

## Migration Guide

### For Existing Data
1. Run the backend with new file sharing system
2. Existing entities will work normally
3. New uploads will automatically use file sharing
4. Old files remain accessible but aren't shared

### For New Content
1. Upload files in any language version
2. Files automatically appear in both languages
3. No additional configuration needed

## Configuration

### Environment Variables
No additional environment variables are required. The system uses existing file upload configurations.

### File Storage
The system works with any file storage backend (S3, local filesystem, etc.) as it only manages references.

## Monitoring and Statistics

### File Usage Stats
```javascript
// Get file sharing statistics
const stats = await fileSharingApi.getFileStats();

// Example response:
{
  stats: [
    {
      _id: "award",
      languages: [
        { language: "en", count: 25, totalSize: 10485760 },
        { language: "ar", count: 25, totalSize: 10485760 }
      ],
      totalFiles: 50,
      totalSize: 20971520
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Files not appearing in other language**
   - Check if SharedFile records exist
   - Verify entityType and entityId are correct
   - Ensure file sharing service is running

2. **Duplicate file uploads**
   - Verify file sharing is enabled
   - Check controller implementation
   - Ensure FileSharingService is imported

3. **Performance issues**
   - Monitor database queries for SharedFile collection
   - Consider indexing optimization
   - Check file processing pipeline

### Debug Mode
Enable debug logging in FileSharingService for detailed operation tracking.

## Future Enhancements

### Planned Features
1. **File Versioning**: Track file changes over time
2. **Bulk Operations**: Mass file sharing operations
3. **File Analytics**: Usage patterns and optimization
4. **CDN Integration**: Automatic CDN URL generation

### Scalability Considerations
1. **Database Indexing**: Optimize SharedFile queries
2. **Caching**: Redis cache for frequently accessed files
3. **Async Processing**: Background file processing
4. **File Compression**: Automatic file optimization

## Support

For technical support or questions about the file sharing system:
1. Check the controller implementations
2. Review the FileSharingService code
3. Monitor database operations
4. Check API endpoint responses

## Conclusion

The File Sharing System provides a robust, scalable solution for managing files across multiple language models. It eliminates duplicate uploads while maintaining data consistency and improving the user experience for content creators.
