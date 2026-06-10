import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { searchCity } from '../services/weatherApi';

const SearchBar = ({ onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        setError('');
        try {
          const data = await searchCity(query);
          setResults(data);
          if (data.length === 0) {
            setError('Aucune ville trouvée');
          }
        } catch (err) {
          setError('Erreur lors de la recherche');
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setError('');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (city) => {
    setQuery('');
    setResults([]);
    onSelectCity(city);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Rechercher une ville"
          placeholderTextColor="#a0aec0"
          value={query}
          onChangeText={setQuery}
        />
        {isSearching && <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled">
            {results.map((item) => (
              <TouchableOpacity key={`${item.id}-${item.latitude}`} style={styles.resultItem} onPress={() => handleSelect(item)}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultDetails}>
                  {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  loader: {
    marginLeft: 12,
  },
  resultsContainer: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#1a2a44',
    borderRadius: 16,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  resultName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultDetails: {
    color: '#a0aec0',
    fontSize: 12,
  },
  errorContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#ff8a8a',
    fontSize: 14,
  },
});

export default SearchBar;
