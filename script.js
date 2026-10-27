const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================
   SCROLL PROGRESS + NAVBAR
   ============================ */
const scrollProgress = document.getElementById('scrollProgress');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================
   MOBILE MENU
   ============================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
}
hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

/* ============================
   THEME TOGGLE
   ============================ */
const root = document.documentElement;

function isDark() {
  if (root.dataset.theme) return root.dataset.theme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function toggleTheme() {
  const next = isDark() ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
}
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

/* ============================
   HERO IDENTITY SWITCHER
   Each word wipes its photo into the plate.
   The accent rule fills as the autoplay countdown.
   ============================ */
const IDENTITY_COUNT = 3;
const CYCLE_MS = 5000;
const heroTitle = document.querySelector('.hero-title');
const identityBtns = document.querySelectorAll('.identity');
const plateImgs = document.querySelectorAll('.plate-img');
let currentIdentity = 0;
let identityTimer = null;

function showIdentity(i) {
  if (i === currentIdentity) return;
  plateImgs.forEach(img => img.classList.toggle('is-active', Number(img.dataset.identity) === i));
  syncTerminal(i);
  identityBtns.forEach(btn => {
    const on = Number(btn.dataset.identity) === i;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  currentIdentity = i;
}

function pickIdentity(i) {
  clearInterval(identityTimer); // the visitor has taken over
  heroTitle.classList.remove('is-playing');
  showIdentity(i);
}

identityBtns.forEach(btn => btn.addEventListener('click', () => pickIdentity(Number(btn.dataset.identity))));

if (!prefersReducedMotion) {
  heroTitle.style.setProperty('--cycle', `${CYCLE_MS}ms`);
  heroTitle.classList.add('is-playing');
  identityTimer = setInterval(() => showIdentity((currentIdentity + 1) % IDENTITY_COUNT), CYCLE_MS);
}

/* ============================
   STACK LAYERS
   ============================ */
const stackVisual = document.querySelector('.stack-visual');
const stackItems = document.querySelectorAll('.stack-item');
const layers = document.querySelectorAll('.layer');

function setLayer(i) {
  stackItems.forEach(item => item.classList.toggle('is-active', item.dataset.layer === String(i)));
  layers.forEach(layer => layer.classList.toggle('is-active', layer.dataset.layer === String(i)));
}
stackItems.forEach(item => {
  ['mouseenter', 'focus', 'click'].forEach(evt => item.addEventListener(evt, () => setLayer(item.dataset.layer)));
});
setLayer(0);

new IntersectionObserver(([entry], obs) => {
  if (!entry.isIntersecting) return;
  stackVisual.classList.add('assembled');
  setTimeout(() => stackVisual.classList.add('settled'), 900);
  obs.disconnect();
}, { threshold: 0.3 }).observe(stackVisual);

/* ============================
   STAT COUNT-UP
   ============================ */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const duration = prefersReducedMotion ? 0 : 1400;
    const start = performance.now();
    function tick(now) {
      const progress = duration ? Math.min((now - start) / duration, 1) : 1;
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((el) => statObserver.observe(el));

/* ============================
   HERO TERMINAL
   Local time, and a command that follows the active identity
   ============================ */
const localTime = document.getElementById('localTime');
function updateTime() {
  localTime.textContent = new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', weekday: 'short'
  });
}
updateTime();
setInterval(updateTime, 30000);

const typedEl = document.getElementById('typed');
const whoEls = document.querySelectorAll('.who');
const identityCommands = ['python eval_judge.py --all', 'git commit -m "ship it"', 'vim case-study.md'];
let typer = null;

function syncTerminal(i) {
  whoEls.forEach(el => el.classList.toggle('is-on', Number(el.dataset.identity) === i));
  clearInterval(typer);
  const cmd = identityCommands[i];
  if (prefersReducedMotion) { typedEl.textContent = cmd; return; }
  let n = 0;
  typedEl.textContent = '';
  typer = setInterval(() => {
    typedEl.textContent = cmd.slice(0, ++n);
    if (n === cmd.length) clearInterval(typer);
  }, 45);
}
syncTerminal(0);

/* ============================
   WORKSPACE HOTSPOTS
   ============================ */
const hotspots = document.querySelectorAll('.hotspot');
const hotspotCard = document.getElementById('hotspotCard');

hotspots.forEach(spot => {
  spot.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = spot.classList.contains('is-open');
    hotspots.forEach(s => s.classList.remove('is-open'));
    if (wasOpen) {
      hotspotCard.classList.remove('show');
      return;
    }
    spot.classList.add('is-open');
    hotspotCard.querySelector('.hc-title').textContent = spot.dataset.title;
    hotspotCard.querySelector('.hc-body').textContent = spot.dataset.body;
    hotspotCard.classList.add('show');
  });
});
document.addEventListener('click', () => {
  hotspots.forEach(s => s.classList.remove('is-open'));
  hotspotCard.classList.remove('show');
});

/* ============================
   SKILL TRACE
   Click a skill to light up where it was used
   ============================ */
