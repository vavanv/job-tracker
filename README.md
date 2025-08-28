# Job Application Tracker

A modern, responsive web application for tracking job applications built with React, TypeScript, and Material-UI. Store and manage your job applications locally with IndexedDB for offline functionality.

## Features

### 📋 Application Management
- **Add/Edit Applications**: Create and modify job applications with comprehensive details
- **Duplicate Applications**: Quickly duplicate existing applications with one click
- **File Attachments**: Upload and manage resume and cover letter files (PDF, DOC, DOCX)
- **Status Tracking**: Track application status with color-coded badges
- **Company Information**: Store company names, websites, and job details
- **Notes**: Add personal notes and observations for each application
- **Context Menu**: Access Edit, Duplicate, and Delete actions via a convenient three-dot menu
- **Data Grid View**: Advanced table view with sorting, pagination, and configurable page sizes (10, 25, 50, 100)
- **Quick Links**: Direct access to company websites and job postings from the grid view

### 🔍 Search & Filter
- **Smart Search**: Search applications by company name or job title
- **Status Filtering**: Filter by application status (Applied, Interview, Offer, etc.)
- **Date Range Filtering**: Filter applications by date applied
- **Clear Filters**: Quick reset of all active filters
- **Advanced Grid Filtering**: Built-in column filtering and sorting in data grid view

### 📊 Dashboard
- **Statistics Overview**: View total applications, interviews, offers, and rejections
- **Visual Stats Cards**: Color-coded statistics with icons
- **Quick Actions**: Easy access to add new applications

### 💾 Data Storage & Management
- **Local Storage**: All data stored locally using IndexedDB
- **Offline Support**: Works completely offline
- **File Management**: Secure storage of resume and cover letter attachments
- **Data Persistence**: Your data stays on your device
- **Data Import/Export**: Import applications from JSON files and export your data
- **Mock Data Generation**: Generate sample applications for testing (50 applications)
- **Clean Data**: Clear all applications with one click (with confirmation)
- **Data Debugging**: Built-in debugging tools for IndexedDB inspection

### 🎨 User Interface
- **Material Design**: Clean, modern UI with Material-UI components
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme detection based on system preferences
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Enhanced Job Cards**: Improved layout with Applied and Updated dates prominently displayed
- **Context Menus**: Streamlined action menus for better user experience
- **Data Grid**: Professional table view with Material-UI DataGrid component
- **Loading States**: Visual feedback during data operations
- **Success Notifications**: Confirmation messages for completed actions

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5 with DataGrid component
- **Build Tool**: Vite
- **Database**: IndexedDB with idb wrapper
- **Routing**: React Router
- **State Management**: React Hooks (useState, useEffect, useContext)
- **File Handling**: Browser File API

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-app-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001` to view the application

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage

### Adding Applications
1. Click the "New Application" button on the Dashboard or Applications page
2. Fill in the required information (Company Name, Job Title, Application Date)
3. Optionally add company website, job link, and notes
4. Upload resume and/or cover letter files
5. Set the application status
6. Click "Add" to save

### Managing Files
- **Upload**: Use the "UPLOAD" buttons to attach resume and cover letter files
- **Download**: Click file name buttons to download previously uploaded files
- **Replace**: Upload a new file to replace an existing one
- **Delete**: Use the "DELETE" button to remove files (with confirmation dialog)

### Searching and Filtering
- Use the search bar to find applications by company or job title
- Apply status filters to view specific types of applications
- Set date ranges to filter by application date
- Use "Clear Filters" to reset all filters

### Managing Applications
1. **Editing**: Click the three-dot menu on any application card or in the data grid and select "Edit"
2. **Duplicating**: Use the "Duplicate" option from the context menu to create a copy
3. **Deleting**: Select "Delete" from the context menu to remove an application
4. **Grid View**: Switch to data grid view for advanced sorting, filtering, and pagination
5. **Bulk Operations**: Use Settings page for bulk data operations (import, export, clean)
6. Modify information as needed and click "Update" to save changes

### Settings & Data Management
1. **Import Data**: Upload JSON files to import applications
2. **Export Data**: Download your applications as JSON for backup
3. **Generate Mock Data**: Create 50 sample applications for testing
4. **Clean Data**: Remove all applications (useful for starting fresh)
5. **Debug Tools**: Access IndexedDB debugging tools at `/debug-db.html`

## Project Structure

```
src/
├── components/
│   ├── Applications/     # Application-related components
│   ├── Common/          # Reusable UI components
│   ├── Dashboard/       # Dashboard and statistics
│   ├── Layout/          # App layout and navigation
│   └── Settings/        # Settings page
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and constants
└── App.tsx             # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the repository.
