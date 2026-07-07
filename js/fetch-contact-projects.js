document.addEventListener('DOMContentLoaded', async () => {
  const projectSelect = document.getElementById('contact-project');
  if (!projectSelect) return;

  try {
    const { data: projects, error } = await window.supabaseClient
      .from('projects')
      .select('name, slug')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      projectSelect.innerHTML = '<option value="">Error loading projects</option>';
      return;
    }

    if (projects && projects.length > 0) {
      let optionsHTML = '<option value="" disabled selected>Interested Project</option>';
      projects.forEach(project => {
        optionsHTML += `<option value="${project.name}">${project.name}</option>`;
      });
      optionsHTML += '<option value="Other">Other Inquiry</option>';
      projectSelect.innerHTML = optionsHTML;
    } else {
      projectSelect.innerHTML = '<option value="">No projects available</option>';
    }
  } catch (error) {
    console.error('Unexpected error fetching projects:', error);
    projectSelect.innerHTML = '<option value="">Error loading projects</option>';
  }
});
