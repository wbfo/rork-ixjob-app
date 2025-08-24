import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, fontSizes, fontWeights, layout, spacing } from '@/theme/tokens';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
  leftIcon?: React.ReactNode;
  testID?: string;
}

export function PrimaryButton({ 
  title, 
  onPress, 
  disabled = false, 
  style, 
  textStyle,
  variant = 'primary',
  leftIcon,
  testID 
}: PrimaryButtonProps) {
  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
      >
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconWrapper}>{leftIcon}</View> : null}
          <Text style={[styles.secondaryText, disabled && styles.disabledText, textStyle]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      <LinearGradient
        colors={disabled ? [colors.primaryLight, colors.primaryLight] : [colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconWrapper}>{leftIcon}</View> : null}
          <Text style={[styles.primaryText, disabled && styles.disabledText, textStyle]}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: layout.buttonHeight,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: spacing.sm,
  },
  secondaryButton: {
    backgroundColor: colors.textOnBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primaryText: {
    color: colors.textOnBlue,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.7,
  },
});