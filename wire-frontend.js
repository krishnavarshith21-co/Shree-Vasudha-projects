const fs = require('fs');

// 1. UPDATE index.html (Footer & Script inclusion)
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Add IDs to footer address and hours
indexHtml = indexHtml.replace(
  /<div class="footer-contact-text">\s*<p>Plot - 285, 5th Floor<\/p>[\s\S]*?<\/div>/,
  `<div class="footer-contact-text" id="footer-address">
                <p>Plot - 285, 5th Floor</p>
                <p>H.No. 5-6-190</p>
                <p>Vaidhehi Nagar, Saheb Nagar Kalan</p>
                <p>BN Reddy Nagar, R.R. Dist.</p>
                <p>Telangana - 500070</p>
              </div>`
);

indexHtml = indexHtml.replace(
  /<div class="footer-contact-text">\s*<p>Monday – Saturday<\/p>[\s\S]*?<\/div>/,
  `<div class="footer-contact-text" id="footer-hours">
                <p>Monday – Saturday</p>
                <p>9:30 AM – 7:00 PM</p>
                <p>Sunday Closed</p>
              </div>`
);

// Add the fetch-settings script
if (!indexHtml.includes('js/fetch-settings.js')) {
  indexHtml = indexHtml.replace(
    /<\/body>/,
    `  <script src="js/fetch-settings.js"></script>\n</body>`
  );
}

fs.writeFileSync('index.html', indexHtml);
console.log('index.html updated');

// 2. UPDATE build_pages.py (Contact Page IDs)
let buildPy = fs.readFileSync('build_pages.py', 'utf8');

buildPy = buildPy.replace(
  /<p style="color:var\(--color-text-secondary\); line-height:1\.6;"><a href="https:\/\/maps\.google\.com\?q=Shree.*?">Plot - 285.*?<\/a><\/p>/,
  `<p style="color:var(--color-text-secondary); line-height:1.6;" id="contact-page-address"><a href="https://maps.google.com?q=Shree%20vasudha" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">Plot - 285, 5th Floor<br>H.No. 5-6-190<br>Vaidhehi Nagar, Saheb Nagar Kalan<br>BN Reddy Nagar, R.R. Dist.<br>Telangana – 500070</a></p>`
);

buildPy = buildPy.replace(
  /<p style="color:var\(--color-text-secondary\); line-height:1\.6;">Monday – Saturday<br>9:30 AM – 7:00 PM<br>Sunday Closed<\/p>/,
  `<p style="color:var(--color-text-secondary); line-height:1.6;" id="contact-page-hours">Monday – Saturday<br>9:30 AM – 7:00 PM<br>Sunday Closed</p>`
);

fs.writeFileSync('build_pages.py', buildPy);
console.log('build_pages.py updated');

// 3. CREATE js/fetch-settings.js
const fetchSettingsCode = `document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  try {
    const { data } = await window.supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'global')
      .single();

    if (data && data.value) {
      const v = data.value;

      // Update Phones globally
      if (v.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
          el.href = \`tel:\${v.phone.replace(/\\s+/g, '')}\`;
          el.textContent = v.phone;
        });
      }

      // Update Emails globally
      if (v.email) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
          el.href = \`mailto:\${v.email}\`;
          // Only replace text if it looks like an email to avoid replacing buttons
          if (el.textContent.includes('@')) {
            el.textContent = v.email;
          }
        });
      }

      // Update Addresses
      if (v.address) {
        const formattedAddress = v.address.replace(/\\n/g, '<br>');
        
        // Footer
        const footerAddress = document.getElementById('footer-address');
        if (footerAddress) {
          footerAddress.innerHTML = \`<p>\${v.address.split(',').join('</p><p>')}</p>\`;
        }

        // Contact Page
        const contactAddress = document.getElementById('contact-page-address');
        if (contactAddress) {
          // If maps link is provided, wrap it
          if (v.maps_link) {
            contactAddress.innerHTML = \`<a href="\${v.maps_link}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">\${formattedAddress}</a>\`;
          } else {
            contactAddress.innerHTML = formattedAddress;
          }
        }
      }

      // Update Business Hours
      if (v.business_hours) {
        // Footer
        const footerHours = document.getElementById('footer-hours');
        if (footerHours) {
          footerHours.innerHTML = \`<p>\${v.business_hours.split(',').join('</p><p>')}</p>\`;
        }

        // Contact Page
        const contactHours = document.getElementById('contact-page-hours');
        if (contactHours) {
          contactHours.innerHTML = v.business_hours.replace(/\\n/g, '<br>');
        }
      }
    }
  } catch (err) {
    console.error("Error fetching global settings:", err);
  }
});
`;

fs.writeFileSync('js/fetch-settings.js', fetchSettingsCode);
console.log('js/fetch-settings.js created');
