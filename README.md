# Weather Explorer 🌦️

A modern, responsive React Native weather app built using Expo, designed to fetch and display real-time weather data and 5-day forecasts. Built with scalability and offline capability in mind, Weather Explorer combines clean UI with robust data handling via OpenWeatherMap's REST API.

---

## 🔍 Project Overview

Weather Explorer is a location-based weather app where users can:

* Search for any city worldwide
* View current weather conditions
* Toggle between Celsius and Fahrenheit
* Browse 5-day forecasts
* Use cached results when offline

This app demonstrates state management, caching strategies, modular component design, and API integration patterns in a React Native environment.

---

## ✨ Features

* 🌤 Real-time weather data (OpenWeatherMap)
* 📡 Offline-first with local cache fallback
* 💾 Persistent search history
* 🕹 Temperature unit toggle (°C / °F)
* 🔄 Navigation between current weather and forecast views
* ⚙️ Type-safe API utilities and modular architecture

---

## ⚙️ Tech Stack

| Layer         | Tool / Library               |
| ------------- | ---------------------------- |
| Core Runtime  | React Native via Expo        |
| Navigation    | `@react-navigation/native`   |
| HTTP Client   | Axios                        |
| Local Storage | AsyncStorage (via utilities) |
| Icons         | Expo Icons / Ionicons        |
| API           | OpenWeatherMap REST API      |

---

## 🛠 Setup Instructions


# Clone the repo
 git clone https://github.com/tasmeer12/weather-explorer
 cd weather-explorer

# Install dependencies
 npm install

# Setup your .env file
OPEN_WEATHER_API_KEY=your_api_key_here

# Run the app
 npx expo start
```

Make sure you have the Expo Go app installed on your mobile device or an Android/iOS simulator running locally.


 📦 File Structure

```
weather-explorer/
├── App.js                     # Root app component
├── screens/
│   ├── SearchScreen.js        # Search UI and history manager
│   ├── CurrentWeatherScreen.js# Weather display UI
│   └── ForecastScreen.js      # 5-day forecast screen
├── services/
│   └── weatherService.js      # Weather + Forecast data handlers
├── utils/
│   ├── cache.js               # AsyncStorage wrapper
│   ├── convertTemp.js         # °C ↔ °F conversion
│   └── normalize.js           # API response formatters
├── storage/
│   └── history.js             # Search history management
├── hooks/
│   └── useNetworkStatus.js    # Connectivity hook
├── .env                       # API key config
└── app.json                   # Expo config
```


 🌐 API Integration (OpenWeatherMap)

We use two endpoints from OpenWeatherMap:

 1. Current Weather

```
GET https://api.openweathermap.org/data/2.5/weather?q=CityName&appid=API_KEY&units=metric
```

2. 5-Day Forecast

```
GET https://api.openweathermap.org/data/2.5/forecast?q=CityName&appid=API_KEY&units=metric
```

All API requests are wrapped in `weatherService.js` with built-in caching logic using `AsyncStorage`.


 🧪 Testing (Recommended additions)

Add basic unit tests in `__tests__/`:


npm install --save-dev jest-expo
```

Test example for `convertTemp.js`:

```js
import { toFahrenheit } from '../utils/convertTemp';

test('convert to Fahrenheit', () => {
  expect(toFahrenheit(0)).toBe(32);
});
```

---

## 📬 Contact

For questions, reach out to azharfakiha@gmail.com | 2022413@student.cct.ie or open an issue.

---

> Built with ❤️ by Tasmeer And Hassan — feel free to fork and improve!
