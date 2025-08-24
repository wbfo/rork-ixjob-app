import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox, Plus } from 'lucide-react-native';
import { colors, fontSizes, fontWeights, spacing } from '@/theme/tokens';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface EmptyViewProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}

export function EmptyView({ 
  title = 'Nothing here yet',
  message = 'Get started by adding your first item',
  actionLabel,
  onAction,
  testID,
}: EmptyViewProps) {
  return (
    <View style={styles.container} testID={testID ?? 'empty-view'}>
      <Inbox size={64} color={colors.textOnBlueTertiary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          leftIcon={<Plus size={18} color={colors.textOnBlue} />}
          testID="empty-view-action"
        />
      ) : null}
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
    gap: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.textOnBlue,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSizes.md,
    color: colors.textOnBlueSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});