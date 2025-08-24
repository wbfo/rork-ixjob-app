import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from 'react-native';
import { 
  X, 
  GripVertical, 
  Eye, 
  EyeOff, 
  RotateCcw
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { Widget, useDashboard } from '@/providers/DashboardProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DashboardCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DashboardCustomizationModal({ visible, onClose }: DashboardCustomizationModalProps) {
  const { widgets, updateWidgetVisibility, reorderWidgets, restoreDefaults } = useDashboard();
  const insets = useSafeAreaInsets();
  const [localWidgets, setLocalWidgets] = useState<Widget[]>(widgets);

  const handleToggleVisibility = (widgetKey: string) => {
    const updatedWidgets = localWidgets.map(widget =>
      widget.key === widgetKey ? { ...widget, visible: !widget.visible } : widget
    );
    setLocalWidgets(updatedWidgets);
    updateWidgetVisibility(widgetKey, !localWidgets.find(w => w.key === widgetKey)?.visible);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newWidgets = [...localWidgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);
    
    const reorderedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      order: index,
    }));
    
    setLocalWidgets(reorderedWidgets);
    reorderWidgets(reorderedWidgets);
  };

  const handleRestoreDefaults = () => {
    Alert.alert(
      'Restore Defaults',
      'This will reset your dashboard to the default layout. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          style: 'destructive',
          onPress: () => {
            restoreDefaults();
            onClose();
          }
        },
      ]
    );
  };

  const sortedWidgets = [...localWidgets].sort((a, b) => a.order - b.order);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Customize Dashboard</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-customization">
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Widget Visibility & Order</Text>
          <Text style={styles.sectionDescription}>
            Toggle widgets on/off and drag to reorder them on your dashboard.
          </Text>

          <View style={styles.widgetList}>
            {sortedWidgets.map((widget, index) => (
              <WidgetCustomizationItem
                key={widget.key}
                widget={widget}
                index={index}
                onToggleVisibility={handleToggleVisibility}
                onReorder={handleReorder}
                totalWidgets={sortedWidgets.length}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.restoreButton} 
              onPress={handleRestoreDefaults}
              testID="restore-defaults"
            >
              <RotateCcw size={16} color={colors.textMuted} />
              <Text style={styles.restoreText}>Restore Defaults</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PrimaryButton
            title="Done"
            onPress={onClose}
            testID="done-customization"
          />
        </View>
      </View>
    </Modal>
  );
}

interface WidgetCustomizationItemProps {
  widget: Widget;
  index: number;
  onToggleVisibility: (widgetKey: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  totalWidgets: number;
}

function WidgetCustomizationItem({ 
  widget, 
  index, 
  onToggleVisibility, 
  onReorder, 
  totalWidgets 
}: WidgetCustomizationItemProps) {
  const canMoveUp = index > 0;
  const canMoveDown = index < totalWidgets - 1;

  return (
    <Card style={[styles.widgetItem, !widget.visible && styles.widgetItemDisabled]}>
      <View style={styles.widgetItemContent}>
        <View style={styles.widgetInfo}>
          <View style={styles.dragHandle}>
            <GripVertical size={16} color={colors.textMuted} />
          </View>
          <Text style={[styles.widgetName, !widget.visible && styles.widgetNameDisabled]}>
            {widget.title}
          </Text>
        </View>

        <View style={styles.widgetControls}>
          <View style={styles.reorderButtons}>
            <TouchableOpacity
              style={[styles.reorderButton, !canMoveUp && styles.reorderButtonDisabled]}
              onPress={() => canMoveUp && onReorder(index, index - 1)}
              disabled={!canMoveUp}
              testID={`move-up-${widget.key}`}
            >
              <Text style={[styles.reorderButtonText, !canMoveUp && styles.reorderButtonTextDisabled]}>
                ↑
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.reorderButton, !canMoveDown && styles.reorderButtonDisabled]}
              onPress={() => canMoveDown && onReorder(index, index + 1)}
              disabled={!canMoveDown}
              testID={`move-down-${widget.key}`}
            >
              <Text style={[styles.reorderButtonText, !canMoveDown && styles.reorderButtonTextDisabled]}>
                ↓
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.visibilityControl}>
            {widget.visible ? (
              <Eye size={16} color={colors.success} />
            ) : (
              <EyeOff size={16} color={colors.textMuted} />
            )}
            <Switch
              value={widget.visible}
              onValueChange={() => onToggleVisibility(widget.key)}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={widget.visible ? colors.primary : colors.textMuted}
              testID={`toggle-${widget.key}`}
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  widgetList: {
    gap: spacing.sm,
  },
  widgetItem: {
    padding: spacing.md,
  },
  widgetItemDisabled: {
    opacity: 0.6,
  },
  widgetItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dragHandle: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  widgetName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    flex: 1,
  },
  widgetNameDisabled: {
    color: colors.textMuted,
  },
  widgetControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  reorderButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  reorderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  reorderButtonDisabled: {
    backgroundColor: colors.border,
  },
  reorderButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  reorderButtonTextDisabled: {
    color: colors.textMuted,
  },
  visibilityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actions: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  restoreText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});