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
    container.innerHTML = '';
}

export function showNoResults(container) {
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
