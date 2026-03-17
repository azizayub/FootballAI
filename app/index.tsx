import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoContainer}>
        <Text style={styles.football}>Football</Text>
        <Text style={styles.ai}> AI</Text>
      </Text>
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
  logoContainer: {
    textAlign: 'center',
  },
  football: {
    color: '#8E8E93',
    fontSize: 42,
    fontWeight: '200',
  },
  ai: {
    color: Colors.primaryText,
    fontSize: 42,
    fontWeight: '800',
    fontStyle: 'italic',
  },
});
