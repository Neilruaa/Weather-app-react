import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherByCoords } from '../services/weatherApi';
import { getWeatherDetails } from '../utils/weatherCodes';
import { getWindDirection } from '../utils/windDirection';
import DetailRow from '../components/DetailRow';

const DetailScreen = ({ route, navigation }) => {
  const { latitude, longitude, name, country, admin1 } = route.params;
  
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchWeatherByCoords(latitude, longitude);
        data.details = getWeatherDetails(data.current.weather_code);
        setWeatherData(data);
      } catch (error) {
        setErrorMsg('Impossible de charger la météo.');
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, [latitude, longitude]);

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getSubLocation = () => {
    if (admin1 && country) return `${admin1}, ${country}`;
    if (country) return country;
    return '';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg || !weatherData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{errorMsg || 'Données indisponibles'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { current, daily } = weatherData;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* En-tête Météo (Carte principale) */}
        <View style={styles.mainCard}>
          <Text style={styles.cityName}>{name}</Text>
          <Text style={styles.countryName}>{getSubLocation()}</Text>
          
          <Text style={styles.weatherIcon}>{weatherData.details.icon}</Text>
          <Text style={styles.temperature}>{Math.round(current.temperature_2m)}°</Text>
          <Text style={styles.description}>{weatherData.details.label}</Text>
          <Text style={styles.feelsLike}>Ressenti : {Math.round(current.apparent_temperature)}°</Text>
        </View>

        {/* Détails météo */}
        <Text style={styles.sectionTitle}>DÉTAILS MÉTÉO</Text>
        <View style={styles.detailsCard}>
          <DetailRow 
            icon="🌡️" 
            label="Min / Max" 
            value={`${Math.round(daily.temperature_2m_min[0])}° / ${Math.round(daily.temperature_2m_max[0])}°`} 
          />
          <DetailRow 
            icon="💧" 
            label="Humidité" 
            value={`${current.relative_humidity_2m}%`} 
          />
          <DetailRow 
            icon="💨" 
            label="Vent" 
            value={`${Math.round(current.wind_speed_10m)} km/h`} 
          />
          <DetailRow 
            icon="🧭" 
            label="Direction" 
            value={getWindDirection(current.wind_direction_10m)} 
          />
          <DetailRow 
            icon="⏲️" 
            label="Pression" 
            value={`${Math.round(current.surface_pressure)} hPa`} 
          />
          <DetailRow 
            icon="🌧️" 
            label="Pluie" 
            value={`${current.precipitation} mm`} 
          />
          <DetailRow 
            icon="🌅" 
            label="Lever du soleil" 
            value={formatTime(daily.sunrise[0])} 
          />
          <DetailRow 
            icon="🌇" 
            label="Coucher du soleil" 
            value={formatTime(daily.sunset[0])} 
            isLast={true}
          />
        </View>

        <Text style={styles.updateTime}>
          Dernière mise à jour : Aujourd'hui {formatTime(current.time)}
        </Text>

        {/* Le bouton favoris sera rendu actif dans le commit 5 */}
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteButtonText}>⭐ Ajouter aux favoris</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1b2e',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    color: '#63b3ed',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff8a8a',
    fontSize: 16,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cityName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  countryName: {
    color: '#a0aec0',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  weatherIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  temperature: {
    color: '#ffffff',
    fontSize: 72,
    fontWeight: '300',
    lineHeight: 80,
  },
  description: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  feelsLike: {
    color: '#a0aec0',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 1,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  updateTime: {
    color: '#a0aec0',
    fontSize: 12,
    marginBottom: 24,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  favoriteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailScreen;
