import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import DraggableFlatList, { 
  RenderItemParams,
  ScaleDecorator 
} from 'react-native-draggable-flatlist';
import { 
  X, 
  GripVertical, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Plus
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useDashboardLayout, WidgetInstance } from '@/state/useDashboardLayout';
import { WIDGETS, WidgetSize, getAvailableWidgets } from '@/widgets/registry';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomizeModalProps {
  visible: boolean;
  onClose: () => void;
}



export function CustomizeModal({ visible, onClose }: CustomizeModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    layout,
    updateWidgetVisibility,
    updateWidgetSize,
    reorderWidgets,
    addWidget,
    resetToDefaults
  } = useDashboardLayout();
  
  const [showAddWidgets, setShowAddWidgets] = useState<boolean>(false);
  const [localLayout, setLocalLayout] = useState<WidgetInstance[]>(layout);

  const handleDragEnd = useCallback(({ data }: { data: WidgetInstance[] }) => {
    setLocalLayout(data);
    reorderWidgets(data);
  }, [reorderWidgets]);

  const handleToggleVisibility = useCallback((widgetId: string) => {
    const widget = localLayout.find(w => w.id === widgetId);
    if (widget) {
      updateWidgetVisibility(widgetId, !widget.visible);
      setLocalLayout(prev => prev.map(w => 
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      ));
    }
  }, [localLayout, updateWidgetVisibility]);

  const handleSizeChange = useCallback((widgetId: string, size: WidgetSize) => {
    updateWidgetSize(widgetId, size);
    setLocalLayout(prev => prev.map(w => 
      w.id === widgetId ? { ...w, size } : w
    ));
  }, [updateWidgetSize]);

  const handleAddWidget = useCallback((widgetId: string) => {
    addWidget(widgetId);
    setLocalLayout(prev => {
      const exists = prev.find(w => w.id === widgetId);
      if (exists) {
        return prev.map(w => w.id === widgetId ? { ...w, visible: true } : w);
      }
      const widget = WIDGETS[widgetId];
      return [...prev, {
        id: widgetId,
        size: widget.supportsSizes[0],
        visible: true,
        order: prev.length
      }];
    });
  }, [addWidget]);

  const handleResetDefaults = useCallback(() => {
    Alert.alert(
      t('dashboard.customize.resetTitle', 'Reset Dashboard'),
      t('dashboard.customize.resetMessage', 'This will restore the default dashboard layout. Are you sure?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('dashboard.customize.reset', 'Reset'), 
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            onClose();
          }
        },
      ]
    );
  }, [t, resetToDefaults, onClose]);

  const renderWidgetItem = ({ item, drag, isActive }: RenderItemParams<WidgetInstance>) => {
    const widget = WIDGETS[item.id];
    if (!widget) return null;

    return (
      <ScaleDecorator>
        <Card style={[styles.widgetItem, isActive && styles.widgetItemActive]}>
          <View style={styles.widgetItemContent}>
            <TouchableOpacity
              onLongPress={drag}
              style={styles.dragHandle}
              testID={`drag-${item.id}`}
            >
              <GripVertical size={20} color={colors.textMuted} />
            </TouchableOpacity>
            
            <View style={styles.widgetInfo}>
              <View style={styles.widgetHeader}>
                <widget.icon size={16} color={colors.primary} />
                <Text style={styles.widgetName}>
                  {t(widget.titleKey, widget.id)}
                </Text>
              </View>
              <Text style={styles.widgetDescription} numberOfLines={2}>
                {widget.description}
              </Text>
            </View>

            <View style={styles.widgetControls}>
              {widget.supportsSizes.length > 1 && (
                <SizeSelector
                  sizes={widget.supportsSizes}
                  currentSize={item.size}
                  onSizeChange={(size) => handleSizeChange(item.id, size)}
                />
              )}
              
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleToggleVisibility(item.id)}
                testID={`toggle-${item.id}`}
              >
                {item.visible ? (
                  <Eye size={20} color={colors.success} />
                ) : (
                  <EyeOff size={20} color={colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </ScaleDecorator>
    );
  };

  const availableWidgets = getAvailableWidgets();
  const addableWidgets = availableWidgets.filter(widget => 
    !localLayout.some(item => item.id === widget.id && item.visible)
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('dashboard.customize.title', 'Customize Dashboard')}
          </Text>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeButton}
            testID="close-customize"
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('dashboard.customize.widgetsTitle', 'Your Widgets')}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddWidgets(true)}
              testID="add-widgets"
            >
              <Plus size={16} color={colors.primary} />
              <Text style={styles.addButtonText}>
                {t('dashboard.customize.addWidget', 'Add')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionDescription}>
            {t('dashboard.customize.description', 'Drag to reorder, tap eye to show/hide, use size controls to resize.')}
          </Text>

          <DraggableFlatList
            data={localLayout}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={renderWidgetItem}
            contentContainerStyle={styles.widgetList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleResetDefaults}
            testID="reset-defaults"
          >
            <RotateCcw size={16} color={colors.textMuted} />
            <Text style={styles.resetText}>
              {t('dashboard.customize.resetDefaults', 'Reset to Defaults')}
            </Text>
          </TouchableOpacity>
          
          <PrimaryButton
            title={t('common.done', 'Done')}
            onPress={onClose}
            testID="done-customize"
          />
        </View>
      </View>

      <AddWidgetsModal
        visible={showAddWidgets}
        widgets={addableWidgets}
        onClose={() => setShowAddWidgets(false)}
        onAddWidget={handleAddWidget}
      />
    </Modal>
  );
}

