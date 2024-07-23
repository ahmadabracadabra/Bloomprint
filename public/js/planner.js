function drop(event) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('text/plain');
    const isCircle = event.dataTransfer.getData('isCircle') === 'true';
    const droppedItem = document.querySelector(`.catalog-item[data-item-id="${itemId}"] img`) || 
                        document.querySelector(`.catalog-item[data-item-id="${itemId}"] .flower-name-circle`);

    if (droppedItem) {
        // Clone the dropped element to avoid moving the original multiple times
        const clone = droppedItem.cloneNode(true);
       
        // Set initial styles for the cloned element
        clone.style.width = '100px'; // Example width
        clone.style.height = droppedItem.tagName === 'IMG' ? 'auto' : '100px'; // Maintain aspect ratio for images, set height for circles
        clone.style.borderRadius = '50%'; // Circle shape for both
        clone.style.backgroundColor = isCircle ? '#237925' : ''; // Background color for circles
        clone.style.display = 'flex';
        clone.style.alignItems = 'center';
        clone.style.justifyContent = 'center';
        clone.style.textAlign = 'center';
        clone.style.fontFamily = 'Montserrat, sans-serif';
        clone.style.fontSize = '1em';
        clone.style.color = '#f0f0f0';
        clone.style.border = isCircle ? '1px solid #ddd' : '';
        clone.style.boxShadow = isCircle ? '0 4px 8px rgba(0, 0, 0, 0.1)' : '';
        clone.style.cursor = 'grab'; // Indicate that the circle can be dragged

        // Position the cloned element where the mouse cursor is
        clone.style.position = 'absolute';
        clone.style.left = `${event.clientX - 50}px`; // Set left position
        clone.style.top = `${event.clientY + window.scrollY - 50}px`; // Adjust top position

        // Append the cloned element to the design window
        event.target.appendChild(clone);

        // Make the cloned element draggable within the design window
        clone.draggable = true;
        clone.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', itemId); // Set data to the plant id
            if (isCircle) {
                event.dataTransfer.setData('isCircle', 'true'); // Indicate that the item is a circle
            }
        });

        // Event listener for moving the cloned item
        clone.addEventListener('drag', function(event) {
            const designWindow = document.getElementById('designWindow');
            const designRect = designWindow.getBoundingClientRect();
            const cloneRect = clone.getBoundingClientRect();

            let newLeft = event.clientX;
            let newTop = event.clientY;

            // Boundary checks
            if (newLeft < designRect.left) {
                newLeft = designRect.left;
            }
            if (newTop < designRect.top + window.scrollY) {
                newTop = designRect.top + window.scrollY;
            }
            if (newLeft + cloneRect.width > designRect.right) {
                newLeft = designRect.right - cloneRect.width;
            }
            if (newTop + cloneRect.height > designRect.bottom + window.scrollY) {
                newTop = designRect.bottom + window.scrollY - cloneRect.height;
            }

            
        });

        // Add click event listener for deletion when delete mode is active
        clone.addEventListener('click', function() {
            if (deleteMode) {
                clone.remove();
            }
        });
    }
}

document.getElementById('designWindow').addEventListener('drop', drop);

document.getElementById('designWindow').addEventListener('dragover', function(event) {
    event.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    // Initial fetch and display of plants
    fetchPlants();

    // Event listener for filter changes
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Event listener for search bar changes (keyup event for live search)
    document.getElementById('search-bar').addEventListener('keyup', applyFilters);

    // Event listeners for save, clear, and delete buttons
    document.getElementById('save').addEventListener('click', saveDesign);
    document.getElementById('clear').addEventListener('click', clearDesign);
    document.getElementById('delete').addEventListener('click', toggleDeleteMode);
});

