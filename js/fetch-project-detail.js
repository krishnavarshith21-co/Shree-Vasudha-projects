/* ============================================================
   Project Detail — Supabase Data Fetching (v3.0)
   Populates the luxury project detail page from Supabase.
   Restores all functionality: highlights, gallery, brochure,
   contact form with validation, toast notifications, and
   elegant empty-state fallbacks.
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

  const id = urlParams.get('id');
  const projectId = urlParams.get('projectId');
  const projectSlug = urlParams.get('projectSlug');
  
  const searchSlug = slug || projectSlug;
  const searchId = id || projectId;

  // ─── ICON MAPPING for project highlights ───
  const HIGHLIGHT_ICON_MAP = {
    'open plots': { icon: 'map', desc: 'Spacious open plots designed for your dream home.' },
    'mega gated community': { icon: 'shield', desc: 'A prestigious mega gated community with secure access.' },
    'gated community': { icon: 'shield', desc: 'Premium gated community for peace of mind.' },
    'dtcp': { icon: 'badge-check', desc: 'Fully approved by DTCP for legitimate development.' },
    'rera': { icon: 'badge-check', desc: 'RERA registered ensuring complete transparency.' },
    'dtcp/rera': { icon: 'badge-check', desc: 'DTCP & RERA approved for complete legal assurance.' },
    'dtcp/rera approved': { icon: 'badge-check', desc: 'DTCP & RERA approved for complete legal assurance.' },
    'wide roads': { icon: 'road', desc: 'Well-planned wide internal roads for smooth connectivity.' },
    'roads': { icon: 'road', desc: 'Premium quality roads throughout the layout.' },
    '24x7 security': { icon: 'shield-check', desc: 'Round-the-clock security for your family safety.' },
    'security': { icon: 'shield-check', desc: 'Advanced security systems and surveillance.' },
    'landscaped parks': { icon: 'trees', desc: 'Beautifully landscaped parks and green spaces.' },
    'parks': { icon: 'trees', desc: 'Lush green parks for relaxation and recreation.' },
    'underground drainage': { icon: 'pipette', desc: 'Modern underground drainage for a clean environment.' },
    'drainage': { icon: 'pipette', desc: 'Efficient drainage system throughout the project.' },
    'street lights': { icon: 'lamp', desc: 'Well-lit streets with elegant lighting infrastructure.' },
    'avenue plantation': { icon: 'flower-2', desc: 'Beautiful avenue plantation for a green canopy.' },
    'plantation': { icon: 'flower-2', desc: 'Lush plantation creating a serene environment.' },
    'club house': { icon: 'building', desc: 'Luxurious clubhouse with premium facilities.' },
    'clubhouse': { icon: 'building', desc: 'State-of-the-art clubhouse for community living.' },
    "children's park": { icon: 'baby', desc: 'Safe and fun play areas designed for children.' },
    'childrens park': { icon: 'baby', desc: 'Safe and fun play areas designed for children.' },
    'kids play area': { icon: 'baby', desc: 'Dedicated play zones for your little ones.' },
    'water supply': { icon: 'droplets', desc: '24x7 bore well water supply with overhead tank.' },
    'water': { icon: 'droplets', desc: 'Assured water supply infrastructure.' },
    'electricity': { icon: 'zap', desc: 'Underground electrical cabling with dedicated transformers.' },
    'power': { icon: 'zap', desc: 'Reliable power supply infrastructure.' },
    '100% vaastu': { icon: 'compass', desc: 'All plots designed as per Vaastu Shastra principles.' },
    'vaastu': { icon: 'compass', desc: 'Vaastu compliant layouts for prosperity.' },
    'temple': { icon: 'landmark', desc: 'A serene temple within the community.' },
    'swimming pool': { icon: 'waves', desc: 'Luxury swimming pool for recreation.' },
    'gym': { icon: 'dumbbell', desc: 'Fully equipped modern gymnasium.' },
    'jogging track': { icon: 'footprints', desc: 'Dedicated jogging tracks amidst greenery.' },
    'community hall': { icon: 'users', desc: 'Spacious community hall for events and gatherings.' },
    'cctv': { icon: 'cctv', desc: 'CCTV surveillance for enhanced security.' },
    'rain water harvesting': { icon: 'cloud-rain', desc: 'Sustainable rainwater harvesting systems.' },
    'compound wall': { icon: 'fence', desc: 'Boundary compound wall for added security.' },
    'black top roads': { icon: 'road', desc: 'Premium black-top roads throughout the layout.' },
    'main entrance arch': { icon: 'door-open', desc: 'Grand entrance arch welcoming residents.' },
    'overhead tank': { icon: 'container', desc: 'Community overhead water tank for consistent supply.' },
    'bore well': { icon: 'drill', desc: 'Deep bore well for reliable water source.' },
    'sump': { icon: 'archive', desc: 'Underground water sump for storage.' },
    'default': { icon: 'sparkles', desc: 'Premium feature for an elevated lifestyle.' }
  };

  function getHighlightMeta(featureName) {
    const key = featureName.toLowerCase().trim();
    // Check exact match first
    if (HIGHLIGHT_ICON_MAP[key]) return HIGHLIGHT_ICON_MAP[key];
    // Check partial match
    for (const [mapKey, meta] of Object.entries(HIGHLIGHT_ICON_MAP)) {
      if (key.includes(mapKey) || mapKey.includes(key)) return meta;
    }
    return HIGHLIGHT_ICON_MAP['default'];
  }

  // ─── TOAST NOTIFICATION SYSTEM ───
  function showToast(message, type = 'success') {
    const container = document.getElementById('pdl-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pdl-toast pdl-toast--${type}`;

    const iconSvg = type === 'success'
      ? '<svg class="pdl-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      : '<svg class="pdl-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  // ─── FORM VALIDATION ───
  function validateForm() {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.pdl-form-field').forEach(f => f.classList.remove('pdl-form-field--error'));

    const name = document.getElementById('inquiry-name');
    const email = document.getElementById('inquiry-email');
    const phone = document.getElementById('inquiry-phone');

    // Name validation
    if (!name.value.trim() || name.value.trim().length < 2) {
      document.getElementById('field-name').classList.add('pdl-form-field--error');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      document.getElementById('field-email').classList.add('pdl-form-field--error');
      isValid = false;
    }

    // Phone validation (Indian format: 10+ digits)
    const phoneClean = phone.value.replace(/[\s\-\+\(\)]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      document.getElementById('field-phone').classList.add('pdl-form-field--error');
      isValid = false;
    }

    return isValid;
  }

  try {
    let project = null;

    // 1. Try by slug
    if (searchSlug) {
      const { data, error } = await window.supabaseClient
        .from('projects')
        .select('*')
        .eq('slug', searchSlug)
        .single();
      if (!error && data) project = data;
    }

    // 2. Try by id if slug failed or wasn't provided
    if (!project && searchId) {
      const { data, error } = await window.supabaseClient
        .from('projects')
        .select('*')
        .eq('id', searchId)
        .single();
      if (!error && data) project = data;
    }

    // 3. Fallback: get the first published project
    if (!project) {
      const { data, error } = await window.supabaseClient
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!error && data) project = data;
    }

    if (!project) {
      // 10. Final Requirement: Seed a sample project if empty
      const sampleProject = {
        name: "Sample Luxury Villa",
        slug: "sample-luxury-villa",
        status: "Ongoing",
        location: "Hyderabad",
        config: "4 BHK Premium Villas",
        price: "Starting at ₹2.5 Cr",
        area: "15 Acres",
        description: "Experience unparalleled luxury in our carefully crafted villas with world-class amenities.",
        highlights: "Club House, Swimming Pool, 24x7 Security, Landscaped Gardens",
        image_url: "assets/images/hero-sunset.jpg",
        published: true,
        featured: true
      };
      
      const { data: inserted, error: insertError } = await window.supabaseClient
        .from('projects')
        .insert([sampleProject])
        .select()
        .single();
        
      if (insertError) {
        show404();
        return;
      }
      project = inserted;
    }

    // Production ready: no logs


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
    const statusTextEl = document.getElementById('project-status-text');
    if (badgeEl || statusTextEl) {
      let icon = '';
      if (project.status === 'Completed') {
        icon = 'check-circle';
      } else if (project.status === 'Ongoing') {
        icon = 'activity';
      } else {
        icon = 'clock';
      }
      if (badgeEl) badgeEl.innerHTML = `<i data-lucide="${icon}" style="width: 14px; height: 14px;"></i> <span>${project.status || 'Upcoming'}</span>`;
      if (statusTextEl) statusTextEl.textContent = project.status || 'Upcoming';
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
    if (priceEl) priceEl.textContent = (project.price && project.price.trim() !== '') ? project.price : 'Price on Request';

    // ─── HIGHLIGHTS (Quick Info Cards) ───
    const configEl = document.getElementById('project-config');
    if (configEl) configEl.textContent = (project.config && project.config.trim() !== '') ? project.config : 'TBA';

    const areaEl = document.getElementById('project-area');
    if (areaEl) areaEl.textContent = (project.area && project.area.trim() !== '') ? project.area : 'TBA';

    // The HTML has `project-status-text` but the JS originally looked for `project-approvals`
    // Ensure `project-status-text` is updated (already done above, but just in case we update `project-approvals` if it exists)
    const approvalsEl = document.getElementById('project-approvals');
    if (approvalsEl) approvalsEl.textContent = (project.approvals && project.approvals.trim() !== '') ? project.approvals : 'TBA';

    // ─── OVERVIEW ───
    // ─── OVERVIEW ───
    const descEl = document.getElementById('project-description');
    if (descEl && project.description) {
      const paragraphs = project.description
        .split(/\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => `<p style="margin-bottom: 1.5rem;">${p}</p>`)
        .join('');
      descEl.innerHTML = paragraphs;
    } else if (descEl) {
      descEl.innerHTML = `<p style="margin-bottom: 1.5rem;">Discover the premium living experience at ${project.name || 'this exclusive project'}. A thoughtfully designed community that blends modern architecture with timeless elegance, offering you the perfect place to call home.</p>`;
    }

    // Replace editorial placeholder images if gallery images exist
    const overviewImg = document.getElementById('project-overview-image');
    if (overviewImg) {
      let overviewSrc = null;
      if (project.gallery_images && project.gallery_images.length > 0) {
        overviewSrc = project.gallery_images[0];
      } else if (project.image_url) {
        overviewSrc = project.image_url;
      }
      if (overviewSrc) {
        overviewImg.innerHTML = `<img src="${overviewSrc}" alt="${project.name || 'Project'} Overview" loading="lazy">`;
      } else {
        overviewImg.innerHTML = `<img src="assets/images/hero-sunset.jpg" alt="Project Overview" loading="lazy">`;
      }
    }

    // ─── PROJECT HIGHLIGHTS (Premium Feature Cards) ───
    const highlightsGrid = document.getElementById('project-highlights-grid');
    if (highlightsGrid) {
      let features = [];
      
      // Parse highlights — support both string and array formats
      if (project.highlights_json && Array.isArray(project.highlights_json)) {
        features = project.highlights_json.map(h => typeof h === 'object' ? h.name || h.title : h);
      } else if (project.highlights) {
        features = project.highlights.split(/,|\n/).map(f => f.trim()).filter(f => f);
      }

      // Premium Fallback Filler - ONLY applied if database is completely empty
      if (features.length === 0) {
        features = [
          "100% Clear Title",
          "Excellent Return on Investment",
          "Strategic Prime Location",
          "Vastu Compliant Design",
          "Lush Green Surroundings",
          "Premium Infrastructure",
          "Seamless Connectivity",
          "Secure Environment"
        ];
      }

      if (features.length > 0) {
        highlightsGrid.innerHTML = features.map((feature, index) => {
          const meta = getHighlightMeta(feature);
          return `
            <div class="pdl-feature-card pdl-reveal-up" style="transition-delay: ${Math.min(index * 0.08, 0.8)}s;">
              <div class="pdl-feature-card__icon">
                <i data-lucide="${meta.icon}"></i>
              </div>
              <h4>${feature}</h4>
              <p>${meta.desc}</p>
            </div>
          `;
        }).join('');
      } else {
        highlightsGrid.innerHTML = `
          <div class="pdl-placeholder-card">
            <i data-lucide="sparkles" class="pdl-placeholder-card__icon"></i>
            <h3 class="pdl-placeholder-card__title">Highlights Coming Soon</h3>
            <p class="pdl-placeholder-card__desc">Project highlights are being curated. Check back soon for exclusive features of this premium development.</p>
          </div>
        `;
      }
    }

    // ─── LOCATION & CONNECTIVITY ───
    const connectivityGrid = document.getElementById('project-connectivity-grid');
    const locationSection = document.getElementById('project-location-section');
    
    if (connectivityGrid && project.distances_json && Array.isArray(project.distances_json) && project.distances_json.length > 0) {
      if (locationSection) locationSection.style.display = 'block';
      connectivityGrid.innerHTML = project.distances_json.map(d => `
        <div class="pdl-location-card pdl-reveal-up">
          <div class="pdl-location-icon"><i data-lucide="${d.icon || 'map-pin'}"></i></div>
          <h4>${d.landmark || d.name || d.title}</h4>
          <p>${d.distance || d.time || d.duration || d.description}</p>
        </div>
      `).join('');
    }

    // Also check legacy distance list
    const distList = document.getElementById('project-distance-list');
    if (distList && project.distances_json && Array.isArray(project.distances_json) && project.distances_json.length > 0) {
      distList.innerHTML = project.distances_json.map(d => `
        <div class="pdl-location-card">
          <div class="pdl-location-icon"><i data-lucide="${d.icon || 'map-pin'}"></i></div>
          <h4>${d.landmark || d.name || d.title}</h4>
          <p>${d.distance || d.time || d.duration || d.description}</p>
        </div>
      `).join('');
    }

    // ─── FLOOR PLANS ───
    const floorPlansSection = document.getElementById('project-floor-plans-section');
    const floorPlansGrid = document.getElementById('project-floor-plans-grid');
    if (project.floor_plans && Array.isArray(project.floor_plans) && project.floor_plans.length > 0) {
      if (floorPlansSection) floorPlansSection.style.display = 'block';
      if (floorPlansGrid) {
        floorPlansGrid.innerHTML = project.floor_plans.map(fp => `
          <div class="pdl-floor-plan-card">
            <div class="pdl-floor-plan-img-wrapper">
              <img src="${fp}" alt="Floor Plan" loading="lazy">
            </div>
            <div class="pdl-floor-plan-info">
              <h4 class="pdl-floor-plan-title">Master Layout</h4>
              <a href="${fp}" target="_blank" class="pdl-floor-plan-btn">
                <i data-lucide="zoom-in"></i> View Full Size
              </a>
            </div>
          </div>
        `).join('');
      }
    }

    // ─── VIDEO ───
    const videoSection = document.getElementById('project-video-section');
    const videoContainer = document.getElementById('project-video-container');
    if (project.video_url && project.video_url.trim() !== '') {
      if (videoSection) videoSection.style.display = 'block';
      if (videoContainer) {
        let videoEmbed = '';
        const ytMatch = project.video_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        
        if (ytMatch && ytMatch[1]) {
          videoEmbed = `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&showinfo=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else if (project.video_url.endsWith('.mp4') || project.video_url.endsWith('.webm')) {
          videoEmbed = `<video src="${project.video_url}" controls playsinline preload="metadata" style="width:100%; height:100%; object-fit:cover;"></video>`;
        } else {
          videoEmbed = `<iframe src="${project.video_url}" allowfullscreen></iframe>`;
        }
        videoContainer.innerHTML = videoEmbed;
      }
    }

    // ─── GALLERY ───
    const gallerySection = document.getElementById('project-gallery-section');
    const galleryGrid = document.getElementById('project-gallery-grid');
    let galleryImages = []; // Collect all gallery image URLs for lightbox

    let sourceImages = [];
    if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
      sourceImages = project.gallery.map(img => typeof img === 'string' ? img : img.url);
    } else if (project.gallery_images && project.gallery_images.length > 0) {
      sourceImages = project.gallery_images;
    }

    const premiumPlaceholders = [
      'assets/images/hero-sunset.jpg',
      'assets/images/hero-home.jpg',
      'assets/images/plot-1.jpg',
      'assets/images/plot-2.jpg',
      'assets/images/plot-3.jpg',
      'assets/images/plot-4.jpg'
    ];

    if (sourceImages.length === 0) {
      // Only apply placeholders if no gallery images exist in DB
      sourceImages = premiumPlaceholders;
    }

    if (sourceImages.length > 0) {
      hasMedia = true;
      if (gallerySection) gallerySection.style.display = 'block';
      if (galleryGrid) {
        let html = '';
        sourceImages.forEach((imgUrl, i) => {
          galleryImages.push(imgUrl);
          
          html += `
            <div class="pdl-gallery-item pdl-reveal-up" style="transition-delay: ${i * 0.08}s;" data-gallery-index="${i}">
              <img src="${imgUrl}" alt="${project.name} Gallery ${i+1}" loading="lazy">
              <div class="pdl-gallery-caption">
                <i data-lucide="zoom-in" style="color: white; width: 32px; height: 32px;"></i>
              </div>
            </div>
          `;
        });
        galleryGrid.innerHTML = html;
      }
    } else {
      // Show elegant placeholder if no gallery images
      if (gallerySection) gallerySection.style.display = 'block';
      if (galleryGrid) {
        galleryGrid.innerHTML = `
          <div class="pdl-placeholder-card">
            <i data-lucide="image" class="pdl-placeholder-card__icon"></i>
            <h3 class="pdl-placeholder-card__title">Gallery Coming Soon</h3>
            <p class="pdl-placeholder-card__desc">Premium visuals for this project are currently being curated. Check back soon.</p>
          </div>
        `;
      }
    }

    // Store gallery images globally for lightbox navigation
    window.__pdlGalleryImages = galleryImages;

    // Master Plan
    if (project.master_plan_url) {
      hasMedia = true;
      const mpSection = document.getElementById('project-masterplan-section');
      const mpImg = document.getElementById('project-masterplan-img');
      if (mpSection) mpSection.style.display = 'block';
      if (mpImg) mpImg.src = project.master_plan_url;
    }

    // ─── BROCHURE ───
    const brochureSection = document.getElementById('project-brochure-section');
    const brochureBtn = document.getElementById('project-brochure-btn');
    const brochureInfo = document.getElementById('brochure-info');
    const heroBrochureBtn = document.getElementById('hero-brochure-btn');

    if (project.brochure_url) {
      hasMedia = true;
      if (brochureBtn) brochureBtn.href = project.brochure_url;
      if (heroBrochureBtn) {
        heroBrochureBtn.href = project.brochure_url;
        heroBrochureBtn.style.display = 'inline-flex';
      }
    } else {
      // Show "Brochure Coming Soon" state
      if (brochureInfo) {
        brochureInfo.innerHTML = `
          <div class="pdl-brochure-coming-soon">
            <h2 class="pdl-heading" style="margin-bottom: 20px;">Brochure Coming Soon</h2>
            <p>Our comprehensive project brochure with detailed floor plans, specifications, and amenities is being prepared. Contact us for more information.</p>
            <span class="pdl-btn pdl-btn--gold" style="opacity: 0.5; pointer-events: none;">
              <i data-lucide="clock"></i> Coming Soon
            </span>
          </div>
        `;
      }
    }

    // Show media container if any media exists
    if (hasMedia) {
      const mediaContainer = document.getElementById('project-media-container');
      if (mediaContainer) mediaContainer.style.display = 'block';
    }

    // ─── AMENITIES ───
    const amSection = document.getElementById('project-amenities-section');
    const amGrid = document.getElementById('project-amenities-grid');
    
    let amenitiesList = [];
    if (project.amenities_json && Array.isArray(project.amenities_json) && project.amenities_json.length > 0) {
      amenitiesList = project.amenities_json;
    }

    if (amenitiesList.length === 0) {
      // Inject Premium Fallback Grid ONLY if no amenities in DB
      amenitiesList = [
        { name: 'Grand Entrance Arch', image: 'assets/images/hero-sunset.jpg' },
        { name: '24/7 Premium Security', image: 'assets/images/hero-home.jpg' },
        { name: 'Landscaped Gardens', image: 'assets/images/plot-1.jpg' },
        { name: 'Underground Utilities', image: 'assets/images/plot-2.jpg' }
      ];
    }

    if (amSection) amSection.style.display = 'block';
    if (amGrid) {
      amGrid.innerHTML = '';
      amenitiesList.forEach((amenity, index) => {
        const label = typeof amenity === 'object' ? amenity.name : amenity;
        let bgImage = typeof amenity === 'object' && amenity.image ? amenity.image : `assets/images/plot-${(index % 4) + 1}.jpg`;
        
        amGrid.innerHTML += `
          <div class="pdl-amenity-card pdl-reveal-up" style="transition-delay: ${index * 0.08}s;">
            <img src="${bgImage}" alt="${label}" loading="lazy">
            <div class="pdl-amenity-overlay">
              <h4>${label}</h4>
            </div>
          </div>
        `;
      });
    }

    // ─── TIMELINE ───
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

    // ─── INQUIRY FORM — Project Name ───
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
  }

  // ─── INQUIRY FORM HANDLER (with validation, loading, toast) ───
  const form = document.getElementById('project-inquiry-form');
  const feedback = document.getElementById('inquiry-feedback');
  const submitBtn = document.getElementById('inquiry-submit');
  const btnText = document.getElementById('inquiry-btn-text');

  if (form) {
    // Clear error state on input focus
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        const field = input.closest('.pdl-form-field');
        if (field) field.classList.remove('pdl-form-field--error');
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate
      if (!validateForm()) {
        showToast('Please correct the highlighted fields.', 'error');
        return;
      }

      const name = document.getElementById('inquiry-name').value.trim();
      const email = document.getElementById('inquiry-email').value.trim();
      const phone = document.getElementById('inquiry-phone').value.trim();
      const message = document.getElementById('inquiry-message').value.trim();
      const project_interest = document.getElementById('inquiry-project').value;

      // Loading state
      if (btnText) btnText.textContent = 'Sending...';
      submitBtn.classList.add('pdl-btn--loading');
      submitBtn.disabled = true;

      try {
        if (!window.supabaseClient) {
          throw new Error('Service unavailable');
        }

        const { error } = await window.supabaseClient
          .from('leads')
          .insert([{ name, email, phone, message, project_interest }]);

        if (error) throw error;

        // Success
        feedback.style.display = 'block';
        feedback.style.color = 'var(--color-success)';
        feedback.style.background = 'rgba(26, 135, 84, 0.08)';
        feedback.style.border = '1px solid rgba(26, 135, 84, 0.3)';
        feedback.innerHTML = `
          <svg class="pdl-success-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span style="margin-left: 8px;">Thank you! We will contact you shortly to schedule your tour.</span>
        `;
        form.reset();
        showToast('Enquiry submitted successfully! Our team will contact you soon.', 'success');

        // Auto-hide feedback after 8 seconds
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 8000);


      } catch (err) {
        feedback.style.display = 'block';
        feedback.style.color = 'var(--color-error)';
        feedback.style.background = 'rgba(192, 57, 43, 0.08)';
        feedback.style.border = '1px solid rgba(192, 57, 43, 0.3)';
        feedback.textContent = 'Error sending inquiry. Please try again or call us directly.';
        showToast('Failed to submit. Please try again or call us directly.', 'error');
      } finally {
        if (btnText) btnText.textContent = 'Submit Enquiry';
        submitBtn.classList.remove('pdl-btn--loading');
        submitBtn.disabled = false;
      }
    });
  }
});
