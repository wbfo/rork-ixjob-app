import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { colors, fontSizes, fontWeights, spacing, radius } from '@/theme/tokens';

interface ErrorViewProps {
  message?: unknown;
  onRetry?: () => void;
}

function formatMessage(msg: unknown): string {
  if (typeof msg === 'string') return msg;
  if (msg instanceof Error) return msg.message;
  if (msg && typeof msg === 'object') {
    const anyMsg: any = msg as any;
    if (typeof anyMsg.message === 'string') return anyMsg.message as string;
    try {
      return JSON.stringify(anyMsg);
    } catch {
      return 'Something went wrong';
    }
  }
  return 'Something went wrong';
}

export function ErrorView({ message = 'Something went wrong', onRetry }: ErrorViewProps) {
  const display = useMemo(() => formatMessage(message), [message]);
  return (
    <View style={styles.container} testID="error-view">
      <AlertCircle size={48} color={colors.error} />
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message} accessibilityLabel={`Error: ${display}`}>{display}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} testID="error-retry-button" accessibilityRole="button" accessibilityLabel="Try Again">
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: spacing.xxl,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.semibold,
    color: colors.textOnBlue,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSizes.md,
    color: colors.textOnBlueSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.textOnBlue,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
  },
  buttonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
});