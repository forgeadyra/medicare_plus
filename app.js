/* ============================================================
   MediCare Plus — JavaScript Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // NAVIGATION — Sticky + Scroll + Active Links
  // ============================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll);

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = mobileNav.querySelectorAll('a');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    mobileOverlay.classList.toggle('show');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for elements in same section
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================================
  // COUNTER ANIMATION (Hero Stats)
  // ============================================================
  const counters = document.querySelectorAll('.hero-stat-value[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(start + (target - start) * easedProgress);

        if (target >= 1000) {
          counter.textContent = (currentValue / 1000).toFixed(0) + 'K+';
        } else {
          counter.textContent = currentValue + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroStatsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) heroStatsObserver.observe(heroStatsEl);

  // ============================================================
  // SERVICES FILTER
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ============================================================
  // TESTIMONIALS CAROUSEL
  // ============================================================
  const track = document.getElementById('testimonials-track');
  const controlsContainer = document.getElementById('testimonial-controls');
  const testimonialCards = track.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  let slidesPerView = 3;
  let autoSlideInterval;

  function getVisibleSlides() {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function getTotalPages() {
    return Math.max(1, testimonialCards.length - slidesPerView + 1);
  }

  function updateCarousel() {
    slidesPerView = getVisibleSlides();
    const cardWidth = 100 / slidesPerView;
    const offset = currentSlide * cardWidth;
    track.style.transform = `translateX(-${offset}%)`;

    // Update dots
    const dots = controlsContainer.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function createDots() {
    controlsContainer.innerHTML = '';
    slidesPerView = getVisibleSlides();
    const totalPages = getTotalPages();
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        currentSlide = i;
        updateCarousel();
        resetAutoSlide();
      });
      controlsContainer.appendChild(dot);
    }
  }

  function nextSlide() {
    const totalPages = getTotalPages();
    currentSlide = (currentSlide + 1) % totalPages;
    updateCarousel();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  track.addEventListener('mouseleave', startAutoSlide);

  createDots();
  startAutoSlide();
  window.addEventListener('resize', () => {
    createDots();
    currentSlide = Math.min(currentSlide, getTotalPages() - 1);
    updateCarousel();
  });

  // ============================================================
  // APPOINTMENT BOOKING — Multi-Step Form
  // ============================================================
  const formSteps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLine = document.getElementById('progress-line');
  let currentFormStep = 1;

  function goToStep(step) {
    // Validate current step
    if (step > currentFormStep && !validateStep(currentFormStep)) return;

    currentFormStep = step;

    // Update steps visibility
    formSteps.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`step-${step}`);
    if (target) target.classList.add('active');

    // Update progress indicators
    progressSteps.forEach(ps => {
      const psStep = parseInt(ps.getAttribute('data-step'));
      ps.classList.remove('active', 'completed');
      if (psStep === step) ps.classList.add('active');
      if (psStep < step) ps.classList.add('completed');
    });

    // Update progress line
    const lineWidth = ((step - 1) / 3) * 100;
    progressLine.style.width = `${lineWidth}%`;
  }

  function validateStep(step) {
    switch (step) {
      case 1:
        const dept = document.getElementById('department').value;
        if (!dept) {
          shakeElement(document.getElementById('department'));
          return false;
        }
        return true;
      case 2:
        const doc = document.getElementById('doctor-select').value;
        if (!doc) {
          shakeElement(document.getElementById('doctor-select'));
          return false;
        }
        return true;
      case 3:
        const selectedDate = document.querySelector('.calendar-day.selected');
        const selectedTime = document.querySelector('.time-slot.selected');
        if (!selectedDate || !selectedTime) {
          if (!selectedDate) shakeElement(document.getElementById('calendar'));
          if (!selectedTime) shakeElement(document.getElementById('time-slots'));
          return false;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  }

  function shakeElement(el) {
    el.style.animation = 'shake 0.5s ease';
    el.style.border = '1px solid var(--clr-error)';
    setTimeout(() => {
      el.style.animation = '';
      el.style.border = '';
    }, 1000);
  }

  // Add shake animation to CSS dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // Navigation buttons
  document.getElementById('next-1')?.addEventListener('click', () => goToStep(2));
  document.getElementById('prev-2')?.addEventListener('click', () => goToStep(1));
  document.getElementById('next-2')?.addEventListener('click', () => goToStep(3));
  document.getElementById('prev-3')?.addEventListener('click', () => goToStep(2));
  document.getElementById('next-3')?.addEventListener('click', () => goToStep(4));
  document.getElementById('prev-4')?.addEventListener('click', () => goToStep(3));

  // Submit booking
  document.getElementById('submit-booking')?.addEventListener('click', () => {
    const firstName = document.getElementById('patient-first').value;
    const lastName = document.getElementById('patient-last').value;
    const email = document.getElementById('patient-email').value;
    const phone = document.getElementById('patient-phone').value;

    if (!firstName || !lastName || !email || !phone) {
      if (!firstName) shakeElement(document.getElementById('patient-first'));
      if (!lastName) shakeElement(document.getElementById('patient-last'));
      if (!email) shakeElement(document.getElementById('patient-email'));
      if (!phone) shakeElement(document.getElementById('patient-phone'));
      return;
    }

    // Show success
    formSteps.forEach(s => s.classList.remove('active'));
    document.querySelector('.form-progress').style.display = 'none';
    document.getElementById('booking-success').classList.add('show');

    // Launch confetti
    launchConfetti();
  });

  // Book another
  document.getElementById('book-another')?.addEventListener('click', () => {
    document.getElementById('booking-success').classList.remove('show');
    document.querySelector('.form-progress').style.display = 'flex';
    currentFormStep = 1;
    goToStep(1);

    // Reset form
    document.getElementById('department').selectedIndex = 0;
    document.getElementById('doctor-select').selectedIndex = 0;
    document.querySelectorAll('.calendar-day.selected').forEach(d => d.classList.remove('selected'));
    document.querySelectorAll('.time-slot.selected').forEach(t => t.classList.remove('selected'));
    document.getElementById('patient-first').value = '';
    document.getElementById('patient-last').value = '';
    document.getElementById('patient-email').value = '';
    document.getElementById('patient-phone').value = '';
    document.getElementById('patient-notes').value = '';
  });

  // ============================================================
  // CALENDAR
  // ============================================================
  let calDate = new Date();
  const calDaysContainer = document.getElementById('cal-days');
  const calTitle = document.getElementById('cal-title');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function renderCalendar() {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const today = new Date();

    calTitle.textContent = `${monthNames[month]} ${year}`;
    calDaysContainer.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calDaysContainer.appendChild(empty);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = d;

      const thisDate = new Date(year, month, d);

      // Disable past dates and Sundays
      if (thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || thisDate.getDay() === 0) {
        dayEl.classList.add('disabled');
      } else {
        dayEl.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day.selected').forEach(s => s.classList.remove('selected'));
          dayEl.classList.add('selected');
        });
      }

      // Highlight today
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayEl.classList.add('today');
      }

      calDaysContainer.appendChild(dayEl);
    }
  }

  document.getElementById('cal-prev')?.addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();

  // Time slots
  const timeSlots = document.querySelectorAll('.time-slot');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });

  // ============================================================
  // CONFETTI ANIMATION
  // ============================================================
  function launchConfetti() {
    const colors = ['#00d4aa', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];
    const container = document.getElementById('booking-success');
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: ${rect.top + rect.height / 2}px;
        left: ${rect.left + rect.width / 2}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
      `;
      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 300 + 150;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 200;
      const rotation = Math.random() * 720;

      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy + 400}px) rotate(${rotation}deg)`, opacity: 0 }
      ], {
        duration: 1500 + Math.random() * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => confetti.remove();
    }
  }

  // ============================================================
  // CONTACT FORM (mock submission)
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'var(--clr-success)';
    btn.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.boxShadow = '';
      contactForm.reset();
    }, 3000);
  });

  // Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Subscribed!';
    setTimeout(() => {
      btn.textContent = originalText;
      newsletterForm.reset();
    }, 2500);
  });

  // ============================================================
  // SMOOTH SCROLL for all anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navH = navbar.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

});
