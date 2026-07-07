document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  try {
    const { data: hp, error } = await window.supabaseClient
      .from('homepage_content')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !hp) {
      console.error("Homepage data not found or error:", error);
      return;
    }

    // Hydrate Hero Section
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroCta = document.querySelector('.hero__actions .btn--primary');
    const heroBgImg = document.querySelector('.hero__bg img');
    
    if (heroTitle && hp.hero_headline) heroTitle.innerHTML = hp.hero_headline;
    if (heroSubtitle && hp.hero_subtitle) heroSubtitle.textContent = hp.hero_subtitle;
    if (heroCta && hp.hero_cta_text) {
      heroCta.innerHTML = `${hp.hero_cta_text} <span class="btn__arrow">→</span>`;
      if (hp.hero_cta_link) heroCta.setAttribute('href', hp.hero_cta_link);
    }
    
    if (heroBgImg && hp.hero_image_url) {
       heroBgImg.src = hp.hero_image_url;
    }

    // Hydrate Stats (Hero Stats)
    const heroStats = document.querySelectorAll('.hero__stat-number');
    if (heroStats.length >= 4) {
      const updateStat = (el, val) => {
        if (!val) return;
        const match = val.match(/^(\d+)(.*)$/);
        if (match) {
          const target = parseInt(match[1], 10);
          const suffix = match[2] || '';
          const duration = 2000;
          const startTime = performance.now();
          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(updateCount);
          }
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = val;
        }
      };
      updateStat(heroStats[0], hp.stat_years);
      updateStat(heroStats[1], hp.stat_projects);
      updateStat(heroStats[2], hp.stat_families);
      updateStat(heroStats[3], hp.stat_area);
    }
    
    // Hydrate About Badge Stat
    const aboutBadge = document.querySelector('.about__badge-number');
    if (aboutBadge && hp.stat_years) {
      const match = hp.stat_years.match(/^(\d+)(.*)$/);
      if (match) {
        const target = parseInt(match[1], 10);
        const suffix = match[2] || '';
        const duration = 2000;
        const startTime = performance.now();
        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          aboutBadge.textContent = Math.round(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(updateCount);
        }
        requestAnimationFrame(updateCount);
      } else {
        aboutBadge.textContent = hp.stat_years;
      }
    }
    
    // Hydrate Achievements Section Stats
    const achievementStats = document.querySelectorAll('.achievement-card__number');
    if (achievementStats.length >= 4) {
      const updateStat = (el, val) => {
        if (!val) return;
        const match = val.match(/^(\d+)(.*)$/);
        if (match) {
          const target = parseInt(match[1], 10);
          const suffix = match[2] || '';
          
          // Update data attributes so app.js doesn't overwrite with old HTML defaults when scrolled
          el.setAttribute('data-count', target);
          el.setAttribute('data-suffix', suffix);

          const duration = 2000;
          const startTime = performance.now();
          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(updateCount);
          }
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = val;
        }
      };
      updateStat(achievementStats[0], hp.stat_years);
      updateStat(achievementStats[1], hp.stat_projects);
      updateStat(achievementStats[2], hp.stat_families);
      updateStat(achievementStats[3], hp.stat_area);
    }

    // Hydrate About Section (from about_page table to keep it synchronized with the separate About page)
    const { data: aboutData, error: aboutError } = await window.supabaseClient
      .from('about_page')
      .select('*')
      .eq('id', 1)
      .single();

    if (!aboutError && aboutData) {
      const aboutTitle = document.querySelector('.about__content .heading-2');
      const aboutDescElements = document.querySelectorAll('.about__text');
      const aboutImage = document.querySelector('.about__image-frame img');

      if (aboutTitle && aboutData.story_title) aboutTitle.textContent = aboutData.story_title;
      if (aboutDescElements.length > 0 && aboutData.story_description) {
        aboutDescElements[0].textContent = aboutData.story_description;
      }
      if (aboutImage && aboutData.story_image) {
         aboutImage.src = aboutData.story_image;
      }
    }

    // Hydrate Why Choose Us
    const featureTitles = document.querySelectorAll('.why-card__title');
    if (featureTitles.length >= 4) {
      if (hp.why_feature_1) featureTitles[0].textContent = hp.why_feature_1;
      if (hp.why_feature_2) featureTitles[1].textContent = hp.why_feature_2;
      if (hp.why_feature_3) featureTitles[2].textContent = hp.why_feature_3;
      if (hp.why_feature_4) featureTitles[3].textContent = hp.why_feature_4;
    }

    // Hydrate CTA Section (Contact Section)
    const ctaTitle = document.querySelector('.contact__info .section__title');
    const ctaDesc = document.querySelector('.contact__info .section__desc');
    const ctaBtn = document.querySelector('.contact__form-wrapper .btn--primary');

    if (ctaTitle && hp.cta_headline) ctaTitle.textContent = hp.cta_headline;
    if (ctaDesc && hp.cta_description) ctaDesc.textContent = hp.cta_description;
    if (ctaBtn && hp.cta_button_text) {
      ctaBtn.textContent = hp.cta_button_text;
    }

    // Hydrate all dynamic inline text and badges globally
    const hydrateGlobalStat = (selector, val, isBadge) => {
      if (!val) return;
      const match = val.match(/^(\d+)/);
      const numOnly = match ? match[1] : val;
      
      document.querySelectorAll(selector).forEach(el => {
        if (isBadge) {
          el.textContent = val;
        } else {
          el.textContent = numOnly;
        }
      });
    };

    hydrateGlobalStat('.dynamic-badge-years', hp.stat_years, true);
    hydrateGlobalStat('.dynamic-badge-projects', hp.stat_projects, true);
    hydrateGlobalStat('.dynamic-badge-families', hp.stat_families, true);
    hydrateGlobalStat('.dynamic-badge-area', hp.stat_area, true);

    hydrateGlobalStat('.dynamic-text-years', hp.stat_years, false);
    hydrateGlobalStat('.dynamic-text-projects', hp.stat_projects, false);
    hydrateGlobalStat('.dynamic-text-families', hp.stat_families, false);
    hydrateGlobalStat('.dynamic-text-area', hp.stat_area, false);

  } catch (err) {
    console.error("Unexpected error fetching homepage content:", err);
  }
});
