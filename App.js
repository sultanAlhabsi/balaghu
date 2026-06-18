import { ActivityIndicator, I18nManager, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/mobile/screens/HomeScreen';
import { typography } from './src/mobile/theme/typography';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL(false);

export default function App() {
  const [fontsLoaded] = useFonts({
    [typography.fonts.quran]: require('./assets/fonts/AmiriQuran-Regular.ttf'),
    [typography.fonts.regular]: require('./assets/fonts/IBMPlexSansArabic-Regular.ttf'),
    [typography.fonts.semiBold]: require('./assets/fonts/IBMPlexSansArabic-SemiBold.ttf'),
    [typography.fonts.bold]: require('./assets/fonts/IBMPlexSansArabic-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#1F7A5C" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <HomeScreen />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF7',
  },
});
