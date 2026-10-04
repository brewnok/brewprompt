document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initHeader();
  initMobileMenu();
  
  // Detect current page and initialize
  const page = document.body.dataset.page;
  
  if (window.PROMPTS && window.CATEGORIES) {
    initPageByRoute(page);
  } else {
    const dataCheck = setInterval(() => {
      if (window.PROMPTS && window.CATEGORIES) {
        clearInterval(dataCheck);
        initPageByRoute(page);
      }
    }, 50);
  }
});

function initPageByRoute(page) {
  if (page === 'home') initHomePage();
  if (page === 'popular') initPopularPage();
  if (page === 'favorites') initFavoritesPage();
}

// Homepage initialization
function initHomePage() {
  // Render categories grid
  const categoryGrid = document.getElementById('category-grid');
  if (categoryGrid && window.CATEGORIES) {
    categoryGrid.innerHTML = window.CATEGORIES.map(cat => renderCategoryCard(cat)).join('');
  }
  
  // Render trending prompts (popular + featured, sorted by copyCount, limit 6)
  const trendingGrid = document.getElementById('trending-grid');
  if (trendingGrid && window.PROMPTS) {
    const trending = window.PROMPTS.filter(p => p.popular || p.featured)
      .sort((a, b) => b.copyCount - a.copyCount)
      .slice(0, 6);
    trendingGrid.innerHTML = trending.map(p => renderPromptCard(p)).join('');
  }
  
  // Render recent prompts (sorted by createdDate desc, limit 6)
  const recentGrid = document.getElementById('recent-grid');
  if (recentGrid && window.PROMPTS) {
    const recent = [...window.PROMPTS].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 6);
    recentGrid.innerHTML = recent.map(p => renderPromptCard(p)).join('');
  }
  
  // Render recently viewed (if any exist in localStorage)
  const rvSection = document.getElementById('recently-viewed-section');
  const rvGrid = document.getElementById('recently-viewed-grid');
  if (rvSection && rvGrid && window.PROMPTS) {
    const rvSlugs = getRecentlyViewed();
    if (rvSlugs && rvSlugs.length > 0) {
      const rvPrompts = rvSlugs.map(s => getPromptBySlug(s)).filter(Boolean).slice(0, 6);
      if (rvPrompts.length > 0) {
        rvSection.style.display = 'block';
        rvGrid.innerHTML = rvPrompts.map(p => renderPromptCard(p)).join('');
      } else {
        rvSection.style.display = 'none';
      }
    } else {
      rvSection.style.display = 'none';
    }
  }
  
  // Hero search - redirect to prompts.html on Enter
  const heroSearch = document.getElementById('hero-search');
  if (heroSearch) {
    heroSearch.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        window.location.href = 'prompts.html?q=' + encodeURIComponent(this.value.trim());
      }
    });
  }
}

// Popular page initialization
function initPopularPage() {
  if (!window.PROMPTS) return;
  
  // 1. Most Copied: sort by copyCount desc, take 6
  const mcGrid = document.getElementById('most-copied-grid');
  if (mcGrid) {
    const mostCopied = [...window.PROMPTS].sort((a, b) => b.copyCount - a.copyCount).slice(0, 6);
    mcGrid.innerHTML = mostCopied.map(p => renderPromptCard(p)).join('');
  }
  
  // 2. Trending: popular flag, take 6
  const tGrid = document.getElementById('popular-trending-grid');
  if (tGrid) {
    const trending = window.PROMPTS.filter(p => p.popular).slice(0, 6);
    tGrid.innerHTML = trending.map(p => renderPromptCard(p)).join('');
  }

  // 3. Most Viewed: sorted by weighted discovery
  const mvGrid = document.getElementById('most-viewed-grid');
  if (mvGrid) {
    const mostViewed = [...window.PROMPTS].sort((a, b) => {
      const scoreB = b.copyCount * 1.8 + (b.featured ? 600 : 0);
      const scoreA = a.copyCount * 1.8 + (a.featured ? 600 : 0);
      return scoreB - scoreA;
    }).slice(0, 6);
    mvGrid.innerHTML = mostViewed.map(p => renderPromptCard(p)).join('');
  }
  
  // 4. Editor's Picks: featured flag, take 6
  const epGrid = document.getElementById('editors-picks-grid');
  if (epGrid) {
    const picks = window.PROMPTS.filter(p => p.featured).slice(0, 6);
    epGrid.innerHTML = picks.map(p => renderPromptCard(p)).join('');
  }
}

// Favorites page initialization
function initFavoritesPage() {
  const grid = document.getElementById('favorites-grid');
  const empty = document.getElementById('favorites-empty');
  const count = document.getElementById('favorites-count');
  
  const favSlugs = getFavorites();
  if (favSlugs.length === 0) {
    if (grid) grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
    if (count) count.textContent = '0 prompts';
  } else {
    if (empty) empty.style.display = 'none';
    const favPrompts = favSlugs.map(s => getPromptBySlug(s)).filter(Boolean);
    if (favPrompts.length === 0) {
      if (grid) grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      if (count) count.textContent = '0 prompts';
    } else {
      if (grid) {
        grid.style.display = 'grid';
        grid.innerHTML = favPrompts.map(p => renderPromptCard(p)).join('');
      }
      if (count) count.textContent = `${favPrompts.length} prompt${favPrompts.length !== 1 ? 's' : ''}`;
    }
  }
}

// Global Event delegation for prompt cards (copy, favorite, navigate)
document.addEventListener('click', function(e) {
  // 1. Copy button on card
  const copyBtn = e.target.closest('.prompt-card .btn-copy');
  if (copyBtn) {
    e.stopPropagation();
    e.preventDefault();
    const card = copyBtn.closest('.prompt-card');
    const slug = card ? card.dataset.slug : null;
    const prompt = slug ? getPromptBySlug(slug) : null;
    if (prompt) {
      copyToClipboard(prompt.content).then(() => {
        copyBtn.classList.add('copied');
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>';
        showToast('Prompt copied to clipboard');
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = origText;
        }, 1800);
      });
    }
    return;
  }
  
  // 2. Favorite button on card
  const favBtn = e.target.closest('.prompt-card .favorite-btn');
  if (favBtn) {
    e.stopPropagation();
    e.preventDefault();
    const card = favBtn.closest('.prompt-card');
    const slug = card ? card.dataset.slug : null;
    if (slug) {
      const isFav = toggleFavorite(slug);
      favBtn.classList.toggle('active', isFav);
      favBtn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
      showToast(isFav ? 'Added to favorites' : 'Removed from favorites');
      
      // If currently on favorites page, re-render
      if (document.body.dataset.page === 'favorites') {
        initFavoritesPage();
      }
    }
    return;
  }
  
  // 3. View button or Tag links
  const viewLink = e.target.closest('.prompt-card .btn-view, .prompt-card__tag');
  if (viewLink) {
    // Let normal anchor navigation proceed
    return;
  }
  
  // 4. Click anywhere on card -> navigate to prompt details
  const card = e.target.closest('.prompt-card');
  if (card && card.dataset.slug) {
    window.location.href = 'prompt.html?slug=' + encodeURIComponent(card.dataset.slug);
  }
});
