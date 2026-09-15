import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { Radii } from '@/constants/theme';

interface PlayerAvatarProps {
  uri: string;
  size?: number;
}

export function PlayerAvatar({ uri, size = 44 }: PlayerAvatarProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    overflow: 'hidden',
  },
});
