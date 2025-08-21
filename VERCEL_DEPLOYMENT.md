# Vercel Deployment Guide for MK Group Backend

This guide will help you deploy your Node.js backend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Environment Variables Setup

Before deploying, you need to set up environment variables in Vercel. Based on your `setup-env.js`, you'll need:

### Required Environment Variables

```bash
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name

# Server Configuration
NODE_ENV=production

# Admin Account
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=your_admin_name
```

### Setting Environment Variables in Vercel

1. **Via Vercel Dashboard**:
   - Go to your project in Vercel
   - Navigate to Settings → Environment Variables
   - Add each variable with the appropriate environment (Production, Preview, Development)

2. **Via Vercel CLI**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add AWS_ACCESS_KEY_ID
   vercel env add AWS_SECRET_ACCESS_KEY
   vercel env add AWS_REGION
   vercel env add AWS_S3_BUCKET
   vercel env add NODE_ENV
   vercel env add ADMIN_EMAIL
   vercel env add ADMIN_PASSWORD
   vercel env add ADMIN_NAME
   ```

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from your project directory
```bash
cd /path/to/your/mk-cms-back
vercel
```

### 4. Follow the prompts:
- Set up and deploy? → `Y`
- Which scope? → Select your account
- Link to existing project? → `N` (for first deployment)
- Project name? → `mk-cms-back` (or your preferred name)
- In which directory is your code located? → `./` (current directory)
- Want to override the settings? → `N`

### 5. For production deployment
```bash
vercel --prod
```

## Important Notes

### MongoDB Connection
- Ensure your MongoDB instance is accessible from Vercel's servers
- Use MongoDB Atlas or a cloud MongoDB service for production
- Whitelist Vercel's IP ranges if using IP restrictions

### AWS S3 Configuration
- Ensure your AWS credentials have proper permissions
- Consider using IAM roles instead of access keys for production
- Verify your S3 bucket CORS settings allow Vercel domains

### File Uploads
- Vercel has a 4.5MB payload limit for serverless functions
- For larger files, consider using presigned S3 URLs for direct uploads
- Update your upload middleware accordingly

## Post-Deployment

### 1. Verify Deployment
- Check your Vercel dashboard for deployment status
- Test your API endpoints using the provided Vercel URL

### 2. Test API Endpoints
```bash
# Health check
curl https://your-project.vercel.app/api/health

# Test other endpoints
curl https://your-project.vercel.app/api/auth/login
```

### 3. Monitor Logs
- Use Vercel dashboard to monitor function logs
- Set up error tracking (e.g., Sentry)

### 4. Custom Domain (Optional)
- Add custom domain in Vercel dashboard
- Configure DNS settings with your domain provider

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables are set for the correct environment
   - Redeploy after adding new environment variables

2. **MongoDB Connection Issues**
   - Check MongoDB URI format
   - Verify network access and firewall settings

3. **File Upload Failures**
   - Check file size limits
   - Verify AWS credentials and permissions

4. **CORS Issues**
   - Update `FRONTEND_URL` environment variable
   - Ensure frontend domain is properly configured

### Debug Commands
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --function=index

# Redeploy with debug info
vercel --debug
```

## Performance Optimization

1. **Database Connections**
   - Use connection pooling
   - Implement proper connection management for serverless

2. **Caching**
   - Implement Redis or similar for session storage
   - Use Vercel's edge caching where possible

3. **Bundle Optimization**
   - Remove unused dependencies
   - Use tree-shaking for better bundle sizes

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use Vercel's environment variable encryption

2. **API Security**
   - Implement rate limiting
   - Use proper authentication middleware
   - Validate all inputs

3. **Database Security**
   - Use strong passwords
   - Implement proper user roles
   - Regular security updates

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Project Issues**: Check your project's issue tracker

---

**Happy Deploying! 🚀**
