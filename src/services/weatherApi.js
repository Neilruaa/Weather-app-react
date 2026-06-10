const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation',
      daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
      timezone: 'auto',
    });

    const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données météo');
    }

    return await response.json();
  } catch (error) {
    console.error('fetchWeatherByCoords error:', error);
    throw error;
  }
};

export const searchCity = async (query) => {
  try {
    const params = new URLSearchParams({
      name: query,
      count: 5,
      language: 'fr',
      format: 'json',
    });

    const response = await fetch(`${GEOCODING_API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche de la ville');
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('searchCity error:', error);
    throw error;
  }
};
