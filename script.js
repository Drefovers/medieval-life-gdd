'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Element References ────────────────────────────────────────────
  const menuToggle    = document.querySelector('.menu-toggle');
  const sidebar       = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const navLinks      = document.querySelectorAll('.nav-link');
  const sections      = document.querySelectorAll('section[id]');
  const backToTopBtn  = document.querySelector('.back-to-top');
  const revealElements = document.querySelectorAll('.reveal');
  const tabContainers = document.querySelectorAll('.tabs');
  const counterElements = document.querySelectorAll('.animate-count');


  // ─── 1. Scroll Spy ────────────────────────────────────────────────
  // Highlights the sidebar link corresponding to the section currently
  // visible in the viewport using IntersectionObserver.

  const activateNavLink = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
  };

  const scrollSpyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateNavLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-10% 0px -80% 0px', // Trigger when section is near the top
      threshold: 0,
    }
  );

  sections.forEach((section) => scrollSpyObserver.observe(section));


  // ─── 2. Smooth Scroll ─────────────────────────────────────────────
  // Intercepts nav-link clicks for smooth scrolling to the target
  // section. On mobile viewports, closes the sidebar after clicking.

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Close sidebar on mobile after navigation
      if (sidebar.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  });


  // ─── 3. Mobile Menu ───────────────────────────────────────────────
  // Toggles the sidebar and overlay visibility for mobile navigation.

  const openMobileMenu = () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeMobileMenu = () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileMenu);
  }


  // ─── 4. Back to Top Button ────────────────────────────────────────
  // Shows the back-to-top button after scrolling past 600px.
  // Clicking it smoothly scrolls the page back to the top.

  const handleBackToTopVisibility = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 600) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ─── 5. Reveal on Scroll ──────────────────────────────────────────
  // Adds a .visible class to .reveal elements when they enter the
  // viewport. Once revealed, the element is unobserved to save resources.

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  // ─── 6. Tab System ────────────────────────────────────────────────
  // Within each .tabs container, clicking a .tab-btn activates the
  // corresponding .tab-content panel matched by the data-tab attribute.

  tabContainers.forEach((container) => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Deactivate all sibling tabs and content
        tabButtons.forEach((b) => b.classList.remove('active'));
        tabContents.forEach((c) => c.classList.remove('active'));

        // Activate clicked tab and its matching content
        btn.classList.add('active');
        const targetContent = container.querySelector(
          `.tab-content[data-tab="${targetTab}"]`
        );
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });


  // ─── 7. Counter Animation ─────────────────────────────────────────
  // Animates numeric counters from 0 to a target value (data-target)
  // when the element becomes visible in the viewport.

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000; // Animation duration in ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(easedProgress * target);

      el.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  counterElements.forEach((el) => counterObserver.observe(el));

});
