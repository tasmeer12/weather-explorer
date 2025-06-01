import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from './screens/SearchScreen';
import CurrentWeatherScreen from './screens/CurrentWeather';
import ForecastScreen from './screens/ForecastScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="CurrentWeather" component={CurrentWeatherScreen} />
        <Stack.Screen name="Forecast" component={ForecastScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
