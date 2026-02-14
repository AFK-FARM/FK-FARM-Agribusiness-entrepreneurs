// 1. INITIALIZE EMAILJS
(function() {
  emailjs.init("r05QOyXoWaZqP_1hd"); 
})();

// 2. WAIT FOR DOM TO LOAD
document.addEventListener('DOMContentLoaded', function() {

  // 3. CONTACT FORM HANDLING
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');
  
  // Only run if the form exists on the page
  if (contactForm) {
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      
      // Clear previous status
      formStatus.innerHTML = '';
      formStatus.className = 'form-status';
      
      // ============================================
      // 4. FORM VALIDATION
      // ============================================
      if (!name || !email || !message) {
        showStatus('⚠️ Please fill in all fields', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showStatus('📧 Please enter a valid email address', 'error');
        return;
      }
      
      if (message.length < 10) {
        showStatus('📝 Message must be at least 10 characters long', 'error');
        return;
      }
      
      // ============================================
      // 5. DISABLE BUTTON DURING SENDING
      // ============================================
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Sending...';
      
      // ============================================
      // 6. GET CURRENT DATE AND TIME FOR NOTIFICATION
      // ============================================
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
      
      // ============================================
      // 7. PREPARE EMAIL PARAMETERS
      // ============================================
      const templateParams = {
        // Customer information - for both templates
        user_name: name,
        user_email: email,
        user_message: message,
        
        // Alternative names (keeping for compatibility)
        from_name: name,
        from_email: email,
        message: message,
        name: name,
        email: email,
        
        // OWNER NOTIFICATION - UPDATED TO CORRECT EMAIL
        owner_email: 'afkmd24@gmail.com', // ✅ WEBSITE OWNER RECEIVES NOTIFICATIONS HERE
        date: dateStr,
        time: timeStr,
        
        // Reply information
        reply_to: email,
        business_email: 'afkmd24@gmail.com' // ✅ OWNER'S BUSINESS EMAIL
      };
      
      // ============================================
      // 8. YOUR EMAILJS IDs
      // ============================================
      const serviceId = 'service_25q2uxe';           // Your EmailJS Service ID
      const autoReplyTemplateId = 'template_bb29wgr'; // Your Auto-reply Template ID
      const ownerTemplateId = 'template_reepsae'; // 🔴 REPLACE WITH YOUR NEW OWNER NOTIFICATION TEMPLATE ID
      
      // ============================================
      // 9. SEND AUTO-REPLY TO CUSTOMER FIRST
      // ============================================
      emailjs.send(serviceId, autoReplyTemplateId, templateParams)
        .then(function(response) {
          // Auto-reply sent successfully
          console.log('✅ Auto-reply sent to customer!', response.status, response.text);
          
          // Now send notification to OWNER (afkmd24@gmail.com)
          return emailjs.send(serviceId, ownerTemplateId, templateParams);
        })
        .then(function(response) {
          // Both emails sent successfully
          console.log('✅ Owner notification sent to afkmd24@gmail.com!', response.status, response.text);
          
          // Show success message to user
          showStatus('✅ Message sent! Check your email for confirmation. We\'ll reply within 24 hours.', 'success');
          
          // Reset the form
          contactForm.reset();
          
          // Clear any error styling
          [nameInput, emailInput, messageInput].forEach(input => {
            input.style.borderColor = '#d0ded6';
          });
        })
        .catch(function(error) {
          // ERROR - Failed to send one or both emails
          console.error('❌ Email sending failed:', error);
          
          // Show user-friendly error message
          showStatus('❌ Failed to send. Please try again or contact us via WhatsApp at +265 996 847 772', 'error');
          
          // Log detailed error for debugging
          if (error.text) {
            console.error('Error details:', error.text);
          }
        })
        .finally(function() {
          // Re-enable button regardless of outcome
          submitBtn.disabled = false;
          submitBtn.textContent = '✉️ Send Message';
        });
    });
    
    // ============================================
    // 8. REAL-TIME VALIDATION FEEDBACK
    // ============================================
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Name validation on blur
    if (nameInput) {
      nameInput.addEventListener('blur', function() {
        if (this.value.trim().length < 2) {
          this.style.borderColor = '#ff6b6b';
        } else {
          this.style.borderColor = '#1b4d3d';
        }
      });
    }
    
    // Email validation on blur
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        if (!isValidEmail(this.value.trim())) {
          this.style.borderColor = '#ff6b6b';
        } else {
          this.style.borderColor = '#1b4d3d';
        }
      });
    }
    
    // Message validation on blur
    if (messageInput) {
      messageInput.addEventListener('blur', function() {
        if (this.value.trim().length < 10) {
          this.style.borderColor = '#ff6b6b';
        } else {
          this.style.borderColor = '#1b4d3d';
        }
      });
    }
  }
  
  // ============================================
  // 9. HELPER FUNCTIONS
  // ============================================
  
  /**
   * Display status messages to user
   * @param {string} message - The message to display
   * @param {string} type - 'success' or 'error'
   */
  function showStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) return;
    
    formStatus.innerHTML = message;
    formStatus.className = 'form-status';
    formStatus.classList.add(type === 'success' ? 'success-msg' : 'error-msg');
    
    // Auto-hide success message after 10 seconds
    if (type === 'success') {
      setTimeout(() => {
        formStatus.innerHTML = '';
        formStatus.className = 'form-status';
      }, 10000);
    }
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // ============================================
  // 10. SMOOTH SCROLLING FOR NAVIGATION
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Smooth scroll with offset for fixed header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // ============================================
  // 11. ACTIVE NAVIGATION HIGHLIGHTING
  // ============================================
  function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Offset for header
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });
    
    navLinks.forEach(link => {
      link.style.borderBottomColor = 'transparent';
      link.style.color = 'white';
      
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.style.borderBottomColor = '#f5b342';
        link.style.color = '#fae1a8';
      }
    });
  }
  
  // Throttle scroll events for better performance
  let isScrolling = false;
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        updateActiveNavOnScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
  
  // Run once on page load
  setTimeout(updateActiveNavOnScroll, 100);
  
  // ============================================
  // 12. LAZY LOADING FOR IMAGES (FALLBACK)
  // ============================================
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.loading = 'lazy';
    });
  } else {
    // Fallback for older browsers (simple fade-in)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', function() {
          this.style.transition = 'opacity 0.3s';
          this.style.opacity = '1';
        });
      }
    });
  }
  
  // ============================================
  // 13. CARD HOVER ENHANCEMENTS
  // ============================================
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.2,0,0,1)';
    });
  });
  
  console.log('✅ AFK Farm website loaded successfully');
  console.log('✅ Contact form ready - Owner notifications go to: afkmd24@gmail.com');
});

// ============================================
// 14. DEBUG FUNCTION
// ============================================
window.debugAFKForm = function() {
  console.log('🔍 Current EmailJS configuration:');
  console.log('- Public Key:', 'r05QOyXoWaZqP_1hd' ? '✅ Set' : '❌ Not set');
  console.log('- Service ID:', 'service_25q2uxe' ? '✅ Set' : '❌ Not set');
  console.log('- Auto-reply Template ID:', 'template_bb29wgr' ? '✅ Set' : '❌ Not set');
  console.log('- Owner Template ID:', ownerTemplateId !== 'YOUR_OWNER_TEMPLATE_ID' ? '✅ Set' : '❌ NEEDS UPDATE');
  console.log('- Owner Email:', 'afkmd24@gmail.com ✅');
  console.log('- Form exists:', document.getElementById('contact-form') ? '✅ Yes' : '❌ No');
  console.log(' ');
  console.log('📋 Final steps:');
  console.log('1. Replace YOUR_OWNER_TEMPLATE_ID with your actual template ID');
  console.log('2. Test the form - owner will receive at afkmd24@gmail.com');
};