document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'eba268ad2b5604ed8636f5e57ce3cebf';  // Replace with your OpenWeather API key
   
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
    });
  
    // Add the legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <div style="background-color:white;padding:10px;border-radius:5px;">
          <p><strong>Wind speed, m/s</strong></p>
          <div>0 - 100</div>
          <div style="display:flex;justify-content:space-between;width:100%;">
            <span>0</span>
            <span>3</span>
            <span>6</span>
            <span>12</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      `;
      return div;
    };
  
    legend.addTo(map);
  });
  