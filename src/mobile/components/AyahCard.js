import { useEffect, useState } from 'react';
import { Animated, Share, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRef } from 'react';
import ActionButton from './ActionButton';
import { openXCompose } from '../utils/openXCompose';
import { typography } from '../theme/typography';

const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function toArabicNumber(number) {
  return number.toString().replace(/\d/g, (digit) => arabicNumbers[Number(digit)]);
}

export default function AyahCard({ ayah, index, theme, onCopied, onError }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const cardScale = useRef(new Animated.Value(1)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 460,
      delay: index * 110,
      useNativeDriver: true,
    }).start();
  }, [entrance, index]);

  useEffect(() => {
    if (!copySuccess) return undefined;

    const timer = setTimeout(() => setCopySuccess(false), 1300);
    return () => clearTimeout(timer);
  }, [copySuccess]);

  const cardTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const copyAyah = async () => {
    try {
      await Clipboard.setStringAsync(ayah.tweetText);
      setCopySuccess(true);
      onCopied();
    } catch {
      onError('تعذر نسخ الآية');
    }
  };

  const shareAyah = async () => {
    try {
      await Share.share({ message: ayah.tweetText });
    } catch {
      onError('تعذرت مشاركة الآية');
    }
  };

  const postToX = async () => {
    try {
      await openXCompose(ayah.tweetText);
    } catch {
      onError('تعذر فتح منصة X');
    }
  };

  return (
    <Animated.View
      onTouchStart={() => {
        Animated.spring(cardScale, {
          toValue: 0.992,
          damping: 18,
          stiffness: 260,
          useNativeDriver: true,
        }).start();
      }}
      onTouchEnd={() => {
        Animated.sequence([
          Animated.delay(40),
          Animated.spring(cardScale, {
            toValue: 1,
            damping: 16,
            stiffness: 260,
            useNativeDriver: true,
          }),
        ]).start();
      }}
      onTouchCancel={() => {
        Animated.spring(cardScale, {
          toValue: 1,
          damping: 16,
          stiffness: 260,
          useNativeDriver: true,
        }).start();
      }}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
        {
          opacity: entrance,
          transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.indexBadge, { backgroundColor: theme.brandSurface }]}>
          <Text style={[styles.indexText, { color: theme.accent }]}>
            {toArabicNumber(index + 1)}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.surah, { color: theme.text }]}>سورة {ayah.surah}</Text>
          <Text style={[styles.reference, { color: theme.mutedText }]}>{ayah.reference}</Text>
        </View>
      </View>

      <Text style={[styles.ayahText, { color: theme.text }]}>
        ﴿ {ayah.text} ۝{ayah.number}﴾
      </Text>

      <View style={styles.actions}>
        <ActionButton
          icon="content-copy"
          label="نسخ"
          onPress={copyAyah}
          theme={theme}
          accessibilityLabel={`نسخ ${ayah.reference}`}
          success={copySuccess}
        />
        <ActionButton
          icon="ios-share"
          label="مشاركة"
          onPress={shareAyah}
          theme={theme}
          accessibilityLabel={`مشاركة ${ayah.reference}`}
        />
        <ActionButton
          icon="x"
          label="نشر"
          onPress={postToX}
          theme={theme}
          variant="primary"
          accessibilityLabel={`نشر ${ayah.reference} على منصة X`}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 17,
    gap: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: 12,
  },
  indexBadge: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
  },
  meta: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surah: {
    fontFamily: typography.fonts.bold,
    fontSize: 19,
    lineHeight: 27,
    textAlign: 'right',
  },
  reference: {
    marginTop: 2,
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'right',
  },
  ayahText: {
    fontFamily: typography.fonts.quran,
    fontSize: 23,
    lineHeight: 52,
    paddingTop: 5,
    paddingBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
    includeFontPadding: true,
  },
  actions: {
    flexDirection: 'row-reverse',
    gap: 9,
  },
});
