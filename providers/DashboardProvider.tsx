import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useAuthContext } from './AuthProvider';

export interface Widget {
  key: string;
  title: string;
  visible: boolean;
  order: number;
  data?: any;
}

export interface DashboardLayout {
  widgets: Widget[];
}

export interface UserMetrics {
  resumeProgress: number;
  applicationsWeek: number;
  interviewsUpcoming: number;
  deadlines48h: number;
  streakDays: number;
}

const DEFAULT_WIDGETS: Widget[] = [
  { key: 'resume-progress', title: 'Resume Progress', visible: true, order: 0 },
  { key: 'applications-week', title: 'Applications This Week', visible: true, order: 1 },
  { key: 'upcoming-interviews', title: 'Upcoming Interviews', visible: true, order: 2 },
  { key: 'deadlines-soon', title: 'Deadlines Soon', visible: true, order: 3 },
  { key: 'community-teaser', title: 'Community', visible: true, order: 4 },
  { key: 'tips-nudges', title: 'Tips & Nudges', visible: true, order: 5 },
  { key: 'translator-quick', title: 'Quick Translator', visible: true, order: 6 },
  { key: 'streaks', title: 'Your Streaks', visible: true, order: 7 },
];

const STORAGE_KEY = 'dashboard_layout';
const METRICS_KEY = 'user_metrics';

export const [DashboardProvider, useDashboard] = createContextHook(() => {
  const { user } = useAuthContext();
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [metrics, setMetrics] = useState<UserMetrics>({
    resumeProgress: 75,
    applicationsWeek: 3,
    interviewsUpcoming: 1,
    deadlines48h: 2,
    streakDays: 5,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const getSmartDefaults = useCallback((): Widget[] => {
    const defaults = [...DEFAULT_WIDGETS];
    
    // If resume progress < 80% and no applications, prioritize resume
    if (metrics.resumeProgress < 80 && metrics.applicationsWeek === 0) {
      const resumeWidget = defaults.find(w => w.key === 'resume-progress');
      if (resumeWidget) {
        resumeWidget.order = 0;
        defaults.sort((a, b) => a.order - b.order);
      }
    }
    // If interviews upcoming or deadlines, prioritize those
    else if (metrics.interviewsUpcoming > 0 || metrics.deadlines48h > 0) {
      const interviewWidget = defaults.find(w => w.key === 'upcoming-interviews');
      const deadlineWidget = defaults.find(w => w.key === 'deadlines-soon');
      
      if (interviewWidget) interviewWidget.order = 0;
      if (deadlineWidget) deadlineWidget.order = 1;
      
      defaults.sort((a, b) => a.order - b.order);
    }
    
    return defaults;
  }, [metrics.resumeProgress, metrics.applicationsWeek, metrics.interviewsUpcoming, metrics.deadlines48h]);

  const loadDashboardLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY}_${user?.id}`);
      const storedMetrics = await AsyncStorage.getItem(`${METRICS_KEY}_${user?.id}`);
      
      if (stored) {
        const layout: DashboardLayout = JSON.parse(stored);
        setWidgets(layout.widgets);
      } else {
        // Apply smart defaults based on user state
        const smartDefaults = getSmartDefaults();
        setWidgets(smartDefaults);
      }
      
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      }
    } catch (error) {
      console.error('Failed to load dashboard layout:', error);
      setWidgets(DEFAULT_WIDGETS);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getSmartDefaults]);

  // Load dashboard layout from storage
  useEffect(() => {
    loadDashboardLayout();
  }, [loadDashboardLayout]);



  const saveDashboardLayout = useCallback(async (newWidgets: Widget[]) => {
    try {
      const layout: DashboardLayout = { widgets: newWidgets };
      await AsyncStorage.setItem(`${STORAGE_KEY}_${user?.id}`, JSON.stringify(layout));
      setWidgets(newWidgets);
    } catch (error) {
      console.error('Failed to save dashboard layout:', error);
    }
  }, [user?.id]);

  const updateWidgetVisibility = useCallback((widgetKey: string, visible: boolean) => {
    const updatedWidgets = widgets.map(widget => 
      widget.key === widgetKey ? { ...widget, visible } : widget
    );
    saveDashboardLayout(updatedWidgets);
  }, [widgets, saveDashboardLayout]);

  const reorderWidgets = useCallback((newOrder: Widget[]) => {
    const updatedWidgets = newOrder.map((widget, index) => ({
      ...widget,
      order: index,
    }));
    saveDashboardLayout(updatedWidgets);
  }, [saveDashboardLayout]);

  const restoreDefaults = useCallback(() => {
    const smartDefaults = getSmartDefaults();
    saveDashboardLayout(smartDefaults);
  }, [getSmartDefaults, saveDashboardLayout]);

  const updateMetrics = useCallback(async (newMetrics: Partial<UserMetrics>) => {
    const updatedMetrics = { ...metrics, ...newMetrics };
    setMetrics(updatedMetrics);
    
    try {
      await AsyncStorage.setItem(`${METRICS_KEY}_${user?.id}`, JSON.stringify(updatedMetrics));
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }, [metrics, user?.id]);

  const getVisibleWidgets = useCallback(() => {
    return widgets
      .filter(widget => widget.visible)
      .sort((a, b) => a.order - b.order);
  }, [widgets]);

  return useMemo(() => ({
    widgets,
    metrics,
    isLoading,
    isCustomizing,
    setIsCustomizing,
    updateWidgetVisibility,
    reorderWidgets,
    restoreDefaults,
    updateMetrics,
    getVisibleWidgets,
    refreshLayout: loadDashboardLayout,
  }), [
    widgets,
    metrics,
    isLoading,
    isCustomizing,
    updateWidgetVisibility,
    reorderWidgets,
    restoreDefaults,
    updateMetrics,
    getVisibleWidgets,
    loadDashboardLayout,
  ]);
});