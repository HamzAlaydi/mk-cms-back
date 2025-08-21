# Language-Aware System Documentation

## Overview

This system now supports both English and Arabic content through separate models and language-aware API endpoints. Each model (except Admin and CandidateResume) has both English and Arabic versions.

## Models

### English Models (Original)
- `Award` - English awards
- `Project` - English projects  
- `Career` - English careers
- `Certification` - English certifications
- `Partnership` - English partnerships
- `Press` - English press articles
- `News` - English news articles

### Arabic Models (New)
- `Award-ar` - Arabic awards
- `Project-ar` - Arabic projects
- `Career-ar` - Arabic careers
- `Certification-ar` - Arabic certifications
- `Partnership-ar` - Arabic partnerships
- `Press-ar` - Arabic press articles
- `News-ar` - Arabic news articles

## How It Works

### Backend (Controllers)

All controllers now use the `modelFactory` to get the appropriate model based on the language:

```javascript
const { getModel } = require('../models/modelFactory');

// Get language from request (headers, query, or body)
const language = req.headers['accept-language'] || req.query.lang || req.body.lang || 'en';

// Get the appropriate model
const AwardModel = getModel('award', language);

// Use the model
const awards = await AwardModel.find();
```

### Language Detection Priority

1. `Accept-Language` header
2. `lang` query parameter
3. `lang` in request body
4. Default to 'en' if none specified

### Frontend (API Calls)

The frontend automatically sends the current language from localStorage:

```javascript
// Automatically includes current language
const response = await languageApi.awards.create(awardData);

// Or specify language explicitly
const response = await languageApi.awards.create(awardData, 'ar');
```

## API Usage Examples

### Creating Content

When an admin creates content, it automatically goes to the correct language model:

```javascript
// If admin's language is 'ar', this goes to Award-ar model
POST /api/awards
{
  "title": "جائزة التميز",
  "summary": "ملخص الجائزة",
  "lang": "ar"  // Automatically added by frontend
}
```

### Fetching Content

When fetching content, specify the language:

```javascript
// Get Arabic awards
GET /api/awards?lang=ar

// Get English awards  
GET /api/awards?lang=en

// Or use Accept-Language header
GET /api/awards
Accept-Language: ar
```

## Frontend Integration

### Using the Language API Service

```javascript
import languageApi from '../shared/languageApi';

// Get all awards in current language
const awards = await languageApi.awards.getAll();

// Create new award in current language
const newAward = await languageApi.awards.create(awardData);

// Update award in current language
const updatedAward = await languageApi.awards.update(id, updateData);
```

### Language Context

The frontend uses React Context to manage language state:

```javascript
import { useLanguage } from '../contexts/LanguageContext';

const { language, changeLanguage } = useLanguage();

// Change language (automatically updates localStorage and API calls)
changeLanguage('ar');
```

## Database Structure

Each language model maintains the same schema structure but with language-appropriate content:

- **English models**: Use English field names and validation
- **Arabic models**: Use Arabic field names and validation (with Arabic comments)

### Example: Award Models

**English Award:**
```javascript
{
  title: "Excellence Award",
  category: "Excellence",
  level: "International"
}
```

**Arabic Award:**
```javascript
{
  title: "جائزة التميز",
  category: "التميز", 
  level: "دولي"
}
```

## Migration Notes

- Existing English data remains in original models
- New Arabic data goes to Arabic models
- Both models can coexist in the same database
- Language switching is seamless for users

## Best Practices

1. **Always specify language** when creating/updating content
2. **Use the language API service** instead of direct fetch calls
3. **Handle language changes** gracefully in the UI
4. **Validate language input** on both frontend and backend
5. **Maintain consistent schemas** between language models

## Testing

Test both language models:

```bash
# Test English endpoints
curl -H "Accept-Language: en" http://localhost:5000/api/awards

# Test Arabic endpoints  
curl -H "Accept-Language: ar" http://localhost:5000/api/awards

# Test with query parameter
curl "http://localhost:5000/api/awards?lang=ar"
```

## Troubleshooting

### Common Issues

1. **Language not detected**: Check headers, query params, and request body
2. **Wrong model used**: Verify modelFactory is working correctly
3. **Frontend language mismatch**: Ensure localStorage is set correctly
4. **API errors**: Check if both language models exist and are properly imported

### Debug Mode

Enable debug logging in controllers:

```javascript
console.log('Language detected:', language);
console.log('Model used:', AwardModel.modelName);
```
