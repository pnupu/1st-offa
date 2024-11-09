import React from 'react';

const PowerPointStyleGuide: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>PowerPoint Style Guide for Presentation</h1>

      <h2>1. Slide Layouts & Structure</h2>

      <h3>Title Slide</h3>
      <ul>
        <li>Use a large, bold font for the project title (e.g., Arial or Helvetica, 44pt).</li>
        <li>Include the project code and brief tagline under the title in a smaller font (e.g., 20pt).</li>
        <li>Place the company logo and date in the bottom-right corner for consistency.</li>
      </ul>

      <h3>Content Slides</h3>
      <ul>
        <li><strong>Title:</strong> Bold and clear, Arial or Helvetica, 36pt.</li>
        <li><strong>Body:</strong> Use bullet points, 24pt font size.</li>
        <li>Keep text aligned left or center depending on the visual hierarchy.</li>
        <li><strong>Images/Graphics:</strong> Align images to the right or left with a maximum width of 50% of the slide. Make sure there is a small padding around images for clarity.</li>
      </ul>

      <h3>Section Break Slide</h3>
      <ul>
        <li>Large text in bold, 36pt, with the section name.</li>
        <li>Minimalist design, focus on clarity and simplicity.</li>
      </ul>

      <h2>2. Color Scheme</h2>

      <h3>Primary Colors</h3>
      <ul>
        <li><strong>Dark Blue:</strong> #003366 (for text, headings, and key accents).</li>
        <li><strong>White:</strong> #FFFFFF (for backgrounds and slide text).</li>
        <li><strong>Gray:</strong> #B0B0B0 (for secondary text and borders).</li>
      </ul>

      <h3>Accent Colors</h3>
      <ul>
        <li><strong>Light Blue:</strong> #66B2FF (for highlighting important points).</li>
        <li><strong>Orange:</strong> #FF7F32 (for callouts and key statistics).</li>
      </ul>

      <h3>Background</h3>
      <ul>
        <li><strong>Light Gray:</strong> #F4F4F4 for content slides.</li>
        <li><strong>White:</strong> for section headers.</li>
      </ul>

      <h2>3. Fonts</h2>

      <h3>Headings</h3>
      <ul>
        <li>Use bold sans-serif fonts like Arial, Helvetica, or Open Sans.</li>
        <li>Size: 36pt for slide titles, 28pt for section titles.</li>
      </ul>

      <h3>Body Text</h3>
      <ul>
        <li>Arial, Calibri, or Open Sans, regular weight.</li>
        <li>Size: 24pt for most body text.</li>
        <li>Ensure the line spacing is set to 1.5 for better readability.</li>
      </ul>

      <h2>4. Visual Elements</h2>

      <h3>Charts & Graphs</h3>
      <ul>
        <li>Use simple bar, line, or pie charts.</li>
        <li>Keep color coding consistent with the color scheme (e.g., dark blue for main data, light blue for accents).</li>
        <li>Ensure all chart text (labels, legends) is readable and not cluttered.</li>
      </ul>

      <h3>Icons & Images</h3>
      <ul>
        <li>Use flat design icons in a consistent color (e.g., light blue, orange).</li>
        <li>Place high-resolution images (avoid pixelation) with a clear visual relationship to the slide content.</li>
      </ul>

      <h3>Infographics</h3>
      <ul>
        <li>Keep it simple and direct. Use arrows, circular diagrams, and timeline graphics with light background colors.</li>
      </ul>

      <h2>5. Animation & Transitions</h2>

      <h3>Slide Transitions</h3>
      <ul>
        <li>Use subtle transitions like "Fade" for smoothness.</li>
        <li>Avoid heavy transitions like "Push" or "Zoom" as they can be distracting.</li>
      </ul>

      <h3>Animations</h3>
      <ul>
        <li>Use simple animations such as "Appear" or "Fade In" for bullet points.</li>
        <li>Limit the use of animations to important information to maintain professionalism.</li>
      </ul>

      <h2>6. Data Presentation Tips</h2>
      <ul>
        <li><strong>Consistency:</strong> Always follow the same layout for similar data across slides to provide a sense of uniformity.</li>
        <li><strong>Clarity:</strong> Use easy-to-read charts with clear labels and axis markers. Avoid excessive jargon in data descriptions.</li>
      </ul>

      <h2>7. Final Touches</h2>
      <ul>
        <li><strong>Branding:</strong> Ensure the company logo is present in the footer of each slide (size should not overpower the content).</li>
        <li><strong>Margins:</strong> Always leave adequate margins around the content to avoid text or images feeling cramped.</li>
        <li><strong>Final Review:</strong> Before presenting, ensure there are no spelling mistakes and all slides maintain consistency in font sizes, colors, and layout.</li>
      </ul>
    </div>
  );
};

export default PowerPointStyleGuide;
