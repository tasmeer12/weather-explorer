import { View, Text, StyleSheet } from 'react-native';

export default function Header({ title = 'Weather Explorer' }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    backgroundColor: '#1e90ff',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  }
});
