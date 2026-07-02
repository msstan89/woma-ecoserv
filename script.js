document.body.classList.add('js');

const FORM_EMAIL = 'woma_industries@yahoo.com';
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;

const SERVICE_LABELS = {
  solar: 'Spălare panouri fotovoltaice',
  mowing: 'Cosire / spații verzi',
  refinery: 'Curățare rafinărie / industrială',
  hydro: 'Hidrosablare',
  other: 'Altul',
};

const heroContent = {
  solar: {
    title: 'Spălare panouri fotovoltaice de <em>clasă industrială</em>',
    desc: 'Utilaj Messersi ROBOKLIN, perie 3,5 m cu senzori, apă demineralizată. Randament crescut cu până la 40%.',
    cta: 'Ofertă parc solar',
  },
  industrial: {
    title: 'Curățare industrială <em>6 – 2800 bari</em>',
    desc: 'Pompe URACA și HAMMELMANN pentru rafinării și instalații petrochimice. Lukoil, OMV Petrom, Rompetrol.',
    cta: 'Ofertă industrială',
  },
};

const header = document.getElementById('header');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const heroCta = document.getElementById('hero-cta');
const heroSlides = document.querySelectorAll('.hero-slide');
const heroTabs = document.querySelectorAll('.hero-tab');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formError = document.getElementById('form-error');
const successModal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');
const serviceSelect = document.getElementById('service');

function switchHero(target) {
  const c = heroContent[target];
  if (!c) return;
  heroTitle.innerHTML = c.title;
  heroDesc.textContent = c.desc;
  heroCta.textContent = c.cta;
  heroSlides.forEach((s) => s.classList.toggle('active', s.dataset.slide === target));
  heroTabs.forEach((t) => t.classList.toggle('active', t.dataset.target === target));
}

heroTabs.forEach((tab) => {
  tab.addEventListener('click', () => switchHero(tab.dataset.target));
});

let autoIdx = 0;
setInterval(() => {
  autoIdx = (autoIdx + 1) % 2;
  switchHero(autoIdx === 0 ? 'solar' : 'industrial');
}, 9000);

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.card-link[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    serviceSelect.value = link.dataset.service;
  });
});

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.querySelector('.btn-text').hidden = loading;
  submitBtn.querySelector('.btn-loading').hidden = !loading;
}

function showModal() {
  successModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  successModal.hidden = true;
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', hideModal);
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) hideModal();
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.hidden = true;

  if (contactForm.querySelector('[name="_honey"]')?.value) return;

  const fd = new FormData(contactForm);
  const serviceKey = fd.get('service');
  const serviceLabel = SERVICE_LABELS[serviceKey] || serviceKey;

  const body = {
    name: fd.get('name'),
    phone: fd.get('phone'),
    email: fd.get('email'),
    service: serviceLabel,
    message: fd.get('message'),
    _subject: `Solicitare nouă — ${serviceLabel} — Woma Ecoserv`,
    _template: 'table',
    _captcha: 'false',
  };

  setLoading(true);

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || 'Eroare la trimitere');
    }

    contactForm.reset();
    showModal();
  } catch {
    formError.textContent = 'Nu am putut trimite mesajul. Sună-ne la 0722 234 114 sau scrie la woma_industries@yahoo.com';
    formError.hidden = false;
  } finally {
    setLoading(false);
  }
});

const revealSelectors = '.card, .split, .ref-grid, .contact-wrap, .block-head, .about-cards, .faq-list, .equip-cards, .hero-panel';

document.querySelectorAll(revealSelectors).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    },
    { threshold: 0.12 }
  ).observe(el);
});