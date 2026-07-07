document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  try {
    const { data: about, error } = await window.supabaseClient
      .from('about_page')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !about) {
      console.error("About page data not found or error:", error);
      return;
    }

    // Hydrate Mission & Vision
    const missionElements = document.querySelectorAll('.mv-card__desc');
    if (missionElements.length >= 2) {
      if (about.mission_statement) missionElements[0].textContent = about.mission_statement;
      if (about.vision_statement) missionElements[1].textContent = about.vision_statement;
    }

    // Hydrate Our Story
    const storyTitle = document.querySelector('.about-story__content .section-title');
    const storyDesc = document.querySelector('.about-story__content');
    const storyImage = document.querySelector('.about-story__image-img');

    if (storyTitle && about.story_title) storyTitle.textContent = about.story_title;
    
    if (storyDesc && about.story_description) {
      // Remove existing paragraphs
      const paragraphs = storyDesc.querySelectorAll('p.section-desc');
      paragraphs.forEach(p => p.remove());

      // Add new paragraphs
      const splitDesc = about.story_description.split('\n').filter(p => p.trim() !== '');
      splitDesc.forEach(p => {
        const pEl = document.createElement('p');
        pEl.className = 'section-desc';
        pEl.textContent = p;
        storyDesc.appendChild(pEl);
      });
    }

    if (storyImage && about.story_image_url) {
      storyImage.src = about.story_image_url;
      storyImage.alt = about.story_title || 'Our Story';
    }

    // Hydrate Chairman Message
    const chairmanName = document.querySelector('.chairman__name');
    const chairmanMessage = document.querySelector('.chairman__quote');
    const chairmanImage = document.querySelector('.chairman__img');

    if (chairmanName && about.chairman_name) chairmanName.textContent = about.chairman_name;
    
    if (chairmanMessage && about.chairman_message) {
      chairmanMessage.innerHTML = `<span class="quote-mark text-gold">"</span> ${about.chairman_message} <span class="quote-mark text-gold">"</span>`;
    }
    
    if (chairmanImage && about.chairman_image_url) {
      chairmanImage.src = about.chairman_image_url;
      chairmanImage.alt = about.chairman_name || 'Chairman';
    }

    // Hydrate Global dynamic text (years etc.)
    const { data: hp, error: hpError } = await window.supabaseClient
      .from('homepage_content')
      .select('stat_years, stat_projects, stat_families, stat_area')
      .eq('id', 1)
      .single();

    if (!hpError && hp) {
      // Hydrate all dynamic inline text globally
      const hydrateGlobalStat = (selector, val) => {
        if (!val) return;
        const match = val.match(/^(\d+)/);
        const numOnly = match ? match[1] : val;
        document.querySelectorAll(selector).forEach(el => {
          el.textContent = numOnly;
        });
      };

      hydrateGlobalStat('.dynamic-text-years', hp.stat_years);
      hydrateGlobalStat('.dynamic-text-projects', hp.stat_projects);
      hydrateGlobalStat('.dynamic-text-families', hp.stat_families);
      hydrateGlobalStat('.dynamic-text-area', hp.stat_area);
    }

  } catch (err) {
    console.error("Unexpected error fetching about page:", err);
  }
});
