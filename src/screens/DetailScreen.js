import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const DetailScreen = ({ route, navigation }) => {
  const { name, country } = route.params || { name: 'Inconnu', country: '' };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{country}</Text>
        <Text style={styles.temp}>Météo à venir dans le commit 4 !</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1b2e',
  },
  header: {
    padding: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    color: '#63b3ed',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#a0aec0',
    fontSize: 16,
    marginTop: 4,
  },
  temp: {
    color: '#ffffff',
    marginTop: 20,
    fontSize: 18,
  },
});

export default DetailScreen;
