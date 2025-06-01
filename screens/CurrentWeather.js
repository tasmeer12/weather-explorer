import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getCurrentWeatherData } from "../services/weatherService";
import { toFahrenheit } from "../utils/convertTemp";
import { Ionicons } from "@expo/vector-icons";
import useNetworkStatus from "../hooks/useNetworkStatus";
import { getFromCache } from "../utils/cache";

export default function CurrentWeatherScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const city = params?.city || "";
  const isConnected = useNetworkStatus();

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  useEffect(() => {
    async function retrieveCityWeather() {
      console.log("Checking connectivity and loading weather for:", city);
      setIsLoading(true);
      setError("");
      try {
        // if offline and no network found then try to load from cache first
        if (!isConnected) {
          console.log("No internet, checking cache for:", city);
          const cached = await getFromCache(`current:${city.toLowerCase()}`);
          if (cached) {
            console.log("Cache hit");
            setWeather(cached);
          } else {
            console.log("Cache miss");
            setError("No internet connection. Connect and try again.");
          }
        } else {
          // otherwise fetch live data from the api
          console.log("Online, fetching data from api");
          const data = await getCurrentWeatherData(city);
          setWeather(data);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("No internet connection or data not found.");
      } finally {
        setIsLoading(false);
      }
    }

    retrieveCityWeather();
  }, [city, isConnected]);

  // helps in toggling btw celsius to fahrenheit and vice versa
  const formatTemperature = (celsius) => {
    const result = isFahrenheit
      ? `${toFahrenheit(celsius)} °F`
      : `${celsius} °C`;
    console.log("  Display temp:", result);
    return result;
  };

  const currentDateTime = new Date().toLocaleString();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : weather ? (
        <View style={styles.card}>
          <Text style={styles.cityName}>{weather.city}</Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
            }}
            style={styles.icon}
          />
          <Text style={styles.description}>{weather.description}</Text>
          <Text style={styles.temperature}>
            {formatTemperature(weather.temperature)}
          </Text>
          <Text style={styles.statText}>Humidity: {weather.humidity}%</Text>
          <Text style={styles.statText}>
            Wind Speed: {weather.windSpeed} m/s
          </Text>
          <Text style={styles.timeText}>{currentDateTime}</Text>

          <View style={styles.toggle}>
            <Text>°F</Text>
            <Switch value={isFahrenheit} onValueChange={setIsFahrenheit} />
            <Text>°C</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Forecast", { city })}
            style={styles.forecastButton}
          >
            <Text style={styles.forecastButtonText}>View 5-Day Forecast</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
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

  forecastButton: {
    marginTop: 20,
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  forecastButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 16,
    zIndex: 10,
  },

  description: {
    fontSize: 16,
    textTransform: "capitalize",
  },

  statText: {
    fontSize: 16,
    marginTop: 4,
  },

  timeText: {
    fontSize: 14,
    marginTop: 8,
  },

  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },

  icon: {
    width: 100,
    height: 100,
  },

  temperature: {
    fontSize: 32,
    fontWeight: "bold",
  },

  toggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
});
