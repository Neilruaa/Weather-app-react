export const getWeatherDetails = (weatherCode) => {
  const codes = {
    0: { label: 'Ciel dégagé', icon: '☀️' },
    1: { label: 'Principalement dégagé', icon: '🌤️' },
    2: { label: 'Partiellement nuageux', icon: '⛅' },
    3: { label: 'Nuageux', icon: '☁️' },
    45: { label: 'Brouillard', icon: '🌫️' },
    48: { label: 'Brouillard givrant', icon: '🌫️' },
    51: { label: 'Bruine légère', icon: '🌧️' },
    53: { label: 'Bruine modérée', icon: '🌧️' },
    55: { label: 'Bruine dense', icon: '🌧️' },
    56: { label: 'Bruine verglaçante légère', icon: '🌧️' },
    57: { label: 'Bruine verglaçante dense', icon: '🌧️' },
    61: { label: 'Pluie faible', icon: '🌧️' },
    63: { label: 'Pluie modérée', icon: '🌧️' },
    65: { label: 'Pluie forte', icon: '🌧️' },
    66: { label: 'Pluie verglaçante légère', icon: '🌧️' },
    67: { label: 'Pluie verglaçante forte', icon: '🌧️' },
    71: { label: 'Chute de neige faible', icon: '🌨️' },
    73: { label: 'Chute de neige modérée', icon: '🌨️' },
    75: { label: 'Chute de neige forte', icon: '🌨️' },
    77: { label: 'Grains de neige', icon: '🌨️' },
    80: { label: 'Averses de pluie faibles', icon: '🌦️' },
    81: { label: 'Averses de pluie modérées', icon: '🌦️' },
    82: { label: 'Averses de pluie violentes', icon: '🌧️' },
    85: { label: 'Averses de neige légères', icon: '🌨️' },
    86: { label: 'Averses de neige fortes', icon: '🌨️' },
    95: { label: 'Orage', icon: '⛈️' },
    96: { label: 'Orage avec grêle légère', icon: '⛈️' },
    99: { label: 'Orage avec grêle forte', icon: '⛈️' },
  };

  return codes[weatherCode] || { label: 'Inconnu', icon: '❓' };
};
