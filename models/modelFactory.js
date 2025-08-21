const Award = require('./Award');
const AwardAr = require('./Award-ar');
const Project = require('./Project');
const ProjectAr = require('./Project-ar');
const Career = require('./Career');
const CareerAr = require('./Career-ar');
const Certification = require('./Certification');
const CertificationAr = require('./Certification-ar');
const Partnership = require('./Partnership');
const PartnershipAr = require('./Partnership-ar');
const Press = require('./Press');
const PressAr = require('./Press-ar');
const News = require('./News');
const NewsAr = require('./News-ar');
const Company = require('./Company');
const CompanyAr = require('./Company-ar');
const SharedFile = require('./SharedFile');

// Model factory to get the appropriate model based on language
const getModel = (modelName, language = 'en') => {
  const models = {
    'award': language === 'ar' ? AwardAr : Award,
    'project': language === 'ar' ? ProjectAr : Project,
    'career': language === 'ar' ? CareerAr : Career,
    'certification': language === 'ar' ? CertificationAr : Certification,
    'partnership': language === 'ar' ? PartnershipAr : Partnership,
    'press': language === 'ar' ? PressAr : Press,
    'news': language === 'ar' ? NewsAr : News,
    'company': language === 'ar' ? CompanyAr : Company,
  };

  return models[modelName.toLowerCase()];
};

// Get all models for a specific language
const getAllModels = (language = 'en') => {
  return {
    Award: language === 'ar' ? AwardAr : Award,
    Project: language === 'ar' ? ProjectAr : Project,
    Career: language === 'ar' ? CareerAr : Career,
    Certification: language === 'ar' ? CertificationAr : Certification,
    Partnership: language === 'ar' ? PartnershipAr : Partnership,
    Press: language === 'ar' ? PressAr : Press,
    News: language === 'ar' ? NewsAr : News,
    Company: language === 'ar' ? CompanyAr : Company,
  };
};

// Get both language models for an entity type
const getBothLanguageModels = (modelName) => {
  const models = {
    'award': { en: Award, ar: AwardAr },
    'project': { en: Project, ar: ProjectAr },
    'career': { en: Career, ar: CareerAr },
    'certification': { en: Certification, ar: CertificationAr },
    'partnership': { en: Partnership, ar: PartnershipAr },
    'press': { en: Press, ar: PressAr },
    'news': { en: News, ar: NewsAr },
    'company': { en: Company, ar: CompanyAr },
  };

  return models[modelName.toLowerCase()];
};

module.exports = {
  getModel,
  getAllModels,
  getBothLanguageModels,
  SharedFile,
  // Export individual models for backward compatibility
  Award,
  AwardAr,
  Project,
  ProjectAr,
  Career,
  CareerAr,
  Certification,
  CertificationAr,
  Partnership,
  PartnershipAr,
  Press,
  PressAr,
  News,
  NewsAr,
  Company,
  CompanyAr,
};
