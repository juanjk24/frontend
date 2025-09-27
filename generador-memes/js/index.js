import { getTemplates, getTemplate, generateMemeUrl } from './api.js';
import { filterTemplates, debounce } from './search.js';
import { createMemeButton, clearContainer, showNoResults, createTextInput } from './ui.js';
import { createDownloadButton } from './download-meme.js';

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

// Función para cargar y mostrar todas las plantillas
async function loadAndDisplayTemplates() {
    try {
        allTemplates = await getTemplates();
        renderMemeList(allTemplates);
    } catch (error) {
        console.error('Error al cargar las plantillas:', error);
        listImages.innerHTML = '<li class="error">Error al cargar los memes. Intenta recargar la página.</li>';
    }
}

// Función para renderizar la lista de memes
function renderMemeList(templates) {
    clearContainer(listImages);
    
    if (templates.length === 0) {
        showNoResults(listImages);
        return;
    }

    templates.forEach(template => {
        const memeElement = createMemeButton(template, openEditor);
        listImages.appendChild(memeElement);
    });
}

// Función para abrir el editor de memes
async function openEditor(id) {
    try {
        currentTemplate = await getTemplate(id);
        
        if (!currentTemplate) {
            alert('Error al cargar la plantilla del meme');
            return;
        }

        // Ocultar lista y mostrar editor
        mainElement.style.display = 'none';
        searchForm.style.display = 'none';
        editor.style.display = 'block';

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
        alert('Error al cargar la plantilla del meme');
    }
}

// Función de búsqueda con debounce
const handleSearch = debounce((searchTerm) => {
    const filteredTemplates = filterTemplates(allTemplates, searchTerm);
    renderMemeList(filteredTemplates);
}, 300);

// Event Listeners
generateBtn.addEventListener('click', () => {
    if (!currentTemplate) return;

    const inputs = inputsContainer.querySelectorAll('input');
    const allEmpty = Array.from(inputs).every(input => !input.value.trim());
    
    if (allEmpty) {
        alert('Por favor, completa al menos un campo de texto.');
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
});

backBtn.addEventListener('click', () => {
    editor.style.display = 'none';
    mainElement.style.display = 'block';
    searchForm.style.display = 'block';
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

// Inicializar la aplicación
loadAndDisplayTemplates();