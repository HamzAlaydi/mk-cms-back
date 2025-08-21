const mongoose = require('mongoose');
const { getModel } = require('./models/modelFactory');

// Test the language-aware model factory
async function testLanguageSystem() {
  try {
    console.log('🧪 Testing Language-Aware System...\n');

    // Test model factory
    console.log('1. Testing Model Factory:');
    
    const awardEn = getModel('award', 'en');
    const awardAr = getModel('award', 'ar');
    
    console.log(`   English Award Model: ${awardEn.modelName}`);
    console.log(`   Arabic Award Model: ${awardAr.modelName}`);
    
    const projectEn = getModel('project', 'en');
    const projectAr = getModel('project', 'ar');
    
    console.log(`   English Project Model: ${projectEn.modelName}`);
    console.log(`   Arabic Project Model: ${projectAr.modelName}`);

    // Test all models
    console.log('\n2. Testing All Models:');
    
    const models = ['award', 'project', 'career', 'certification', 'partnership', 'press', 'news'];
    
    models.forEach(modelName => {
      const enModel = getModel(modelName, 'en');
      const arModel = getModel(modelName, 'ar');
      
      console.log(`   ${modelName}: ${enModel.modelName} | ${arModel.modelName}`);
    });

    // Test default language
    console.log('\n3. Testing Default Language:');
    
    const defaultAward = getModel('award');
    console.log(`   Default Award Model: ${defaultAward.modelName}`);

    console.log('\n✅ Language system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing language system:', error);
  }
}

// Test model schemas
async function testModelSchemas() {
  try {
    console.log('\n🔍 Testing Model Schemas...\n');

    // Test Award schemas
    const AwardEn = getModel('award', 'en');
    const AwardAr = getModel('award', 'ar');
    
    console.log('1. Award Model Schemas:');
    console.log(`   English fields: ${Object.keys(AwardEn.schema.paths).join(', ')}`);
    console.log(`   Arabic fields: ${Object.keys(AwardAr.schema.paths).join(', ')}`);
    
    // Test enum values
    console.log('\n2. Enum Values:');
    const categoryPath = AwardEn.schema.path('category');
    const arCategoryPath = AwardAr.schema.path('category');
    
    if (categoryPath.enumValues) {
      console.log(`   English categories: ${categoryPath.enumValues.join(', ')}`);
    }
    
    if (arCategoryPath.enumValues) {
      console.log(`   Arabic categories: ${arCategoryPath.enumValues.join(', ')}`);
    }

    console.log('\n✅ Schema test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing schemas:', error);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Language System Tests...\n');
  
  await testLanguageSystem();
  await testModelSchemas();
  
  console.log('\n🎉 All tests completed!');
  process.exit(0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testLanguageSystem, testModelSchemas };
