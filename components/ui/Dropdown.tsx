import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Modal,
  Animated,
  Easing,
  Dimensions,
  PanResponder,
  FlatList,
} from 'react-native';
import { colors, radius, fontSizes, fontWeights, spacing, layout } from '@/theme/tokens';
import { type SupportedLanguage } from '@/i18n';

interface LanguageOption {
  code: SupportedLanguage;
  nativeName: string;
  flag: string;
}

interface DropdownProps {
  label: string;
  selectedValue: SupportedLanguage | null;
  onValueChange: (value: SupportedLanguage) => void;
  options: LanguageOption[];
  placeholder?: string;
  testID?: string;
}

export function Dropdown({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder = 'Select an option',
  testID,
}: DropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const windowHeight = Dimensions.get('window').height;
  const sheetMaxHeight = Math.min(400, Math.floor(windowHeight * 0.6));
  const translateY = useRef(new Animated.Value(sheetMaxHeight)).current;
  const dragY = useRef(0);

  const selectedLabel = useMemo(() => {
    const opt = options.find((o) => o.code === selectedValue);
    return opt ? `${opt.flag} ${opt.nativeName}` : `— ${placeholder} —`;
  }, [options, selectedValue, placeholder]);

  const openSheet = useCallback(() => {
    console.log('[Dropdown] open');
    setOpen(true);
    requestAnimationFrame(() => {
      translateY.setValue(sheetMaxHeight);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, [sheetMaxHeight, translateY]);

  const closeSheet = useCallback(() => {
    console.log('[Dropdown] close');
    Animated.timing(translateY, {
      toValue: sheetMaxHeight,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setOpen(false);
    });
  }, [sheetMaxHeight, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        return Math.abs(gesture.dy) > 4;
      },
      onPanResponderGrant: () => {
        translateY.stopAnimation((value?: number) => {
          dragY.current = typeof value === 'number' ? value : 0;
        });
      },
      onPanResponderMove: (_evt, gesture) => {
        const next = Math.max(0, Math.min(sheetMaxHeight, dragY.current + gesture.dy));
        translateY.setValue(next);
      },
      onPanResponderRelease: (_evt, gesture) => {
        const shouldClose = gesture.vy > 0.8 || gesture.dy > sheetMaxHeight * 0.33;
        if (shouldClose) {
          closeSheet();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderItem = useCallback(
    ({ item }: { item: LanguageOption }) => {
      const active = item.code === selectedValue;
      return (
        <Pressable
          onPress={() => {
            console.log('[Dropdown] select', item.code);
            onValueChange(item.code);
            closeSheet();
          }}
          style={({ pressed }) => [
            styles.option,
            active ? styles.optionActive : null,
            pressed ? styles.optionPressed : null,
          ]}
          testID={testID ? `${testID}-option-${item.code}` : undefined}
          accessibilityRole="button"
          accessibilityLabel={`${item.nativeName}`}
        >
          <Text style={styles.optionEmoji}>{item.flag}</Text>
          <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>
            {item.nativeName}
          </Text>
        </Pressable>
      );
    },
    [closeSheet, onValueChange, selectedValue, testID]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={openSheet}
        style={[styles.field, selectedValue ? styles.fieldSelected : null]}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={selectedLabel}
      >
        <Text style={styles.fieldText}>{selectedLabel}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="none" onRequestClose={closeSheet}>
        <Pressable
          style={styles.backdrop}
          onPress={closeSheet}
          testID={testID ? `${testID}-backdrop` : undefined}
        />
        <Animated.View
          style={[styles.sheet, { maxHeight: sheetMaxHeight, transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
          testID={testID ? `${testID}-sheet` : undefined}
        >
          <View style={styles.grabber} />
          <FlatList
            data={options}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            initialNumToRender={options.length}
            bounces
          />
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textMuted,
    marginBottom: spacing.sm + spacing.xs,
  },
  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.textOnBlue,
    minHeight: layout.minTapTarget + 4,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  fieldSelected: {
    borderColor: colors.borderActive,
    borderWidth: 2,
  },
  fieldText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.textOnBlue,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  grabber: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionPressed: {
    backgroundColor: colors.background,
  },
  optionActive: {
    backgroundColor: colors.background,
  },
  optionEmoji: {
    fontSize: 20 as const,
    marginRight: spacing.md,
  },
  optionText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  optionTextActive: {
    fontWeight: fontWeights.semibold,
  },
});
