document.addEventListener('DOMContentLoaded', async () => {
  const servicesGrid = document.querySelector('.services-grid');
  if (!servicesGrid) return;
  if (!window.supabaseClient) {
    console.error("Supabase client not initialized.");
    return;
  }

  try {
    const { data: services, error } = await window.supabaseClient
      .from('services')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    servicesGrid.innerHTML = '';

    if (services.length === 0) {
      servicesGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--text-secondary);">No services available at the moment.</p>';
      return;
    }

    services.forEach((service, index) => {
      const delay = index * 100;
      
      let iconHTML = `<i data-lucide="${service.icon || 'briefcase'}"></i>`;
      if (service.image_url) {
        iconHTML = `<img src="${service.image_url}" alt="${service.title}" style="width:36px; height:36px; border-radius: 4px; object-fit: cover;" />`;
      }

      const cardHTML = `
        <a href="/contact.html" class="service-card-lux" style="transition-delay: ${delay}ms;">
          <div class="service-card-lux__icon-wrapper">
            <div class="service-card-lux__icon">${iconHTML}</div>
            <div class="service-card-lux__divider"></div>
          </div>
          <h3 class="service-card-lux__title">${service.title}</h3>
          <p class="service-card-lux__desc">${service.description || ''}</p>
          <div class="service-card-lux__btn">
            Enquire Now
          </div>
        </a>
      `;
      servicesGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    servicesGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--error, #e53e3e);">Failed to load services.</p>';
  }
});
