document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const show404 = () => {
    document.title = "Project Not Found — Shree Vasudha Projects";
    const section404 = document.getElementById('project-404-section');
    const mainHero = document.getElementById('project-main-hero');
    const mainContent = document.getElementById('project-main-content');
    
    if (section404) section404.style.display = 'block';
    if (mainHero) mainHero.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
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

    // Update DOM
    document.title = `${project.name} — Shree Vasudha Projects`;
    document.getElementById('project-title').textContent = project.name;
    document.getElementById('project-location').innerHTML = `<i data-lucide="map-pin"></i> <span>${project.location || "Hyderabad"}</span>`;
    
    const badge = document.getElementById('project-status-badge').querySelector('span');
    badge.textContent = project.status;
    if (project.status === 'Completed') {
      badge.style.background = '#4CAF50';
      badge.style.color = '#fff';
    } else if (project.status === 'Ongoing') {
      badge.style.background = 'var(--color-primary)';
      badge.style.color = '#000';
    } else {
      badge.style.background = '#2196F3';
      badge.style.color = '#fff';
    }

    if (project.image_url) {
      document.getElementById('project-hero-bg').style.backgroundImage = `url('${project.image_url}')`;
    }

    document.getElementById('project-config').textContent = project.config || "TBA";
    document.getElementById('project-area').textContent = project.area || "TBA";
    document.getElementById('project-price').textContent = project.price || "Price on Request";

    document.getElementById('project-description').innerHTML = `<p>${project.description?.replace(/\n/g, '<br>') || "Details coming soon."}</p>`;
    document.getElementById('project-highlights').innerHTML = `<p>${project.highlights?.replace(/\n/g, '<br>') || ""}</p>`;

    // --- Media Sections ---
    let hasMedia = false;
    
    // Video
    if (project.video_url) {
      hasMedia = true;
      document.getElementById('project-video-section').style.display = 'block';
      document.getElementById('project-video').src = project.video_url;
    }

    // Gallery
    if (project.gallery_images && project.gallery_images.length > 0) {
      hasMedia = true;
      document.getElementById('project-gallery-section').style.display = 'block';
      const galleryGrid = document.getElementById('project-gallery-grid');
      project.gallery_images.forEach(imgUrl => {
        galleryGrid.innerHTML += `
          <div style="border-radius: 12px; overflow: hidden; aspect-ratio: 4/3; border: 1px solid var(--color-border);">
            <img src="${imgUrl}" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          </div>
        `;
      });
    }

    // Floor Plans
    if (project.floor_plans && project.floor_plans.length > 0) {
      hasMedia = true;
      document.getElementById('project-floorplans-section').style.display = 'block';
      const floorplansGrid = document.getElementById('project-floorplans-grid');
      project.floor_plans.forEach(imgUrl => {
        floorplansGrid.innerHTML += `
          <div style="border-radius: 12px; overflow: hidden; aspect-ratio: 4/3; border: 1px solid var(--color-border); background: #fff; display: flex; align-items: center; justify-content: center; padding: 16px;">
            <img src="${imgUrl}" alt="Floor Plan" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
        `;
      });
    }

    // Brochure
    if (project.brochure_url) {
      hasMedia = true;
      document.getElementById('project-brochure-section').style.display = 'block';
      document.getElementById('project-brochure-btn').href = project.brochure_url;
    }

    // Show container if any media exists
    if (hasMedia) {
      document.getElementById('project-media-container').style.display = 'flex';
    }

    // Set hidden field for inquiry form
    document.getElementById('inquiry-project').value = project.name;
    
    // Re-init lucide icons for dynamic content
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

  } catch (err) {
    console.error("Unexpected error fetching project:", err);
  }

  // Handle Inquiry Form
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
        feedback.style.backgroundColor = 'rgba(72, 187, 120, 0.1)';
        feedback.style.color = '#68d391';
        feedback.style.border = '1px solid #68d391';
        feedback.textContent = 'Thank you! We will contact you soon.';
        form.reset();
      } catch (err) {
        console.error(err);
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
        feedback.style.color = '#fc8181';
        feedback.style.border = '1px solid #fc8181';
        feedback.textContent = 'Error sending inquiry. Please try again.';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
