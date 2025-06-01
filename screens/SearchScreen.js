import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getHistory, saveToHistory, clearHistory } from "../storage/history";

export default function SearchScreen() {
  const navigation = useNavigation();
  const [cityName, setCityName] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // loads search history from storage when the screen is loading
    console.log("loading history");
    loadStoredCities();
  }, []);

  // gets the stored city list and shows them in the ui
  const loadStoredCities = async () => {
    console.log("Fetching history from storage");
    const stored = await getHistory();
    setSearchHistory(stored);
  };

  // removes extra spaces from the user input, saves the city to local history, clears up the input search box,updates the list and moves to weather screen with selected city
  const submitCitySearch = async () => {
    const trimmed = cityName.trim();
    if (!trimmed) return;

    await saveToHistory(trimmed);
    setCityName("");
    await loadStoredCities();
    navigation.navigate("CurrentWeather", { city: trimmed });
  };

  // uses the history to go to the weather page
  const jumpToWeatherFromHistory = (selectedCity) => {
    navigation.navigate("CurrentWeather", { city: selectedCity });
  };

  // clear all stored cities as histroy and no component shows on the frontend
  const eraseSearchHistory = async () => {
    console.log("Clearing search history");
    await clearHistory();
    setSearchHistory([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.appTitle}>Weather Explorer</Text>
              <Text style={styles.headline}>Know before you go 🌦️</Text>
            </View>

            {/* User types a city name and in return gets the weather for that city */}
            <View style={styles.searchRow}>
              <View style={styles.searchInputContainer}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#aaa"
                  style={{ marginHorizontal: 6 }}
                />
                <TextInput
                  placeholder="Search for a city..."
                  value={cityName}
                  onChangeText={setCityName}
                  style={styles.input}
                  placeholderTextColor="#aaa"
                />
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={submitCitySearch}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
            {/* first checks then shows your recent seacrches as history */}
            {searchHistory.length > 0 && (
              <View style={styles.historyHeader}>
                <Text style={styles.subtitle}>Search History</Text>
                <TouchableOpacity onPress={eraseSearchHistory}>
                  <Text style={styles.clearBtn}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        data={searchHistory}
        keyExtractor={(item) => item}
        // each history item can be clicked to fetch weather again even without network
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyItem}
            onPress={() => jumpToWeatherFromHistory(item)}
          >
            <View style={styles.historyLeft}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#666"
                style={{ marginRight: 12 }}
              />
              <Text style={styles.historyText}>{item}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.innerContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.select({ ios: 50, android: 30 }),
  },
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },

  hero: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },

  appTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  headline: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  historySection: {
    marginTop: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearBtn: {
    color: "red",
    fontWeight: "600",
    fontSize: 14,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyText: {
    fontSize: 16,
    color: "#333",
  },
});
