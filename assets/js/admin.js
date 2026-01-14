const storageKey = 'stkittsCampaignConfig';
const authKey = 'stkittsCampaignAuth';
const apiConfigUrl = 'api/get-config.php';
const apiSaveUrl = 'api/save-config.php';

const demoUsers = [
  { email: 'admin@stkitts.demo', password: 'StKitts2025!' },
  { email: 'editor@stkitts.demo', password: 'IslandEdit24!' },
  { email: 'marketing@stkitts.demo', password: 'GenZCampaign!' },
];

const defaultConfig = {
  logoText: 'ST. KITTS ISLAND',
  logoTagline: 'Find your next story',
  menuHow: 'https://www.britishairways.com/content/flights/caribbean/st-kitts-and-nevis#search',
  menuPlan: 'https://www.visitstkitts.com/plan-your-trip/gettingaround-st-kitts',
  menuEta: 'https://www.knatravelform.kn/en',
  heroTitle: 'Touch down where culture, sea, and soul collide.',
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

const getStoredConfig = () => {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return {};
  }
  return JSON.parse(saved);
};

const loadRemoteConfig = () =>
  fetch(apiConfigUrl, { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);

const loginPanel = document.querySelector('[data-login-panel]');
const editorPanel = document.querySelector('[data-editor-panel]');
const loginForm = document.querySelector('[data-login-form]');
const saveButton = document.querySelector('[data-save]');
const logoutButton = document.querySelector('[data-logout]');
const contentGrid = document.querySelector('[data-content-grid]');

const showEditor = () => {
  if (loginPanel) loginPanel.classList.add('hidden');
  if (editorPanel) editorPanel.classList.remove('hidden');
};

const showLogin = () => {
  if (loginPanel) loginPanel.classList.remove('hidden');
  if (editorPanel) editorPanel.classList.add('hidden');
};

const isAuthenticated = () => localStorage.getItem(authKey) === 'true';

const updateInputs = (config) => {
  document.querySelectorAll('[data-config]').forEach((input) => {
    const key = input.dataset.config;
    input.value = config[key] || '';
  });
};

const buildEditableBlocks = (config) => {
  if (!contentGrid) return;
  contentGrid.innerHTML = '';
  config.contentBlocks.forEach((block, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'editable';
    wrapper.contentEditable = true;
    wrapper.dataset.blockIndex = index;
    wrapper.innerHTML = `<h3>${block.title}</h3><p>${block.copy}</p>`;
    contentGrid.appendChild(wrapper);
  });
};

const getEditedBlocks = () => {
  if (!contentGrid) return [];
  return Array.from(contentGrid.querySelectorAll('.editable')).map((block) => {
    const title = block.querySelector('h3')?.textContent || 'Untitled';
    const copy = block.querySelector('p')?.textContent || '';
    return { title, copy };
  });
};

const load = async () => {
  const stored = getStoredConfig();
  const remote = await loadRemoteConfig();
  const config = { ...defaultConfig, ...stored, ...(remote || {}) };
  updateInputs(config);
  buildEditableBlocks(config);
};

const save = () => {
  const config = { ...defaultConfig, ...getStoredConfig() };
  document.querySelectorAll('[data-config]').forEach((input) => {
    const key = input.dataset.config;
    config[key] = input.value.trim();
  });

  const editedBlocks = getEditedBlocks();
  config.contentBlocks = config.contentBlocks.map((block, index) => ({
    ...block,
    title: editedBlocks[index]?.title || block.title,
    copy: editedBlocks[index]?.copy || block.copy,
  }));

  localStorage.setItem(storageKey, JSON.stringify(config));

  fetch(apiSaveUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Save failed');
      }
      return response.json();
    })
    .then(() => {
      alert('Changes saved. Refresh the homepage to see updates.');
    })
    .catch(() => {
      alert('Saved locally. Server save unavailable.');
    });
};

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const email = data.get('email');
    const password = data.get('password');
    const match = demoUsers.find(
      (user) => user.email === email && user.password === password
    );
    if (match) {
      localStorage.setItem(authKey, 'true');
      showEditor();
      load();
    } else {
      alert('Invalid demo credentials.');
    }
  });
}

if (saveButton) {
  saveButton.addEventListener('click', () => {
    save();
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem(authKey);
    showLogin();
  });
}

const toolbar = document.querySelector('.toolbar');
if (toolbar) {
  toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const command = button.dataset.format;
    if (command === 'createLink') {
      const url = prompt('Enter URL');
      if (url) {
        document.execCommand(command, false, url);
      }
      return;
    }
    document.execCommand(command, false, null);
  });
}

if (isAuthenticated()) {
  showEditor();
  load();
} else {
  showLogin();
}
