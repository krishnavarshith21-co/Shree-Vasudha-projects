const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already added
  if (content.includes('fetch-settings.js')) return;

  // Insert before </body>
  const scriptTag = `\n  <!-- Global Settings -->\n  <script src="js/fetch-settings.js"></script>\n</body>`;
  content = content.replace('</body>', scriptTag);

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
