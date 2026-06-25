/* ============================================
   Mahipal Puri — Portfolio Interactions
   ============================================ */

// TODO: Replace with your real Web3Forms access key from https://web3forms.com (free)
const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_KEY';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  init3DTilt();
  initSkillCards();
  initCounters();
  initRings();
  initMagneticChips();
  initScrollProgress();
  initCustomCursor();
  initSplitText();
  initMagneticButtons();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Theme toggle ---------- */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);
  btn.textContent = initial === 'light' ? '🌙' : '☀️';

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    btn.textContent = next === 'light' ? '🌙' : '☀️';
    localStorage.setItem('theme', next);
  });
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ---------- Typewriter ---------- */
function initTypewriter() {
  const target = document.getElementById('typed');
  if (!target) return;
  const roles = [
    'MERN Stack Developer',
    'AI Enthusiast',
    'CSE Student',
    'Full-Stack Builder'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const word = roles[roleIdx];
    if (!deleting) {
      target.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        return setTimeout(tick, 1500);
      }
    } else {
      target.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 50 : 90);
  }
  tick();
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => observer.observe(el));
}

/* ---------- Skill bars (animated fill + percent counter) ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const bar = e.target;
      const level = parseInt(bar.dataset.level || '0', 10);
      bar.style.width = level + '%';

      const row = bar.closest('.bar-row');
      const pctEl = row && row.querySelector('.bar-label span:last-child');
      if (pctEl) {
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          pctEl.textContent = Math.round(level * eased) + '%';
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });
  bars.forEach((b) => observer.observe(b));
}

/* ---------- Project filter ---------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach((c) => {
        const matches = filter === 'all' || c.dataset.category === filter;
        c.classList.toggle('hidden', !matches);
      });
    });
  });
}

/* ---------- 3D tilt on project cards ---------- */
function init3DTilt() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const MAX = 10;
  cards.forEach((card) => {
    let rafId = null;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((cy - y) / cy) * MAX;
      const ry = ((x - cx) / cx) * MAX;
      const gx = (x / rect.width) * 100;
      const gy = (y / rect.height) * 100;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform =
          `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px) scale(1.01)`;
        card.style.setProperty('--glare-x', gx + '%');
        card.style.setProperty('--glare-y', gy + '%');
        card.classList.add('tilt-active');
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.classList.remove('tilt-active');
    });
  });
}

/* ---------- Contact form (Web3Forms) ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  function setStatus(type, msg) {
    status.className = 'form-status show ' + type;
    status.textContent = msg;
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    if (!WEB3FORMS_KEY || WEB3FORMS_KEY === 'YOUR_WEB3FORMS_KEY') {
      setStatus('info', 'Demo mode: replace WEB3FORMS_KEY in assets/js/main.js with a key from web3forms.com to enable real submissions.');
      return;
    }

    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_KEY);

    setStatus('info', 'Sending...');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success', 'Thanks! Your message has been sent.');
        form.reset();
      } else {
        setStatus('error', json.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error', 'Network error. Please try again later.');
    }
  });
}

/* ---------- Skill cards: spotlight + subtle 3D tilt ---------- */
function initSkillCards() {
  const cards = document.querySelectorAll('.skill-group');
  if (!cards.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover = window.matchMedia('(hover: none)').matches;
  const MAX_TILT = 6;

  cards.forEach((card) => {
    let rafId = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const mxPct = (x / rect.width) * 100;
      const myPct = (y / rect.height) * 100;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--mx', mxPct + '%');
        card.style.setProperty('--my', myPct + '%');

        if (!reduced && !noHover) {
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rx = ((cy - y) / cy) * MAX_TILT;
          const ry = ((x - cx) / cx) * MAX_TILT;
          card.style.transform =
            `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}

/* ---------- Generic counter (stats + ring %) ---------- */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll('.skill-stats .counter');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.target || '0', 10);
      animateCounter(e.target, target);
      observer.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => observer.observe(c));
}

/* ---------- Circular progress rings ---------- */
function initRings() {
  const cards = document.querySelectorAll('.ring-card');
  if (!cards.length) return;
  const CIRCUMFERENCE = 2 * Math.PI * 52; // ~326.7

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const card = e.target;
      const level = parseInt(card.dataset.level || '0', 10);
      const fg = card.querySelector('.ring-fg');
      const counter = card.querySelector('.ring-pct .counter');
      const offset = CIRCUMFERENCE * (1 - level / 100);
      requestAnimationFrame(() => { fg.style.strokeDashoffset = offset; });
      if (counter) animateCounter(counter, level, 1600);
      observer.unobserve(card);
    });
  }, { threshold: 0.4 });
  cards.forEach((c) => observer.observe(c));
}

/* ---------- Magnetic skill chips (lean toward cursor when nearby) ---------- */
function initMagneticChips() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const chips = document.querySelectorAll('.skill-chip');
  if (!chips.length) return;

  const STRENGTH = 0.35;
  const MAX_DIST = 80;

  chips.forEach((chip) => {
    let rafId = null;
    chip.addEventListener('mousemove', (e) => {
      const rect = chip.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX_DIST) return;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const tx = dx * STRENGTH;
        const ty = dy * STRENGTH;
        chip.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(1.08)`;
      });
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.transform = '';
    });
  });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100).toFixed(2) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Custom cursor (smooth follower + magnetic states) ---------- */
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let dx = mx, dy = my; // dot follows immediately
  let rx = mx, ry = my; // ring lerps with delay

  document.body.classList.add('cursor-active');

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) document.body.classList.remove('cursor-active');
  });
  window.addEventListener('mouseover', () => document.body.classList.add('cursor-active'));

  const loop = () => {
    dx = mx; dy = my;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  // State changes on interactive elements
  const linkSel = 'a, button, [data-magnetic], .skill-chip, .ring-card, .tech-pill, .project-card, .filter-btn';
  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest(linkSel);
    const text = e.target.closest('p, h1, h2, h3, h4, input, textarea, li');
    document.body.classList.toggle('cursor-link', !!link);
    document.body.classList.toggle('cursor-text', !!text && !link);
  });
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) {
      document.body.classList.remove('cursor-link', 'cursor-text');
    }
  });
}

