File Naming and Organization Standards
======================================

**Purpose:** To create a streamlined, intuitive, and consistent structure for project file storage, ensuring that all team members can easily locate documents, understand project progress, and archive completed work for future reference.

1\. Naming Conventions
----------------------

### Projects

Each project folder should begin with a unique project code, followed by the quarter and year, and finally the document’s content type.

`Format:` ProjectCode\_YearQuarter\_ContentType

`Example:` PRJ5678\_2023Q4\_Report

This format ensures that all files can be easily sorted and identified by both project and timeframe.

### Dates

For documents requiring specific dates (such as meeting minutes or milestone updates), append the date in `YYYYMMDD` format at the end of the file name.

`Example:` PRJ5678\_2023Q4\_MeetingMinutes\_20231015

This date format helps in sorting files chronologically and tracking updates.

### Project Phases

Within each project folder, organize files by the specific project phase. Common phases include:

*   `Phase1_Research`
*   `Phase2_Design`
*   `Phase3_Implementation`
*   `Phase4_Evaluation`

This breakdown provides a clear workflow view and allows team members to understand the project’s current phase at a glance.

### Document Type Tags

Each document’s file name should include a tag indicating the type of document. Common tags are:

*   `Report`, `Presentation`, `Invoice`, `Budget`, `Notes`, `Timeline`

`Example:` PRJ5678\_2023Q4\_Presentation

Including the document type in the file name clarifies the file’s purpose, making it easy to locate within each project phase folder.

2\. Folder Structure
--------------------

### Root Folder

Each project has its own main folder in the central "Projects" directory. This root folder should contain subfolders for each document type.

`Naming Example:` /Projects/PRJ5678

### Subfolders for Document Types

*   **Reports:** For all internal or external reports, including progress, end-of-phase, or completion reports.
*   **Presentations:** For client or team presentations related to project milestones, updates, or deliverables.
*   **Communications:** For email threads, client communications, and meeting notes.
*   **Financials:** For budgets, invoices, and financial summaries.

`Example Structure:`

/Projects/PRJ5678  
├── Reports  
├── Presentations  
├── Communications  
└── Financials  

This structure separates document types for easier access and prevents clutter within project folders.

### Phase-Based Subfolders

Within the root project folder, create subfolders organized by the four main project phases.

`Example Structure:`

/Projects/PRJ5678  
├── Phase1\_Research  
│   ├── Reports  
│   ├── Presentations  
│   └── Communications  
├── Phase2\_Design  
│   ├── Reports  
│   ├── Presentations  
│   └── Communications  
└── etc.

This allows teams to access documents by project phase, making it easy to see what has been completed or is in progress.

### General Resources Subfolder

For documents that apply across phases, such as an overall project timeline or a list of contacts.

`Naming Example:` /Projects/PRJ5678/Resources

Keeps overarching documents readily accessible throughout the project’s lifecycle.

3\. Archiving Completed Projects
--------------------------------

### Quarterly Archives

At the end of each quarter, completed projects should be moved to the "Archives" folder.

`Folder Format:` /Archives/YearQuarter/ProjectCode

`Example:` /Archives/2023Q4/PRJ5678

Archiving completed projects frees up space in active directories and ensures current projects remain easily accessible.

### Final Project Files

Within the archive, each project should have a “Final Deliverables” subfolder containing all approved final documents for future use or reference.

`Naming Example:` /Archives/2023Q4/PRJ5678/Final\_Deliverables

4\. Best Practices
------------------

*   **Regular Updates:** Each team member should review project folders weekly to ensure documents are up-to-date and correctly filed.
*   **Version Control:** Use a version number at the end of the file name for multiple versions (e.g., `PRJ5678_2023Q4_Report_v2`).
*   **Naming Consistency:** Adhere to the standard naming format, as inconsistency can cause confusion and slow down workflows.