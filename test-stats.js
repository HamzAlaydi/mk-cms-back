const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test function to check stats endpoints
async function testStatsEndpoints() {
  try {
    console.log('Testing stats endpoints...\n');

    // Test projects stats
    console.log('Testing /api/projects/stats/admin...');
    const projectsStats = await axios.get(`${API_BASE_URL}/projects/stats/admin`);
    console.log('Projects stats:', projectsStats.data);

    // Test certifications stats
    console.log('\nTesting /api/certifications/stats/admin...');
    const certificationsStats = await axios.get(`${API_BASE_URL}/certifications/stats/admin`);
    console.log('Certifications stats:', certificationsStats.data);

    // Test partnerships stats
    console.log('\nTesting /api/partnerships/stats/admin...');
    const partnershipsStats = await axios.get(`${API_BASE_URL}/partnerships/stats/admin`);
    console.log('Partnerships stats:', partnershipsStats.data);

    // Test awards stats
    console.log('\nTesting /api/awards/stats/admin...');
    const awardsStats = await axios.get(`${API_BASE_URL}/awards/stats/admin`);
    console.log('Awards stats:', awardsStats.data);

    // Test careers stats
    console.log('\nTesting /api/careers/stats/admin...');
    const careersStats = await axios.get(`${API_BASE_URL}/careers/stats/admin`);
    console.log('Careers stats:', careersStats.data);

    console.log('\n✅ All stats endpoints are working correctly!');

  } catch (error) {
    console.error('❌ Error testing stats endpoints:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testStatsEndpoints(); 