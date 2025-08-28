import { ApplicationStatus } from '../types';
import type { Application } from '../types';

const companies = [
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Spotify',
  'Airbnb', 'Uber', 'Stripe', 'Shopify', 'Slack', 'Zoom', 'Adobe', 'Salesforce',
  'Oracle', 'IBM', 'Intel', 'NVIDIA', 'PayPal', 'Square', 'Dropbox', 'GitHub',
  'Atlassian', 'Twilio', 'MongoDB', 'Redis', 'Cloudflare', 'Vercel'
];

const jobTitles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'UI Designer',
  'Mobile Developer', 'QA Engineer', 'Site Reliability Engineer', 'Security Engineer',
  'Machine Learning Engineer', 'Cloud Architect', 'Technical Lead', 'Engineering Manager',
  'Principal Engineer', 'Staff Engineer', 'Senior Software Engineer'
];

const statuses = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN
];

const notes = [
  'Great company culture and benefits',
  'Interesting technical challenges',
  'Remote-first company',
  'Competitive salary and equity',
  'Strong engineering team',
  'Good work-life balance',
  'Innovative products',
  'Fast-growing startup',
  'Excellent learning opportunities',
  'Flexible working hours',
  'Modern tech stack',
  'Collaborative environment'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysBack: number = 90): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  const date = new Date(now.getTime() - (randomDays * 24 * 60 * 60 * 1000));
  return date;
}



export function generateMockApplication(): Omit<Application, 'id' | 'createdAt' | 'updatedAt'> {
  const company = getRandomElement(companies);
  const jobTitle = getRandomElement(jobTitles);
  const status = getRandomElement(statuses);
  const applicationDate = getRandomDate();
  const note = getRandomElement(notes);
  
  return {
    companyName: company,
    jobTitle: jobTitle,
    status: status,
    applicationDate: applicationDate,
    jobLink: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers`,
    notes: note
  };
}

export function generateMockApplications(count: number = 20): Array<Omit<Application, 'id' | 'createdAt' | 'updatedAt'>> {
  const applications = [];
  
  for (let i = 0; i < count; i++) {
    applications.push(generateMockApplication());
  }
  
  return applications;
}