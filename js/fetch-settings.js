document.addEventListener('DOMContentLoaded', async () => {
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
          el.href = `tel:${v.phone.replace(/\s+/g, '')}`;
          if (el.textContent.trim().match(/^[0-9+\-\s]+$/)) {
            el.textContent = v.phone;
          }
        });
      }

      // Update WhatsApp globally
      const waNumber = v.whatsapp ? v.whatsapp.replace(/[^0-9]/g, '') : '917702436052';
      const waBaseUrl = `https://wa.me/${waNumber}`;
      const waEnquiryUrl = `${waBaseUrl}?text=Hello%20I%20am%20interested%20in%20this%20project.`;
      
      document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(el => {
        // Check if it's an enquiry button (like the sticky bar or specific CTA)
        if (el.classList.contains('pdl-sticky-btn--wa') || el.classList.contains('enquiry-wa-btn')) {
          el.href = waEnquiryUrl;
        } else {
          el.href = waBaseUrl;
        }
      });

      // Update Emails globally
      if (v.email) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
          el.href = `mailto:${v.email}`;
          // Only replace text if it looks like an email to avoid replacing buttons
          if (el.textContent.includes('@')) {
            el.textContent = v.email;
          }
        });
      }

      // Update Social Media Links
      const updateSocialLink = (network, url) => {
        if (url) {
          document.querySelectorAll(`a[href*="${network}.com"]`).forEach(el => {
            el.href = url;
          });
        }
      };
      
      updateSocialLink('facebook', v.facebook);
      updateSocialLink('instagram', v.instagram);
      updateSocialLink('youtube', v.youtube);
      updateSocialLink('linkedin', v.linkedin);

      // Update Branding
      if (v.brand_color) {
        document.documentElement.style.setProperty('--color-accent', v.brand_color);
        document.documentElement.style.setProperty('--color-primary', v.brand_color);
      }
      
      if (v.company_name) {
        document.title = document.title.replace('Shree Vasudha Projects', v.company_name);
        document.querySelectorAll('.company-name').forEach(el => el.textContent = v.company_name);
      }

      // Update Addresses
      if (v.address) {
        const formattedAddress = v.address.replace(/\n/g, '<br>');
        
        // Footer
        const footerAddress = document.getElementById('footer-address');
        if (footerAddress) {
          const content = `<p>${v.address.split(',').join('</p><p>')}</p>`;
          const aTag = footerAddress.querySelector('a');
          if (aTag) {
            aTag.href = v.maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`;
            aTag.innerHTML = content;
          } else {
            const genericMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`;
            footerAddress.innerHTML = `<a href="${v.maps_link || genericMapsLink}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; display: block; transition: color 0.3s;" onmouseover="this.style.color='var(--color-primary)'" onmouseout="this.style.color='inherit'">${content}</a>`;
          }
        }

        // Contact Page
        const contactAddress = document.getElementById('contact-page-address');
        if (contactAddress) {
          // If maps link is provided, wrap it
          if (v.maps_link) {
            contactAddress.innerHTML = `<a href="${v.maps_link}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">${formattedAddress}</a>`;
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
          footerHours.innerHTML = `<p>${v.business_hours.split(',').join('</p><p>')}</p>`;
        }

        // Contact Page
        const contactHours = document.getElementById('contact-page-hours');
        if (contactHours) {
          contactHours.innerHTML = v.business_hours.replace(/\n/g, '<br>');
        }
      }
    }
  } catch (err) {
    console.error("Error fetching global settings:", err);
  }
});
