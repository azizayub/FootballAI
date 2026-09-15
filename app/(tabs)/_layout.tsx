import { Tabs } from 'expo-router';
import { TabBar } from '@/components/common/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="rankings" options={{ title: 'Rankings' }} />
    </Tabs>
  );
}
