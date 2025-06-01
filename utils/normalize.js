/**
 * Normalize OpenWeather current weather data
 * @param {Object} raw
 * @returns {{
 *   city: string,
 *   temperature: number,
 *   humidity: number,
 *   windSpeed: number,
 *   icon: string,
 *   description: string
 * }}
 */
export function normalizeCurrentWeather(raw) {
  return {
    city: raw.name,
    temperature: raw.main.temp,
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    icon: raw.weather[0].icon,
    description: raw.weather[0].description,
  };
}

/**
 * Normalize 5-day forecast into grouped structure
 * @param {Object[]} rawList
 * @returns {Object}
 */
export function normalizeForecast(rawList) {
  const grouped = {};

  for (const entry of rawList) {
    const date = entry.dt_txt.split(' ')[0];
    if (!grouped[date]) {
      grouped[date] = {
        temp_min: entry.main.temp_min,
        temp_max: entry.main.temp_max,
        icon: entry.weather[0].icon,
        description: entry.weather[0].description
      };
    } else {
      grouped[date].temp_min = Math.min(grouped[date].temp_min, entry.main.temp_min);
      grouped[date].temp_max = Math.max(grouped[date].temp_max, entry.main.temp_max);
    }
  }

  return grouped;
}
