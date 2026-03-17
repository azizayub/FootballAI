import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default function PlayerDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Player Detail Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.primaryText,
    fontSize: 18,
  },
});