const chips = document.querySelectorAll('.chip');
const skillTrace = document.getElementById('skillTrace');
const chapters = document.querySelectorAll('.chapter');
const projectEl = document.querySelector('.project');

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function usesSkill(scope, term) {
  const re = new RegExp(`(?<![\\w])${escapeRegex(term)}(?![\\w])`, 'i');
  const hitTags = [...scope.querySelectorAll('.tag')].filter(t => re.test(t.textContent));
  const inText = [...scope.querySelectorAll('.chapter-bullets li, .chapter-desc, .build-body p, .project-desc')]
    .some(p => re.test(p.textContent));
  return { hit: hitTags.length > 0 || inText, hitTags };
}

function clearTrace() {
  chips.forEach(c => c.classList.remove('is-active'));
  chapters.forEach(r => r.classList.remove('is-traced', 'is-dimmed'));
  document.querySelectorAll('.tag.is-hit').forEach(t => t.classList.remove('is-hit'));
  skillTrace.innerHTML = '<span class="muted">Select a skill above ↑</span>';
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    if (chip.classList.contains('is-active')) { clearTrace(); return; }
    clearTrace();
    chip.classList.add('is-active');
    const term = chip.dataset.match || chip.textContent.trim();

    const places = [];
    chapters.forEach(row => {
      const { hit, hitTags } = usesSkill(row, term);
      row.classList.toggle('is-traced', hit);
      row.classList.toggle('is-dimmed', !hit);
      hitTags.forEach(t => t.classList.add('is-hit'));
      if (hit) places.push({ name: row.querySelector('.chapter-co').textContent, el: row });
    });
    const proj = usesSkill(projectEl, term);
    proj.hitTags.forEach(t => t.classList.add('is-hit'));
    if (proj.hit) places.push({ name: 'Job Pilot', el: projectEl });

    skillTrace.innerHTML = '';
    const label = document.createElement('b');
    label.textContent = chip.textContent.trim();
    skillTrace.append(label, document.createTextNode(places.length ? ' →' : ' → used in coursework and personal exploration. Ask me about it.'));
    places.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'trace-co';
      btn.textContent = p.name;
      btn.addEventListener('click', () => scrollToEl(p.el));
      skillTrace.append(btn);
    });
  });
});

/* ============================
   CAREER JOURNEY MAP
   The avatar travels to the chapter in view
   ============================ */
const STATIONS = [[265, 75], [150, 140], [250, 205], [120, 270]];
const traveler = document.getElementById('traveler');
const mapProgress = document.getElementById('mapProgress');
const stations = document.querySelectorAll('.station');
const chapterLinks = document.querySelectorAll('.chapter-nav a');

// Cumulative route length at each station, for drawing progress
const cumLengths = STATIONS.reduce((acc, [x, y], i) => {
  if (i === 0) return [0];
  const [px, py] = STATIONS[i - 1];
  return [...acc, acc[i - 1] + Math.hypot(x - px, y - py)];
}, []);
const routeLength = cumLengths[cumLengths.length - 1];
mapProgress.style.strokeDasharray = routeLength;

function setChapter(i) {
  const [x, y] = STATIONS[i];
  traveler.style.transform = `translate(${x}px, ${y - 37}px)`;
  mapProgress.style.strokeDashoffset = routeLength - cumLengths[i];
  stations.forEach((s, n) => s.setAttribute('data-active', String(n === i)));
  chapterLinks.forEach((a, n) => {
    if (n === i) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
}
setChapter(0);

const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setChapter(Number(entry.target.dataset.chapter));
  });
}, { rootMargin: '-35% 0px -60% 0px' });
chapters.forEach(ch => chapterObserver.observe(ch));

/* ============================
   TEXT-TO-SCENARIO DEMO
   Types a crash description, then lights each stage
   ============================ */
const t2sTyped = document.getElementById('t2sTyped');
const t2sSteps = document.querySelectorAll('.t2s-flow li');
const crashReports = [
  'A sedan brakes hard at a junction as a cyclist crosses from the right.',
  'An SUV merges into a slower lane and clips a truck in its blind spot.',
  'A pedestrian steps out from behind a parked van on a wet urban road.'
];
let reportIndex = 0;
let t2sStarted = false;

function runT2s() {
  const text = crashReports[reportIndex];
  t2sSteps.forEach(s => s.classList.remove('is-lit'));
  let i = 0;
  const typer = setInterval(() => {
    t2sTyped.textContent = text.slice(0, ++i);
    if (i < text.length) return;
    clearInterval(typer);
    t2sSteps.forEach((step, n) => setTimeout(() => step.classList.add('is-lit'), 450 * (n + 1)));
    setTimeout(() => {
      reportIndex = (reportIndex + 1) % crashReports.length;
      runT2s();
    }, 450 * t2sSteps.length + 2600);
  }, 32);
}

