import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "searchHistory";
const MAX_HISTORY_ENTRIES = 5;

/**
 * Save a city name to local history.
 * Keeps history unique and limited to recent entries.
 * @param {string} city
 * @returns {Promise<string[]>}
 */

export async function saveToHistory(city) {
  try {
    const existing = await getHistory();
    const uniqueHistory = [
      city,
      ...existing.filter((item) => item !== city),
    ].slice(0, MAX_HISTORY_ENTRIES);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueHistory));
    return uniqueHistory;
  } catch (err) {
    console.error("Failed to save history:", err);
    throw err;
  }
}

/**
 * Fetch recent search history from local storage.
 * @returns {Promise<string[]>}
 */
export async function getHistory() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to load history:", err);
    return [];
  }
}

/**
 * Clear all saved search history.
 */
export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}