async function fetchPlants() {
    try {
        const response = await fetch('http://localhost:8080/Native_Plant_List');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const plants = await response.json();

        const catalog = document.getElementById('catalog');
        catalog.innerHTML = ''; // Clear existing items

        plants.forEach(plant => {
            const item = createCatalogItem(plant);
            catalog.appendChild(item);

            // Make each catalog item draggable
            const itemImage = item.querySelector('img');
            itemImage.draggable = true;
            itemImage.addEventListener('dragstart', function(event) {
                event.dataTransfer.setData('text/plain', plant.id); // Set data to the plant id
            });
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function applyFilters() {
    const searchValue = document.getElementById('search-bar').value.trim().toLowerCase();
    const typeFilters = getCheckedValues('#type-filter input[type="checkbox"]');
    const lightFilters = getCheckedValues('#light-filter input[type="checkbox"]');
    const heightFilters = getCheckedValues('#height-filter input[type="checkbox"]');
    const moistureFilters = getCheckedValues('#moisture-filter input[type="checkbox"]');
    const seasonFilters = getCheckedValues('#season-filter input[type="checkbox"]');

    const catalogItems = document.querySelectorAll('.catalog-item');

    catalogItems.forEach(item => {
        const commonName = item.querySelector('h3').textContent.toLowerCase();
        const scientificName = item.querySelector('.scientific-name').textContent.toLowerCase();
        const matchesSearch = commonName.includes(searchValue) || scientificName.includes(searchValue);
        const matchesType = typeFilters.length === 0 || typeFilters.includes(item.getAttribute('data-type'));
        const matchesLight = lightFilters.length === 0 || lightFilters.includes(item.getAttribute('data-light'));
        const matchesHeight = heightFilters.length === 0 || heightFilters.includes(item.getAttribute('data-height'));
        const matchesMoisture = moistureFilters.length === 0 || moistureFilters.includes(item.getAttribute('data-moisture'));
        const matchesSeason = seasonFilters.length === 0 || seasonFilters.includes(item.getAttribute('data-season'));

        if (matchesSearch && matchesType && matchesLight && matchesHeight && matchesMoisture && matchesSeason) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(`${selector}:checked`)).map(cb => cb.value);
}

function createCatalogItem(plant) {
    const item = document.createElement('div');
    item.className = 'catalog-item';
    item.setAttribute('data-item-id', plant.id);
    item.setAttribute('data-type', plant.Type);
    item.setAttribute('data-color', plant.Bloom_color);
    item.setAttribute('data-light', plant.Light_intensity);
    item.setAttribute('data-season', `${plant.Bloom_start} to ${plant.Bloom_end}`);
    item.setAttribute('data-moisture', plant.Soil_moisture);
    item.setAttribute('data-height', plant.Height);
    item.setAttribute('data-spacing', plant.Spacing);
    item.setAttribute('data-hardiness', plant.Hardiness_zone);

    const image = document.createElement('img');
    image.src = `catalogphoto/${plant.Common_name}.jpg`; // Adjust this to your actual image URL field
    image.alt = plant.Common_name; // Use common name or appropriate alt text
    image.draggable = true; // Make the image draggable

    // Handle image load errors by displaying the name in a circle
    image.onerror = function() {
        const flowerName = plant.Common_name;

        // Remove the broken image
        image.remove();

        // Create a new div element to display the flower name
        const flowerNameCircle = document.createElement('div');
        flowerNameCircle.className = 'flower-name-circle';
        flowerNameCircle.textContent = flowerName;
        flowerNameCircle.draggable = true; // Make the flower name circle draggable

        // Append the new div to the catalog item
        item.appendChild(flowerNameCircle);

        // Make the flower name circle draggable
        flowerNameCircle.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', plant.id); // Set data to the plant id
            event.dataTransfer.setData('isCircle', 'true'); // Indicate that the item is a circle
        });
    };

    item.appendChild(image);

    const heading = document.createElement('h3');
    heading.textContent = plant.Common_name;
    item.appendChild(heading);

    const ul = document.createElement('ul');
    ul.innerHTML = `
        <li>Scientific Name: <span class="scientific-name">${plant.Scientific_name}</span></li>
        <li>Type: <span class="type">${plant.Type}</span></li>
        <li>Height: <span class="height">${plant.Height}</span></li>
        <li>Width: <span class="width">${plant.Width}</span></li>
        <li>Spacing: <span class="spacing">${plant.Spacing}</span></li>
        <li>Bloom Color: <span class="bloom-color">${plant.Bloom_color}</span></li>
        <li>Light: <span class="light">${plant.Light_intensity}</span></li>
        <li>Bloom Period: <span class="bloom-period">${plant.Bloom_start} to ${plant.Bloom_end}</span></li>
        <li>Soil Moisture: <span class="soil-moisture">${plant.Soil_moisture}</span></li>
        <li>Zone: <span class="zone">${plant.Hardiness_zone}</span></li>`;
    item.appendChild(ul);

    return item;
}

function toggleFilter() {
    const filters = document.getElementById('filters');
    const button = document.getElementById('filter-toggle');
    if (filters.style.display === 'none' || !filters.style.display) {
        filters.style.display = 'block';
        button.textContent = 'Hide Filters';
    } else {
        filters.style.display = 'none';
        button.textContent = 'Show Filters';
    }
}
document.getElementById('filters').style.display = 'none';

let deleteMode = false;

function toggleDeleteMode() {
    deleteMode = !deleteMode;
    document.body.style.cursor = deleteMode ? 'not-allowed' : 'default';
}

function clearDesign() {
    const designWindow = document.getElementById('designWindow');
    while (designWindow.firstChild) {
        designWindow.removeChild(designWindow.firstChild);
    }
}

function saveDesign() {
    const designWindow = document.getElementById('designWindow');
    html2canvas(designWindow).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'design.png';
        link.click();
    });
}

// Add html2canvas script
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
document.head.appendChild(script);
