// Funciones para el filtrado y búsqueda de memes
export function filterTemplates(templates, searchTerm) {
    if (!searchTerm.trim()) {
        return templates;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return templates.filter(template => 
        template.name.toLowerCase().includes(term) ||
        template.keywords?.some(keyword => keyword.toLowerCase().includes(term))
    );
}

export function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
