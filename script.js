document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation (existing)
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close mobile menu when clicking a link (existing)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  // Sticky Header (existing)
  const header = document.querySelector('.sticky-header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Back to Top Button (existing)
  const backToTopButton = document.querySelector('.back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('active');
    } else {
      backToTopButton.classList.remove('active');
    }
  });
  
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Smooth scrolling for anchor links (existing)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Certificate modal functionality (existing)
  function openModal(imgSrc) {
    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = imgSrc;
  }
  
  function closeModal() {
    document.getElementById('certificateModal').style.display = "none";
  }
  
  window.onclick = function(event) {
    const modal = document.getElementById('certificateModal');
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // NEW: Email Form Submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      try {
        const formData = new FormData(this);
        const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(formData))
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.message || 'Failed to send message');
        
        // Success message
        showAlert('success', 'Message sent successfully!');
        contactForm.reset();
        
      } catch (error) {
        // Error message
        showAlert('error', error.message || 'Failed to send message');
      } finally {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }

  // NEW: Alert notification function
  function showAlert(type, message) {
    // Remove existing alerts first
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
      <span>${message}</span>
    `;
    
    // Insert after the contact form title
    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) {
      contactTitle.parentNode.insertBefore(alertDiv, contactTitle.nextSibling);
    } else {
      // Fallback to prepend to contact section
      const contactSection = document.querySelector('#contact');
      if (contactSection) contactSection.prepend(alertDiv);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => alertDiv.remove(), 5000);
  }

  // Animation on scroll (existing)
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.project-card, .skill-category, .certificate-card, .about-image, .contact-text');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Set initial state for animated elements (existing)
  document.querySelectorAll('.project-card, .skill-category, .certificate-card, .about-image, .contact-text').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on page load
});