const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 Setting up MK Group Backend Environment\n');

  const envPath = path.join(__dirname, '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. This will overwrite it.');
    const answer = await question('Do you want to continue? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('Please provide the following configuration values:\n');

  // Database
  const mongodbUri = await question('MongoDB URI (default: mongodb://localhost:27017/mkgroup-website): ') || 'mongodb://localhost:27017/mkgroup-website';
  
  // JWT
  const jwtSecret = await question('JWT Secret (default: mkgroup-super-secret-key-change-in-production): ') || 'mkgroup-super-secret-key-change-in-production';
  
  // AWS
  const awsAccessKey = await question('AWS Access Key ID: ');
  const awsSecretKey = await question('AWS Secret Access Key: ');
  const awsRegion = await question('AWS Region (default: us-east-1): ') || 'us-east-1';
  const awsBucket = await question('AWS S3 Bucket Name: ');
  
  // Server
  const port = (await question("Server Port (default: 3000): ")) || "3000";
  const nodeEnv = await question('Node Environment (default: development): ') || 'development';
  
  // Admin
  const adminEmail = await question('Admin Email (default: admin@mkgroup.com): ') || 'admin@mkgroup.com';
  const adminPassword = await question('Admin Password (default: admin123): ') || 'admin123';
  const adminName = await question('Admin Name (default: MK Group Admin): ') || 'MK Group Admin';

  const envContent = `# Database Configuration
MONGODB_URI=${mongodbUri}

# JWT Configuration
JWT_SECRET=${jwtSecret}

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=${awsAccessKey}
AWS_SECRET_ACCESS_KEY=${awsSecretKey}
AWS_REGION=${awsRegion}
AWS_S3_BUCKET=${awsBucket}

# Server Configuration
PORT=${port}
NODE_ENV=${nodeEnv}

# Admin Account (create this account on first run)
ADMIN_EMAIL=${adminEmail}
ADMIN_PASSWORD=${adminPassword}
ADMIN_NAME=${adminName}
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start the server: npm run dev');
    console.log('3. Create admin account by running the setup script');
    console.log('\n⚠️  Remember to:');
    console.log('- Change the JWT_SECRET in production');
    console.log('- Use strong passwords in production');
    console.log('- Configure proper AWS credentials');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }

  rl.close();
}

setupEnvironment().catch(console.error); 