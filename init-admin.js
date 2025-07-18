const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

async function initializeAdmin() {
  try {
    console.log('🔧 Initializing Admin Account...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkgroup-website', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`Status: ${existingAdmin.isActive ? 'Active' : 'Inactive'}`);
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('\nDo you want to update the admin password? (y/N): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() === 'y') {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('✅ Admin password updated successfully');
      }
    } else {
      // Create new admin account
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        name: process.env.ADMIN_NAME,
        isActive: true,
        role: 'super_admin'
      });

      await admin.save();
      console.log('✅ Admin account created successfully');
      console.log(`Email: ${admin.email}`);
      console.log(`Name: ${admin.name}`);
      console.log(`Role: ${admin.role}`);
    }

    console.log('\n🎉 Admin initialization complete!');
    console.log('\n📝 You can now:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Login to admin panel with the credentials above');
    console.log('3. Access the API at http://localhost:3001/api');

  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Ensure all dependencies are installed');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

initializeAdmin(); 