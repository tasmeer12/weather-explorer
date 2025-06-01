import axios from "axios";
import { getFromCache, saveToCache } from "../utils/cache";
import { normalizeCurrentWeather, normalizeForecast } from "../utils/normalize";
import { OPEN_WEATHER_API_KEY, BASE_URL } from "@env";

// handle api errors like rate limiting or failures
function processWeatherApiError(err) {
  if (err.response?.status === 429) {
    throw new Error("RATE_LIMIT");
  } else {
    throw new Error("FETCH_FAILED");
  }
}

// fetch current weather data from api or cache
export async function getCurrentWeatherData(cityName) {
  if (!cityName) throw new Error("City name is required");

  const cacheKey = `current:${cityName.toLowerCase()}`;
  const cached = await getFromCache(cacheKey); // try loading from cache first
  if (cached) return cached;

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: cityName,
        appid: OPEN_WEATHER_API_KEY,
        units: "metric",
      },
    });

    const normalized = normalizeCurrentWeather(response.data); // clean up api data
    await saveToCache(cacheKey, normalized); // save for offline use
    return normalized;
  } catch (err) {
    processWeatherApiError(err);
  }
}

// fetch 5-day forecast either from api or cache
export async function getForecastData5Day(cityName) {
  if (!cityName) throw new Error("City name is required");

  const cacheKey = `forecast:${cityName.toLowerCase()}`;
  const cached = await getFromCache(cacheKey); // try loading from cache first
  if (cached) return cached;

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: cityName,
        appid: OPEN_WEATHER_API_KEY,
        units: "metric",
      },
    });

    const grouped = normalizeForecast(response.data.list); // structure forecast data per day
    await saveToCache(cacheKey, grouped); // store it for reuse
    return grouped;
  } catch (err) {
    processWeatherApiError(err);
  }
}
