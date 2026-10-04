document.addEventListener('DOMContentLoaded', function() {
  if (document.body.dataset.page !== 'prompt') return;
  
  if (window.PROMPTS) {
    initPromptDetails();
  } else {
    const dataCheck = setInterval(() => {
      if (window.PROMPTS) {
        clearInterval(dataCheck);
        initPromptDetails();
      }
    }, 50);
  }
  
  function initPromptDetails() {
    const slug = getUrlParam('slug');
    const prompt = slug ? getPromptBySlug(slug) : null;
    
    const detailContainer = document.getElementById('prompt-detail');
    const notFound = document.getElementById('not-found');
    
    if (!prompt) {
      if (detailContainer) detailContainer.style.display = 'none';
      if (notFound) notFound.style.display = 'block';
      document.title = 'Prompt Not Found | BrewPrompt';
      return;
    }
    
    // Show detail, hide error
    if (notFound) notFound.style.display = 'none';
    if (detailContainer) detailContainer.style.display = 'block';
    
    // Update page title & meta
    document.title = `${prompt.title} | BrewPrompt`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = prompt.description;
    
    // Add to recently viewed
    addToRecentlyViewed(prompt.slug);
    
    // Render breadcrumb
    const breadcrumb = document.getElementById('prompt-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="prompts.html">Prompts</a>
        <span class="breadcrumb-separator">/</span>
        <a href="category.html?category=${encodeURIComponent(prompt.category)}">${prompt.category}</a>
        <span class="breadcrumb-separator">/</span>
        <a href="category.html?category=${encodeURIComponent(prompt.category)}&subcategory=${encodeURIComponent(prompt.subcategory)}">${prompt.subcategory}</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">${prompt.title}</span>
      `;
    }
    
    // Render title & description
    const titleEl = document.getElementById('prompt-title');
    const descEl = document.getElementById('prompt-description');
    if (titleEl) titleEl.textContent = prompt.title;
    if (descEl) descEl.textContent = prompt.description;
    
    // Render meta grid
    const metaGrid = document.getElementById('prompt-meta');
    if (metaGrid) {
      metaGrid.innerHTML = `
        <div class="prompt-meta-item">
          <div class="prompt-meta-label">Difficulty</div>
          <div class="prompt-meta-value font-medium">${prompt.difficulty}</div>
        </div>
        <div class="prompt-meta-item">
          <div class="prompt-meta-label">Category</div>
          <div class="prompt-meta-value font-medium">${prompt.category}</div>
        </div>
        <div class="prompt-meta-item">
          <div class="prompt-meta-label">Subcategory</div>
          <div class="prompt-meta-value font-medium">${prompt.subcategory}</div>
        </div>
        <div class="prompt-meta-item">
          <div class="prompt-meta-label">AI Platforms</div>
          <div class="prompt-meta-value font-medium">${prompt.aiPlatforms.join(', ')}</div>
        </div>
        <div class="prompt-meta-item">
          <div class="prompt-meta-label">Use Cases</div>
          <div class="prompt-meta-value font-medium">${prompt.useCases.join(', ')}</div>
        </div>
        <div class="prompt-meta-item">
          <div class="prompt-meta-label">Copies</div>
          <div class="prompt-meta-value font-medium">🔥 ${formatNumber(prompt.copyCount)}</div>
        </div>
      `;
    }
    
    // Render prompt content
    const contentEl = document.getElementById('prompt-content');
    if (contentEl) {
      contentEl.textContent = prompt.content;
    }
    
    // Render tags
    const tagsEl = document.getElementById('prompt-tags');
    if (tagsEl) {
      tagsEl.innerHTML = prompt.tags.map(t => `<a href="prompts.html?q=${encodeURIComponent(t)}" class="prompt-card__tag">#${t}</a>`).join('');
    }
    
    // Copy button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        copyToClipboard(prompt.content).then(() => {
          copyBtn.classList.add('copied');
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>';
          showToast('Prompt copied to clipboard');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = originalHTML;
          }, 2000);
        });
      };
    }
    
    // Favorite button
    const favBtn = document.getElementById('favorite-btn');
    if (favBtn) {
      if (isFavorited(prompt.slug)) favBtn.classList.add('active');
      favBtn.onclick = function() {
        const isFav = toggleFavorite(prompt.slug);
        favBtn.classList.toggle('active', isFav);
        favBtn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
        showToast(isFav ? 'Added to favorites' : 'Removed from favorites');
      };
    }
    
    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.onclick = function() {
        const url = window.location.href;
        if (navigator.share) {
          navigator.share({
            title: `${prompt.title} - BrewPrompt`,
            text: prompt.description,
            url: url
          }).catch(err => {
            if (err.name !== 'AbortError') {
              copyToClipboard(url).then(() => showToast('Link copied to clipboard'));
            }
          });
        } else {
          copyToClipboard(url).then(() => showToast('Link copied to clipboard'));
        }
      };
    }
    
    // Customize button & modal
    const customizeBtn = document.getElementById('customize-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('customize-modal');
    const closeModal = modal ? modal.querySelector('.modal-close') : null;
    const fieldsContainer = document.getElementById('customize-fields');
    const previewContainer = document.getElementById('customize-preview');
    const copyCustomizedBtn = document.getElementById('copy-customized-btn') || document.getElementById('modal-copy-btn');
    
    const placeholders = extractPlaceholders(prompt.content);
    
    // Hide customize button if no placeholders found
    if (placeholders.length === 0 && customizeBtn) {
      customizeBtn.style.display = 'none';
    }
    
    if (customizeBtn && placeholders.length > 0) {
      customizeBtn.style.display = 'inline-flex';
      customizeBtn.onclick = function() {
        openCustomizeModal();
      };
    }
    
    function openCustomizeModal() {
      // Render input fields for each detected placeholder
      if (fieldsContainer) {
        fieldsContainer.innerHTML = placeholders.map(ph => {
          const readableName = ph.replace(/_/g, ' ').toLowerCase()
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          
          return `
            <div class="customize-field" style="margin-bottom: 16px;">
              <label class="customize-label" for="field-${ph}" style="display: block; font-weight: 500; font-size: 0.875rem; margin-bottom: 6px;">
                ${readableName} <span class="text-tertiary" style="font-size: 0.75rem;">[${ph}]</span>
              </label>
              <input 
                class="customize-input" 
                id="field-${ph}" 
                type="text" 
                placeholder="Enter ${readableName.toLowerCase()}..." 
                data-placeholder="${ph}"
                style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg); color: var(--text); font-family: var(--font-sans); font-size: 0.9rem;"
              >
            </div>
          `;
        }).join('');
        
        // Add live input listeners
        fieldsContainer.querySelectorAll('.customize-input').forEach(input => {
          input.addEventListener('input', updatePreview);
        });
      }
      
      // Initial live preview
      updatePreview();
      
      // Open modal
      if (modalOverlay) modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      
      // Auto-focus first input
      setTimeout(() => {
        const firstInput = fieldsContainer ? fieldsContainer.querySelector('.customize-input') : null;
        if (firstInput) firstInput.focus();
      }, 100);
    }
    
    function updatePreview() {
      const replacements = {};
      if (fieldsContainer) {
        fieldsContainer.querySelectorAll('.customize-input').forEach(input => {
          replacements[input.dataset.placeholder] = input.value.trim() || `[${input.dataset.placeholder}]`;
        });
      }
      const customized = replacePlaceholders(prompt.content, replacements);
      if (previewContainer) {
        previewContainer.textContent = customized;
      }
    }
    
    function closeModalFn() {
      if (modalOverlay) modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    
    if (closeModal) closeModal.onclick = closeModalFn;
    
    if (modalOverlay) {
      modalOverlay.onclick = function(e) {
        if (e.target === modalOverlay) closeModalFn();
      };
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
        closeModalFn();
      }
    });
    
    if (copyCustomizedBtn) {
      copyCustomizedBtn.onclick = function() {
        const text = previewContainer ? previewContainer.textContent : prompt.content;
        copyToClipboard(text).then(() => {
          const originalHTML = copyCustomizedBtn.innerHTML;
          copyCustomizedBtn.classList.add('copied');
          copyCustomizedBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>';
          showToast('Customized prompt copied to clipboard');
          setTimeout(() => {
            copyCustomizedBtn.classList.remove('copied');
            copyCustomizedBtn.innerHTML = originalHTML;
            closeModalFn();
          }, 1200);
        });
      };
    }
    
    // Render related prompts
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
      const related = getRelatedPrompts(prompt, 4);
      if (related && related.length > 0) {
        relatedGrid.innerHTML = related.map(p => renderPromptCard(p)).join('');
      } else {
        const relatedSection = relatedGrid.closest('section');
        if (relatedSection) relatedSection.style.display = 'none';
      }
    }
  }
});
