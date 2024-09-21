const openWeatherApiKey = 'eba268ad2b5604ed8636f5e57ce3cebf';
const googleMapsApiKey = 'AIzaSyBdrbcmaVg00iq45x6iIx5EZ4k-G9tQPY0';

// Function to get URL parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        lat: params.get('lat'),
        lon: params.get('lon')
    };
}

// Function to fetch weather data from OpenWeather API
async function fetchWeatherData(lat, lon) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;

    try {
        const response = await fetch(weatherApiUrl);
        const weatherData = await response.json();
        if (response.ok) {
            displayWeatherData(weatherData);
            setBackground(weatherData.weather[0].main);
        } else {
            console.error('Error fetching weather data:', weatherData.message);
            alert('Failed to retrieve weather data. Please try again.');
            setBackground('default');
        }
    } catch (error) {
        console.error('Network error while fetching weather data:', error);
        alert('Network error while fetching weather data. Please try again.');
    }
}

// Function to fetch place name using reverse geocoding
async function fetchPlaceName(lat, lon) {
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleMapsApiKey}`;

    try {
        const response = await fetch(geocodeApiUrl);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            // Find the most appropriate address component (e.g., city)
            for (let result of data.results) {
                if (result.types.includes("locality")) {
                    return result.formatted_address;
                }
            }
            // Fallback to the first result if no locality found
            return data.results[0].formatted_address;
        } else {
            return 'Unknown Location';
        }
    } catch (error) {
        console.error('Error fetching place name:', error);
        return 'Unknown Location';
    }
}

// Function to format UNIX timestamp to readable time
function formatTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours();
    const minutes = "0" + date.getUTCMinutes();
    return `${hours}:${minutes.substr(-2)}`;
}

// Function to set the background based on weather condition
function setBackground(condition) {
    const body = document.body;
    // Remove any existing weather classes
    body.classList.remove('clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'fog', 'drizzle', 'mist', 'smoke', 'haze', 'dust', 'sand', 'ash', 'squall', 'tornado', 'default-background');

    // Normalize condition string
    const conditionLower = condition.toLowerCase();
    console.log('Weather Condition:', conditionLower); // Debugging log

    // Mapping of conditions to CSS classes
    const weatherClassMap = {
        'clear': 'clear',
        'clouds': 'clouds',
        'rain': 'rain',
        'drizzle': 'drizzle',
        'thunderstorm': 'thunderstorm',
        'snow': 'snow',
        'fog': 'fog',
        'mist': 'fog',         // Both fog and mist use the 'fog' class
        'smoke': 'fog',        // Map smoke to fog
        'haze': 'fog',         // Map haze to fog
        'dust': 'fog',         // Map dust to fog
        'sand': 'fog',         // Map sand to fog
        'ash': 'fog',          // Map ash to fog
        'squall': 'thunderstorm', // Map squall to thunderstorm
        'tornado': 'thunderstorm' // Map tornado to thunderstorm
    };

    // Find the corresponding class
    const weatherClass = Object.keys(weatherClassMap).find(key => conditionLower.includes(key));

    if (weatherClass) {
        console.log(`Applying background class: ${weatherClassMap[weatherClass]}`); // Debugging log
        body.classList.add(weatherClassMap[weatherClass]);
    } else {
        console.log('Applying default background class'); // Debugging log
        body.classList.add('default-background'); // Fallback background
    }
}

// Function to display fetched weather data on the page
async function displayWeatherData(data) {
    // Fetch place name using reverse geocoding
    const placeName = await fetchPlaceName(data.coord.lat, data.coord.lon);

    document.getElementById('place-name').textContent = placeName;
    document.getElementById('temp').textContent = data.main.temp;
    document.getElementById('feels-like').textContent = data.main.feels_like;
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset, data.timezone);
    document.getElementById('pressure').textContent = data.main.pressure;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('clouds').textContent = data.clouds.all;
    document.getElementById('wind-speed').textContent = data.wind.speed;
}

// Get the coordinates from the URL and fetch weather data on page load
document.addEventListener('DOMContentLoaded', () => {
    const { lat, lon } = getQueryParams();
    if (lat && lon) {
        fetchWeatherData(lat, lon);
    } else {
        alert('No coordinates found in the URL.');
    }
});
