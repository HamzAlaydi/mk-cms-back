const fetch = require('node-fetch');

async function testCandidatesEndpoint() {
  try {
    console.log('Testing candidates endpoint...');
    
    // Test the base endpoint
    const baseResponse = await fetch('http://localhost:5000/api/candidates');
    console.log('Base endpoint response status:', baseResponse.status);
    
    if (baseResponse.ok) {
      const data = await baseResponse.json();
      console.log('Base endpoint data:', data);
    } else {
      const errorText = await baseResponse.text();
      console.log('Base endpoint error:', errorText);
    }
    
    // Test with a specific jobId (you'll need to replace this with a real job ID)
    const jobIdResponse = await fetch('http://localhost:5000/api/candidates?jobId=test123');
    console.log('JobId endpoint response status:', jobIdResponse.status);
    
    if (jobIdResponse.ok) {
      const data = await jobIdResponse.json();
      console.log('JobId endpoint data:', data);
    } else {
      const errorText = await jobIdResponse.text();
      console.log('JobId endpoint error:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCandidatesEndpoint();