/* ---------- Split text: hero chars + section-title words ---------- */
function initSplitText() {
  // Hero title — split into characters
  document.querySelectorAll('.split-chars').forEach((el) => {
    splitChars(el);
    // Reveal on next frame (after fonts/layout settle)
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-revealed')));
  });

  // Section titles — split into words, reveal when in viewport
  const wordEls = document.querySelectorAll('.split-words');
  wordEls.forEach((el) => splitWords(el));
  // The existing reveal observer already toggles `.in-view`; word reveal is hooked via CSS
}

function splitChars(el) {
  const walk = (node) => {
    const out = [];
    node.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const text = n.textContent;
        for (const ch of text) {
          const span = document.createElement('span');
          span.className = ch === ' ' ? 'char space' : 'char';
          if (ch !== ' ') span.textContent = ch;
          out.push(span);
        }
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        const wrapper = n.cloneNode(false);
        const children = walk(n);
        children.forEach((c) => wrapper.appendChild(c));
        out.push(wrapper);
      }
    });
    return out;
  };
  const newChildren = walk(el);
  el.textContent = '';
  newChildren.forEach((c) => el.appendChild(c));

  // Stagger transition-delay per char (sequential index across nested spans)
  const chars = el.querySelectorAll('.char');
  chars.forEach((c, i) => {
    c.style.transitionDelay = (i * 45) + 'ms';
  });
}

function splitWords(el) {
  // Preserve any inner HTML (e.g., the &amp; in "Achievements & Certifications") by working on text content only
  const text = el.textContent.trim();
  el.textContent = '';
  const words = text.split(/\s+/);
  words.forEach((w, i) => {
    const outer = document.createElement('span');
    outer.className = 'word';
    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.textContent = w;
    inner.style.transitionDelay = (i * 80) + 'ms';
    outer.appendChild(inner);
    el.appendChild(outer);
  });
}

/* ---------- Magnetic buttons ---------- */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const STRENGTH = 0.25;
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    let rafId = null;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * STRENGTH;
      const dy = (e.clientY - cy) * STRENGTH;
      const mxPct = ((e.clientX - rect.left) / rect.width) * 100;
      const myPct = ((e.clientY - rect.top) / rect.height) * 100;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        btn.style.setProperty('--mx', mxPct + '%');
        btn.style.setProperty('--my', myPct + '%');
      });
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.removeProperty('--mx');
      btn.style.removeProperty('--my');
    });
  });
}
