
// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.research-card, .expertise-item, .publication-item');
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    setTimeout(() => {
      typeWriter(heroTitle, 'Exploring the World Through Geospatial Science', 80);
    }, 1000);
  }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero');
  const speed = scrolled * 0.5;
  
  if (parallax) {
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

// Globe interaction
document.addEventListener('DOMContentLoaded', () => {
  const globe = document.querySelector('.globe');
  const dataPoints = document.querySelectorAll('.data-point');
  
  if (globe) {
    globe.addEventListener('mouseenter', () => {
      globe.style.transform = 'translate(-50%, -50%) scale(1.1)';
      globe.style.transition = 'transform 0.3s ease';
      
      dataPoints.forEach(point => {
        point.style.animationDuration = '1s';
      });
    });
    
    globe.addEventListener('mouseleave', () => {
      globe.style.transform = 'translate(-50%, -50%) scale(1)';
      
      dataPoints.forEach(point => {
        point.style.animationDuration = '2s';
      });
    });
  }
});

// Research card hover effects
document.addEventListener('DOMContentLoaded', () => {
  const researchCards = document.querySelectorAll('.research-card');
  
  researchCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderTopColor = '#ffd700';
      card.querySelector('.research-icon').style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.borderTopColor = '#2563eb';
      card.querySelector('.research-icon').style.background = 'linear-gradient(45deg, #2563eb, #3b82f6)';
    });
  });
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Add CSS for active nav links
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: #2563eb;
  }
  .nav-link.active::after {
    width: 100%;
  }
`;
document.head.appendChild(style);
