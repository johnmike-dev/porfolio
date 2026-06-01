// Active navbar sync (scroll + click) — per-page section highlighting

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const buttons = document.querySelectorAll('.hero-buttons .btn');

  // Map section ids to nav hrefs (page-based navigation)
  // Each page has a single main section id; this keeps active underline stable.
  const sectionToHref = {
    home: 'index.html',
    about: 'about.html',
    service: 'service.html',
    portfolio: 'other.html',
    contact: 'contact.html'
  };

  function setActiveHref(href) {
    navLinks.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('href') === href);
    });
  }

  // Initialize active based on current page (so Home is highlighted on index.html, etc.)
  function initActiveByLocation() {
    const path = window.location.pathname.split('/').pop();
    // Normalize
    setActiveHref(path || 'index.html');
  }

  initActiveByLocation();

  // Handle nav link clicks: set active immediately and let navigation continue.
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      const href = this.getAttribute('href');
      if (href) setActiveHref(href);

      // Close mobile nav
      const navToggle = document.querySelector('.nav-toggle');
      const primaryNav = document.getElementById('primary-nav');
      if (navToggle && primaryNav) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('open');
      }
    });
  });

  // IntersectionObserver (scroll sync) for pages that have multiple stacked sections.
  // In your current layout, each page has one main section, but this keeps behavior correct if you add more.
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first intersecting section with highest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const id = visible.target.id;
        const href = sectionToHref[id];
        if (href) setActiveHref(href);
      },
      {
        root: null,
        // Favor the section that is closer to the middle of the viewport
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0.01, 0.1, 0.2, 0.35]
      }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Handle buttons (existing behavior)
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', function () {
      if (index === 0) {
        const redirectUrl = btn.getAttribute('data-redirect');
        if (redirectUrl) {
          window.open(redirectUrl, '_blank', 'noopener');
        }
      }
      // Hire Me button is on index.html currently; other pages can keep their default nav.
    });
  });

  // Handle scroll indicator click (keep existing id if present)
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      const target = document.querySelector('#service');
      if (!target) return;
      const header = document.querySelector('.header');
      const headerHeight = header ? header.getBoundingClientRect().height : 100;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  }
});


