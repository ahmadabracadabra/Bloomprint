document.addEventListener('DOMContentLoaded', function () {
  // Initial fetch and display of plants
  fetchPlants();

  // Event listener for filter changes
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', applyFilters);
  });

  // Event listener for search bar changes (keyup event for live search)
  document.getElementById('search-bar').addEventListener('keyup', applyFilters);
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
  item.setAttribute('data-type', plant.Type);
  item.setAttribute('data-light', plant.Light_intensity);
  item.setAttribute('data-season', `${plant.Bloom_start} to ${plant.Bloom_end}`);
  item.setAttribute('data-moisture', plant.Soil_moisture);
  item.setAttribute('data-height', plant.Height);

  const image = document.createElement('img'); 
  image.src = `catalogphoto/${plant.Common_name}.jpg`; // Adjust this to your actual image URL field
  image.alt = plant.Common_name; // Use common name or appropriate alt text

//image load errors replacement
image.onerror = function() {
  image.src = 'assets/noimageyet.jpg'; // Path to your default image
  image.alt = 'Image Not Avaliable :('; // Alt text for the default image
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
      <li>Zone: <span class="zone">${plant.Hardiness_zone}</span></li>
  `;
  item.appendChild(ul);

  return item;
}
