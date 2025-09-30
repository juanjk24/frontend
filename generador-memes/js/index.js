import { getTemplates, getTemplate, generateMemeUrl } from './api.js';
import { filterTemplates, debounce } from './search.js';
import { createMemeButton, clearContainer, showNoResults, createTextInput, showLoadingIndicator, removeLoadingIndicator } from './ui.js';
import { createDownloadButton } from './download-meme.js';
import { showSuccess, showError, showWarning } from './notifications.js';

// Elementos del DOM
const listImages = document.querySelector('#list-images');
const editor = document.querySelector('#editor');
const memePreview = document.querySelector('#meme-preview');
const inputsContainer = document.querySelector('#inputs');
const generateBtn = document.querySelector('#generate-btn');
const result = document.querySelector('#result');
const backBtn = document.querySelector('#back-btn');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const mainElement = document.querySelector('#main');

// Variables globales
let currentTemplate = null;
let allTemplates = [];
let displayedTemplates = [];
let currentPage = 0;
let filteredTemplates = [];
let isLoading = false;
const ITEMS_PER_PAGE = 20;

// Función para cargar todas las plantillas inicialmente
async function loadTemplates() {
    try {
        if (allTemplates.length === 0) {
            allTemplates = await getTemplates();
        }
        filteredTemplates = [...allTemplates];
        resetPagination();
        loadMoreTemplates();
    } catch (error) {
        console.error('Error al cargar las plantillas:', error);
        listImages.innerHTML = '<li class="error">Error al cargar los memes. Intenta recargar la página.</li>';
        showError('Error de conexión', 'No se pudieron cargar los memes. Verifica tu conexión a internet e intenta recargar la página.');
    }
}

// Función para resetear la paginación
function resetPagination() {
    currentPage = 0;
    displayedTemplates = [];
    clearContainer(listImages);
    removeLoadingIndicator(mainElement);
}

// Función para cargar más plantillas (paginación)
function loadMoreTemplates() {
    if (isLoading) return;
    
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newTemplates = filteredTemplates.slice(startIndex, endIndex);
    
    if (newTemplates.length === 0) {
        if (displayedTemplates.length === 0) {
            showNoResults(listImages);
        }
        removeLoadingIndicator(mainElement);
        return;
    }
    
    // Mostrar indicador de carga si hay más contenido para cargar
    const hasMoreContent = endIndex < filteredTemplates.length;
    
    if (currentPage > 0 && hasMoreContent) {
        isLoading = true;
        showLoadingIndicator(mainElement);
        
        // Simular un pequeño delay para mejor UX
        setTimeout(() => {
            removeLoadingIndicator(mainElement);
            displayedTemplates.push(...newTemplates);
            renderNewTemplates(newTemplates);
            currentPage++;
            isLoading = false;
        }, 500);
    } else {
        displayedTemplates.push(...newTemplates);
        renderNewTemplates(newTemplates);
        currentPage++;
    }
}

// Función para renderizar nuevas plantillas (sin limpiar las existentes)
function renderNewTemplates(templates) {
    templates.forEach(template => {
        const memeElement = createMemeButton(template, openEditor);
        listImages.appendChild(memeElement);
    });
}

// Función para manejar búsquedas con infinite scroll
function handleFilteredResults(searchResults) {
    filteredTemplates = searchResults;
    resetPagination();
    loadMoreTemplates();
}

// Función para abrir el editor de memes
async function openEditor(id) {
    try {
        currentTemplate = await getTemplate(id);
        
        if (!currentTemplate) {
            showError('Error al cargar', 'No se pudo cargar la plantilla del meme. Intenta de nuevo.');
            return;
        }

        // Ocultar lista y mostrar editor
        mainElement.style.display = 'none';
        searchForm.style.display = 'none';
        editor.style.display = 'block';
        
        // Desactivar scroll infinito en el editor
        window.removeEventListener('scroll', throttledScrollHandler);

        // Configurar preview del meme
        memePreview.src = currentTemplate.blank;
        clearContainer(inputsContainer);

        // Generar inputs según el número de líneas
        for (let i = 0; i < currentTemplate.lines; i++) {
            const input = createTextInput(i);
            inputsContainer.appendChild(input);
        }

        // Limpiar resultado anterior
        result.innerHTML = '';
    } catch (error) {
        console.error('Error al abrir el editor:', error);
        showError('Error inesperado', 'Ocurrió un problema al cargar la plantilla. Por favor, intenta de nuevo.');
    }
}

// Función de búsqueda con debounce
const handleSearch = debounce((searchTerm) => {
    const searchResults = filterTemplates(allTemplates, searchTerm);
    handleFilteredResults(searchResults);
}, 300);

// Función para detectar scroll infinito
function handleInfiniteScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Si el usuario está cerca del final de la página (dentro de 100px)
    if (scrollTop + windowHeight >= documentHeight - 100) {
        loadMoreTemplates();
    }
}

// Throttle para optimizar el scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

const throttledScrollHandler = throttle(handleInfiniteScroll, 200);

// Event Listeners
generateBtn.addEventListener('click', () => {
    if (!currentTemplate) return;

    const inputs = inputsContainer.querySelectorAll('input');
    const allEmpty = Array.from(inputs).every(input => !input.value.trim());
    
    if (allEmpty) {
        showWarning('Campos vacíos', 'Por favor, completa al menos un campo de texto para generar el meme.');
        return;
    }

    const texts = Array.from(inputs).map(input => input.value.trim());
    
    const url = generateMemeUrl(currentTemplate.id, texts);
    
    // Crear contenido del resultado con imagen y botón de descarga
    const resultContent = document.createElement('div');
    resultContent.className = 'result-content';
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Meme generado';
    img.loading = 'lazy';
    
    const downloadBtn = createDownloadButton(url, currentTemplate.name);
    
    resultContent.appendChild(img);
    resultContent.appendChild(downloadBtn);
    
    // Limpiar y agregar el nuevo contenido
    result.innerHTML = '';
    result.appendChild(resultContent);
    
    // Mostrar notificación de éxito
    showSuccess('¡Meme generado!', 'Tu meme se ha creado exitosamente. Puedes descargarlo usando el botón de abajo.');
});

backBtn.addEventListener('click', () => {
    editor.style.display = 'none';
    mainElement.style.display = 'block';
    searchForm.style.display = 'block';
    
    // Reactivar el scroll infinito al volver a la lista
    window.addEventListener('scroll', throttledScrollHandler);
});

// Configurar búsqueda
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    handleSearch(searchTerm);
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    handleSearch(searchTerm);
});

// Event listener para scroll infinito
window.addEventListener('scroll', throttledScrollHandler);

// Inicializar la aplicación
loadTemplates();