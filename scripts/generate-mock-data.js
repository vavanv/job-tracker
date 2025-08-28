// Browser-based mock data generator for Job Application Tracker
// This script should be run in the browser console or as part of an HTML page

// Mock data arrays
const companies = [
  { name: 'Google', website: 'https://google.com' },
  { name: 'Microsoft', website: 'https://microsoft.com' },
  { name: 'Apple', website: 'https://apple.com' },
  { name: 'Amazon', website: 'https://amazon.com' },
  { name: 'Meta', website: 'https://meta.com' },
  { name: 'Netflix', website: 'https://netflix.com' },
  { name: 'Tesla', website: 'https://tesla.com' },
  { name: 'Spotify', website: 'https://spotify.com' },
  { name: 'Airbnb', website: 'https://airbnb.com' },
  { name: 'Uber', website: 'https://uber.com' },
  { name: 'Salesforce', website: 'https://salesforce.com' },
  { name: 'Adobe', website: 'https://adobe.com' },
  { name: 'Shopify', website: 'https://shopify.com' },
  { name: 'Stripe', website: 'https://stripe.com' },
  { name: 'Zoom', website: 'https://zoom.us' },
  { name: 'Slack', website: 'https://slack.com' },
  { name: 'Dropbox', website: 'https://dropbox.com' },
  { name: 'Twitter', website: 'https://twitter.com' },
  { name: 'LinkedIn', website: 'https://linkedin.com' },
  { name: 'GitHub', website: 'https://github.com' }
];

const jobTitles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Senior Software Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'UI Designer',
  'Mobile Developer',
  'React Developer',
  'Node.js Developer',
  'Python Developer',
  'Java Developer',
  'Machine Learning Engineer',
  'Cloud Architect',
  'Technical Lead',
  'Engineering Manager',
  'QA Engineer'
];

const statuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

const notes = [
  'Great company culture and benefits package.',
  'Interesting technical challenges in this role.',
  'Remote-first company with flexible working hours.',
  'Competitive salary and stock options.',
  'Strong engineering team and mentorship opportunities.',
  'Exciting product roadmap and growth potential.',
  'Good work-life balance and learning opportunities.',
  'Innovative company working on cutting-edge technology.',
  'Collaborative environment with cross-functional teams.',
  'Opportunity to work with modern tech stack.',
  null, null, null // Some applications without notes
];

// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateMockApplication() {
  const company = getRandomItem(companies);
  const applicationDate = getRandomDate(new Date(2024, 0, 1), new Date());
  const updatedAt = new Date(applicationDate.getTime() + Math.random() * (Date.now() - applicationDate.getTime()));
  
  return {
    id: generateUUID(),
    companyName: company.name,
    companyWebsite: company.website,
    jobTitle: getRandomItem(jobTitles),
    applicationDate: applicationDate,
    status: getRandomItem(statuses),
    notes: getRandomItem(notes),
    jobLink: `https://jobs.${company.website.split('//')[1]}/position-${Math.floor(Math.random() * 1000)}`,
    createdAt: applicationDate,
    updatedAt: updatedAt
  };
}

// Function to seed the database (browser environment)
async function seedDatabase() {
  try {
    console.log('Opening IndexedDB database...');
    
    // Open the database using the same configuration as the app
    const request = indexedDB.open('JobApplicationTracker', 2);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = async () => {
        const db = request.result;
        
        try {
          console.log('Generating 20 mock applications...');
          
          const applications = [];
          for (let i = 0; i < 20; i++) {
            applications.push(generateMockApplication());
          }

          console.log('Inserting applications into database...');
          
          const transaction = db.transaction(['applications'], 'readwrite');
          const store = transaction.objectStore('applications');
          
          let completed = 0;
          const total = applications.length;
          
          applications.forEach((application, index) => {
            const request = store.add(application);
            
            request.onsuccess = () => {
              completed++;
              console.log(`Added application ${completed}/${total}: ${application.jobTitle} at ${application.companyName}`);
              
              if (completed === total) {
                console.log('✅ Successfully created 20 mock job applications!');
                console.log('Applications summary:');
                applications.forEach((app, idx) => {
                  console.log(`${idx + 1}. ${app.jobTitle} at ${app.companyName} - ${app.status}`);
                });
                db.close();
                resolve(applications);
              }
            };
            
            request.onerror = () => {
              console.error(`Failed to add application ${index + 1}:`, request.error);
            };
          });
          
          transaction.onerror = () => {
            console.error('Transaction failed:', transaction.error);
            db.close();
            reject(transaction.error);
          };
          
        } catch (error) {
          console.error('Error during seeding:', error);
          db.close();
          reject(error);
        }
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('applications')) {
          const store = db.createObjectStore('applications', { keyPath: 'id' });
          store.createIndex('companyName', 'companyName', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('applicationDate', 'applicationDate', { unique: false });
          console.log('Database schema created');
        }
      };
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Export for use in browser console or HTML page
if (typeof window !== 'undefined') {
  window.seedJobApplications = seedDatabase;
  console.log('Mock data generator loaded! Run seedJobApplications() to create 20 mock applications.');
} else {
  // For Node.js environments, export the function
  module.exports = { seedDatabase };
}

// Auto-run if this script is loaded directly in browser
if (typeof window !== 'undefined' && window.location.pathname.includes('generate-mock-data')) {
  seedDatabase().then(() => {
    console.log('Mock data generation completed!');
  }).catch(error => {
    console.error('Mock data generation failed:', error);
  });
}