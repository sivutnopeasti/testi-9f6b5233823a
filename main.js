'use strict';

/* =============================================
   MOBILE MENU
   ============================================= */

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
    mobileMenu.classList.toggle('open', !isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.classList.remove('open');
    });
  });
}

/* =============================================
   TYPEWRITER HERO
   ============================================= */

(function initTypewriter() {
  const el = document.getElementById('hero-headline');
  if (!el) return;

  const text = 'Sähkötyöt sovitusti — ei ylityksiä, ei viivästyksiä';
  // Käytetään väliviivaa ajatusviivan sijaan tekstissä
  const safeText = 'Sähkötyöt sovitusti. Ei ylityksiä, ei viivästyksiä.';
  let i = 0;

  function type() {
    if (i <= safeText.length) {
      el.textContent = safeText.slice(0, i);
      i++;
      setTimeout(type, 60);
    } else {
      el.classList.add('typing-done');
    }
  }

  setTimeout(type, 400);
})();

/* =============================================
   SCROLL REVEAL (IntersectionObserver + stagger)
   ============================================= */

(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Ryhmittele elementit vanhemman mukaan ja lisää stagger-viive
  const groups = new Map();
  items.forEach(item => {
    const key = item.parentElement || document.body;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  groups.forEach(group => {
    group.forEach((item, idx) => {
      item.dataset.delay = idx * 100;
      observer.observe(item);
    });
  });
})();

/* =============================================
   STATS – SVG-RENKAAT + NUMEROLASKURI
   ============================================= */

(function initStats() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  const circumference = 2 * Math.PI * 50; // r=50 → ~314.16

  function animateRing(ring) {
    const pct = parseFloat(ring.dataset.percent) || 0;
    const offset = circumference - (pct / 100) * circumference;
    ring.style.strokeDashoffset = offset;
  }

  function animateNum(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const duration = 1400;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  let fired = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      statsSection.querySelectorAll('.stat-ring').forEach(animateRing);
      statsSection.querySelectorAll('.stat-num').forEach(animateNum);
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();

/* =============================================
   CONTACT FORM – lähetys + spinner + checkmark
   ============================================= */

(function initForm() {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');
  if (!form || !btn || !status) return;

  function showError(msg) {
    status.className = 'form-status error';
    status.textContent = msg;
  }

  function clearStatus() {
    status.className = 'form-status';
    status.textContent = '';
  }

  function setLoading(on) {
    if (on) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }

  function setSuccess() {
    btn.classList.remove('loading');
    btn.classList.add('success');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    // Validointi
    const name    = form.querySelector('#name');
    const phone   = form.querySelector('#phone');
    const message = form.querySelector('#message');
    const errors  = [];

    if (!name || !name.value.trim())       errors.push('Nimi puuttuu.');
    if (!phone || !phone.value.trim())     errors.push('Puhelinnumero puuttuu.');
    if (!message || !message.value.trim()) errors.push('Kerrothan työkohteesta.');

    if (errors.length) {
      showError(errors.join(' '));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setSuccess();
        form.reset();
      } else {
        setLoading(false);
        showError('Lähetys epäonnistui. Yritä uudelleen tai soita suoraan.');
      }
    } catch {
      setLoading(false);
      showError('Verkkovirhe. Tarkista yhteytesi ja yritä uudelleen.');
    }
  });
})();

/* =============================================
   STICKY HEADER – varjo scrollatessa
   ============================================= */

(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.28)';
    } else {
      header.style.boxShadow = '0 1px 0 rgba(255,255,255,0.06)';
    }
  }, { passive: true });
})();