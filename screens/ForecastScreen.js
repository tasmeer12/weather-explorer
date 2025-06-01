import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getForecastData5Day } from "../services/weatherService";
import { getFromCache } from "../utils/cache";
import { Ionicons } from "@expo/vector-icons";
import useNetworkStatus from "../hooks/useNetworkStatus";

export default function ForecastScreen() {
  const navigation = useNavigation();
  const { city } = useRoute().params;
  const isConnected = useNetworkStatus();

  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    // fetch forecast data either from the cache or api
    async function retrieve5DayForecast() {
      console.log("Fetching forecast for:", city);
      setIsLoading(true);
      setFetchError("");

      try {
        // if offline, try to load forecast from cache
        if (!isConnected) {
          console.log("Offline. attempting to load forecast from cache.");
          const cached = await getFromCache(`forecast:${city.toLowerCase()}`);
          if (cached) {
            console.log("cache hit");
            const formatted = Object.entries(cached).map(([date, values]) => ({
              date,
              ...values,
            }));
            setForecast(formatted);
          } else {
            console.log("cache miss");
            setFetchError("No internet connection. Cached forecast not found.");
          }
        } else {
          // otherwise get fresh forecast data
          console.log("Online. Fetching from api.");
          const data = await getForecastData5Day(city);
          const formatted = Object.entries(data).map(([date, values]) => ({
            date,
            ...values,
          }));
          setForecast(formatted);
        }
      } catch (err) {
        console.log("Error fetching forecast:", err);
        setFetchError("No internet connection or forecast unavailable.");
      } finally {
        setIsLoading(false);
      }
    }

    retrieve5DayForecast();
  }, [city, isConnected]);

  // displays a forecast card for each day
  const renderForecastCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`,
        }}
        style={styles.icon}
      />
      <Text style={styles.tempRange}>
        {Math.round(item.temp_min)}°C - {Math.round(item.temp_max)}°C
      </Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : fetchError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{fetchError}</Text>
        </View>
      ) : (
        // shows forecast data in a scrollable list style
        <FlatList
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>5-Day Forecast</Text>
              <View style={{ height: 12 }} />
            </View>
          )}
          data={forecast}
          renderItem={renderForecastCard} // displays each day as a card with weather info
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 16,
    zIndex: 10,
  },
  listContainer: {
    paddingBottom: 32,
  },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  icon: {
    width: 60,
    height: 60,
    marginVertical: 8,
  },
  tempRange: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    textTransform: "capitalize",
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
