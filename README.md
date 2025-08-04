# MK Group Backend API

A high-performance Node.js backend API for the MK Group website with MongoDB, AWS S3 integration, and comprehensive admin functionality.

## Features

- **Authentication**: JWT-based admin authentication
- **Content Management**: Full CRUD operations for all content types
- **File Uploads**: AWS S3 integration with image/video processing
- **Bilingual Support**: Arabic/English content management
- **Security**: Rate limiting, CORS, input validation
- **Performance**: Optimized database queries and file processing

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- AWS S3 Account

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Environment Setup**
Create a `.env` file in the backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mkgroup-website

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=mkgroup-website-uploads

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Limits
MAX_FILE_SIZE=100MB
MAX_VIDEO_SIZE=500MB
```

3. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
```
POST /api/auth/login          - Admin login
GET  /api/auth/profile        - Get admin profile
POST /api/auth/logout         - Logout
POST /api/auth/init           - Initialize admin account
```

### Projects
```
GET    /api/projects/admin     - Get all projects (admin)
GET    /api/projects/public    - Get published projects (public)
POST   /api/projects           - Create project
PUT    /api/projects/:id       - Update project
DELETE /api/projects/:id       - Delete project
PATCH  /api/projects/:id/status    - Update status
PATCH  /api/projects/:id/priority  - Update priority
GET    /api/projects/stats/admin    - Get statistics
```

### Partnerships
```
GET    /api/partnerships/admin     - Get all partnerships (admin)
GET    /api/partnerships/public    - Get published partnerships (public)
POST   /api/partnerships           - Create partnership
PUT    /api/partnerships/:id       - Update partnership
DELETE /api/partnerships/:id       - Delete partnership
PATCH  /api/partnerships/:id/status    - Update status
PATCH  /api/partnerships/:id/priority  - Update priority
GET    /api/partnerships/stats/admin    - Get statistics
```

### Awards
```
GET    /api/awards/admin     - Get all awards (admin)
GET    /api/awards/public    - Get published awards (public)
POST   /api/awards           - Create award
PUT    /api/awards/:id       - Update award
DELETE /api/awards/:id       - Delete award
PATCH  /api/awards/:id/status    - Update status
PATCH  /api/awards/:id/priority  - Update priority
GET    /api/awards/stats/admin    - Get statistics
```

### Certifications
```
GET    /api/certifications/admin     - Get all certifications (admin)
GET    /api/certifications/public    - Get published certifications (public)
POST   /api/certifications           - Create certification
PUT    /api/certifications/:id       - Update certification
DELETE /api/certifications/:id       - Delete certification
PATCH  /api/certifications/:id/status    - Update status
PATCH  /api/certifications/:id/priority  - Update priority
GET    /api/certifications/stats/admin    - Get statistics
```

### News
```
GET    /api/news/admin     - Get all news (admin)
GET    /api/news/public    - Get published news (public)
POST   /api/news           - Create news
PUT    /api/news/:id       - Update news
DELETE /api/news/:id       - Delete news
PATCH  /api/news/:id/status    - Update status
PATCH  /api/news/:id/priority  - Update priority
GET    /api/news/stats/admin    - Get statistics
```

### File Uploads
```
POST   /api/upload/single      - Upload single file
POST   /api/upload/multiple    - Upload multiple files
DELETE /api/upload/:filename   - Delete file
GET    /api/upload/limits      - Get upload limits
```

## Database Models

### Admin
- Username, password, email, role, lastLogin, isActive

### Project
- Title (EN/AR), summary (EN/AR), description (EN/AR)
- Budget, location, successPartner, awards, attachments
- Priority, status, featured, category, dates

### Partnership
- Title (EN/AR), summary (EN/AR), description (EN/AR)
- PartnerInformation (EN/AR), partnerLinks, attachments
- Priority, status, featured, partnerType, dates

### Award
- Title (EN/AR), summary (EN/AR), description (EN/AR)
- Attachments, priority, status, featured
- AwardType, year, issuingOrganization, category, level

### Certification
- Title (EN/AR), summary (EN/AR), description (EN/AR)
- Attachments, priority, status, featured
- CertificationType, issuingOrganization, dates, level

### News
- Title (EN/AR), summary (EN/AR), description (EN/AR)
- Attachments, priority, status, featured
- NewsType, source, publishDate, author, category

## File Processing

### Supported Formats
- **Images**: JPEG, PNG, WebP, GIF
- **Videos**: MP4, AVI, MOV, WMV, FLV
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, TXT

### Processing Features
- **Image Optimization**: Automatic resizing and compression
- **Video Compression**: Convert to 720p with optimized bitrate
- **Storage**: AWS S3 with CDN support
- **Security**: File type validation and size limits

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend domain
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Type and size validation
- **Helmet.js**: Security headers protection

## Performance Optimizations

### Database
- Indexed queries for priority and status
- Text search indexes for bilingual content
- Aggregation pipelines for statistics
- Connection pooling

### File Processing
- Image optimization with Sharp
- Video compression with FFmpeg
- Async file processing
- CDN integration

### API
- Response compression
- Request logging with Morgan
- Error handling middleware
- Health check endpoint

## Development

### Running in Development
```bash
npm run dev
```

### Environment Variables
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mkgroup-website
JWT_SECRET=your-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Initialize admin
curl -X POST http://localhost:3000/api/auth/init

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
AWS_ACCESS_KEY_ID=your-production-aws-key
AWS_SECRET_ACCESS_KEY=your-production-aws-secret
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-production-bucket
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start index.js --name "mkgroup-api"

# Save configuration
pm2 save
pm2 startup
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **AWS S3 Upload Errors**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Ensure bucket exists

3. **FFmpeg Not Found**
   - Install FFmpeg: `npm install ffmpeg-static`
   - For Linux: `sudo apt-get install ffmpeg`

4. **Port Already in Use**
   - Change PORT in `.env`
   - Kill existing process: `lsof -ti:3000 | xargs kill`

### Logs
- Application logs: Check terminal output
- Error logs: Check console for detailed errors
- File upload logs: Check server console

## License

This project is proprietary software for MK Group. 