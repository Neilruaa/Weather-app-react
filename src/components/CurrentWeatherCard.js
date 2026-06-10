import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CurrentWeatherCard = ({ weatherData, locationName, country }) => {
  if (!weatherData) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.locationIcon}>📍</Text>
        <View>
          <Text style={styles.locationLabel}>Ma position</Text>
          <Text style={styles.locationName}>
            {locationName}{country ? `, ${country}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.mainInfo}>
        <View>
          <Text style={styles.temperature}>
            {Math.round(weatherData.current.temperature_2m)}°
          </Text>
          <Text style={styles.description}>{weatherData.details.label}</Text>
          <Text style={styles.feelsLike}>
            Ressenti : {Math.round(weatherData.current.apparent_temperature)}°
          </Text>
        </View>
        <Text style={styles.weatherIcon}>{weatherData.details.icon}</Text>
      </View>

      <View style={styles.minMaxContainer}>
        <Text style={styles.minMaxText}>
          Min {Math.round(weatherData.daily.temperature_2m_min[0])}°
        </Text>
        <Text style={styles.divider}>|</Text>
        <Text style={styles.minMaxText}>
          Max {Math.round(weatherData.daily.temperature_2m_max[0])}°
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationLabel: {
    color: '#a0aec0',
    fontSize: 12,
  },
  locationName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  temperature: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: '300',
    lineHeight: 72,
  },
  description: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  feelsLike: {
    color: '#a0aec0',
    fontSize: 14,
  },
  weatherIcon: {
    fontSize: 80,
  },
  minMaxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  minMaxText: {
    color: '#a0aec0',
    fontSize: 14,
  },
  divider: {
    color: '#4a5568',
    marginHorizontal: 12,
  },
});

export default CurrentWeatherCard;
