// Funciones para manejar la interfaz de usuario
export function createMemeButton(template, onClickHandler) {
    const { name, example, id } = template;
    const { url } = example;
    
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'meme-btn';
    button.setAttribute('data-id', id);

    const img = document.createElement('img');
    img.src = url;
    img.alt = name;
    img.loading = 'lazy'; // Optimización de carga

    const label = document.createElement('span');
    label.textContent = name;

    button.appendChild(img);
    button.appendChild(label);
    li.appendChild(button);

    button.addEventListener('click', () => onClickHandler(id));
    
    return li;
}

export function clearContainer(container) {
    container.classList.remove('no-results');
    container.innerHTML = '';
}

export function showNoResults(container) {
    container.classList.add('no-results');
    container.innerHTML = `
        <li class="no-results">
            <p>No se encontraron memes con ese término de búsqueda.</p>
            <p>Intenta con otras palabras clave.</p>
        </li>
    `;
}

export function createTextInput(index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Texto ${index + 1}`;
    input.className = 'meme-text-input';
    return input;
}

export function createLoadingIndicator() {
    const loading = document.createElement('div');
    loading.className = 'loading-indicator';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Cargando más memes...</p>
        </div>
    `;
    return loading;
}

export function showLoadingIndicator(mainContainer) {
    // Remover loading indicator existente si hay uno
    removeLoadingIndicator(mainContainer);
    
    const loadingIndicator = createLoadingIndicator();
    mainContainer.appendChild(loadingIndicator);
    return loadingIndicator;
}

export function removeLoadingIndicator(mainContainer) {
    const existingLoader = mainContainer.querySelector('.loading-indicator');
    if (existingLoader) {
        existingLoader.remove();
    }
}
