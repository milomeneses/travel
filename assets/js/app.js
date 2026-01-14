const defaultConfig = {
  logoText: 'St. Kitts',
  logoTagline: 'Find your next story',
  menuHow: 'https://www.britishairways.com/content/flights/caribbean/st-kitts-and-nevis#search',
  menuPlan: 'https://www.visitstkitts.com/plan-your-trip/gettingaround-st-kitts',
  menuEta: 'https://www.knatravelform.kn/en',
  heroTitle: 'Cold on the pitch, chill in St. Kitts.',
  heroCopy:
    'From volcanic hikes to late-night beach sessions, St. Kitts is the island for bold itineraries and story-worthy moments.',
  gaMeasurementId: '',
  gtmContainerId: '',
  gscVerification: '',
  contentBlocks: [
    {
      id: 'campaign',
      title: 'Why this campaign exists',
      copy:
        'We are spotlighting St. Kitts for Gen Z travelers and Kittitian heritage communities who want to reconnect with the island in a fresh way.',
    },
    {
      id: 'things',
      title: 'Things to do',
      copy: 'The same menu placement as the VSK experience, curated to highlight top Gen Z moments.',
    },
    {
      id: 'places',
      title: 'Places of interest',
      copy: 'Add these to your itinerary for a full island story in one trip.',
    },
  ],
};

const translations = {
  es: {
    'data-hero-eyebrow': 'Gen Z x St. Kitts',
    'data-hero-title': 'Aterriza donde cultura, mar y alma se unen.',
    'data-hero-copy':
      'Desde caminatas volcánicas hasta noches en la playa, St. Kitts es la isla para itinerarios audaces.',
    'data-hero-cta-primary': 'Planear visita',
    'data-hero-cta-secondary': 'Ver actividades',
    'data-campaign-title': 'Por qué existe esta campaña',
    'data-campaign-copy':
      'Destacamos St. Kitts para viajeros Gen Z y jóvenes de herencia kittitiana que desean reconectar con la isla.',
    'data-things-title': 'Cosas para hacer',
    'data-things-copy':
      'El mismo menú del sitio VSK, curado para los momentos Gen Z más importantes.',
    'data-places-title': 'Lugares de interés',
    'data-places-copy': 'Agrega estos puntos a tu itinerario para una visita completa.',
    'data-plan-title': 'Planear tu visita',
    'data-plan-copy':
      'El inglés es el idioma principal; también tendrás soporte en español en este sitio.',
    'data-reserve-title': 'Reserva tu visita',
    'data-reserve-copy':
      'Comparte tus fechas y nuestro equipo te ayudará a crear el viaje perfecto.',
    'data-form-name-label': 'Nombre',
    'data-form-email-label': 'Correo',
    'data-form-dates-label': 'Fechas de viaje',
    'data-form-interest-label': 'Interés',
    'data-form-interest-option-one': 'Aventura',
    'data-form-interest-option-two': 'Cultura',
    'data-form-interest-option-three': 'Herencia',
    'data-form-submit': 'Enviar solicitud',
  },
};

const storageKey = 'stkittsCampaignConfig';
const langKey = 'stkittsCampaignLang';

const getStoredConfig = () => {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return {};
  }
  return JSON.parse(saved);
};

const loadRemoteConfig = () =>
  fetch('api/get-config.php', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);

const updateText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) {
    element.textContent = value;
  }
};

const applyConfig = (config) => {
  updateText('[data-logo-text]', config.logoText);
  updateText('[data-logo-tagline]', config.logoTagline);
  updateText('[data-hero-title]', config.heroTitle);
  updateText('[data-hero-copy]', config.heroCopy);

  const blockMap = {
    campaign: {
      title: '[data-campaign-title]',
      copy: '[data-campaign-copy]',
    },
    things: {
      title: '[data-things-title]',
      copy: '[data-things-copy]',
    },
    places: {
      title: '[data-places-title]',
      copy: '[data-places-copy]',
    },
  };

  config.contentBlocks.forEach((block) => {
    const selectors = blockMap[block.id];
    if (!selectors) return;
    updateText(selectors.title, block.title);
    updateText(selectors.copy, block.copy);
  });

  const menuHow = document.querySelector('[data-menu="how"]');
  const menuPlan = document.querySelector('[data-menu="plan"]');
  const menuEta = document.querySelector('[data-menu="eta"]');

  if (menuHow) menuHow.href = config.menuHow;
  if (menuPlan) menuPlan.href = config.menuPlan;
  if (menuEta) menuEta.href = config.menuEta;

  const planLinkOne = document.querySelector('[data-plan-link-one]');
  const planLinkTwo = document.querySelector('[data-plan-link-two]');
  const planLinkThree = document.querySelector('[data-plan-link-three]');

  if (planLinkOne) planLinkOne.href = config.menuHow;
  if (planLinkTwo) planLinkTwo.href = config.menuPlan;
  if (planLinkThree) planLinkThree.href = config.menuEta;

  const gscMeta = document.getElementById('gsc-meta');
  if (gscMeta && config.gscVerification) {
    gscMeta.content = config.gscVerification;
  }

  const injectGa = () => {
    if (!config.gaMeasurementId) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', config.gaMeasurementId);
  };

  const injectGtm = () => {
    if (!config.gtmContainerId) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtmContainerId}`;
    document.head.appendChild(script);
  };

  injectGa();
  injectGtm();
};

const initialize = async () => {
  const stored = getStoredConfig();
  const remote = await loadRemoteConfig();
  const config = { ...defaultConfig, ...stored, ...(remote || {}) };
  applyConfig(config);
};

const navToggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');

if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

const applyLanguage = (lang) => {
  const entries = translations[lang];
  if (!entries) return;
  Object.entries(entries).forEach(([key, value]) => {
    const element = document.querySelector(`[${key}]`);
    if (element) {
      element.textContent = value;
    }
  });
};

const langToggle = document.querySelector('[data-lang-toggle]');
const currentLang = localStorage.getItem(langKey) || 'en';

if (langToggle) {
  langToggle.addEventListener('click', () => {
    const nextLang = localStorage.getItem(langKey) === 'es' ? 'en' : 'es';
    localStorage.setItem(langKey, nextLang);
    if (nextLang === 'es') {
      applyLanguage('es');
    } else {
      window.location.reload();
    }
  });
}

initialize().then(() => {
  if (currentLang === 'es') {
    applyLanguage('es');
  }
});

const reserveForm = document.querySelector('[data-reserve-form]');
if (reserveForm) {
  reserveForm.addEventListener('submit', (event) => {
    event.preventDefault();
    reserveForm.reset();
    alert('Thanks! We will reach out soon.');
  });
}
