// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
      mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
      });
    }
    
    // Initialize the shows carousel
    $('.shows-carousel').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            arrows: false
          }
        }
      ]
    });
    
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Close mobile menu if open
          if (nav.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
          }
          
          // Calculate header height for offset
          const headerHeight = document.querySelector('header').offsetHeight;
          
          // Scroll to the element
          window.scrollTo({
            top: targetElement.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Form submission handler
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          message: document.getElementById('message').value
        };
        
        // Here you would normally send the data to a server
        console.log('Form submitted with data:', formData);
        
        // Show success message (this is just a demo)
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        
        // Insert success message after form
        contactForm.insertAdjacentElement('afterend', successMessage);
        
        // Reset form
        contactForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      });
    }
    
    // Parallax scrolling effect for hero section
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      const heroSection = document.querySelector('.hero');
      
      if (heroSection) {
        // Move the background slightly as user scrolls
        heroSection.style.backgroundPosition = `center ${50 + scrollPosition * 0.05}%`;
      }
    });
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
      const elements = document.querySelectorAll('.about-text p, .show-card, .contact-content > div');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.9) {
          element.classList.add('fade-in');
        }
      });
    };
    
    // Add CSS class for animation
    const style = document.createElement('style');
    style.textContent = `
      .fade-in {
        animation: fadeIn 1s ease forwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .about-text p, .show-card, .contact-content > div {
        opacity: 0;
      }
      
      .success-message {
        background-color: rgba(0, 255, 0, 0.1);
        color: #00ff00;
        padding: 15px;
        border-radius: 4px;
        margin-top: 20px;
        text-align: center;
        animation: fadeIn 0.5s ease;
      }
    `;
    document.head.appendChild(style);
    
    // Run on page load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Audio visualizer for footer (simulated)
    const footer = document.querySelector('footer');
    
    if (footer) {
      const visualizer = document.createElement('div');
      visualizer.className = 'audio-visualizer';
      
      for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        visualizer.appendChild(bar);
      }
      
      footer.querySelector('.container').insertBefore(visualizer, footer.querySelector('.footer-content'));
      
      // Add CSS
      const visualizerStyle = document.createElement('style');
      visualizerStyle.textContent = `
        .audio-visualizer {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          height: 60px;
          margin-bottom: 40px;
          gap: 5px;
        }
        
        .visualizer-bar {
          width: 10px;
          background: linear-gradient(to top, #ff0066, #0044ff);
          border-radius: 5px;
          transition: height 0.2s ease;
        }
      `;
      document.head.appendChild(visualizerStyle);
      
      // Animate bars randomly
      const bars = document.querySelectorAll('.visualizer-bar');
      
      function animateVisualizer() {
        bars.forEach(bar => {
          const height = Math.random() * 50 + 10;
          bar.style.height = `${height}px`;
        });
        
        setTimeout(animateVisualizer, 200);
      }
      
      animateVisualizer();
    }
  });