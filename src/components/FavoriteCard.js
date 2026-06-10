import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FavoriteCard = ({ city, weatherData, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={styles.cityName} numberOfLines={1}>{city.name}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {weatherData ? weatherData.details.label : '...'}
          </Text>
        </View>
        <Text style={styles.icon}>
          {weatherData ? weatherData.details.icon : '☁️'}
        </Text>
      </View>
      <Text style={styles.temperature}>
        {weatherData ? `${Math.round(weatherData.current.temperature_2m)}°` : '--°'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cityName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#a0aec0',
    fontSize: 12,
  },
  icon: {
    fontSize: 24,
  },
  temperature: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default FavoriteCard;
