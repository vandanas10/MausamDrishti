const openWeatherApiKey = 'eba268ad2b5604ed8636f5e57ce3cebf';

const googleMapsApiKey = 'AIzaSyBdrbcmaVg00iq45x6iIx5EZ4k-G9tQPY0';

let selectedPlaceCoordinates = null; // Variable to store the selected place's coordinates

// Function to initialize Google Maps Places API Autocomplete
function initAutocomplete() {
    const input = document.getElementById('search-input');
    const autocomplete = new google.maps.places.Autocomplete(input);
    
    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            selectedPlaceCoordinates = { lat, lng };  // Store the coordinates
            // console.log(`Selected place: ${place.name}, Latitude: ${lat}, Longitude: ${lng}`);
        } else {
            alert('No location found');
            selectedPlaceCoordinates = null; // Clear previous coordinates
        }
    });
}

// Function to geocode (convert place name to coordinates) if a place wasn't selected from the dropdown
async function geocodePlaceName(placeName) {
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${googleMapsApiKey}`;

    try {
        const response = await fetch(geocodeApiUrl);
        const data = await response.json();

        if (data.status === 'OK') {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            return { lat, lng }; // Return the coordinates
        } else {
            alert('Location not found. Please enter a valid place name.');
            return null;
        }
    } catch (error) {
        console.error('Error geocoding the place:', error);
        return null;
    }
}

// Attach event listener to search button
document.getElementById('search-btn').addEventListener('click', async function () {
    const input = document.getElementById('search-input').value.trim();
    // console.log('Search button clicked');

    if (selectedPlaceCoordinates) {
        const { lat, lng } = selectedPlaceCoordinates;
        console.log('Redirecting with selected coordinates:', lat, lng);
        window.location.href = `weather.html?lat=${lat}&lon=${lng}`; // Redirect to the new page with coordinates as URL parameters
    } else if (input) {
        // If no place was selected, but input is provided, geocode the place name
        const coordinates = await geocodePlaceName(input);
        if (coordinates) {
            const { lat, lng } = coordinates;
            console.log('Redirecting with geocoded coordinates:', lat, lng);
            window.location.href = `weather.html?lat=${lat}&lon=${lng}`; // Redirect to the new page with coordinates as URL parameters
        } else {
            console.error('Failed to fetch coordinates for input:', input);
        }
    } else {
        alert('Please enter a place name or select a place from the dropdown.');
    }
});

// Initialize Google Maps API once the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAutocomplete();
});
