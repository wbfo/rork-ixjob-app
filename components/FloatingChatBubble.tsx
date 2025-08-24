import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
} from 'react-native';
import { MessageSquare, X } from 'lucide-react-native';
import { colors, spacing, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getScreen = () => Dimensions.get('window');
let { width: screenWidth, height: screenHeight } = getScreen();
const BUBBLE_SIZE = 56;

interface GlobalWithChatFlag extends Record<string, unknown> {
  __ixjob_floating_chat_instance_id__?: symbol;
}

interface FloatingChatBubbleProps {
  children?: React.ReactNode;
}

export function FloatingChatBubble({ children }: FloatingChatBubbleProps) {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);
  const isPrimaryRef = useRef<boolean>(false);
  const instanceId = useRef<symbol>(Symbol('floating_chat_instance')).current;

  useEffect(() => {
    const g = globalThis as unknown as GlobalWithChatFlag;
    if (!g.__ixjob_floating_chat_instance_id__) {
      g.__ixjob_floating_chat_instance_id__ = instanceId;
      isPrimaryRef.current = true;
      console.log('[FloatingChatBubble] Registered as primary instance');
    } else if (g.__ixjob_floating_chat_instance_id__ === instanceId) {
      isPrimaryRef.current = true;
    } else {
      isPrimaryRef.current = false;
      console.log('[FloatingChatBubble] Secondary instance detected — will not render');
    }
    setReady(true);
    return () => {
      if (isPrimaryRef.current) {
        g.__ixjob_floating_chat_instance_id__ = undefined;
        console.log('[FloatingChatBubble] Unregistered primary instance');
      }
    };
  }, [instanceId]);
  
  const position = useRef(new Animated.ValueXY({
    x: screenWidth - BUBBLE_SIZE - spacing.lg,
    y: Math.max(insets.top + 80, screenHeight - BUBBLE_SIZE - 100 - insets.bottom),
  })).current;

  const loadPosition = useCallback(async () => {
    try {
      const savedPosition = await AsyncStorage.getItem('chatBubblePosition');
      if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        position.setValue({ x, y });
      }
    } catch (error) {
      console.log('Failed to load bubble position:', error);
    }
  }, [position]);

  const savePosition = useCallback(async (x: number, y: number) => {
    try {
      await AsyncStorage.setItem('chatBubblePosition', JSON.stringify({ x, y }));
    } catch (error) {
      console.log('Failed to save bubble position:', error);
    }
  }, []);

  useEffect(() => {
    if (!isPrimaryRef.current) return;
    console.log('[FloatingChatBubble] mount');
    loadPosition();
    
    const keyboardDidShowListener = Dimensions.addEventListener('change', () => {}); // placeholder to keep API symmetry

    const dimSub = Dimensions.addEventListener('change', ({ window }) => {
      screenWidth = window.width;
      screenHeight = window.height;
      const currentX = (position.x as any)._value ?? 0;
      const currentY = (position.y as any)._value ?? 0;
      const nearRight = currentX > window.width / 2;
      const clampedX = nearRight ? window.width - BUBBLE_SIZE - spacing.lg : Math.max(spacing.lg, Math.min(window.width - BUBBLE_SIZE - spacing.lg, currentX));
      const bottomSafe = 100 + insets.bottom;
      const topSafe = insets.top + 80;
      const maxY = window.height - BUBBLE_SIZE - bottomSafe;
      const clampedY = Math.max(topSafe, Math.min(maxY, currentY));
      position.setValue({ x: clampedX, y: clampedY });
      savePosition(clampedX, clampedY);
    });

    return () => {
      keyboardDidShowListener?.remove?.();
      dimSub?.remove?.();
    };
  }, [insets.bottom, insets.top, isPrimaryRef, loadPosition, position, savePosition]);

  const snapToEdge = useCallback((gestureState: any) => {
    const { moveX } = gestureState;
    const snapToLeft = moveX < screenWidth / 2;
    const targetX = snapToLeft ? spacing.lg : screenWidth - BUBBLE_SIZE - spacing.lg;

    Animated.spring(position.x, {
      toValue: targetX,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start(({ finished }) => {
      if (finished) {
        const yVal = (position.y as any)._value ?? 0;
        savePosition(targetX, yVal);
      }
    });
  }, [position.x, position.y, savePosition]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        position.stopAnimation();
        position.setOffset({
          x: (position.x as any)._value,
          y: (position.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        position.flattenOffset();
        
        const maxX = screenWidth - BUBBLE_SIZE - spacing.lg;
        const bottomSafe = 100 + insets.bottom;
        const maxY = screenHeight - BUBBLE_SIZE - bottomSafe;
        
        let finalX = Math.max(spacing.lg, Math.min(maxX, (position.x as any)._value));
        let finalY = Math.max(insets.top + 80, Math.min(maxY, (position.y as any)._value));
        
        if (Math.abs(gestureState.dx) > 50) {
          snapToEdge(gestureState);
          return;
        }
        
        Animated.spring(position, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
        
        savePosition(finalX, finalY);
      },
    })
  ).current;

  const handleBubblePress = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!ready || !isPrimaryRef.current) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={[
          styles.bubble,
          {
            width: BUBBLE_SIZE,
            height: BUBBLE_SIZE,
            borderRadius: BUBBLE_SIZE / 2,
            transform: position.getTranslateTransform(),
          },
        ]}
        pointerEvents={isOpen ? 'none' : 'auto'}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[styles.bubbleButton, { width: BUBBLE_SIZE, height: BUBBLE_SIZE, borderRadius: BUBBLE_SIZE / 2 }]}
          onPress={handleBubblePress}
          testID="chat-bubble"
          accessibilityRole="button"
          accessibilityLabel="Open AI Chat"
        >
          <MessageSquare size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + spacing.md }]}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              testID="close-chat"
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {children}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: '#4F46E5',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 25,
    zIndex: 1000,
  },
  bubbleButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  modalContent: {
    flex: 1,
  },
});