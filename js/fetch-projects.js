document.addEventListener('DOMContentLoaded', async () => {
  const projectsGrid = document.querySelector('.projects-grid') || document.querySelector('.project-grid');
  
  if (!projectsGrid) return;
  if (!window.supabaseClient) {
    console.error("Supabase client not initialized.");
    return;
  }

  try {
    // Show a loading skeleton or just simple text
    projectsGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--text-secondary);">Loading luxury residences...</p>';

    let query = window.supabaseClient
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    // Filter based on the page URL
    const path = window.location.pathname.toLowerCase();
    if (path.includes('ongoing')) {
      query = query.eq('status', 'Ongoing');
    } else if (path.includes('upcoming')) {
      query = query.eq('status', 'Upcoming');
    } else if (path.includes('completed')) {
      query = query.eq('status', 'Completed');
    } else if (path.includes('index') || path === '/' || path === '') {
      // If it's the homepage, show featured projects only, limit to 3
      query = query.eq('featured', true).limit(3);
    }

    const { data: projects, error } = await query;

    if (error) throw error;

    projectsGrid.innerHTML = ''; // Clear loading

    if (projects.length === 0) {
      projectsGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--text-secondary);">No projects available at the moment.</p>';
      return;
    }

    // Default placeholder images just in case
    const defaultImages = [
      'assets/project-1.jpg',
      'assets/project-2.jpg',
      'assets/project-3.jpg'
    ];

    projects.forEach((project, index) => {
      // Use uploaded image or fallback to a default image
      const imageUrl = project.image_url || defaultImages[index % defaultImages.length];
      
      // Calculate transition delay for staggered animation
      const delay = index * 100;

      const cardHTML = `
        <div class="portfolio-card reveal" style="transition-delay: ${delay}ms;">
          <div class="portfolio-card__image-wrapper">
            <div class="portfolio-card__status">${project.status}</div>
            <img src="${imageUrl}" alt="${project.name}" class="portfolio-card__image">
            <div class="portfolio-card__overlay"></div>
          </div>
          <div class="portfolio-card__content">
            <h3 class="portfolio-card__title">${project.name}</h3>
            <p class="portfolio-card__location">
              <i data-lucide="map-pin"></i> ${project.location}
            </p>
            
            <div class="portfolio-card__specs">
              <div class="portfolio-card__spec">
                <span class="portfolio-card__spec-label">Typology</span>
                <span class="portfolio-card__spec-value">${project.config}</span>
              </div>
              <div class="portfolio-card__divider"></div>
              <div class="portfolio-card__spec portfolio-card__spec--center">
                <span class="portfolio-card__spec-label">Scale</span>
                <span class="portfolio-card__spec-value">${project.area || 'Premium'}</span>
              </div>
              <div class="portfolio-card__divider"></div>
              <div class="portfolio-card__spec portfolio-card__spec--right">
                <span class="portfolio-card__spec-label">Starting Price</span>
                <span class="portfolio-card__spec-value portfolio-card__spec-value--gold">${project.price}</span>
              </div>
            </div>

            <a href="project-detail.html?slug=${project.slug}" class="portfolio-card__btn">
              Explore Project <span class="portfolio-card__btn-arrow">→</span>
            </a>
          </div>
        </div>
      `;
      
      projectsGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Re-initialize Lucide icons for the newly injected HTML
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Observe newly added cards to trigger the reveal animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    
    projectsGrid.querySelectorAll('.portfolio-card.reveal').forEach(el => observer.observe(el));

  } catch (error) {
    console.error("Error fetching projects:", error);
    projectsGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--error, #e53e3e);">Failed to load projects. Please try again later.</p>';
  }
});
