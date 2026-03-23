/* ============================
   NAVBAR — scroll effect
   ============================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================
   MOBILE MENU
   ============================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close on link click
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ============================
   ROTATING TITLE
   ============================ */
const titles = [
  'Software Engineer',
  'Data Scientist',
  'AI Systems Builder',
  'Cloud Architect',
];
let titleIndex = 0;
const rotatingEl = document.getElementById('rotatingTitle');

function rotateTitles() {
  rotatingEl.style.opacity = '0';
  rotatingEl.style.transform = 'translateY(8px)';
  setTimeout(() => {
    titleIndex = (titleIndex + 1) % titles.length;
    rotatingEl.textContent = titles[titleIndex];
    rotatingEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    rotatingEl.style.opacity = '1';
    rotatingEl.style.transform = 'translateY(0)';
  }, 300);
}

rotatingEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
setInterval(rotateTitles, 3000);

/* ============================
   SCROLL REVEAL
   ============================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ============================
   ACTIVE NAV LINK HIGHLIGHT
   ============================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================
   SMOOTH SCROLL OFFSET
   (accounts for fixed navbar)
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
