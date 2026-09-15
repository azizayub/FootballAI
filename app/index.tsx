import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Text style={styles.logoFootball}>Football</Text>
        <Text style={styles.logoAI}> AI</Text>
      </View>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoFootball: {
    fontSize: 32,
    fontWeight: '300',
    color: Colors.secondaryText,
  },
  logoAI: {
    fontSize: 32,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.primaryText,
  },
});
