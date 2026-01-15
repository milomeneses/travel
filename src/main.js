import './styles/main.css';

const app = document.querySelector('#app');

const partialModules = import.meta.glob('./partials/**/*.html', { eager: true, as: 'raw' });

const getLocale = () => (window.location.pathname.startsWith('/es') ? 'es' : 'en');

const getValue = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);

const renderTemplate = (template, data) =>
  template.replace(/{{\s*([\w.-]+)\s*}}/g, (_, key) => String(getValue(data, key)));

const buildLayout = (data) => {
  const order = [
    './partials/header.html',
    './partials/sections/hero.html',
    './partials/sections/chapters.html',
    './partials/sections/things.html',
    './partials/sections/cta-links.html',
    './partials/sections/faq.html',
    './partials/sections/contact.html',
    './partials/footer.html'
  ];

  const html = order
    .map((path) => renderTemplate(partialModules[path], data))
    .join('\n');

  app.innerHTML = html;
};

const renderLists = (data) => {
  const chaptersContainer = document.querySelector('[data-list="chapters"]');
  if (chaptersContainer) {
    chaptersContainer.innerHTML = data.chaptersList
      .map(
        (item) => `
        <article class="chapter-card">
          <span class="chapter-number">${item.number}</span>
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
        </article>`
      )
      .join('');
  }

  const thingsContainer = document.querySelector('[data-list="things"]');
  if (thingsContainer) {
    const itemMarkup = data.thingsList
      .map((item) => {
        const media = item.video
          ? `<video src="${item.video}" muted autoplay loop playsinline></video>`
          : `<img src="${item.image}" alt="${item.title}" width="600" height="750" loading="lazy" />`;
        return `
        <article class="thing-card">
          <div class="thing-media">
            ${media}
            <figcaption class="thing-caption">
              <h3>${item.title}</h3>
              <p>${item.copy}</p>
            </figcaption>
          </div>
          <div class="thing-body">
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
          </div>
        </article>`;
      })
      .join('');

    const duplicateMarkup = data.thingsList
      .map((item) => {
        const media = item.video
          ? `<video src="${item.video}" muted autoplay loop playsinline></video>`
          : `<img src="${item.image}" alt="${item.title}" width="600" height="750" loading="lazy" />`;
        return `
        <article class="thing-card" aria-hidden="true">
          <div class="thing-media">
            ${media}
            <figcaption class="thing-caption">
              <h3>${item.title}</h3>
              <p>${item.copy}</p>
            </figcaption>
          </div>
          <div class="thing-body">
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
          </div>
        </article>`;
      })
      .join('');

    thingsContainer.innerHTML = itemMarkup + duplicateMarkup;
  }

  const ctaContainer = document.querySelector('[data-list="ctaLinks"]');
  if (ctaContainer) {
    ctaContainer.innerHTML = data.ctaLinks
      .map(
        (item) => `
        <article class="cta-card">
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
          <a class="text-link" href="${item.link}" target="_blank" rel="noreferrer">
            ${item.label}
          </a>
        </article>`
      )
      .join('');
  }

  const faqContainer = document.querySelector('[data-list="faq"]');
  if (faqContainer) {
    faqContainer.innerHTML = data.faqList
      .map(
        (item) => `
        <details>
          <summary>${item.question}</summary>
          <p>${item.answer}</p>
        </details>`
      )
      .join('');
  }
};

const bindNav = () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('a[data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
};

const bindScrollSpy = () => {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navAnchors = document.querySelectorAll('.nav-links a[data-scroll]');

  if (!sections.length || !navAnchors.length) return;

  const updateActive = () => {
    const scrollPosition = window.scrollY + 140;
    let currentId = sections[0]?.id;

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navAnchors.forEach((anchor) => {
      const href = anchor.getAttribute('href');
      const isActive = href === `#${currentId}`;
      anchor.classList.toggle('is-active', isActive);
    });
  };

  updateActive();
  window.addEventListener('scroll', updateActive, { passive: true });
};

const bindReveal = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const loadContent = async (locale) => {
  const response = await fetch(`/data/${locale}.json`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${locale} content.`);
  }
  return response.json();
};

const init = async () => {
  try {
    const locale = getLocale();
    const data = await loadContent(locale);
    buildLayout(data);
    renderLists(data);
    bindNav();
    bindScrollSpy();
    bindReveal();
  } catch (error) {
    app.innerHTML = '<p style=\"padding:2rem;\">Content failed to load.</p>';
    console.error(error);
  }
};

init();
