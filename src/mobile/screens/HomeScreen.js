import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AyahCard from '../components/AyahCard';
import Snackbar from '../components/Snackbar';
import { selectRandomAyahs } from '../data/ayahs';
import { getTheme } from '../theme/colors';
import { typography } from '../theme/typography';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [themeMode, setThemeMode] = useState(colorScheme === 'dark' ? 'dark' : 'light');
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);
  const [displayedAyahs, setDisplayedAyahs] = useState(() => selectRandomAyahs(3));
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [transition, setTransition] = useState({ visible: false, nextMode: themeMode });
  const brandScale = useRef(new Animated.Value(0.94)).current;
  const themeRotation = useRef(new Animated.Value(themeMode === 'dark' ? 180 : 0)).current;
  const themeButtonScale = useRef(new Animated.Value(1)).current;
  const themeOverlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(brandScale, {
        toValue: 1.08,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(brandScale, {
        toValue: 1,
        damping: 12,
        stiffness: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [brandScale]);

  const themeIconRotation = themeRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const showSnackbar = useCallback((message) => {
    setSnackbar({ visible: true, message });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar((current) => ({ ...current, visible: false }));
  }, []);

  const refreshAyahs = useCallback(() => {
    if (refreshing) return;

    setRefreshing(true);

    setTimeout(() => {
      setDisplayedAyahs((currentAyahs) =>
        selectRandomAyahs(
          3,
          currentAyahs.map((ayah) => ayah.id)
        )
      );
      setRefreshing(false);
    }, 650);
  }, [refreshing]);

  const toggleTheme = useCallback(() => {
    if (transition.visible) return;

    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setTransition({ visible: true, nextMode });
    themeOverlayOpacity.setValue(0);

    Animated.sequence([
      Animated.spring(themeButtonScale, {
        toValue: 0.92,
        damping: 15,
        stiffness: 360,
        useNativeDriver: true,
      }),
      Animated.spring(themeButtonScale, {
        toValue: 1,
        damping: 12,
        stiffness: 260,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(themeRotation, {
      toValue: themeMode === 'dark' ? 360 : 180,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (themeMode === 'dark') {
        themeRotation.setValue(0);
      }
    });

    Animated.sequence([
      Animated.timing(themeOverlayOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(themeOverlayOpacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setTransition({ visible: false, nextMode });
      }
    });

    setTimeout(() => {
      setThemeMode(nextMode);
    }, 180);
  }, [themeButtonScale, themeMode, themeOverlayOpacity, themeRotation, transition.visible]);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 96 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshAyahs}
              colors={[theme.accent]}
              tintColor={theme.accent}
              progressBackgroundColor={theme.card}
              title="جاري تحديث الآيات"
              titleColor={theme.mutedText}
            />
          }
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Animated.View style={{ transform: [{ scale: themeButtonScale }] }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={themeMode === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
                  onPress={toggleTheme}
                  style={({ pressed }) => [
                    styles.themeToggle,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      opacity: pressed ? 0.72 : 1,
                    },
                  ]}
                >
                  <Animated.View style={{ transform: [{ rotate: themeIconRotation }] }}>
                    <MaterialIcons
                      name={themeMode === 'dark' ? 'light-mode' : 'dark-mode'}
                      size={21}
                      color={theme.accent}
                    />
                  </Animated.View>
                </Pressable>
              </Animated.View>
              <View style={styles.headerText}>
                <Text style={[styles.kicker, { color: theme.accent }]}>آيات اليوم</Text>
                <Text style={[styles.title, { color: theme.text }]}>بلغوا عني ولو آية</Text>
                <Text style={[styles.subtitle, { color: theme.mutedText }]}>
                  آيات جاهزة للنسخ والمشاركة
                </Text>
              </View>
              <Animated.View
                style={[
                  styles.brandMark,
                  { backgroundColor: theme.brandSurface },
                  { transform: [{ scale: brandScale }] },
                ]}
              >
                <MaterialIcons name="auto-stories" size={24} color={theme.accent} />
              </Animated.View>
            </View>

            <View style={styles.cards}>
              {displayedAyahs.map((ayah, index) => (
                <AyahCard
                  key={ayah.id}
                  ayah={ayah}
                  index={index}
                  theme={theme}
                  onCopied={() => showSnackbar('تم نسخ الآية')}
                  onError={showSnackbar}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        theme={theme}
        onHide={hideSnackbar}
      />
      {transition.visible ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.themeOverlay,
            {
              backgroundColor: getTheme(transition.nextMode).background,
              opacity: themeOverlayOpacity,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  brandMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  kicker: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  title: {
    marginTop: 5,
    fontFamily: typography.fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    marginTop: 5,
    maxWidth: 420,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cards: {
    gap: 12,
  },
  themeOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
});
