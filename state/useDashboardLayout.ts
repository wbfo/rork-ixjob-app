import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useAuthContext } from '@/providers/AuthProvider';
import { WIDGETS, WidgetSize, getAvailableWidgets } from '@/widgets/registry';

export type WidgetInstance = {
  id: string;
  size: WidgetSize;
  visible: boolean;
  order: number;
};

export type Layout = WidgetInstance[];

export interface UserMetrics {
  resumeProgress: number;
  applicationsWeek: number;
  interviewsUpcoming: number;
  deadlines48h: number;
  streakDays: number;
}

const DEFAULT_LAYOUT: Layout = [
  { id: 'overallProgress', size: 'M', visible: true, order: 0 },
  { id: 'quickStats', size: 'S', visible: true, order: 1 },
  { id: 'nextActions', size: 'S', visible: true, order: 2 },
  { id: 'communityHighlight', size: 'M', visible: true, order: 3 },
  { id: 'recentApplications', size: 'S', visible: true, order: 4 },
  { id: 'suggestedTasks', size: 'M', visible: true, order: 5 },
  { id: 'translatorShortcut', size: 'S', visible: false, order: 6 },
  { id: 'streaks', size: 'S', visible: false, order: 7 }
];

const STORAGE_KEY = 'dashboard_layout_v2';
const METRICS_KEY = 'user_metrics_v2';

export const [DashboardLayoutProvider, useDashboardLayout] = createContextHook(() => {
  const { user } = useAuthContext();
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  const [metrics, setMetrics] = useState<UserMetrics>({
    resumeProgress: 75,
    applicationsWeek: 3,
    interviewsUpcoming: 1,
    deadlines48h: 2,
    streakDays: 5,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  const loadLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY}_${user?.id}`);
      const storedMetrics = await AsyncStorage.getItem(`${METRICS_KEY}_${user?.id}`);
      
      if (stored) {
        const parsedLayout: Layout = JSON.parse(stored);
        // Validate layout against current widget registry
        const validLayout = parsedLayout.filter(item => WIDGETS[item.id]);
        setLayout(validLayout.length > 0 ? validLayout : DEFAULT_LAYOUT);
      } else {
        setLayout(DEFAULT_LAYOUT);
      }
      
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      }
    } catch (error) {
      console.error('Failed to load dashboard layout:', error);
      setLayout(DEFAULT_LAYOUT);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const saveLayout = useCallback(async (newLayout: Layout) => {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEY}_${user?.id}`, JSON.stringify(newLayout));
      setLayout(newLayout);
    } catch (error) {
      console.error('Failed to save dashboard layout:', error);
    }
  }, [user?.id]);

  const saveMetrics = useCallback(async (newMetrics: UserMetrics) => {
    try {
      await AsyncStorage.setItem(`${METRICS_KEY}_${user?.id}`, JSON.stringify(newMetrics));
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadLayout();
  }, [loadLayout]);

  const updateWidgetVisibility = useCallback((widgetId: string, visible: boolean) => {
    const updatedLayout = layout.map(item => 
      item.id === widgetId ? { ...item, visible } : item
    );
    saveLayout(updatedLayout);
  }, [layout, saveLayout]);

  const updateWidgetSize = useCallback((widgetId: string, size: WidgetSize) => {
    const widget = WIDGETS[widgetId];
    if (!widget || !widget.supportsSizes.includes(size)) return;
    
    const updatedLayout = layout.map(item => 
      item.id === widgetId ? { ...item, size } : item
    );
    saveLayout(updatedLayout);
  }, [layout, saveLayout]);

  const reorderWidgets = useCallback((newLayout: Layout) => {
    const reorderedLayout = newLayout.map((item, index) => ({
      ...item,
      order: index
    }));
    saveLayout(reorderedLayout);
  }, [saveLayout]);

  const addWidget = useCallback((widgetId: string, size: WidgetSize = 'M') => {
    const widget = WIDGETS[widgetId];
    if (!widget) return;

    const existingWidget = layout.find(item => item.id === widgetId);
    if (existingWidget) {
      updateWidgetVisibility(widgetId, true);
      return;
    }

    const newWidget: WidgetInstance = {
      id: widgetId,
      size: widget.supportsSizes.includes(size) ? size : widget.supportsSizes[0],
      visible: true,
      order: layout.length
    };

    const updatedLayout = [...layout, newWidget];
    saveLayout(updatedLayout);
  }, [layout, saveLayout, updateWidgetVisibility]);

  const removeWidget = useCallback((widgetId: string) => {
    updateWidgetVisibility(widgetId, false);
  }, [updateWidgetVisibility]);

  const resetToDefaults = useCallback(() => {
    saveLayout(DEFAULT_LAYOUT);
  }, [saveLayout]);

  const getVisibleWidgets = useCallback(() => {
    return layout
      .filter(item => item.visible && WIDGETS[item.id])
      .sort((a, b) => a.order - b.order);
  }, [layout]);

  const getAvailableWidgetsForUser = useCallback(() => {
    // In the future, this could filter based on user's feature flags
    return getAvailableWidgets();
  }, []);

  const updateMetrics = useCallback((newMetrics: Partial<UserMetrics>) => {
    const updatedMetrics = { ...metrics, ...newMetrics };
    saveMetrics(updatedMetrics);
  }, [metrics, saveMetrics]);

  return useMemo(() => ({
    layout,
    metrics,
    isLoading,
    isCustomizing,
    setIsCustomizing,
    updateWidgetVisibility,
    updateWidgetSize,
    reorderWidgets,
    addWidget,
    removeWidget,
    resetToDefaults,
    getVisibleWidgets,
    getAvailableWidgetsForUser,
    updateMetrics,
    refreshLayout: loadLayout,
  }), [
    layout,
    metrics,
    isLoading,
    isCustomizing,
    updateWidgetVisibility,
    updateWidgetSize,
    reorderWidgets,
    addWidget,
    removeWidget,
    resetToDefaults,
    getVisibleWidgets,
    getAvailableWidgetsForUser,
    updateMetrics,
    loadLayout,
  ]);
});