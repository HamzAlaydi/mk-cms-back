const express = require('express');
const router = express.Router();
const CandidateResume = require('../models/CandidateResume');
const Career = require('../models/Career');

// Test route to verify the endpoint is working
router.get('/test', (req, res) => {
  res.json({ message: 'Candidates endpoint is working!' });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Candidates endpoint is healthy' });
});

// Simple test route to check if the model is working
router.get('/test-model', async (req, res) => {
  try {
    console.log('Testing CandidateResume model...');
    const count = await CandidateResume.countDocuments();
    console.log('Total candidates in database:', count);
    
    res.json({ 
      message: 'Model test successful', 
      totalCandidates: count,
      modelName: CandidateResume.modelName
    });
  } catch (error) {
    console.error('Model test failed:', error);
    res.status(500).json({ 
      message: 'Model test failed', 
      error: error.message 
    });
  }
});

// POST /api/candidates - Store candidate application
router.post('/', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { jobId, applicantName, cvFile } = req.body;
    
    console.log('Extracted data:', { jobId, applicantName, cvFile });
    console.log('CV File details:', {
      url: cvFile?.url,
      name: cvFile?.name,
      mimeType: cvFile?.mimeType,
      type: cvFile?.type,
      size: cvFile?.size
    });
    
    if (!jobId || !applicantName || !cvFile) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: jobId, applicantName, and cvFile are required'
      });
    }

    // Verify the job exists
    const job = await Career.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is still active
    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active'
      });
    }

    // Check if application deadline has passed
    // if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Application deadline has passed for this position'
    //   });
    // }

    // Create candidate resume record
    const candidateResumeData = {
      jobId: jobId,
      jobTitle: job.title,
      applicantName: applicantName,
      cvFile: {
        url: cvFile.url,
        name: cvFile.name,
        mimeType: cvFile.mimeType,
        size: cvFile.size,
        uploadedAt: new Date()
      }
    };
    
        console.log('Creating candidate resume with data:', candidateResumeData);
    
    // Validate the data structure
    console.log('Validating CV file data:', {
      url: candidateResumeData.cvFile.url,
      name: candidateResumeData.cvFile.name,
      mimeType: candidateResumeData.cvFile.mimeType,
      size: candidateResumeData.cvFile.size
    });
    
    if (!candidateResumeData.cvFile.url || !candidateResumeData.cvFile.name || 
        !candidateResumeData.cvFile.mimeType || !candidateResumeData.cvFile.size) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Invalid CV file data structure',
        details: {
          url: !!candidateResumeData.cvFile.url,
          name: !!candidateResumeData.cvFile.name,
          mimeType: !!candidateResumeData.cvFile.mimeType,
          size: !!candidateResumeData.cvFile.size
        }
      });
    }
    
    const candidateResume = new CandidateResume(candidateResumeData);
    
    console.log('Candidate resume instance created, attempting to save...');
    
    await candidateResume.save();
    
    console.log('Candidate resume saved successfully');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: candidateResume._id,
        jobTitle: candidateResume.jobTitle,
        applicantName: candidateResume.applicantName,
        appliedAt: candidateResume.appliedAt
      }
    });

  } catch (error) {
    console.error('Candidate application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.'
    });
  }
});

// GET /api/candidates - Get all applications (for admin use)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/candidates called');
    const { jobId } = req.query;
    console.log('Query parameters:', { jobId });
    
    let query = {};
    if (jobId) {
      query.jobId = jobId;
      console.log('Filtering by jobId:', jobId);
    }
    
    console.log('Final query:', query);
    
    const applications = await CandidateResume.find(query)
      .populate('jobId', 'title department location')
      .sort({ appliedAt: -1 });

    console.log('Found applications:', applications.length);
    console.log('Applications:', applications);

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// PUT /api/candidates/:id - Update candidate status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, reviewed, shortlisted, rejected'
      });
    }
    
    const candidateResume = await CandidateResume.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('jobId', 'title department location');
    
    if (!candidateResume) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: candidateResume
    });
    
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate status'
    });
  }
});

module.exports = router;
