const loginCard = document.querySelector('#login-card');
const adminPanel = document.querySelector('#admin-panel');
const loginButton = document.querySelector('#login-button');
const loginStatus = document.querySelector('#login-status');
const passwordInput = document.querySelector('#password-input');
const localeSelect = document.querySelector('#locale-select');
const refreshButton = document.querySelector('#refresh-button');
const contentForm = document.querySelector('#content-form');
const saveStatus = document.querySelector('#save-status');
const chaptersList = document.querySelector('#chapters-list');
const thingsList = document.querySelector('#things-list');
const addThingButton = document.querySelector('#add-thing');

let currentData = null;
let currentLocale = 'en';
let sessionPasswordHash = null;

const encoder = new TextEncoder();

const hashPassword = async (value) => {
  const data = encoder.encode(value);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const showStatus = (element, message, type) => {
  element.textContent = message;
  element.className = `status ${type}`;
};

const fetchContent = async (locale) => {
  const response = await fetch(`/data/${locale}.json`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('No se pudo cargar el JSON.');
  }
  return response.json();
};

const renderChapters = (chapters) => {
  chaptersList.innerHTML = chapters
    .map(
      (chapter, index) => `
      <div class="item-card stack" data-chapter-index="${index}">
        <div class="inline">
          <strong>Chapter ${chapter.number}</strong>
        </div>
        <label>
          Title
          <input type="text" name="chapter-title-${index}" value="${chapter.title}" required />
        </label>
        <label>
          Copy
          <textarea name="chapter-copy-${index}" required>${chapter.copy}</textarea>
        </label>
      </div>`
    )
    .join('');
};

const renderThings = (things) => {
  thingsList.innerHTML = things
    .map(
      (thing, index) => `
      <div class="item-card stack" data-thing-index="${index}">
        <div class="inline" style="justify-content: space-between;">
          <strong>Item ${index + 1}</strong>
          <button class="btn secondary" type="button" data-remove-thing="${index}">Remove</button>
        </div>
        <label>
          Title
          <input type="text" name="thing-title-${index}" value="${thing.title}" required />
        </label>
        <label>
          Copy
          <textarea name="thing-copy-${index}" required>${thing.copy}</textarea>
        </label>
        <label>
          Image URL
          <input type="url" name="thing-image-${index}" value="${thing.image}" required />
        </label>
      </div>`
    )
    .join('');
};

const fillForm = (data) => {
  currentData = data;
  contentForm.elements['hero-title'].value = data.hero.title;
  contentForm.elements['hero-subtitle'].value = data.hero.subtitle;
  contentForm.elements['hero-primary-cta'].value = data.hero.primaryCta;
  contentForm.elements['hero-secondary-cta'].value = data.hero.secondaryCta ?? '';

  contentForm.elements['nav-things-label'].value = data.nav.things;
  contentForm.elements['nav-how-label'].value = data.nav.how;
  contentForm.elements['nav-how-link'].value = data.nav.howLink;
  contentForm.elements['nav-plan-label'].value = data.nav.plan;
  contentForm.elements['nav-plan-link'].value = data.nav.planLink;
  contentForm.elements['nav-eta-label'].value = data.nav.eta;
  contentForm.elements['nav-eta-link'].value = data.nav.etaLink;

  renderChapters(data.chaptersList);
  renderThings(data.thingsList);
};

const buildPayload = () => {
  const hero = {
    ...currentData.hero,
    title: contentForm.elements['hero-title'].value.trim(),
    subtitle: contentForm.elements['hero-subtitle'].value.trim(),
    primaryCta: contentForm.elements['hero-primary-cta'].value.trim(),
    secondaryCta: contentForm.elements['hero-secondary-cta'].value.trim()
  };

  const chaptersList = currentData.chaptersList.map((chapter, index) => ({
    ...chapter,
    title: contentForm.elements[`chapter-title-${index}`].value.trim(),
    copy: contentForm.elements[`chapter-copy-${index}`].value.trim()
  }));

  const thingsCards = Array.from(thingsList.querySelectorAll('[data-thing-index]'));
  const thingsListValue = thingsCards.map((card) => {
    const index = card.dataset.thingIndex;
    return {
      title: contentForm.elements[`thing-title-${index}`].value.trim(),
      copy: contentForm.elements[`thing-copy-${index}`].value.trim(),
      image: contentForm.elements[`thing-image-${index}`].value.trim()
    };
  });

  const nav = {
    ...currentData.nav,
    things: contentForm.elements['nav-things-label'].value.trim(),
    how: contentForm.elements['nav-how-label'].value.trim(),
    howLink: contentForm.elements['nav-how-link'].value.trim(),
    plan: contentForm.elements['nav-plan-label'].value.trim(),
    planLink: contentForm.elements['nav-plan-link'].value.trim(),
    eta: contentForm.elements['nav-eta-label'].value.trim(),
    etaLink: contentForm.elements['nav-eta-link'].value.trim()
  };

  return {
    ...currentData,
    hero,
    chaptersList,
    thingsList: thingsListValue,
    nav
  };
};

const isForbiddenThing = (title) => /romance|rum master/i.test(title);

const saveContent = async () => {
  const payload = buildPayload();

  if (payload.thingsList.some((item) => isForbiddenThing(item.title))) {
    throw new Error('Romance y Rum Master no están permitidos en Things To Do.');
  }

  const response = await fetch('/save-content.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locale: currentLocale,
      passwordHash: sessionPasswordHash,
      content: payload
    })
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || 'No se pudo guardar.');
  }

  return result;
};

