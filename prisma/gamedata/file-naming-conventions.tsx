import React from 'react';

const FileNamingAndOrganizationStandards: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>File Naming and Organization Standards</h1>
      <p><strong>Purpose:</strong> To create a streamlined, intuitive, and consistent structure for project file storage, ensuring that all team members can easily locate documents, understand project progress, and archive completed work for future reference.</p>

      <h2>1. Naming Conventions</h2>

      <h3>Projects</h3>
      <p>Each project folder should begin with a unique project code, followed by the quarter and year, and finally the document’s content type.</p>
      <code>Format: ProjectCode_YearQuarter_ContentType</code>
      <p><code>Example: PRJ5678_2023Q4_Report</code></p>
      <p>This format ensures that all files can be easily sorted and identified by both project and timeframe.</p>

      <h3>Dates</h3>
      <p>For documents requiring specific dates (such as meeting minutes or milestone updates), append the date in <code>YYYYMMDD</code> format at the end of the file name.</p>
      <code>Example: PRJ5678_2023Q4_MeetingMinutes_20231015</code>
      <p>This date format helps in sorting files chronologically and tracking updates.</p>

      <h3>Project Phases</h3>
      <p>Within each project folder, organize files by the specific project phase. Common phases include:</p>
      <ul>
        <li><code>Phase1_Research</code></li>
        <li><code>Phase2_Design</code></li>
        <li><code>Phase3_Implementation</code></li>
        <li><code>Phase4_Evaluation</code></li>
      </ul>
      <p>This breakdown provides a clear workflow view and allows team members to understand the project’s current phase at a glance.</p>

      <h3>Document Type Tags</h3>
      <p>Each document’s file name should include a tag indicating the type of document. Common tags are:</p>
      <ul>
        <li><code>Report</code>, <code>Presentation</code>, <code>Invoice</code>, <code>Budget</code>, <code>Notes</code>, <code>Timeline</code>
      </ul>
      <p><code>Example: PRJ5678_2023Q4_Presentation</code></p>
      <p>Including the document type in the file name clarifies the file’s purpose, making it easy to locate within each project phase folder.</p>

      <h2>2. Folder Structure</h2>

      <h3>Root Folder</h3>
      <p>Each project has its own main folder in the central "Projects" directory. This root folder should contain subfolders for each document type.</p>
      <code>Example: /Projects/PRJ5678</code>

      <h3>Subfolders for Document Types</h3>
      <ul>
        <li><strong>Reports:</strong> For all internal or external reports, including progress, end-of-phase, or completion reports.</li>
        <li><strong>Presentations:</strong> For client or team presentations related to project milestones, updates, or deliverables.</li>
        <li><strong>Communications:</strong> For email threads, client communications, and meeting notes.</li>
        <li><strong>Financials:</strong> For budgets, invoices, and financial summaries.</li>
      </ul>

      <code>Example Structure:</code>
      <pre>
/Projects/PRJ5678  
├── Reports  
├── Presentations  
├── Communications  
└── Financials  
      </pre>
      <p>This structure separates document types for easier access and prevents clutter within project folders.</p>

      <h3>Phase-Based Subfolders</h3>
      <p>Within the root project folder, create subfolders organized by the four main project phases.</p>
      <code>Example Structure:</code>
      <pre>
/Projects/PRJ5678  
├── Phase1_Research  
│   ├── Reports  
│   ├── Presentations  
│   └── Communications  
├── Phase2_Design  
│   ├── Reports  
│   ├── Presentations  
│   └── Communications  
└── etc.
      </pre>
      <p>This allows teams to access documents by project phase, making it easy to see what has been completed or is in progress.</p>

      <h3>General Resources Subfolder</h3>
      <p>For documents that apply across phases, such as an overall project timeline or a list of contacts.</p>
      <code>Example: /Projects/PRJ5678/Resources</code>
      <p>Keeps overarching documents readily accessible throughout the project’s lifecycle.</p>

      <h2>3. Archiving Completed Projects</h2>

      <h3>Quarterly Archives</h3>
      <p>At the end of each quarter, completed projects should be moved to the "Archives" folder.</p>
      <code>Folder Format: /Archives/YearQuarter/ProjectCode</code>
      <p><code>Example: /Archives/2023Q4/PRJ5678</code></p>
      <p>Archiving completed projects frees up space in active directories and ensures current projects remain easily accessible.</p>

      <h3>Final Project Files</h3>
      <p>Within the archive, each project should have a “Final Deliverables” subfolder containing all approved final documents for future use or reference.</p>
      <code>Example: /Archives/2023Q4/PRJ5678/Final_Deliverables</code>

      <h2>4. Best Practices</h2>
      <ul>
        <li><strong>Regular Updates:</strong> Each team member should review project folders weekly to ensure documents are up-to-date and correctly filed.</li>
        <li><strong>Version Control:</strong> Use a version number at the end of the file name for multiple versions (e.g., <code>PRJ5678_2023Q4_Report_v2</code>).</li>
        <li><strong>Naming Consistency:</strong> Adhere to the standard naming format, as inconsistency can cause confusion and slow down workflows.</li>
      </ul>
    </div>
  );
};

export default FileNamingAndOrganizationStandards;
