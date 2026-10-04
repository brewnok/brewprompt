function searchPrompts(query, prompts) {
  if (!query || !query.trim()) return prompts;
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);
  
  return prompts.filter(p => {
    const searchable = [
      p.title, p.description, p.content, p.category, p.subcategory,
      ...p.tags, ...p.useCases
    ].join(' ').toLowerCase();
    return terms.every(term => searchable.includes(term));
  }).sort((a, b) => {
    // Prioritize title matches
    const aTitle = a.title.toLowerCase().includes(q) ? 1 : 0;
    const bTitle = b.title.toLowerCase().includes(q) ? 1 : 0;
    return bTitle - aTitle;
  });
}

function highlightText(text, query) {
  if (!query || !query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('(' + escaped + ')', 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
