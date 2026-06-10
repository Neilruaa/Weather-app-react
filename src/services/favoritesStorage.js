import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erreur lecture favoris:', e);
    return [];
  }
};

export const saveFavorites = async (favorites) => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
  } catch (e) {
    console.error('Erreur sauvegarde favoris:', e);
  }
};

export const addFavorite = async (city) => {
  try {
    const favorites = await getFavorites();
    // Vérifier si la ville n'est pas déjà dans les favoris
    const isExist = favorites.some((f) => f.latitude === city.latitude && f.longitude === city.longitude);
    if (!isExist) {
      favorites.push(city);
      await saveFavorites(favorites);
    }
  } catch (e) {
    console.error('Erreur ajout favori:', e);
  }
};

export const removeFavorite = async (lat, lon) => {
  try {
    let favorites = await getFavorites();
    favorites = favorites.filter((f) => f.latitude !== lat || f.longitude !== lon);
    await saveFavorites(favorites);
  } catch (e) {
    console.error('Erreur retrait favori:', e);
  }
};

export const isFavorite = async (lat, lon) => {
  try {
    const favorites = await getFavorites();
    return favorites.some((f) => f.latitude === lat && f.longitude === lon);
  } catch (e) {
    console.error('Erreur check favori:', e);
    return false;
  }
};
