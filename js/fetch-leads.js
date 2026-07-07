document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  const submitBtn = document.getElementById('contact-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!window.supabaseClient) {
      showFeedback('Service is currently unavailable. Please try again later.', 'error');
      return;
    }

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const project_interest = document.getElementById('contact-project').value;
    const message = document.getElementById('contact-message').value;

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    try {
      const { error } = await window.supabaseClient
        .from('leads')
        .insert([{
          name,
          email,
          phone,
          project_interest,
          message
        }]);

      if (error) throw error;

      showFeedback('Thank you for your inquiry. Our advisors will contact you shortly.', 'success');
      form.reset();
    } catch (err) {
      console.error("Error submitting lead:", err);
      showFeedback('There was an error sending your message. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  function showFeedback(msg, type) {
    feedback.style.display = 'block';
    feedback.textContent = msg;
    if (type === 'error') {
      feedback.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
      feedback.style.color = '#fc8181';
      feedback.style.border = '1px solid #fc8181';
    } else {
      feedback.style.backgroundColor = 'rgba(72, 187, 120, 0.1)';
      feedback.style.color = '#68d391';
      feedback.style.border = '1px solid #68d391';
    }
  }
});
