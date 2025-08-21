require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Route imports (to be implemented)
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const certificationRoutes = require('./routes/certifications');
const partnershipRoutes = require('./routes/partnerships');
const newsRoutes = require('./routes/news');
const awardRoutes = require('./routes/awards');
const careerRoutes = require('./routes/careers');
const pressRoutes = require('./routes/press');
const uploadRoutes = require('./routes/upload');
const candidateRoutes = require('./routes/candidates');
const companiesRoutes = require('./routes/companies');
const fileSharingRoutes = require('./routes/fileSharing');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mount routes (to be implemented)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/press', pressRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/filesharing', fileSharingRoutes);

// Log mounted routes for debugging
console.log('Mounted routes:');
console.log('- /api/auth');
console.log('- /api/projects');
console.log('- /api/certifications');
console.log('- /api/partnerships');
console.log('- /api/news');
console.log('- /api/awards');
console.log('- /api/careers');
console.log('- /api/press');
console.log('- /api/upload');
console.log('- /api/candidates');
console.log('- /api/companies');
console.log('- /api/filesharing');

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 