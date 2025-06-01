import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Retrieve cached JSON value by key
 * @param {string} key
 * @returns {Promise<any|null>}
 */
export async function getFromCache(key) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.warn('Cache read error:', err.message);
    return null;
  }
}

/**
 * Save value to cache
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function saveToCache(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Cache write error:', err.message);
  }
}
