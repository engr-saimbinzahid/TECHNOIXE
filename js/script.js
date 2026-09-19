/* ============================================================
   TECHNOXIE - Main JavaScript
   Handles: Navigation, Forms, Components, Back-to-Top, Loader
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ── */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
    /* Fallback: hide after 3s even if load event already fired */
    setTimeout(() => loader.classList.add('hidden'), 3000);
  }


  /* ── Navbar Scroll Effect ── */
  const navbar = document.querySelector('.navbar');
  const handleNavScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ── Mobile Menu Toggle ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('visible');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    /* Close menu on overlay click */
    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    }

    /* Close menu on link click */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    });
  }


  /* ── Active Nav Link ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  /* ── Back to Top Button ── */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── Contact Form Validation ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      /* Reset errors */
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      /* Validators */
      const validators = [
        { id: 'name',    test: v => v.trim().length >= 2,     msg: 'Please enter your name (at least 2 characters).' },
        { id: 'email',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
        { id: 'phone',   test: v => v.trim().length >= 7,     msg: 'Please enter a valid phone number.' },
        { id: 'service', test: v => v !== '',                  msg: 'Please select a service.' },
        { id: 'message', test: v => v.trim().length >= 10,    msg: 'Message must be at least 10 characters.' },
      ];

      validators.forEach(({ id, test, msg }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const group = el.closest('.form-group');
        if (!test(el.value)) {
          isValid = false;
          group.classList.add('error');
          const errEl = group.querySelector('.error-message');
          if (errEl) errEl.textContent = msg;
        }
      });

      if (isValid) {
        /* Show success message */
        contactForm.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.classList.add('show');

        /* Reset after 5s */
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = '';
          if (success) success.classList.remove('show');
        }, 5000);
      }
    });

    /* Live validation — remove error on input */
    contactForm.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => {
        el.closest('.form-group')?.classList.remove('error');
      });
    });
  }


  /* ── Portfolio Filters ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ── Service Category Tabs ── */
  const catBtns = document.querySelectorAll('.category-btn');
  const serviceCards = document.querySelectorAll('.service-detail-card');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      serviceCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ── Load Components (Navbar & Footer) ── */
  loadComponent('navbar-placeholder', getComponentPath('navbar.html'));
  loadComponent('footer-placeholder', getComponentPath('footer.html'));

});


/**
 * Determines the correct relative path to components based on the current page.
 * Inner pages (inside /pages/) use the '-inner' variant of components which
 * have relative paths adjusted for the /pages/ directory.
 * @param {string} componentFile – The component filename (e.g. 'navbar.html')
 * @returns {string} – The relative path to the component
 */
function getComponentPath(componentFile) {
  const path = window.location.pathname;
  /* If we are inside the /pages/ directory, load the inner-page variant */
  if (path.includes('/pages/') || path.includes('\\pages\\')) {
    const baseName = componentFile.replace('.html', '');
    return `../components/${baseName}-inner.html`;
  }
  return `components/${componentFile}`;
}

/**
 * Fetches an HTML component and injects it into the placeholder element.
 * After injection, re-initializes event listeners that depend on the injected DOM.
 * @param {string} placeholderId – The ID of the placeholder element
 * @param {string} url           – The path to the component HTML file
 */
async function loadComponent(placeholderId, url) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    const html = await res.text();
    placeholder.innerHTML = html;

    /* Re-attach event listeners after component injection */
    if (placeholderId === 'navbar-placeholder') {
      initNavbarEvents();
    }
  } catch (err) {
    console.warn(`Component load error: ${err.message}`);
  }
}

/**
 * Re-initializes navbar-related event listeners after the navbar component
 * is injected into the page.
 */
function initNavbarEvents() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  /* Scroll effect */
  const handleScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* Mobile toggle */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('visible');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    }

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('visible');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active nav link */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
