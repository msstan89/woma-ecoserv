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
    title: 'Spălare panouri fotovoltaice de <em class="not-italic text-accent">clasă industrială</em>',
    desc: 'Utilaj Messersi ROBOKLIN, perie 3,5 m cu senzori, apă demineralizată. Randament crescut cu până la 40%.',
  },
  industrial: {
    title: 'Curățare industrială <em class="not-italic text-accent">6 – 2800 bari</em>',
    desc: 'Pompe URACA și HAMMELMANN pentru rafinării și instalații petrochimice. Lukoil, OMV Petrom, Rompetrol.',
  },
};

const header = document.getElementById('header');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const heroSlides = document.querySelectorAll('.hero-slide');
const heroTabs = document.querySelectorAll('.hero-tab');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
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
  heroSlides.forEach((s) => s.classList.toggle('active', s.dataset.slide === target));
  heroTabs.forEach((t) => t.classList.toggle('active', t.dataset.target === target));
}

heroTabs.forEach((tab) => tab.addEventListener('click', () => switchHero(tab.dataset.target)));

let autoIdx = 0;
setInterval(() => {
  autoIdx = (autoIdx + 1) % 2;
  switchHero(autoIdx === 0 ? 'solar' : 'industrial');
}, 9000);

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('hidden');
  navToggle.setAttribute('aria-expanded', !open);
});

document.querySelectorAll('.mobile-link').forEach((a) => {
  a.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-service]').forEach((el) => {
  el.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = el.dataset.service;
  });
});

document.querySelectorAll('#faq-accordion .faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('#faq-accordion .faq-item').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.querySelector('.btn-text').classList.toggle('hidden', loading);
  submitBtn.querySelector('.btn-loading').classList.toggle('hidden', !loading);
}

modalClose?.addEventListener('click', () => {
  successModal.classList.add('hidden');
  document.body.style.overflow = '';
});

successModal?.addEventListener('click', (e) => {
  if (e.target === successModal) {
    successModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
});

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.classList.add('hidden');

  if (contactForm.querySelector('[name="_honey"]')?.value) return;

  const fd = new FormData(contactForm);
  const serviceKey = fd.get('service');
  const serviceLabel = SERVICE_LABELS[serviceKey] || serviceKey;

  setLoading(true);

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        service: serviceLabel,
        message: fd.get('message'),
        _subject: `Solicitare nouă — ${serviceLabel} — Woma Ecoserv`,
        _template: 'table',
        _captcha: 'false',
      }),
    });
    const data = await res.json();
    if (!res.ok || data.success === false) throw new Error();
    contactForm.reset();
    successModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch {
    formError.textContent = 'Nu am putut trimite mesajul. Sună-ne la 0722 234 114.';
    formError.classList.remove('hidden');
  } finally {
    setLoading(false);
  }
});