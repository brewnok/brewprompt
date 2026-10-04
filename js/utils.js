// URL helpers
function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function setUrlParam(name, value) {
  const url = new URL(window.location);
  if (value === null || value === undefined || value === '') {
    url.searchParams.delete(name);
  } else {
    url.searchParams.set(name, value);
  }
  window.history.replaceState({}, '', url);
}

// Clipboard
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, using fallback:', err);
    }
  }
  // Fallback for non-secure contexts or older browsers
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  textArea.setAttribute('readonly', '');
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  document.body.removeChild(textArea);
  return success;
}

// Toast notifications
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.innerHTML = type === 'success' 
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' 
    : '!';
  
  const msg = document.createElement('span');
  msg.className = 'toast-message';
  msg.textContent = message;
  
  toast.appendChild(icon);
  toast.appendChild(msg);
  container.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2800);
}

// Number formatting (e.g. 1240 -> "1.2K")
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num < 1000) return num.toString();
  return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
}

// Debounce helper
function debounce(fn, ms = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

// LocalStorage helpers
function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from storage', error);
    return null;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage', error);
  }
}

// Favorites (stored as array of slugs in localStorage key 'brewprompt_favorites')
function getFavorites() {
  return getFromStorage('brewprompt_favorites') || getFromStorage('pv_favorites') || [];
}

function toggleFavorite(slug) {
  const favorites = getFavorites();
  const index = favorites.indexOf(slug);
  let isFav = false;
  
  if (index === -1) {
    favorites.push(slug);
    isFav = true;
  } else {
    favorites.splice(index, 1);
  }
  
  saveToStorage('brewprompt_favorites', favorites);
  return isFav;
}

function isFavorited(slug) {
  const favorites = getFavorites();
  return favorites.includes(slug);
}

// Recently Viewed (stored as array of slugs in localStorage key 'brewprompt_recent', max 10)
function getRecentlyViewed() {
  return getFromStorage('brewprompt_recent') || getFromStorage('pv_recent') || [];
}

function addToRecentlyViewed(slug) {
  let recent = getRecentlyViewed();
  const index = recent.indexOf(slug);
  if (index > -1) {
    recent.splice(index, 1);
  }
  recent.unshift(slug);
  if (recent.length > 10) {
    recent.pop();
  }
  saveToStorage('brewprompt_recent', recent);
}

// Data helpers
function getPromptBySlug(slug) {
  if (!window.PROMPTS) return null;
  return window.PROMPTS.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

function getPromptsByCategory(category) {
  if (!window.PROMPTS) return [];
  return window.PROMPTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

function getRelatedPrompts(prompt, limit = 4) {
  if (!window.PROMPTS || !prompt) return [];
  
  return window.PROMPTS.filter(p => p.slug !== prompt.slug)
    .map(p => {
      let score = 0;
      if (p.category.toLowerCase() === prompt.category.toLowerCase()) score += 4;
      if (p.subcategory.toLowerCase() === prompt.subcategory.toLowerCase()) score += 3;
      const commonTags = p.tags.filter(t => prompt.tags.includes(t));
      score += commonTags.length * 2;
      return { prompt: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || b.prompt.copyCount - a.prompt.copyCount)
    .slice(0, limit)
    .map(item => item.prompt);
}

// Extract [VARIABLES] from prompt text (e.g. [TOPIC], [AUDIENCE])
function extractPlaceholders(text) {
  if (!text) return [];
  const regex = /\[([A-Z][A-Z0-9_]{1,35})\]/g;
  const matches = [...text.matchAll(regex)].map(m => m[1]);
  return [...new Set(matches)];
}

function replacePlaceholders(text, replacements) {
  if (!text) return '';
  return text.replace(/\[([A-Z][A-Z0-9_]{1,35})\]/g, (match, p1) => {
    return (replacements[p1] !== undefined && replacements[p1] !== '') ? replacements[p1] : match;
  });
}

// Theme management
function initTheme() {
  let theme = localStorage.getItem('brewprompt_theme') || localStorage.getItem('pv_theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeToggleBtn(theme);

  // Listen for system changes if user hasn't set explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('brewprompt_theme') && !localStorage.getItem('pv_theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeToggleBtn(newTheme);
    }
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('brewprompt_theme', newTheme);
  updateThemeToggleBtn(newTheme);
}

function updateThemeToggleBtn(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
}

// Mobile Menu
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  
  if (!btn || !menu) return;
  
  btn.onclick = (e) => {
    e.stopPropagation();
    const isOpen = btn.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
  };
  
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}

// Header
function initHeader() {
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.onclick = toggleTheme;
  }
  
  // Mark active nav link based on current page
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const linkPage = link.getAttribute('data-page');
      if (linkPage === page || (page === 'home' && (link.getAttribute('href') === 'index.html' || linkPage === 'home'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Render helpers
function renderPromptCard(prompt, highlightQuery = '') {
  const isFav = isFavorited(prompt.slug);
  const heartClass = isFav ? 'favorite-btn active' : 'favorite-btn';
  const tagsHtml = prompt.tags.slice(0, 3).map(tag => `<span class="prompt-card__tag">#${tag}</span>`).join('');
  
  let displayTitle = prompt.title;
  let displayDesc = prompt.description;
  
  if (highlightQuery && typeof highlightText === 'function') {
    displayTitle = highlightText(prompt.title, highlightQuery);
    displayDesc = highlightText(prompt.description, highlightQuery);
  }
  
  return `
    <article class="card prompt-card slide-up" data-slug="${prompt.slug}">
      <div class="prompt-card__header">
        <span class="prompt-card__category">${prompt.category}</span>
        <button class="${heartClass}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <h3 class="prompt-card__title">${displayTitle}</h3>
      <p class="prompt-card__description">${displayDesc}</p>
      <div class="prompt-card__tags">
        ${tagsHtml}
      </div>
      <div class="prompt-card__footer">
        <div class="prompt-card__copies" title="${prompt.copyCount} total copies">🔥 ${formatNumber(prompt.copyCount)} copies</div>
        <div class="prompt-card__actions">
          <a href="prompt.html?slug=${prompt.slug}" class="btn btn-sm btn-ghost btn-view">View</a>
          <button class="btn btn-sm btn-primary btn-copy" aria-label="Copy prompt">Copy</button>
        </div>
      </div>
    </article>
  `;
}

function renderCategoryCard(category) {
  let count = 0;
  if (window.PROMPTS) {
    count = window.PROMPTS.filter(p => p.category.toLowerCase() === category.name.toLowerCase()).length;
  }
  
  return `
    <a href="category.html?category=${encodeURIComponent(category.name)}" class="card category-card">
      <div class="category-card__icon">${category.icon}</div>
      <h3 class="category-card__name">${category.name}</h3>
      <p class="category-card__desc">${category.description}</p>
      <div class="category-card__count">${count} prompts &rarr;</div>
    </a>
  `;
}

function renderSkeletonCards(count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card skeleton"></div>
    `;
  }
  return html;
}
