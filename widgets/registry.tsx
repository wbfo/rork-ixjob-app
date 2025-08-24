import React from 'react';
import { 
  FileText, 
  ClipboardList, 
  Calendar, 
  Clock, 
  Users, 
  Lightbulb, 
  Languages, 
  Flame
} from 'lucide-react-native';
import { 
  ResumeProgressWidget,
  ApplicationsWeekWidget,
  UpcomingInterviewsWidget,
  DeadlinesSoonWidget,
  CommunityTeaserWidget,
  TipsNudgesWidget,
  TranslatorQuickWidget,
  StreaksWidget
} from '@/components/dashboard/DashboardWidget';
import { UserMetrics } from '@/state/useDashboardLayout';

export type WidgetSize = 'S' | 'M' | 'L';

export interface WidgetDef {
  id: string;
  titleKey: string;
  component: React.ComponentType<{ metrics: UserMetrics; size?: WidgetSize }>;
  minHeight: number;
  supportsSizes: WidgetSize[];
  featureFlag?: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  description: string;
}

export const WIDGETS: Record<string, WidgetDef> = {
  overallProgress: {
    id: 'overallProgress',
    titleKey: 'dashboard.widgets.overallProgress.title',
    component: ResumeProgressWidget,
    minHeight: 120,
    supportsSizes: ['M', 'L'],
    icon: FileText,
    description: 'Track your resume completion and job search progress'
  },
  quickStats: {
    id: 'quickStats',
    titleKey: 'dashboard.widgets.quickStats.title',
    component: ApplicationsWeekWidget,
    minHeight: 100,
    supportsSizes: ['S', 'M'],
    icon: ClipboardList,
    description: 'View your weekly application statistics'
  },
  nextActions: {
    id: 'nextActions',
    titleKey: 'dashboard.widgets.nextActions.title',
    component: UpcomingInterviewsWidget,
    minHeight: 100,
    supportsSizes: ['S', 'M'],
    icon: Calendar,
    description: 'See upcoming interviews and important dates'
  },
  recentApplications: {
    id: 'recentApplications',
    titleKey: 'dashboard.widgets.recentApplications.title',
    component: DeadlinesSoonWidget,
    minHeight: 100,
    supportsSizes: ['S', 'M'],
    icon: Clock,
    description: 'Monitor application deadlines and urgent tasks'
  },
  communityHighlight: {
    id: 'communityHighlight',
    titleKey: 'dashboard.widgets.communityHighlight.title',
    component: CommunityTeaserWidget,
    minHeight: 140,
    supportsSizes: ['M', 'L'],
    icon: Users,
    description: 'Connect with the job search community'
  },
  translatorShortcut: {
    id: 'translatorShortcut',
    titleKey: 'dashboard.widgets.translatorShortcut.title',
    component: TranslatorQuickWidget,
    minHeight: 100,
    supportsSizes: ['S', 'M'],
    icon: Languages,
    description: 'Quick access to translation tools'
  },
  suggestedTasks: {
    id: 'suggestedTasks',
    titleKey: 'dashboard.widgets.suggestedTasks.title',
    component: TipsNudgesWidget,
    minHeight: 120,
    supportsSizes: ['M', 'L'],
    icon: Lightbulb,
    description: 'Daily tips and personalized suggestions'
  },
  streaks: {
    id: 'streaks',
    titleKey: 'dashboard.widgets.streaks.title',
    component: StreaksWidget,
    minHeight: 100,
    supportsSizes: ['S', 'M'],
    icon: Flame,
    description: 'Track your job search activity streaks'
  }
};

export const getWidgetById = (id: string): WidgetDef | undefined => {
  return WIDGETS[id];
};

export const getAllWidgets = (): WidgetDef[] => {
  return Object.values(WIDGETS);
};

export const getAvailableWidgets = (featureFlags?: string[]): WidgetDef[] => {
  return getAllWidgets().filter(widget => {
    if (!widget.featureFlag) return true;
    return featureFlags?.includes(widget.featureFlag) ?? false;
  });
};