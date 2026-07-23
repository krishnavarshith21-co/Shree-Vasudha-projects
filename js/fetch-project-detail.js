/* ============================================================
   Project Detail — Supabase Data Fetching
   Populates the luxury project detail page from Supabase.
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const show404 = () => {
    document.title = "Project Not Found — Shree Vasudha Projects";
    const section404 = document.getElementById('project-404-section');
    const mainHero = document.getElementById('project-main-hero');
    const mainContent = document.getElementById('project-main-content');

    if (section404) section404.style.display = 'flex';
    if (mainHero) mainHero.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    const loadingSection = document.getElementById('project-loading-section');
    if (loadingSection) loadingSection.style.display = 'none';
  };

  if (!slug) {
    show404();
    return;
  }

  try {
    const { data: project, error } = await window.supabaseClient
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !project) {
      console.error("Project error:", error);
      show404();
      return;
    }

    // ─── SEO META TAGS & TITLE ───
    document.title = project.seo_title ? project.seo_title : `${project.name} — Luxury Real Estate`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = project.seo_description || `Explore ${project.name}, a premium real estate project by Shree Vasudha Projects.`;

    
    // ─── HERO ───
    const loadingSection = document.getElementById('project-loading-section');
    const mainHero = document.getElementById('project-main-hero');
    const mainContent = document.getElementById('project-main-content');
    
    if (loadingSection) loadingSection.style.display = 'none';
    if (mainHero) mainHero.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'block';

    const titleEl = document.getElementById('project-title');
    if (titleEl) titleEl.textContent = project.name;

    const taglineEl = document.getElementById('project-tagline');
    if (taglineEl) taglineEl.textContent = project.tagline || 'Experience Luxury Living';


    const locationEl = document.getElementById('project-location');
    if (locationEl) {
      locationEl.innerHTML = `<i data-lucide="map-pin"></i> <span>${project.location || "Hyderabad"}</span>`;
    }

    // Status badge
    const badgeEl = document.getElementById('project-status-badge');
    if (badgeEl) {
      let icon = '';
      if (project.status === 'Completed') {
        icon = 'check-circle';
      } else if (project.status === 'Ongoing') {
        icon = 'activity';
      } else {
        icon = 'clock';
      }
      badgeEl.innerHTML = `<i data-lucide="${icon}" style="width: 14px; height: 14px;"></i> <span>${project.status || 'Upcoming'}</span>`;
    }

        // Hero background logic
    const badWords = ['brochure', 'masterplan', 'layout', 'qr', 'location', 'pdf', 'thumbnail', 'gallery'];
    const candidates = [
        project.heroImage, project.hero_image, 
        project.coverImage, project.cover_image, 
        project.bannerImage, project.banner_image, 
        project.image_url
    ];
    
    // Only use gallery images as a last resort if they don't contain bad words (like 'brochure')
    if (project.gallery_images && Array.isArray(project.gallery_images)) {
        candidates.push(...project.gallery_images);
    }
    
    let selectedHero = 'assets/images/hero-sunset.jpg'; // default fallback
    
    for (let img of candidates) {
      if (img && typeof img === 'string') {
        const lowerImg = img.toLowerCase();
        const isBad = badWords.some(word => lowerImg.includes(word));
        if (!isBad && !lowerImg.includes('1783443297432-lzljsww.png')) {
          selectedHero = img;
          break;
        }
      }
    }
    
    const heroBg = document.getElementById('project-hero-bg');
    if (heroBg) {
      heroBg.style.backgroundImage = `url('${selectedHero}')`;
    }

    // Price
    const priceEl = document.getElementById('project-price');
    if (priceEl) priceEl.textContent = project.price || 'Price on Request';

    // ─── HIGHLIGHTS ───
    const configEl = document.getElementById('project-config');
    if (configEl) configEl.textContent = project.config || 'TBA';

    const areaEl = document.getElementById('project-area');
    if (areaEl) areaEl.textContent = project.area || 'TBA';

    const approvalsEl = document.getElementById('project-approvals');
    if (approvalsEl) approvalsEl.textContent = project.approvals || 'TBA';

    // ─── OVERVIEW ───
    const descEl = document.getElementById('project-description');
    if (descEl && project.description) {
      descEl.innerHTML = `<p>${project.description.replace(/\n/g, '<br>')}</p>`;
    }

    const highlightsEl = document.getElementById('project-highlights');
    if (highlightsEl && project.highlights) {
      highlightsEl.innerHTML = `<p>${project.highlights.replace(/\n/g, '<br>')}</p>`;
    }

    // Replace editorial placeholder images if gallery images exist
    if (project.gallery_images && project.gallery_images.length >= 2) {
      const editImg1 = document.getElementById('editorial-image-1');
      const editImg2 = document.getElementById('editorial-image-2');
      if (editImg1) editImg1.src = project.gallery_images[0];
      if (editImg2) editImg2.src = project.gallery_images[1];
    }

            // ─── LOCATION & CONNECTIVITY ───
    const distList = document.getElementById('project-distance-list');
    if (distList) {
      if (project.distances_json && Array.isArray(project.distances_json) && project.distances_json.length > 0) {
        distList.innerHTML = project.distances_json.map(d => `
          <div class="pdl-location-card">
            <div class="pdl-location-icon"><i data-lucide="${d.icon || 'map-pin'}"></i></div>
            <h4>${d.landmark || d.name || d.title}</h4>
            <p>${d.distance || d.time || d.duration || d.description}</p>
          </div>
        `).join('');
      }
      if (window.lucide) window.lucide.createIcons();
    }

    // ─── MEDIA SECTIONS ───
    let hasMedia = false;

    // Video
    if (project.video_url) {
      hasMedia = true;
      const videoSection = document.getElementById('project-video-section');
      const videoEl = document.getElementById('project-video');
      if (videoSection) videoSection.style.display = 'block';
      if (videoEl) videoEl.src = project.video_url;
    }

    // Gallery
    if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
      hasMedia = true;
      const gallerySection = document.getElementById('project-gallery-section');
      const galleryContainer = document.getElementById('project-gallery-grid');
      
      if (gallerySection) gallerySection.style.display = 'block';
      
      if (galleryContainer) {
        galleryContainer.innerHTML = '';
        project.gallery.forEach((imgObj, i) => {
          galleryContainer.innerHTML += `
            <div class="pdl-gallery-item pdl-reveal-up" style="transition-delay: ${i * 0.1}s;">
              <img src="${imgObj.url}" alt="${project.name} Gallery ${i+1}" loading="lazy">
              <div class="pdl-gallery-caption">
                <i data-lucide="zoom-in" style="color: white; width: 32px; height: 32px;"></i>
              </div>
            </div>
          `;
        });
      }
    } else if (project.gallery_images && project.gallery_images.length > 0) {
      hasMedia = true;
      const gallerySection = document.getElementById('project-gallery-section');
      const galleryGrid = document.getElementById('project-gallery-grid');
      if (gallerySection) gallerySection.style.display = 'block';
      if (galleryGrid) {
        let html = '';
        project.gallery_images.forEach(imgUrl => {
          html += `
            <div class="pdl-gallery-item pdl-reveal-up">
              <img src="${imgUrl}" alt="Gallery Image">
              <div class="pdl-gallery-caption">
                <i data-lucide="zoom-in"></i>
              </div>
            </div>
          `;
        });
        galleryGrid.innerHTML = html;
      }
    }

    // Master Plan
    if (project.master_plan_url) {
      hasMedia = true;
      const mpSection = document.getElementById('project-masterplan-section');
      const mpImg = document.getElementById('project-masterplan-img');
      if (mpSection) mpSection.style.display = 'block';
      if (mpImg) mpImg.src = project.master_plan_url;
    }

    // Brochure
    if (project.brochure_url) {
      hasMedia = true;
      const brochureSection = document.getElementById('project-brochure-section');
      const brochureBtn = document.getElementById('project-brochure-btn');
      const heroBrochureBtn = document.getElementById('hero-brochure-btn');

      if (brochureSection) brochureSection.style.display = 'block';
      if (brochureBtn) brochureBtn.href = project.brochure_url;
      if (heroBrochureBtn) {
        heroBrochureBtn.href = project.brochure_url;
        heroBrochureBtn.style.display = 'inline-flex';
      }
    }

    // Show media container if any media exists
    if (hasMedia) {
      const mediaContainer = document.getElementById('project-media-container');
      if (mediaContainer) mediaContainer.style.display = 'block';
    }

    // Amenities
    if (project.amenities_json && Array.isArray(project.amenities_json) && project.amenities_json.length > 0) {
      const amSection = document.getElementById('project-amenities-section');
      const amGrid = document.getElementById('project-amenities-grid');
      if (amSection) amSection.style.display = 'block';
      if (amGrid) {
        amGrid.innerHTML = '';
        project.amenities_json.forEach((amenity, index) => {
          const label = typeof amenity === 'object' ? amenity.name : amenity;
          // Use image if provided, else use a placeholder luxury image from unsplash
          let bgImage = typeof amenity === 'object' && amenity.image ? amenity.image : `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&sig=${index}`;
          
          amGrid.innerHTML += `
            <div class="pdl-amenity-card pdl-reveal-up">
              <img src="${bgImage}" alt="${label}" loading="lazy">
              <div class="pdl-amenity-overlay">
                <h4>${label}</h4>
              </div>
            </div>
          `;
        });
      }
    }

    // Timeline
    const tlContainer = document.getElementById('project-timeline');
    const tlParent = tlContainer ? tlContainer.closest('.pdl-roi-timeline') : null;
    
    if (project.timeline_json && Array.isArray(project.timeline_json) && project.timeline_json.length > 0) {
      if (tlParent) tlParent.style.display = 'block';
      if (tlContainer) {
        // Calculate progress % based on completed statuses
        const completedCount = project.timeline_json.filter(t => t.status === 'completed').length;
        const totalCount = project.timeline_json.length;
        const progressPercent = totalCount > 1 ? (completedCount / (totalCount - 1)) * 100 : 100;
        
        const progressBar = tlContainer.querySelector('.pdl-timeline-progress');
        if (progressBar) progressBar.style.height = `${progressPercent}%`;

        project.timeline_json.forEach((phase, index) => {
          const isActive = phase.status === 'completed' ? 'is-active' : '';
          
          const newEl = document.createElement('div');
          newEl.className = `pdl-tl-node pdl-reveal-up ${isActive}`;
          newEl.innerHTML = `
            <div class="pdl-tl-marker"></div>
            <div class="pdl-tl-content">
              <span class="pdl-tl-date">${phase.year || `Phase ${index + 1}`}</span>
              <h3 class="pdl-tl-title">${phase.title || 'Development'}</h3>
              ${phase.description ? `<p class="pdl-tl-desc">${phase.description}</p>` : ''}
            </div>
          `;
          tlContainer.appendChild(newEl);
        });
      }
    } else {
      if (tlParent) tlParent.style.display = 'none';
    }

    // ─── INQUIRY FORM ───
    const inquiryProject = document.getElementById('inquiry-project');
    if (inquiryProject) inquiryProject.value = project.name;

    // Re-init lucide icons for dynamic content
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Init animations for newly injected DOM elements
    if (typeof initPDLInteractions === 'function') {
      requestAnimationFrame(() => {
        initPDLInteractions();
      });
    }

  } catch (err) {
    console.error("Unexpected error fetching project:", err);
  }

  // ─── INQUIRY FORM HANDLER ───
  const form = document.getElementById('project-inquiry-form');
  const feedback = document.getElementById('inquiry-feedback');
  const submitBtn = document.getElementById('inquiry-submit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('inquiry-name').value;
      const email = document.getElementById('inquiry-email').value;
      const phone = document.getElementById('inquiry-phone').value;
      const message = document.getElementById('inquiry-message').value;
      const project_interest = document.getElementById('inquiry-project').value;

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const { error } = await window.supabaseClient
          .from('leads')
          .insert([{ name, email, phone, message, project_interest }]);

        if (error) throw error;

        feedback.style.display = 'block';
        feedback.style.color = 'var(--color-success)';
        feedback.textContent = 'Thank you! We will contact you shortly to schedule your tour.';
        form.reset();
      } catch (err) {
        console.error(err);
        feedback.style.display = 'block';
        feedback.style.color = 'var(--color-error)';
        feedback.textContent = 'Error sending inquiry. Please try again or call us directly.';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
