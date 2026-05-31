/* PELAGOS - main.js V7 */
(function() {
  'use strict';

  // Nav scroll state
  const nav = document.getElementById('nav');
  if (nav) {
    const handleScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Burger mobile
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Dropdown clic mobile
  document.querySelectorAll('.has-dropdown').forEach(item => {
    const trigger = item.querySelector('a');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  // Reveal animations - parallaxe smooth
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
    document.querySelectorAll('.reveal, .parallax-up').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal, .parallax-up').forEach(el => el.classList.add('visible'));
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Effet 2 — compteurs animés sur les KPI marqués [data-count]
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const runCounter = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const duration = 1500;
      const startTime = performance.now();
      const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step); else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const cObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { runCounter(entry.target); cObs.unobserve(entry.target); }
        });
      }, { threshold: 0.25 });
      counters.forEach(el => cObs.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  // Effet 10 — barre de progression de scroll
  if (!reduceMotion) {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const updateBar = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  // Effet 12 — CTA flottant mobile (apparaît après 600px de scroll)
  const stickyCta = document.querySelector('.sticky-cta-mobile');
  if (stickyCta) {
    const toggleCta = () => stickyCta.classList.toggle('visible', window.scrollY > 600);
    window.addEventListener('scroll', toggleCta, { passive: true });
    toggleCta();
  }

})();
