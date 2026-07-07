document.addEventListener('DOMContentLoaded', async () => {
  const amenitiesGrid = document.querySelector('.amenities-grid');
  if (!amenitiesGrid) return;
  if (!window.supabaseClient) {
    console.error("Supabase client not initialized.");
    return;
  }

  try {
    amenitiesGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--text-secondary);">Loading amenities...</p>';

    const { data: amenities, error } = await window.supabaseClient
      .from('amenities')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    amenitiesGrid.innerHTML = '';

    if (amenities.length === 0) {
      amenitiesGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--text-secondary);">No amenities available at the moment.</p>';
      return;
    }

    amenities.forEach((amenity, index) => {
      const delay = index * 100;
      
      const imageHTML = amenity.image_url 
        ? `<img src="${amenity.image_url}" alt="${amenity.title}" class="amenity-card__img" />`
        : `<div class="image-placeholder" style="height: 100%; display: flex; align-items: center; justify-content: center;">${amenity.title}</div>`;

      const iconHTML = amenity.icon ? `<i data-lucide="${amenity.icon}"></i>` : '';

      const cardHTML = `
        <div class="amenity-card" style="transition-delay: ${delay}ms; opacity: 1; transform: translateY(0);">
          ${imageHTML}
          <div class="amenity-card__overlay">
            <h3 class="amenity-card__title">
              ${iconHTML}
              ${amenity.title}
            </h3>
          </div>
        </div>
      `;
      amenitiesGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (error) {
    console.error("Error fetching amenities:", error);
    amenitiesGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--error, #e53e3e);">Failed to load amenities.</p>';
  }
});
