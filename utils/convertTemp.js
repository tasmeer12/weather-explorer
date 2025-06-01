/**
 * Converts Celsius to Fahrenheit
 * Formula: (°C × 9/5) + 32
 * @param {number} celsius
 * @returns {number|null}
 */
export function toFahrenheit(celsius) {
  if (typeof celsius !== 'number' || isNaN(celsius)) {
    console.warn("Invalid input for Celsius → Fahrenheit conversion.");
    return null;
  }
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Converts Fahrenheit to Celsius
 * Formula: (°F − 32) × 5/9
 * @param {number} fahrenheit
 * @returns {number|null}
 */
export function toCelsius(fahrenheit) {
  if (typeof fahrenheit !== 'number' || isNaN(fahrenheit)) {
    console.warn("Invalid input for Fahrenheit → Celsius conversion.");
    return null;
  }
  return Math.round(((fahrenheit - 32) * 5) / 9);
}
