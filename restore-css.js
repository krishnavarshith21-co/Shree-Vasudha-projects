const fs = require('fs');

const path = 'project-detail.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Add CSS Link
html = html.replace(
  '<link rel="stylesheet" href="css/tablet-responsive.css?v=1.0">',
  '<link rel="stylesheet" href="css/tablet-responsive.css?v=1.0">\n  <link rel="stylesheet" href="css/project-detail-luxury.css">'
);

fs.writeFileSync(path, html);
console.log('Restored project-detail-luxury.css to project-detail.html');
