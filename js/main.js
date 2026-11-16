(function () {
  // Toggle Vinicius's order calendar: true = AGENDA ABERTA, false = AGENDA FECHADA
  const AGENDA_OPEN = true;

  const grid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const expandBtn = document.getElementById('gallery-expand-btn');
  const expandWrap = document.querySelector('.gallery-expand');
  const agendaEl = document.getElementById('agenda-status');

  const PAGE_SIZE = 12;
  // Mosaic columns: 2 @ ≤720, 3 @ ≤1024, 4 desktop
  const CARD_SIZES = '(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw';

  const FILTER_LABELS = {
    finished: 'FINALIZADAS',
    wip: 'BASTIDORES',
    event: 'EVENTOS',
    all: 'TODAS',
  };

  let currentFilter = 'finished';
  let expanded = false;
  let activeGroup = null;
  let activeAngle = 0;

  function groupKey(g) {
    return g.images[0];
  }

  function groupsForFilter(filter) {
    const base = filter === 'all'
      ? GALLERY_GROUPS.slice()
      : GALLERY_GROUPS.filter(g => g.category === filter);

    const front = HIGHLIGHTS.filter(h => filter === 'all' || h.category === filter);
    const frontKeys = new Set(front.map(groupKey));
    const rest = base.filter(g => !frontKeys.has(groupKey(g)));
    return front.concat(rest);
  }

  function countForFilter(filter) {
    if (filter === 'all') return GALLERY_GROUPS.length;
    return GALLERY_GROUPS.filter(g => g.category === filter).length;
  }

  function updateTabLabels() {
    filterBtns.forEach(btn => {
      const f = btn.dataset.filter;
      const label = FILTER_LABELS[f] || f.toUpperCase();
      const n = countForFilter(f);
      btn.textContent = f === 'all' ? label : `${label} ${n}`;
    });
  }

  function applyAgendaStatus() {
    if (!agendaEl) return;
    const label = agendaEl.querySelector('.agenda-label');
    agendaEl.dataset.open = AGENDA_OPEN ? 'true' : 'false';
    agendaEl.classList.toggle('agenda-open', AGENDA_OPEN);
    agendaEl.classList.toggle('agenda-closed', !AGENDA_OPEN);
    if (label) label.textContent = AGENDA_OPEN ? 'AGENDA ABERTA' : 'AGENDA FECHADA';
  }

  const manifest = typeof IMAGE_MANIFEST !== 'undefined' ? IMAGE_MANIFEST : {};

  function applyResponsiveSrc(img, src, sizes) {
    const entry = manifest[src];
    img.src = entry ? entry.src : src;
    if (entry) {
      img.srcset = entry.srcset;
      img.sizes = sizes;
      img.width = entry.width;
      img.height = entry.height;
    }
  }

  function makeCard(group) {
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.dataset.category = group.category;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', group.alt);

    let angle = 0;
    const img = document.createElement('img');
    applyResponsiveSrc(img, group.images[0], CARD_SIZES);
    img.alt = group.alt;
    img.loading = 'lazy';
    card.appendChild(img);

    if (group.images.length > 1) {
      const badge = document.createElement('span');
      badge.className = 'angle-badge';
      badge.textContent = `1/${group.images.length}`;
      card.appendChild(badge);

      const prev = document.createElement('button');
      prev.className = 'card-nav card-prev';
      prev.type = 'button';
      prev.setAttribute('aria-label', 'Ângulo anterior');
      prev.innerHTML = '&#10094;';

      const next = document.createElement('button');
      next.className = 'card-nav card-next';
      next.type = 'button';
      next.setAttribute('aria-label', 'Próximo ângulo');
      next.innerHTML = '&#10095;';

      function setAngle(i) {
        angle = (i + group.images.length) % group.images.length;
        applyResponsiveSrc(img, group.images[angle], CARD_SIZES);
        badge.textContent = `${angle + 1}/${group.images.length}`;
      }

      prev.addEventListener('click', (e) => { e.stopPropagation(); setAngle(angle - 1); });
      next.addEventListener('click', (e) => { e.stopPropagation(); setAngle(angle + 1); });

      card.appendChild(prev);
      card.appendChild(next);
    }

    card.addEventListener('click', () => openLightbox(group, angle));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openLightbox(group, angle);
      } else if (e.key === ' ') {
        e.preventDefault();
      }
    });
    card.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        openLightbox(group, angle);
      }
    });
    return card;
  }

  function renderGrid() {
    grid.replaceChildren();
    const groups = groupsForFilter(currentFilter);
    const visible = expanded ? groups : groups.slice(0, PAGE_SIZE);
    const frag = document.createDocumentFragment();
    visible.forEach(g => frag.appendChild(makeCard(g)));
    grid.appendChild(frag);

    if (groups.length > PAGE_SIZE) {
      expandWrap.style.display = '';
      expandBtn.textContent = expanded
        ? 'VER MENOS'
        : `VER MAIS (${groups.length - PAGE_SIZE})`;
    } else {
      expandWrap.style.display = 'none';
    }
  }

  expandBtn.addEventListener('click', () => {
    expanded = !expanded;
    renderGrid();
    if (!expanded) {
      document.getElementById('arquivo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      expanded = false;
      renderGrid();
    });
  });

  let lastFocused = null;

  function getFocusable() {
    return Array.from(lightbox.querySelectorAll('button, [href], img[tabindex]'))
      .filter(el => el.offsetParent !== null || el === document.activeElement);
  }

  function openLightbox(group, angle) {
    activeGroup = group;
    activeAngle = angle;
    lastFocused = document.activeElement;
    showCurrent();
    lightbox.classList.add('open');
    document.querySelectorAll('body > :not(#lightbox)').forEach(el => { el.inert = true; });
    const focusable = getFocusable();
    (focusable[0] || lightbox).focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.querySelectorAll('body > :not(#lightbox)').forEach(el => { el.inert = false; });
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function showCurrent() {
    lightboxImg.src = activeGroup.images[activeAngle];
    lightboxImg.alt = activeGroup.alt;
  }

  function step(dir) {
    if (!activeGroup) return;
    const n = activeGroup.images.length;
    activeAngle = (activeAngle + dir + n) % n;
    showCurrent();
  }

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
  document.querySelector('.lightbox-next').addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  applyAgendaStatus();
  updateTabLabels();
  renderGrid();
})();
