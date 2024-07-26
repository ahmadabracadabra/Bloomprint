document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display plants when the page loads
    fetchPlants();
});

async function fetchPlants() {
    try {
        const response = await fetch('https://bloomprint.xyz/Native_Plant_List');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const plants = await response.json();

        const catalog = document.getElementById('catalog');
        catalog.innerHTML = ''; // Clear existing items

        for (const plant of plants) {
            const imageUrl = `catalogphoto/${plant.Common_name}.jpg`;
            const imageExists = await checkImage(imageUrl);
            if (imageExists) {
                const item = createCatalogItem(plant);
                catalog.appendChild(item);
            }
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function checkImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

function createCatalogItem(plant) {
    const item = document.createElement('div');
    item.className = 'catalog-item';
    item.setAttribute('data-type', plant.Type);
    item.setAttribute('data-light', plant.Light_intensity);
    item.setAttribute('data-season', `${plant.Bloom_start} to ${plant.Bloom_end}`);
    item.setAttribute('data-moisture', plant.Soil_moisture);
    item.setAttribute('data-height', plant.Height);

    const image = document.createElement('img');
    image.src = `catalogphoto/${plant.Common_name}.jpg`; // Adjust this to your actual image URL field
    image.alt = plant.Common_name; // Use common name or appropriate alt text

    // Handle image load errors
    image.onerror = function() {
        image.src = 'assets/logo1.png'; // Path to your default image
        image.alt = 'Image Not Available :('; // Alt text for the default image
    };

    item.appendChild(image);

    const heading = document.createElement('h3');
    heading.textContent = plant.Common_name;
    item.appendChild(heading);

    const ul = document.createElement('p');
    ul.innerHTML = `
    <span class="scientific-name">${plant.Scientific_name}</span>
    `;
    item.appendChild(ul);

    // Add click event listener to redirect to catalog page
    item.addEventListener('click', function() {
        // Redirect to catalog page with optional query parameter
        window.location.href = `catalog.html?plant=${encodeURIComponent(plant.Common_name)}`;
    });

    return item;
}