loginButton.addEventListener('click', async () => {
  loginStatus.textContent = '';
  const value = passwordInput.value;
  if (!value) {
    showStatus(loginStatus, 'Ingresa la contraseña.', 'error');
    return;
  }

  const hash = await hashPassword(value);
  try {
    await verifyPassword(hash);
    sessionPasswordHash = hash;
    loginCard.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    await loadLocale(currentLocale);
  } catch (error) {
    showStatus(loginStatus, error.message, 'error');
  }
});

const verifyPassword = async (hash) => {
  const response = await fetch('/save-content.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'verify', passwordHash: hash })
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || 'Contraseña incorrecta.');
  }
  return result;
};

const loadLocale = async (locale) => {
  try {
    currentLocale = locale;
    const data = await fetchContent(locale);
    fillForm(data);
    showStatus(saveStatus, '', '');
  } catch (error) {
    showStatus(saveStatus, error.message, 'error');
  }
};

localeSelect.addEventListener('change', async (event) => {
  await loadLocale(event.target.value);
});

refreshButton.addEventListener('click', async () => {
  await loadLocale(currentLocale);
});

addThingButton.addEventListener('click', () => {
  const existingIndexes = Array.from(thingsList.querySelectorAll('[data-thing-index]')).map(
    (card) => Number(card.dataset.thingIndex)
  );
  const nextIndex = existingIndexes.length ? Math.max(...existingIndexes) + 1 : 0;
  const wrapper = document.createElement('div');
  wrapper.className = 'item-card stack';
  wrapper.dataset.thingIndex = String(nextIndex);
  wrapper.innerHTML = `
    <div class="inline" style="justify-content: space-between;">
      <strong>Item ${nextIndex + 1}</strong>
      <button class="btn secondary" type="button" data-remove-thing="${nextIndex}">Remove</button>
    </div>
    <label>
      Title
      <input type="text" name="thing-title-${nextIndex}" required />
    </label>
    <label>
      Copy
      <textarea name="thing-copy-${nextIndex}" required></textarea>
    </label>
    <label>
      Image URL
      <input type="url" name="thing-image-${nextIndex}" required />
    </label>
  `;
  thingsList.appendChild(wrapper);
});

thingsList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-thing]');
  if (!button) return;
  const index = button.dataset.removeThing;
  const card = thingsList.querySelector(`[data-thing-index="${index}"]`);
  card?.remove();
});

contentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  saveStatus.textContent = '';
  try {
    await saveContent();
    showStatus(saveStatus, 'Guardado correctamente.', 'success');
  } catch (error) {
    showStatus(saveStatus, error.message, 'error');
  }
});
