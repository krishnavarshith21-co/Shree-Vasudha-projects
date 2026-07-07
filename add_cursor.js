const fs = require('fs');
const jsPath = 'js/app.js';

let jsContent = fs.readFileSync(jsPath, 'utf-8');

const cursorCode = `

  /* --------------------------------------------------------
     CUSTOM LUXURY CURSOR
     -------------------------------------------------------- */
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('cursor-dot');
  document.body.appendChild(cursorDot);

  const cursorOutline = document.createElement('div');
  cursorOutline.classList.add('cursor-outline');
  document.body.appendChild(cursorOutline);

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows exactly
    cursorDot.style.transform = \`translate(\${mouseX}px, \${mouseY}px)\`;
  });

  function animateCursor() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    
    outlineX += distX * 0.15;
    outlineY += distY * 0.15;
    
    cursorOutline.style.transform = \`translate(\${outlineX}px, \${outlineY}px)\`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effect to links and buttons
  const interactiveElements = document.querySelectorAll('a, button, .btn, .navbar__dropdown-toggle');
  
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover-dot');
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover-dot');
    });
  });
`;

if (!jsContent.includes('CUSTOM LUXURY CURSOR')) {
    // Insert just before the end of DOMContentLoaded
    const insertIndex = jsContent.lastIndexOf('});');
    if (insertIndex !== -1) {
        jsContent = jsContent.slice(0, insertIndex) + cursorCode + jsContent.slice(insertIndex);
        fs.writeFileSync(jsPath, jsContent);
        console.log('Cursor JS injected.');
    }
} else {
    console.log('Cursor JS already exists.');
}
