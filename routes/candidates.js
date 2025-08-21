const express = require('express');
const router = express.Router();
const CandidateResume = require('../models/CandidateResume');
const { getModel, getBothLanguageModels } = require('../models/modelFactory');

// Helper function to get language from request
const getLanguage = (req) => {
  return req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';
};

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
    console.log('=== CANDIDATE APPLICATION REQUEST ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
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

    // Get language from request
    const language = getLanguage(req);
    console.log('Language detected:', language);
    console.log('All headers:', JSON.stringify(req.headers, null, 2));

    // Try to find the job in both language collections
    let job = null;
    const bothModels = getBothLanguageModels('career');
    console.log('Available models:', Object.keys(bothModels));
    
    // First try the detected language
    try {
      const primaryModel = bothModels[language];
      console.log(`Trying to find job ${jobId} in ${language} collection using model:`, primaryModel.modelName);
      job = await primaryModel.findById(jobId);
      console.log(`Job found in ${language} collection:`, job ? 'Yes' : 'No');
      if (job) {
        console.log('Job details:', {
          id: job._id,
          title: job.title,
          department: job.department,
          lang: job.lang
        });
      }
    } catch (error) {
      console.log(`Error finding job in ${language} collection:`, error.message);
    }
    
    // If not found, try the other language
    if (!job) {
      const otherLanguage = language === 'en' ? 'ar' : 'en';
      try {
        const secondaryModel = bothModels[otherLanguage];
        console.log(`Trying to find job ${jobId} in ${otherLanguage} collection using model:`, secondaryModel.modelName);
        job = await secondaryModel.findById(jobId);
        console.log(`Job found in ${otherLanguage} collection:`, job ? 'Yes' : 'No');
        if (job) {
          console.log('Job details:', {
            id: job._id,
            title: job.title,
            department: job.department,
            lang: job.lang
          });
        }
      } catch (error) {
        console.log(`Error finding job in ${otherLanguage} collection:`, error.message);
      }
    }

    if (!job) {
      console.log('Job not found in any language collection');
      console.log('Job ID being searched:', jobId);
      console.log('Job ID type:', typeof jobId);
      console.log('Available models:', Object.keys(bothModels));
      
      // Let's also check if there are any jobs in the collections
      try {
        const enCount = await bothModels.en.countDocuments();
        const arCount = await bothModels.ar.countDocuments();
        console.log(`Total jobs in English collection: ${enCount}`);
        console.log(`Total jobs in Arabic collection: ${arCount}`);
        
        // Show a few sample jobs from each collection
        const enJobs = await bothModels.en.find().limit(3).select('_id title');
        const arJobs = await bothModels.ar.find().limit(3).select('_id title');
        console.log('Sample English jobs:', enJobs);
        console.log('Sample Arabic jobs:', arJobs);
      } catch (error) {
        console.log('Error checking collection counts:', error.message);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    console.log('Job found:', {
      id: job._id,
      title: job.title,
      department: job.department,
      language: job.lang || language
    });

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
      .sort({ appliedAt: -1 });

    // Enhance applications with job details from both language collections
    const enhancedApplications = await Promise.all(
      applications.map(async (application) => {
        try {
          // Try to find job details in both language collections
          const bothModels = getBothLanguageModels('career');
          let jobDetails = null;
          
          // Try English first
          try {
            jobDetails = await bothModels.en.findById(application.jobId)
              .select('title department location lang');
          } catch (error) {
            console.log('Error finding job in English collection:', error.message);
          }
          
          // If not found, try Arabic
          if (!jobDetails) {
            try {
              jobDetails = await bothModels.ar.findById(application.jobId)
                .select('title department location lang');
            } catch (error) {
              console.log('Error finding job in Arabic collection:', error.message);
            }
          }
          
          // Return enhanced application with job details
          return {
            ...application.toObject(),
            jobDetails: jobDetails ? {
              title: jobDetails.title,
              department: jobDetails.department,
              location: jobDetails.location,
              lang: jobDetails.lang
            } : null
          };
        } catch (error) {
          console.log('Error enhancing application:', error.message);
          return application.toObject();
        }
      })
    );

    console.log('Found applications:', enhancedApplications.length);
    console.log('Enhanced applications:', enhancedApplications);

    res.json({
      success: true,
      data: enhancedApplications
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
    );
    
    if (!candidateResume) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Enhance with job details from both language collections
    let jobDetails = null;
    try {
      const bothModels = getBothLanguageModels('career');
      
      // Try English first
      try {
        jobDetails = await bothModels.en.findById(candidateResume.jobId)
          .select('title department location lang');
      } catch (error) {
        console.log('Error finding job in English collection:', error.message);
      }
      
      // If not found, try Arabic
      if (!jobDetails) {
        try {
          jobDetails = await bothModels.ar.findById(candidateResume.jobId)
            .select('title department location lang');
        } catch (error) {
          console.log('Error finding job in Arabic collection:', error.message);
        }
      }
    } catch (error) {
      console.log('Error enhancing candidate with job details:', error.message);
    }

    const enhancedCandidate = {
      ...candidateResume.toObject(),
      jobDetails: jobDetails ? {
        title: jobDetails.title,
        department: jobDetails.department,
        location: jobDetails.location,
        lang: jobDetails.lang
      } : null
    };
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: enhancedCandidate
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
