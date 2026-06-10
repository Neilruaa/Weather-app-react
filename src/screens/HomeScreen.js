import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { fetchWeatherByCoords } from '../services/weatherApi';
import { getWeatherDetails } from '../utils/weatherCodes';
import CurrentWeatherCard from '../components/CurrentWeatherCard';
import SearchBar from '../components/SearchBar';

const HomeScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission de localisation refusée.');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        let reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        const city = reverseGeocode[0]?.city || reverseGeocode[0]?.subregion || 'Position actuelle';
        const country = reverseGeocode[0]?.country || '';

        setCurrentLocation({ name: city, country });

        const weatherData = await fetchWeatherByCoords(lat, lon);
        weatherData.details = getWeatherDetails(weatherData.current.weather_code);
        setCurrentWeather(weatherData);

      } catch (error) {
        setErrorMsg('Erreur lors de la récupération des données.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectCity = (city) => {
    navigation.navigate('Detail', {
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country,
      admin1: city.admin1,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Météo</Text>
          <Text style={styles.subtitle}>Vos villes en un coup d'œil</Text>
        </View>

        <SearchBar onSelectCity={handleSelectCity} />

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Localisation en cours...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : (
          <CurrentWeatherCard
            weatherData={currentWeather}
            locationName={currentLocation?.name}
            country={currentLocation?.country}
          />
        )}

        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>VILLES FAVORITES</Text>
          <View style={styles.favoritesGrid}>
            <Text style={styles.emptyFavorites}>Aucune ville en favoris pour l'instant.</Text>
            {/* Les favoris seront implémentés dans le commit 5 */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1b2e',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#a0aec0',
    fontSize: 16,
    marginTop: 4,
  },
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    marginVertical: 16,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#ff8a8a',
    fontSize: 16,
    textAlign: 'center',
  },
  favoritesSection: {
    marginTop: 16,
  },
  sectionTitle: {
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 1,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  emptyFavorites: {
    color: '#a0aec0',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
