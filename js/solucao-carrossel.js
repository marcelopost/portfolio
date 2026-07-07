/* ============================================================
   CARROSSEL v9 — SEM DRAG, só clique + setas + touch nativo
   ============================================================ */
(function () {
  'use strict';

  const track   = document.getElementById('scTrack');
  const prevBtn = document.getElementById('scPrev');
  const nextBtn = document.getElementById('scNext');
  const curEl   = document.getElementById('scCur');
  const totEl   = document.getElementById('scTot');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.srv-cc-card'));
  const TOTAL = cards.length;
  if (totEl) totEl.textContent = TOTAL;

  let activeIdx   = 0;
  let scrollTimer = null;
  let snapTimer   = null;
  let isScrolling = false;

  /* ── centraliza card ── */
/* ── centraliza card ── */
function goTo(idx, smooth) {
  idx = Math.max(0, Math.min(TOTAL - 1, idx));
  isScrolling = true;
  
  if (smooth === false) {
    // Carregamento inicial: ajusta apenas o scroll horizontal sem pular a página
    const card = cards[idx];
    track.scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2);
  } else {
    // Comportamento normal ao clicar nas setas ou cards
    cards[idx].scrollIntoView({
      behavior: 'smooth',
      block:    'nearest',
      inline:   'center'
    });
  }

  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => {
    setActive(idx);
    isScrolling = false;
  }, smooth === false ? 50 : 420);
}

  /* ── card mais próximo do centro ── */
  function nearestIdx() {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs((c.offsetLeft + c.offsetWidth / 2) - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  /* ── aplica is-active ── */
  function setActive(idx) {
    if (idx < 0 || idx >= TOTAL) return;
    cards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    activeIdx = idx;
    if (curEl)   curEl.textContent = idx + 1;
    if (prevBtn) prevBtn.disabled  = idx === 0;
    if (nextBtn) nextBtn.disabled  = idx === TOTAL - 1;
  }

  /* ── touch nativo: detecta quando para ── */
  track.addEventListener('scroll', () => {
    if (isScrolling) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => setActive(nearestIdx()), 120);
  }, { passive: true });

  /* ── clique no card ── */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => goTo(i));
    card.addEventListener('mouseenter', () => {
      if (i !== activeIdx) card.style.cursor = 'pointer';
    });
    card.addEventListener('mouseleave', () => {
      card.style.cursor = '';
    });
  });

  /* ── setas ── */
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(activeIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(activeIdx + 1));

  /* ── teclado ── */
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(activeIdx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(activeIdx + 1); }
  });

  /* ── init ── */
  function init() { goTo(0, false); }
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);

})();
