const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const insertionPoint = `    <!-- ================================================
         WHY CHOOSE US
         ================================================ -->`;
const newSection = `    <!-- ================================================
         FEATURED PROJECTS
         ================================================ -->
    <section class="section section--projects" id="projects">
      <div class="container">
        <div class="section__header text-center reveal">
          <div class="section__overline">Our Portfolio</div>
          <h2 class="section__title">Signature <span class="text-gradient">Developments</span></h2>
          <p class="section__desc">
            Explore our curated selection of luxury properties.
          </p>
        </div>
        
        <div class="project-grid projects-grid stagger-children" style="margin-top: 48px;">
          <!-- Dynamically populated by fetch-projects.js -->
        </div>
        
        <div style="text-align: center; margin-top: 60px;" class="reveal">
          <a href="projects.html" class="btn btn--primary">View All Projects <span class="btn__arrow">→</span></a>
        </div>
      </div>
    </section>

`;
html = html.replace(insertionPoint, newSection + insertionPoint);
fs.writeFileSync('index.html', html);

let pdlHtml = fs.readFileSync('project-detail.html', 'utf8');
const testimonialsRegex = /<!-- ────────────────────────────────────────────────────\s*TESTIMONIALS\s*──────────────────────────────────────────────────── -->\s*<section class="pdl-section pdl-section--secondary">[\s\S]*?<\/section>/;
pdlHtml = pdlHtml.replace(testimonialsRegex, '');
fs.writeFileSync('project-detail.html', pdlHtml);

console.log('Restored index and project-detail');
