<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Naming and Organization Standards</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: auto;
            color: #333;
        }
        h1, h2, h3 {
            color: #0056b3;
        }
        code, pre {
            background-color: #f4f4f4;
            padding: 5px;
            border-radius: 4px;
            font-size: 1em;
        }
        ul {
            margin-left: 20px;
        }
        .example {
            font-weight: bold;
            color: #333;
        }
        .purpose {
            color: #888;
            font-style: italic;
        }
    </style>
</head>
<body>

<h1>File Naming and Organization Standards</h1>
<p><strong>Purpose:</strong> To create a streamlined, intuitive, and consistent structure for project file storage, ensuring that all team members can easily locate documents, understand project progress, and archive completed work for future reference.</p>

<h2>1. Naming Conventions</h2>

<h3>Projects</h3>
<p>Each project folder should begin with a unique project code, followed by the quarter and year, and finally the document’s content type.</p>
<p><code>Format:</code> <span class="example">ProjectCode_YearQuarter_ContentType</span></p>
<p><code>Example:</code> <span class="example">PRJ5678_2023Q4_Report</span></p>
<p class="purpose">This format ensures that all files can be easily sorted and identified by both project and timeframe.</p>

<h3>Dates</h3>
<p>For documents requiring specific dates (such as meeting minutes or milestone updates), append the date in <code>YYYYMMDD</code> format at the end of the file name.</p>
<p><code>Example:</code> <span class="example">PRJ5678_2023Q4_MeetingMinutes_20231015</span></p>
<p class="purpose">This date format helps in sorting files chronologically and tracking updates.</p>

<h3>Project Phases</h3>
<p>Within each project folder, organize files by the specific project phase. Common phases include:</p>
<ul>
    <li><code>Phase1_Research</code></li>
    <li><code>Phase2_Design</code></li>
    <li><code>Phase3_Implementation</code></li>
    <li><code>Phase4_Evaluation</code></li>
</ul>
<p class="purpose">This breakdown provides a clear workflow view and allows team members to understand the project’s current phase at a glance.</p>

<h3>Document Type Tags</h3>
<p>Each document’s file name should include a tag indicating the type of document. Common tags are:</p>
<ul>
    <li><code>Report</code>, <code>Presentation</code>, <code>Invoice</code>, <code>Budget</code>, <code>Notes</code>, <code>Timeline</code></li>
</ul>
<p><code>Example:</code> <span class="example">PRJ5678_2023Q4_Presentation</span></p>
<p class="purpose">Including the document type in the file name clarifies the file’s purpose, making it easy to locate within each project phase folder.</p>

<h2>2. Folder Structure</h2>

<h3>Root Folder</h3>
<p>Each project has its own main folder in the central "Projects" directory. This root folder should contain subfolders for each document type.</p>
<p><code>Naming Example:</code> <span class="example">/Projects/PRJ5678</span></p>

<h3>Subfolders for Document Types</h3>
<ul>
    <li><strong>Reports:</strong> For all internal or external reports, including progress, end-of-phase, or completion reports.</li>
    <li><strong>Presentations:</strong> For client or team presentations related to project milestones, updates, or deliverables.</li>
    <li><strong>Communications:</strong> For email threads, client communications, and meeting notes.</li>
    <li><strong>Financials:</strong> For budgets, invoices, and financial summaries.</li>
</ul>

<p><code>Example Structure:</code></p>
<pre>
/Projects/PRJ5678  
├── Reports  
├── Presentations  
├── Communications  
└── Financials  
</pre>
<p class="purpose">This structure separates document types for easier access and prevents clutter within project folders.</p>

<h3>Phase-Based Subfolders</h3>
<p>Within the root project folder, create subfolders organized by the four main project phases.</p>
<p><code>Example Structure:</code></p>
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
<p class="purpose">This allows teams to access documents by project phase, making it easy to see what has been completed or is in progress.</p>

<h3>General Resources Subfolder</h3>
<p>For documents that apply across phases, such as an overall project timeline or a list of contacts.</p>
<p><code>Naming Example:</code> <span class="example">/Projects/PRJ5678/Resources</span></p>
<p class="purpose">Keeps overarching documents readily accessible throughout the project’s lifecycle.</p>

<h2>3. Archiving Completed Projects</h2>

<h3>Quarterly Archives</h3>
<p>At the end of each quarter, completed projects should be moved to the "Archives" folder.</p>
<p><code>Folder Format:</code> <span class="example">/Archives/YearQuarter/ProjectCode</span></p>
<p><code>Example:</code> <span class="example">/Archives/2023Q4/PRJ5678</span></p>
<p class="purpose">Archiving completed projects frees up space in active directories and ensures current projects remain easily accessible.</p>

<h3>Final Project Files</h3>
<p>Within the archive, each project should have a “Final Deliverables” subfolder containing all approved final documents for future use or reference.</p>
<p><code>Naming Example:</code> <span class="example">/Archives/2023Q4/PRJ5678/Final_Deliverables</span></p>

<h2>4. Best Practices</h2>
<ul>
    <li><strong>Regular Updates:</strong> Each team member should review project folders weekly to ensure documents are up-to-date and correctly filed.</li>
    <li><strong>Version Control:</strong> Use a version number at the end of the file name for multiple versions (e.g., <code>PRJ5678_2023Q4_Report_v2</code>).</li>
    <li><strong>Naming Consistency:</strong> Adhere to the standard naming format, as inconsistency can cause confusion and slow down workflows.</li>
</ul>

</body>
</html>