if (prefersReducedMotion) {
  t2sTyped.textContent = crashReports[0];
  t2sSteps.forEach(s => s.classList.add('is-lit'));
} else {
  new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting || t2sStarted) return;
    t2sStarted = true;
    runT2s();
    obs.disconnect();
  }, { threshold: 0.4 }).observe(document.querySelector('.t2s'));
}

/* ============================
   COPY EMAIL + TOAST
   ============================ */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

const EMAIL = 'santhoshiks73@gmail.com';
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    showToast('Email copied ✓');
  } catch (e) {
    window.location.href = `mailto:${EMAIL}`;
  }
}
document.getElementById('copyEmail').addEventListener('click', copyEmail);

/* ============================
   SCROLL REVEAL
   ============================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll(':scope > .reveal')];
    const delay = Math.max(0, siblings.indexOf(entry.target)) * 80;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const contact = document.getElementById('contact');
new IntersectionObserver(([entry]) => {
  contact.classList.toggle('in-view', entry.isIntersecting);
}, { threshold: 0.2 }).observe(contact);

/* ============================
   ACTIVE NAV LINK HIGHLIGHT
   ============================ */
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ============================
   SMOOTH SCROLL OFFSET
   (accounts for fixed navbar)
   ============================ */
function scrollToEl(el) {
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.getElementById(anchor.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
  });
});

/* ============================
   COMMAND PALETTE (⌘K / Ctrl+K)
   ============================ */
const palette = document.getElementById('palette');
const paletteInput = document.getElementById('paletteInput');
const paletteList = document.getElementById('paletteList');

const go = id => () => scrollToEl(document.getElementById(id));
const paletteItems = [
  { label: 'Home', hint: 'section', run: go('hero') },
  { label: 'About', hint: 'section', run: go('about') },
  { label: 'Work experience', hint: 'section', run: go('experience') },
  { label: 'Tempero.tech · text-to-scenario pipeline', hint: 'work', run: go('career-tempero') },
  { label: 'PayPal', hint: 'work', run: go('career-paypal') },
  { label: 'Configit', hint: 'work', run: go('career-configit') },
  { label: 'Blue Yonder', hint: 'work', run: go('career-blueyonder') },
  { label: 'Projects', hint: 'section', run: go('projects') },
  { label: 'Toolkit', hint: 'section', run: go('skills') },
  { label: 'Education & certifications', hint: 'section', run: go('education') },
  { label: 'Contact', hint: 'section', run: go('contact') },
  { label: 'Copy email address', hint: 'action', run: copyEmail },
  { label: 'Download resume', hint: 'action', run: () => { const a = document.createElement('a'); a.href = 'Santhoshi_CV.pdf'; a.download = ''; a.click(); } },
  { label: 'Toggle dark mode', hint: 'action', run: toggleTheme },
  { label: 'Open LinkedIn', hint: 'link', run: () => window.open('https://www.linkedin.com/in/santhoshi-k-s/', '_blank', 'noopener') },
  { label: 'Try Job Pilot', hint: 'link', run: () => window.open('https://job-pilot-gchl.onrender.com', '_blank', 'noopener') }
];
let filtered = paletteItems;
let selected = 0;

function renderPalette() {
  const q = paletteInput.value.trim().toLowerCase();
  filtered = paletteItems.filter(item => item.label.toLowerCase().includes(q));
  selected = Math.min(selected, Math.max(filtered.length - 1, 0));
  paletteList.innerHTML = '';
  if (!filtered.length) {
    paletteList.innerHTML = '<li class="palette-empty">Nothing matches that. Try “work” or “email”.</li>';
    return;
  }
  filtered.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'palette-item';
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', String(i === selected));
    li.innerHTML = `<span></span><span class="mono">${item.hint}</span>`;
    li.firstChild.textContent = item.label;
    li.addEventListener('mousemove', () => { if (selected !== i) { selected = i; renderPalette(); } });
    li.addEventListener('click', () => runItem(i));
    paletteList.appendChild(li);
  });
  paletteList.children[selected]?.scrollIntoView({ block: 'nearest' });
}

function openPalette() {
  palette.hidden = false;
  paletteInput.value = '';
  selected = 0;
  renderPalette();
  paletteInput.focus();
}
function closePalette() { palette.hidden = true; }
function runItem(i) {
  const item = filtered[i];
  if (!item) return;
  closePalette();
  item.run();
}

document.getElementById('paletteOpen').addEventListener('click', openPalette);
palette.querySelector('[data-close]').addEventListener('click', closePalette);
paletteInput.addEventListener('input', () => { selected = 0; renderPalette(); });

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    palette.hidden ? openPalette() : closePalette();
    return;
  }
  if (palette.hidden) return;
  if (e.key === 'Escape') closePalette();
  else if (e.key === 'ArrowDown') { e.preventDefault(); selected = (selected + 1) % Math.max(filtered.length, 1); renderPalette(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); selected = (selected - 1 + filtered.length) % Math.max(filtered.length, 1); renderPalette(); }
  else if (e.key === 'Enter') { e.preventDefault(); runItem(selected); }
});

document.getElementById('year').textContent = new Date().getFullYear();
