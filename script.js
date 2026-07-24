/* ==========================================================================
   KAEYAN AI STUDIO — SCRIPT
   1. Page loader
   2. Cursor glow
   3. Navbar scroll + mobile nav
   4. Smooth anchor scrolling
   5. Magnetic buttons + ripple
   6. Scroll reveal (IntersectionObserver)
   7. Counter animation
   8. Trust marquee (duplicate for seamless loop)
   9. Services accordion
   10. FAQ accordion
   11. Process timeline progress
   12. Hero particle field (canvas + requestAnimationFrame)
   13. Contact form validation
   14. Newsletter form
   15. Back to top
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Page loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
      triggerHeroReveal();
    }, 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => {
    if (!document.body.classList.contains('is-loaded')) {
      loader.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
      triggerHeroReveal();
    }
  }, 2200);

  function triggerHeroReveal() {
    document.querySelectorAll('.hero .reveal-up').forEach((el) => {
      const delay = parseInt(el.dataset.delay || '0', 10) * 110;
      setTimeout(() => el.classList.add('is-visible'), delay);
    });
  }

  /* ---------- 2. Cursor glow ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ---------- 3. Navbar scroll + mobile nav ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id], .hero[id]');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });

  /* Active link highlight on scroll */
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));

  /* ---------- 4. Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ---------- 5. Magnetic buttons + ripple ---------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      if (prefersReducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- 6. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), (i % 6) * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 7. Counter animation ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- 8. Trust marquee duplication ---------- */
  const track = document.getElementById('trustTrack');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- 9. Services accordion (single-open) ---------- */
  const accordionItems = document.querySelectorAll('#servicesAccordion .accordion__item');
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      accordionItems.forEach((other) => {
        const otherTrigger = other.querySelector('.accordion__trigger');
        const otherPanel = other.querySelector('.accordion__panel');
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  // Open first accordion item by default
  const firstTrigger = document.querySelector('#servicesAccordion .accordion__trigger');
  if (firstTrigger) {
    const firstPanel = firstTrigger.closest('.accordion__item').querySelector('.accordion__panel');
    requestAnimationFrame(() => {
      firstPanel.style.maxHeight = `${firstPanel.scrollHeight}px`;
    });
  }

  // Recalculate open accordion height on resize
  window.addEventListener('resize', debounce(() => {
    document.querySelectorAll('.accordion__trigger[aria-expanded="true"]').forEach((trigger) => {
      const panel = trigger.closest('.accordion__item').querySelector('.accordion__panel');
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    });
    document.querySelectorAll('.faq__trigger[aria-expanded="true"]').forEach((trigger) => {
      const panel = trigger.nextElementSibling;
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    });
  }, 200));

  /* ---------- 10. FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach((item) => {
    const trigger = item.querySelector('.faq__trigger');
    const panel = item.querySelector('.faq__panel');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq__trigger').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  /* ---------- 11. Process timeline progress ---------- */
  const timeline = document.getElementById('timeline');
  const timelineFill = document.getElementById('timelineFill');
  const timelineItems = document.querySelectorAll('.timeline__item');

  if (timeline && timelineFill) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Array.from(timelineItems).indexOf(entry.target);
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
            const pct = ((index + 1) / timelineItems.length) * 100;
            timelineFill.style.width = `${pct}%`;
          }
        });
      },
      { threshold: 0.6 }
    );
    timelineItems.forEach((item) => timelineObserver.observe(item));
  }

  /* ---------- 12. Hero particle field ---------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height, dpr;

    function resizeCanvas() {
      const hero = document.querySelector('.hero');
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      const count = Math.round((width * height) / 22000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.15,
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    requestAnimationFrame(drawParticles);

    window.addEventListener('resize', debounce(() => {
      resizeCanvas();
      createParticles();
    }, 250));
  }

  /* ---------- 13. Contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitLabel = document.getElementById('submitLabel');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nameField = contactForm.querySelector('#name').closest('.field');
      const emailField = contactForm.querySelector('#email').closest('.field');
      const messageField = contactForm.querySelector('#message').closest('.field');

      const nameVal = contactForm.querySelector('#name').value.trim();
      const emailVal = contactForm.querySelector('#email').value.trim();
      const messageVal = contactForm.querySelector('#message').value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      [nameField, emailField, messageField].forEach((f) => f.classList.remove('has-error'));

      if (!nameVal) {
        nameField.classList.add('has-error');
        valid = false;
      }
      if (!emailVal || !emailPattern.test(emailVal)) {
        emailField.classList.add('has-error');
        valid = false;
      }
      if (!messageVal) {
        messageField.classList.add('has-error');
        valid = false;
      }

      if (!valid) {
        formSuccess.classList.remove('is-visible');
        return;
      }

      submitLabel.textContent = 'Sending...';
      setTimeout(() => {
        submitLabel.textContent = 'Send Message';
        formSuccess.classList.add('is-visible');
        contactForm.reset();
      }, 900);
    });

    contactForm.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('input', () => {
        input.closest('.field').classList.remove('has-error');
      });
    });
  }

  /* ---------- 14. Newsletter form ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const button = newsletterForm.querySelector('button');
      if (!input.value.trim()) return;
      const original = button.innerHTML;
      button.innerHTML = '✓';
      input.value = '';
      setTimeout(() => (button.innerHTML = original), 1800);
    });
  }

  /* ---------- 15. Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', debounce(() => {
    backToTop.classList.toggle('is-visible', window.scrollY > 700);
  }, 80), { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Utility ---------- */
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
});
