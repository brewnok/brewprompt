document.addEventListener('DOMContentLoaded', function() {
  if (document.body.dataset.page !== 'prompts') return;
  
  let currentFilters = {
    query: getUrlParam('q') || '',
    category: getUrlParam('category') || 'All',
    difficulty: getUrlParam('difficulty') || 'All',
    platform: getUrlParam('platform') || 'All',
    sort: getUrlParam('sort') || 'popular'
  };
  
  const searchInput = document.getElementById('search-input');
  const promptGrid = document.getElementById('prompt-grid');
  const resultsCount = document.getElementById('results-count');
  const noResults = document.getElementById('no-results');
  const sortSelect = document.getElementById('sort-select');
  const loadingSkeleton = document.getElementById('loading-skeleton');
  
  // Set initial search value from URL
  if (searchInput && currentFilters.query) {
    searchInput.value = currentFilters.query;
  }
  
  // Wait for data to load if it hasn't
  if (window.PROMPTS && window.CATEGORIES) {
    initPromptsPage();
  } else {
    const dataCheck = setInterval(() => {
      if (window.PROMPTS && window.CATEGORIES) {
        clearInterval(dataCheck);
        initPromptsPage();
      }
    }, 50);
  }
  
  function initPromptsPage() {
    renderFilterChips();
    renderPrompts();
    
    // Search input handler (debounced)
    if (searchInput) {
      searchInput.addEventListener('input', debounce(function() {
        currentFilters.query = this.value;
        setUrlParam('q', this.value || null);
        renderPrompts();
      }, 250));
    }
    
    // Sort handler
    if (sortSelect) {
      sortSelect.value = currentFilters.sort;
      sortSelect.addEventListener('change', function() {
        currentFilters.sort = this.value;
        setUrlParam('sort', this.value);
        renderPrompts();
      });
    }
  }
  
  function renderFilterChips() {
    // Category chips
    const catContainer = document.getElementById('category-filter');
    if (catContainer) {
      const categories = ['All', ...window.CATEGORIES.map(c => c.name)];
      catContainer.innerHTML = categories.map(c => 
        `<button class="chip ${c.toLowerCase() === currentFilters.category.toLowerCase() ? 'active' : ''}" data-filter="category" data-value="${c}">${c}</button>`
      ).join('');
    }
    
    // Difficulty chips
    const diffContainer = document.getElementById('difficulty-filter');
    if (diffContainer) {
      const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
      diffContainer.innerHTML = difficulties.map(d => 
        `<button class="chip ${d.toLowerCase() === currentFilters.difficulty.toLowerCase() ? 'active' : ''}" data-filter="difficulty" data-value="${d}">${d}</button>`
      ).join('');
    }
    
    // Platform chips
    const platContainer = document.getElementById('platform-filter');
    if (platContainer) {
      const platforms = ['All', 'ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot'];
      platContainer.innerHTML = platforms.map(p => 
        `<button class="chip ${p.toLowerCase() === currentFilters.platform.toLowerCase() ? 'active' : ''}" data-filter="platform" data-value="${p}">${p}</button>`
      ).join('');
    }
    
    // Chip click handlers (event delegation)
    const filtersContainer = document.querySelector('.filters');
    if (filtersContainer) {
      filtersContainer.addEventListener('click', function(e) {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        const filter = chip.dataset.filter;
        const value = chip.dataset.value;
        currentFilters[filter] = value;
        setUrlParam(filter, value === 'All' ? null : value);
        
        // Update active states within the group
        chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        renderPrompts();
      });
    }
  }
  
  function renderPrompts() {
    if (!window.PROMPTS) return;
    let filtered = [...window.PROMPTS];
    
    // Apply search
    if (currentFilters.query && currentFilters.query.trim()) {
      filtered = searchPrompts(currentFilters.query, filtered);
    }
    
    // Apply category filter
    if (currentFilters.category && currentFilters.category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === currentFilters.category.toLowerCase());
    }
    
    // Apply difficulty filter
    if (currentFilters.difficulty && currentFilters.difficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty.toLowerCase() === currentFilters.difficulty.toLowerCase());
    }
    
    // Apply platform filter
    if (currentFilters.platform && currentFilters.platform !== 'All') {
      filtered = filtered.filter(p => p.aiPlatforms && p.aiPlatforms.some(plat => plat.toLowerCase() === currentFilters.platform.toLowerCase()));
    }
    
    // Apply sort
    switch (currentFilters.sort) {
      case 'popular':
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || (b.copyCount - a.copyCount));
        break;
      case 'copied':
      case 'copies':
        filtered.sort((a, b) => b.copyCount - a.copyCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        break;
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => b.copyCount - a.copyCount);
    }
    
    // Update results count
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} prompt${filtered.length !== 1 ? 's' : ''} found`;
    }
    
    // Render grid or empty state
    if (filtered.length === 0) {
      if (promptGrid) promptGrid.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
    } else {
      if (noResults) noResults.style.display = 'none';
      if (promptGrid) {
        promptGrid.style.display = 'grid';
        promptGrid.innerHTML = filtered.map(p => renderPromptCard(p, currentFilters.query)).join('');
      }
    }
  }
});