interface SizeSelectorProps {
  sizes: WidgetSize[];
  currentSize: WidgetSize;
  onSizeChange: (size: WidgetSize) => void;
}

function SizeSelector({ sizes, currentSize, onSizeChange }: SizeSelectorProps) {
  return (
    <View style={styles.sizeSelector}>
      {sizes.map(size => (
        <TouchableOpacity
          key={size}
          style={[
            styles.sizeButton,
            currentSize === size && styles.sizeButtonActive
          ]}
          onPress={() => onSizeChange(size)}
          testID={`size-${size}`}
        >
          <Text style={[
            styles.sizeButtonText,
            currentSize === size && styles.sizeButtonTextActive
          ]}>
            {size}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface AddWidgetsModalProps {
  visible: boolean;
  widgets: { id: string; titleKey: string; description: string; icon: React.ComponentType<any> }[];
  onClose: () => void;
  onAddWidget: (widgetId: string) => void;
}

function AddWidgetsModal({ visible, widgets, onClose, onAddWidget }: AddWidgetsModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('dashboard.customize.addWidgetsTitle', 'Add Widgets')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {widgets.map(widget => (
            <Card key={widget.id} style={styles.addableWidget}>
              <TouchableOpacity
                style={styles.addableWidgetContent}
                onPress={() => {
                  onAddWidget(widget.id);
                  onClose();
                }}
                testID={`add-${widget.id}`}
              >
                <View style={styles.addableWidgetInfo}>
                  <View style={styles.addableWidgetHeader}>
                    <widget.icon size={20} color={colors.primary} />
                    <Text style={styles.addableWidgetName}>
                      {t(widget.titleKey, widget.id)}
                    </Text>
                  </View>
                  <Text style={styles.addableWidgetDescription}>
                    {widget.description}
                  </Text>
                </View>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </View>
    </Modal>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '15',
    borderRadius: radius.md,
  },
  addButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary,
  },
  sectionDescription: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  widgetList: {
    paddingBottom: spacing.xl,
  },
  widgetItem: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  widgetItemActive: {
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  widgetItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dragHandle: {
    padding: spacing.sm,
  },
  widgetInfo: {
    flex: 1,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  widgetName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  widgetDescription: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 18,
  },
  widgetControls: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  sizeSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sizeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sizeButtonText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.textMuted,
  },
  sizeButtonTextActive: {
    color: colors.textInverse,
  },
  visibilityButton: {
    padding: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  resetText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
  },
  addableWidget: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  addableWidgetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addableWidgetInfo: {
    flex: 1,
  },
  addableWidgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  addableWidgetName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  addableWidgetDescription: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 18,
  },
});