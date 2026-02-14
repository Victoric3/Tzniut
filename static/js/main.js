/* ============================================
   TZNIUT — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initLightbox();
  initTestimonialCarousel();
  initChatUI();
});

/* --- Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Navbar scroll effect --- */
function initNavbar() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const overlay = document.getElementById('nav-mobile-overlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    overlay.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --- Lightbox --- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox') || trigger.src || trigger.querySelector('img')?.src;
      if (src) {
        lightboxImg.src = src;
        lightboxImg.alt = trigger.alt || 'Image preview';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* --- Testimonial Carousel --- */
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || !dots.length) return;

  let currentSlide = 0;
  const totalSlides = dots.length;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Auto-advance every 5s
  setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);
}

/* --- Chat UI (Scripted dress finder) --- */
function initChatUI() {
  const container = document.getElementById('chat-messages');
  const optionsContainer = document.getElementById('chat-options');
  if (!container || !optionsContainer) return;

  const chatFlow = [
    {
      bot: "Welcome to Tzniut! I'm here to help you find the perfect dress. What occasion are you looking for?",
      options: ["Special Event", "Everyday Elegance", "Bridal", "Professional", "Just Browsing"]
    },
    {
      bot: "Great choice! What style do you prefer?",
      options: ["Floor-length Gown", "Midi Dress", "A-Line", "Wrap Dress", "Not Sure"]
    },
    {
      bot: "And what colors are you drawn to?",
      options: ["Wine Red", "Classic Black", "Ivory/White", "Earth Tones", "Jewel Tones"]
    },
    {
      bot: "Wonderful taste! Let me connect you with our stylist on WhatsApp for personalized recommendations."
    }
  ];

  let step = 0;
  let userChoices = [];

  function addMessage(text, isBot) {
    const msg = document.createElement('div');
    msg.className = `chat-message chat-message--${isBot ? 'bot' : 'user'}`;
    msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function showOptions(options) {
    optionsContainer.innerHTML = '';
    if (!options) {
      // Final step — show WhatsApp button
      const whatsappMsg = encodeURIComponent(
        `Hello Tzniut! I'm looking for:\n- Occasion: ${userChoices[0] || 'N/A'}\n- Style: ${userChoices[1] || 'N/A'}\n- Color: ${userChoices[2] || 'N/A'}\n\nCan you help me find the perfect dress?`
      );
      const btn = document.createElement('a');
      btn.href = `https://wa.me/message/qjvggk?text=${whatsappMsg}`;
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.className = 'btn btn--whatsapp';
      btn.textContent = 'Continue on WhatsApp';
      btn.style.width = '100%';
      optionsContainer.appendChild(btn);

      // Also add a simpler direct link
      const directBtn = document.createElement('a');
      directBtn.href = document.querySelector('.whatsapp-float__btn')?.href || 'https://wa.link/qjvggk';
      directBtn.target = '_blank';
      directBtn.rel = 'noopener';
      directBtn.className = 'btn btn--outline';
      directBtn.textContent = 'Open WhatsApp Direct';
      directBtn.style.width = '100%';
      directBtn.style.marginTop = '8px';
      optionsContainer.appendChild(directBtn);
      return;
    }

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        userChoices.push(opt);
        addMessage(opt, false);
        step++;
        if (step < chatFlow.length) {
          setTimeout(() => {
            addMessage(chatFlow[step].bot, true);
            showOptions(chatFlow[step].options);
          }, 600);
        }
      });
      optionsContainer.appendChild(btn);
    });
  }

  // Start the chat
  setTimeout(() => {
    addMessage(chatFlow[0].bot, true);
    showOptions(chatFlow[0].options);
  }, 500);
}

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
