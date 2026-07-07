/* ============================================================
   MARCELO POST | v3.0 — SCRIPTS
   - Custom cursor
   - Partículas canvas (hero)
   - Scroll reveal (IntersectionObserver)
   - Contadores animados (zero → valor)
   - Checklist gatilho + expansão de formulário
   - Skill bars animadas
   - Accordion
   - Formulários (diagnóstico + reunião) → Vercel /api/contact
   - Navbar scroll
   ============================================================ */
'use strict';

/* ── UTILS ── */
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];



/* ============================================================
   CANVAS PARTÍCULAS (hero)
   ============================================================ */
function initParticles() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  const rnd = (a, b) => Math.random() * (b - a) + a;

  const init = () => {
    const n = Math.floor(W * H / 10000);
    pts = Array.from({length: n}, () => ({
      x: rnd(0, W), y: rnd(0, H),
      r: rnd(.6, 2.2),
      vx: rnd(-.12, .12), vy: rnd(-.22, -.04),
      a: rnd(.08, .45),
      // cor aleatória entre laranja e cyan
      orange: Math.random() > .7,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.orange
        ? `rgba(254,80,0,${p.a})`
        : `rgba(0,229,255,${p.a * .5})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = H + 5; p.x = rnd(0, W); }
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const nav = $('#nav');
  if (!nav) return;
  const upd = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', upd, {passive: true});
  upd();
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const els = $$('.reveal, .reveal-l, .reveal-r, .reveal-s');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, {threshold: .1});

  els.forEach(el => obs.observe(el));
}

/* ============================================================
   COUNTER ANIMADO — data-target="66" data-suffix="%"
   ============================================================ */
function animateCounter(el) {
  const raw      = el.dataset.target || '0';
  const decimals = el.dataset.decimals != null
    ? parseInt(el.dataset.decimals, 10)
    : (raw.includes('.') ? 1 : 0);
  const target = parseFloat(raw);
  const dur    = 1800;
  const start  = performance.now();

  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
    const v = e * target;
    el.textContent = v.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const els = $$('[data-target]');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, {threshold: .5});

  els.forEach(el => obs.observe(el));
}

/* ============================================================
   ACORDEÃO (FAQ)
   ============================================================ */
function initAccordion() {
  $$('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');

      $$('.acc-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.acc-body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================
   SMOOTH SCROLL âncoras
   ============================================================ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();

      const navHeight = $('#nav')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   MICROINTERAÇÃO nos service cards (tilt leve)
   ============================================================ */
function initCardTilt() {
  $$('.srv-card, .ben-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   EFEITO TYPING no hero (opcional — ativa se elemento existir)
   ============================================================ */
function initTyping() {
  const el = $('#hero-typing');
  if (!el) return;
  const words = ['Processos em Lucro.', 'Dados em Decisões.', 'Potencial em Crescimento.'];
  let wi = 0, ci = 0, del = false;

  const tick = () => {
    const word = words[wi];
    if (!del) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) { del = true; setTimeout(tick, 1800); return; }
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, del ? 55 : 90);
  };
  tick();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initReveal();
  initCounters();
  initAccordion();
  initSmoothScroll();
  initCardTilt();
  initTyping();

  // Ano no footer
  const yr = $('#footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
});
