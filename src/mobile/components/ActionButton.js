import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import XLogo from './XLogo';
import { typography } from '../theme/typography';

export default function ActionButton({
  icon,
  label,
  onPress,
  theme,
  variant = 'default',
  accessibilityLabel,
  success = false,
}) {
  const isPrimary = variant === 'primary';
  const backgroundColor = isPrimary ? theme.accent : theme.button;
  const foregroundColor = isPrimary ? theme.accentText : theme.buttonText;
  const borderColor = isPrimary ? theme.accent : theme.buttonBorder;
  const scale = useRef(new Animated.Value(1)).current;
  const displayIcon = success ? 'check' : icon;
  const displayLabel = success ? 'تم' : label;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      damping: 16,
      stiffness: 360,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.03,
        damping: 12,
        stiffness: 360,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 14,
        stiffness: 320,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor,
            opacity: pressed ? 0.74 : 1,
            borderColor,
          },
        ]}
      >
        <Text style={[styles.label, { color: foregroundColor }]}>{displayLabel}</Text>
        {displayIcon === 'x' ? (
          <XLogo color={foregroundColor} />
        ) : (
          <MaterialIcons name={displayIcon} size={18} color={foregroundColor} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: 86,
  },
  button: {
    minHeight: 44,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 10,
  },
  label: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    includeFontPadding: false,
  },
});
