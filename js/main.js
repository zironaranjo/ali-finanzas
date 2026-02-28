/* =============================================
   ALI FINANZAS – JAVASCRIPT PRINCIPAL
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     NAVBAR: Scroll effect + hamburger
  ------------------------------------------ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ------------------------------------------
     HERO: Animated word cycling
  ------------------------------------------ */
  const words = document.querySelectorAll('.hero-words .word');
  let currentWord = 0;

  function cycleWords() {
    words[currentWord].classList.remove('active');
    words[currentWord].classList.add('out');
    setTimeout(() => { words[currentWord].classList.remove('out'); }, 600);

    currentWord = (currentWord + 1) % words.length;
    words[currentWord].classList.add('active');
  }

  if (words.length > 0) {
    setInterval(cycleWords, 2800);
  }

  /* ------------------------------------------
     ANIMATED COUNTERS
  ------------------------------------------ */
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  /* ------------------------------------------
     INTERSECTION OBSERVER (reveal + counters)
  ------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  /* ------------------------------------------
     TESTIMONIALS CAROUSEL
  ------------------------------------------ */
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('testimPrev');
  const nextBtn  = document.getElementById('testimNext');
  const dotsWrap = document.getElementById('testimDots');
  const controls = document.querySelector('.testimonials-controls');

  if (track) {
    const cards        = track.querySelectorAll('.testimonial-card');
    const totalCards   = cards.length;
    let   current      = 0;
    let   autoInterval = null;

    function getVisible() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    const totalSlides = () => Math.max(0, totalCards - getVisible());

    function getCardStep() {
      const card = cards[0];
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 0);
      return card.getBoundingClientRect().width + gap;
    }

    function updateControlsVisibility() {
      const hasSlides = totalSlides() > 0;
      if (controls) controls.style.display = hasSlides ? 'flex' : 'none';
      if (dotsWrap) dotsWrap.style.display = hasSlides ? 'flex' : 'none';
    }

    function createDots() {
      dotsWrap.innerHTML = '';
      const n = totalSlides() + 1;
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
      updateControlsVisibility();
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, totalSlides()));
      track.style.transform = `translateX(-${current * getCardStep()}px)`;
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function next() {
      if (totalSlides() <= 0) return;
      goTo(current < totalSlides() ? current + 1 : 0);
    }
    function prev() {
      if (totalSlides() <= 0) return;
      goTo(current > 0 ? current - 1 : totalSlides());
    }

    function startAuto() {
      stopAuto();
      if (totalSlides() <= 0) return;
      autoInterval = setInterval(next, 4500);
    }

    function stopAuto() {
      if (autoInterval) clearInterval(autoInterval);
    }

    createDots();
    startAuto();

    nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });
    prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    window.addEventListener('resize', () => {
      createDots();
      goTo(0);
      updateControlsVisibility();
    });
  }

  /* ------------------------------------------
     FAQ ACCORDION
  ------------------------------------------ */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const isOpen  = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

      if (!isOpen) item.classList.add('open');
    });
  });

  /* ------------------------------------------
     MULTI-STEP FORM
  ------------------------------------------ */
  const form        = document.getElementById('multiStepForm');
  const prevBtn2    = document.getElementById('prevBtn');
  const nextBtn2    = document.getElementById('nextBtn');
  const progressFill= document.getElementById('progressFill');
  const progressTxt = document.getElementById('progressText');
  const successDiv  = document.getElementById('formSuccess');

  if (form) {
    const steps     = form.querySelectorAll('.form-step');
    const totalSteps = steps.length;
    let current     = 0;

    function updateProgress() {
      const pct = Math.round(((current + 1) / totalSteps) * 100);
      progressFill.style.width = pct + '%';
      progressTxt.textContent  = `Paso ${current + 1} de ${totalSteps} · ${pct}%`;
    }

    function showStep(index) {
      steps.forEach((s, i) => s.classList.toggle('active', i === index));
      prevBtn2.style.display = index === 0 ? 'none' : 'inline-flex';
      nextBtn2.textContent   = index === totalSteps - 1 ? 'Enviar solicitud →' : 'Siguiente →';
      updateProgress();
    }

    nextBtn2.addEventListener('click', () => {
      if (current < totalSteps - 1) {
        current++;
        showStep(current);
        form.closest('.form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        submitForm();
      }
    });

    prevBtn2.addEventListener('click', () => {
      if (current > 0) {
        current--;
        showStep(current);
      }
    });

    function submitForm() {
      form.querySelectorAll('.form-step').forEach(s => { s.style.display = 'none'; });
      form.querySelector('.form-nav').style.display = 'none';
      document.querySelector('.form-progress').style.display = 'none';
      successDiv.style.display = 'block';
    }

    showStep(0);
  }

  /* ------------------------------------------
     SMOOTH SCROLL for anchor links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------
     ACTIVE NAV LINK on scroll
  ------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ------------------------------------------
     LANGUAGE SWITCHER (placeholder)
  ------------------------------------------ */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.lang === 'de') {
        alert('Versión en alemán próximamente / Deutsche Version demnächst verfügbar');
      }
    });
  });

});
