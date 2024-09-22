const apiKey = 'eba268ad2b5604ed8636f5e57ce3cebf';  // Replace with your OpenWeather API key
 // Replace with your OpenWeather API key 
document.addEventListener('DOMContentLoaded', () => {

    const defaultLayer = 'temp_new';
    const map = L.map('mapContainer').setView([20, 78], 5);  // Center on India
  
    // Add the base layer for place names (OpenStreetMap)
    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Function to create a weather layer
    function createTileLayer(layer) {
      return L.tileLayer(`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`, {
        maxZoom: 18
      });
    }
  
    // Add default weather layer (temperature)
    let currentLayer = createTileLayer(defaultLayer).addTo(map);
  
    // Layer select dropdown functionality
    const layerSelect = document.getElementById('layerSelect');
    layerSelect.addEventListener('change', (event) => {
      const selectedLayer = event.target.value;
      map.removeLayer(currentLayer);
      currentLayer = createTileLayer(selectedLayer).addTo(map);
      updateLegend(selectedLayer);  // Update legend when layer changes
    });
  
    // Function to get the appropriate gradient and labels for each layer
    function getColorGradient(layer) {
        switch (layer) {
          case 'temp_new':
            return {
              gradient: 'linear-gradient(to right, blue, lightblue, yellow, orange, red)',
              labels: ['-40', '-20', '0', '20', '40']
            };
          case 'wind_new':
            return {
              gradient: 'linear-gradient(to right, #C8E6F9, #7DB2ED, #5B88E3, #355FD0, #1E2E8E)',
              labels: ['0', '5', '10', '25', '50', '100']
            };
          case 'clouds_new':
            return {
              gradient: 'linear-gradient(to right, #FFFFFF, #C0C0C0, #808080, #404040, #000000)',
              labels: ['0%', '25%', '50%', '75%', '100%']
            };
          case 'precipitation_new':
            return {
              gradient: 'linear-gradient(to right, lightgreen, green, yellow, orange, red)',
              labels: ['0', '2', '5', '10', '50']
            };
          case 'pressure_new':
            return {
              gradient: 'linear-gradient(to right, #00FF00, #FFFF00, #FF8000, #FF0000)',
              labels: ['950', '980', '1010', '1040', '1070']
            };
          default:
            return {};
        }
    }
  
    // Function to get the title for the legend
    function getLegendTitle(layer) {
        switch (layer) {
          case 'temp_new':
            return 'Temperature (°C)';
          case 'wind_new':
            return 'Wind Speed (m/s)';
          case 'clouds_new':
            return 'Cloud Cover (%)';
          case 'precipitation_new':
            return 'Precipitation (mm/h)';
          case 'pressure_new':
            return 'Pressure (hPa)';
          default:
            return '';
        }
    }

    // Function to update the legend based on the selected layer
    function updateLegend(layer) {
        const { gradient, labels } = getColorGradient(layer);

        // Update the legend content with more spacing between labels
        let legendContent = `<strong>${getLegendTitle(layer)}</strong><br>
                             <div style="background: ${gradient}; width: 100%; height: 20px; border-radius: 5px;"></div>
                             <div style="display: flex; justify-content: space-around; margin-top: 10px;">`;  // Added margin-top for spacing

        // Add the labels below the gradient with extra margin
        labels.forEach(label => {
            legendContent += `<span style="flex: 1; text-align: center; margin: 0 10px;">${label}</span>`;  // Flex and margin for spacing
        });

        legendContent += `</div>`;

        // Update the legend element in the DOM
        document.querySelector('.info.legend').innerHTML = `
          <div style="background-color:white;padding:10px;border-radius:5px;">
            ${legendContent}
          </div>`;
    }

    // Add the legend control to the map
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        return div;
    };
  
    legend.addTo(map);
    updateLegend(defaultLayer);  // Initialize with the default layer's legend
});
