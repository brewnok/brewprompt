document.addEventListener('DOMContentLoaded', function() {
  if (document.body.dataset.page !== 'category') return;
  
  const categoryParam = getUrlParam('category');
  const subcategoryParam = getUrlParam('subcategory');
  
  if (window.CATEGORIES && window.PROMPTS) {
    initCategoryPage();
  } else {
    const dataCheck = setInterval(() => {
      if (window.CATEGORIES && window.PROMPTS) {
        clearInterval(dataCheck);
        initCategoryPage();
      }
    }, 50);
  }
  
  function initCategoryPage() {
    const notFoundEl = document.getElementById('category-not-found');
    const allGrid = document.getElementById('all-categories-grid');
    const detailView = document.getElementById('category-detail-view');
    const countBadge = document.getElementById('category-count');
    const titleEl = document.getElementById('category-title');
    const descEl = document.getElementById('category-description');

    if (!categoryParam) {
      // Show all categories view
      showAllCategories(allGrid, detailView, notFoundEl, countBadge, titleEl, descEl);
      return;
    }
    
    // Find category case-insensitively
    const category = window.CATEGORIES.find(c => c.name.toLowerCase() === categoryParam.toLowerCase());
    
    if (!category) {
      // Show 404 error
      if (allGrid) allGrid.style.display = 'none';
      if (detailView) detailView.style.display = 'none';
      if (countBadge) countBadge.style.display = 'none';
      if (titleEl) titleEl.textContent = 'Category Not Found';
      if (descEl) descEl.textContent = "The category you're looking for doesn't exist.";
      if (notFoundEl) notFoundEl.style.display = 'block';
      document.title = 'Category Not Found | BrewPrompt';
      return;
    }
    
    showCategoryDetail(category, subcategoryParam, allGrid, detailView, notFoundEl, countBadge, titleEl, descEl);
  }
});

function showAllCategories(allGrid, detailView, notFoundEl, countBadge, titleEl, descEl) {
  if (notFoundEl) notFoundEl.style.display = 'none';
  if (detailView) detailView.style.display = 'none';
  if (countBadge) countBadge.style.display = 'none';
  
  if (titleEl) titleEl.textContent = 'Categories';
  if (descEl) descEl.textContent = 'Browse prompts by category.';
  document.title = 'Categories | BrewPrompt';
  
  if (allGrid) {
    allGrid.style.display = 'grid';
    allGrid.innerHTML = window.CATEGORIES.map(cat => renderCategoryCard(cat)).join('');
  }
}

function showCategoryDetail(category, activeSubcategory, allGrid, detailView, notFoundEl, countBadge, titleEl, descEl) {
  if (notFoundEl) notFoundEl.style.display = 'none';
  if (allGrid) allGrid.style.display = 'none';
  if (detailView) detailView.style.display = 'block';
  
  const categoryPrompts = getPromptsByCategory(category.name);
  
  if (titleEl) titleEl.textContent = `${category.icon} ${category.name}`;
  if (descEl) descEl.textContent = category.description;
  if (countBadge) {
    countBadge.textContent = `${categoryPrompts.length} prompts`;
    countBadge.style.display = 'inline-flex';
  }
  
  document.title = `${category.name} Prompts | BrewPrompt`;
  
  // Render subcategory chips
  const chipsContainer = document.getElementById('subcategory-chips');
  if (chipsContainer) {
    const subcats = ['All', ...category.subcategories];
    const currentSub = activeSubcategory || 'All';
    chipsContainer.innerHTML = subcats.map(sc => 
      `<button class="chip ${currentSub.toLowerCase() === sc.toLowerCase() ? 'active' : ''}" data-subcategory="${sc}">${sc}</button>`
    ).join('');
    
    chipsContainer.onclick = function(e) {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const sc = chip.dataset.subcategory;
      chipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      setUrlParam('subcategory', sc === 'All' ? null : sc);
      
      const searchInput = document.getElementById('category-search');
      renderCategoryPrompts(category.name, sc === 'All' ? null : sc, searchInput ? searchInput.value : '');
    };
  }
  
  // Search within category
  const searchInput = document.getElementById('category-search');
  if (searchInput) {
    searchInput.value = '';
    searchInput.oninput = debounce(function() {
      const activeChip = chipsContainer ? chipsContainer.querySelector('.chip.active') : null;
      const sc = activeChip ? activeChip.dataset.subcategory : null;
      renderCategoryPrompts(category.name, sc === 'All' ? null : sc, this.value);
    }, 250);
  }
  
  // Initial render
  const initialSub = (activeSubcategory && activeSubcategory.toLowerCase() !== 'all') ? activeSubcategory : null;
  renderCategoryPrompts(category.name, initialSub, '');
}

function renderCategoryPrompts(categoryName, subcategory, searchQuery) {
  const grid = document.getElementById('category-prompt-grid');
  if (!grid) return;
  
  let prompts = getPromptsByCategory(categoryName);
  
  if (subcategory && subcategory !== 'All') {
    prompts = prompts.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
  }
  
  if (searchQuery && searchQuery.trim()) {
    prompts = searchPrompts(searchQuery, prompts);
  }
  
  if (prompts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px 16px;">
        <h3>No prompts found</h3>
        <p class="text-secondary" style="margin-top: 8px;">Try selecting another subcategory or adjusting your search term.</p>
      </div>
    `;
  } else {
    grid.innerHTML = prompts.map(p => renderPromptCard(p, searchQuery)).join('');
  }
}
