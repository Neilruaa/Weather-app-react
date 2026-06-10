import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { fetchWeatherByCoords } from '../services/weatherApi';
import { getWeatherDetails } from '../utils/weatherCodes';
import { getFavorites } from '../services/favoritesStorage';
import CurrentWeatherCard from '../components/CurrentWeatherCard';
import FavoriteCard from '../components/FavoriteCard';
import SearchBar from '../components/SearchBar';


const HomeScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoritesWeather, setFavoritesWeather] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
    
    // Charger la météo pour chaque favori
    const weathers = {};
    for (let fav of favs) {
      try {
        const data = await fetchWeatherByCoords(fav.latitude, fav.longitude);
        data.details = getWeatherDetails(data.current.weather_code);
        weathers[`${fav.latitude}-${fav.longitude}`] = data;
      } catch (err) {
        console.error('Erreur météo favori:', err);
      }
    }
    setFavoritesWeather(weathers);
  };

  const loadInitialData = async () => {
    setLoading(true);
    setErrorMsg('');
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
      setErrorMsg('Erreur réseau ou localisation introuvable.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
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
            <TouchableOpacity style={styles.retryButton} onPress={loadInitialData}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
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
            {favorites.length === 0 ? (
              <Text style={styles.emptyFavorites}>Aucune ville en favoris pour l'instant.</Text>
            ) : (
              favorites.map((fav, index) => (
                <View key={index} style={styles.favoriteCardContainer}>
                  <FavoriteCard 
                    city={fav} 
                    weatherData={favoritesWeather[`${fav.latitude}-${fav.longitude}`]} 
                    onPress={() => handleSelectCity(fav)}
                  />
                </View>
              ))
            )}
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
    justifyContent: 'space-between',
  },
  favoriteCardContainer: {
    width: '48%', // 2 colonnes
    marginBottom: 16,
  },
  emptyFavorites: {
    color: '#a0aec0',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
