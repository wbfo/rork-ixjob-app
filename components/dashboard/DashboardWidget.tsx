import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { 
  FileText, 
  ClipboardList, 
  Calendar, 
  Clock, 
  Users, 
  Lightbulb, 
  Languages, 
  Flame,
  ChevronRight,
  User,
  MessageSquare,
  TrendingUp
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, spacing, fontSizes, fontWeights } from '@/theme/tokens';
import { Widget, UserMetrics } from '@/providers/DashboardProvider';

const { width } = Dimensions.get('window');
const WIDGET_WIDTH = (width - spacing.lg * 3) / 2;

interface WidgetComponentProps {
  widget: Widget;
  metrics: UserMetrics;
  onPress?: () => void;
}

export function ResumeProgressWidget({ metrics }: { metrics: UserMetrics }) {
  const progress = metrics.resumeProgress;
  
  return (
    <Card style={[styles.widget, styles.expandedWidget]}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/resume')}
        style={styles.widgetContent}
        testID="resume-progress-widget"
      >
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <FileText size={20} color={colors.primary} />
          </View>
          <Text style={styles.widgetTitle}>Resume Progress</Text>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}% Complete</Text>
        </View>
        
        <Text style={styles.widgetDescription}>
          {progress < 80 ? 'Complete your resume to improve job prospects' : 'Your resume is ready!'}
        </Text>
        
        <View style={styles.widgetAction}>
          <Text style={styles.actionText}>Edit Resume</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

export function ApplicationsWeekWidget({ metrics }: { metrics: UserMetrics }) {
  return (
    <Card style={styles.widget}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/tracker')}
        style={styles.widgetContent}
        testID="applications-week-widget"
      >
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
            <ClipboardList size={20} color={colors.warning} />
          </View>
          <Text style={styles.widgetTitle}>This Week</Text>
        </View>
        
        <Text style={styles.metricNumber}>{metrics.applicationsWeek}</Text>
        <Text style={styles.metricLabel}>Applications</Text>
        
        {metrics.applicationsWeek === 0 && (
          <Text style={styles.emptyState}>Start tracking your applications</Text>
        )}
      </TouchableOpacity>
    </Card>
  );
}

export function UpcomingInterviewsWidget({ metrics }: { metrics: UserMetrics }) {
  return (
    <Card style={styles.widget}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/interview')}
        style={styles.widgetContent}
        testID="upcoming-interviews-widget"
      >
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
            <Calendar size={20} color={colors.success} />
          </View>
          <Text style={styles.widgetTitle}>Interviews</Text>
        </View>
        
        <Text style={styles.metricNumber}>{metrics.interviewsUpcoming}</Text>
        <Text style={styles.metricLabel}>Upcoming</Text>
        
        {metrics.interviewsUpcoming === 0 ? (
          <Text style={styles.emptyState}>No interviews yet — schedule prep</Text>
        ) : (
          <Text style={styles.nextInterview}>Next: Tomorrow 2:00 PM</Text>
        )}
      </TouchableOpacity>
    </Card>
  );
}

export function DeadlinesSoonWidget({ metrics }: { metrics: UserMetrics }) {
  return (
    <Card style={styles.widget}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/tracker')}
        style={styles.widgetContent}
        testID="deadlines-soon-widget"
      >
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
            <Clock size={20} color={colors.error} />
          </View>
          <Text style={styles.widgetTitle}>Deadlines</Text>
        </View>
        
        <Text style={styles.metricNumber}>{metrics.deadlines48h}</Text>
        <Text style={styles.metricLabel}>Within 48h</Text>
        
        {metrics.deadlines48h === 0 ? (
          <Text style={styles.emptyState}>No urgent deadlines</Text>
        ) : (
          <Text style={styles.urgentText}>Action needed soon!</Text>
        )}
      </TouchableOpacity>
    </Card>
  );
}

export function CommunityTeaserWidget() {
  return (
    <Card style={[styles.widget, styles.expandedWidget]}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/community')}
        style={styles.widgetContent}
        testID="community-teaser-widget"
      >
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Users size={20} color={colors.primary} />
          </View>
          <Text style={styles.widgetTitle}>Community</Text>
        </View>
        
        <View style={styles.communityPost}>
          <View style={styles.postHeader}>
            <View style={styles.postAvatar}>
              <User size={12} color={colors.textMuted} />
            </View>
            <View style={styles.postMeta}>
              <Text style={styles.postAuthor}>Sarah M.</Text>
              <Text style={styles.verifiedBadge}>✅</Text>
            </View>
          </View>
          <Text style={styles.postContent}>Just got hired as a CNA using ixJOB!</Text>
          <View style={styles.postActions}>
            <View style={styles.postAction}>
              <TrendingUp size={12} color={colors.textMuted} />
              <Text style={styles.postActionText}>12</Text>
            </View>
            <View style={styles.postAction}>
              <MessageSquare size={12} color={colors.textMuted} />
              <Text style={styles.postActionText}>3</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.widgetAction}>
          <Text style={styles.actionText}>View Community</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

export function TipsNudgesWidget() {
  const tips = [
    "Add keywords from job descriptions to your resume",
    "Practice the STAR method for interview questions",
    "Follow up on applications after 1 week",
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  return (
    <Card style={[styles.widget, styles.expandedWidget]}>
      <View style={styles.widgetContent} testID="tips-nudges-widget">
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
            <Lightbulb size={20} color={colors.warning} />
          </View>
          <Text style={styles.widgetTitle}>Tip of the Day</Text>
        </View>
        
        <Text style={styles.tipText}>{randomTip}</Text>
      </View>
    </Card>
  );
}

export function TranslatorQuickWidget() {
  return (
    <Card style={styles.widget}>
      <TouchableOpacity 
        onPress={() => router.push('/resources/tools/translator')}
        style={styles.widgetContent}
        testID="translator-quick-widget"
      >
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Languages size={20} color={colors.primary} />
          </View>
          <Text style={styles.widgetTitle}>Translator</Text>
        </View>
        
        <Text style={styles.widgetDescription}>Quick translate for job applications</Text>
        
        <PrimaryButton
          title="Open Translator"
          onPress={() => router.push('/resources/tools/translator')}
          style={styles.quickAction}
        />
      </TouchableOpacity>
    </Card>
  );
}

export function StreaksWidget({ metrics }: { metrics: UserMetrics }) {
  return (
    <Card style={styles.widget}>
      <View style={styles.widgetContent} testID="streaks-widget">
        <View style={styles.widgetHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
            <Flame size={20} color={colors.error} />
          </View>
          <Text style={styles.widgetTitle}>Streak</Text>
        </View>
        
        <Text style={styles.metricNumber}>{metrics.streakDays}</Text>
        <Text style={styles.metricLabel}>Days Active</Text>
        
        <Text style={styles.streakMotivation}>Keep it up! 🔥</Text>
      </View>
    </Card>
  );
}

export function DashboardWidget({ widget, metrics, onPress }: WidgetComponentProps) {
  switch (widget.key) {
    case 'resume-progress':
      return <ResumeProgressWidget metrics={metrics} />;
    case 'applications-week':
      return <ApplicationsWeekWidget metrics={metrics} />;
    case 'upcoming-interviews':
      return <UpcomingInterviewsWidget metrics={metrics} />;
    case 'deadlines-soon':
      return <DeadlinesSoonWidget metrics={metrics} />;
    case 'community-teaser':
      return <CommunityTeaserWidget />;
    case 'tips-nudges':
      return <TipsNudgesWidget />;
    case 'translator-quick':
      return <TranslatorQuickWidget />;
    case 'streaks':
      return <StreaksWidget metrics={metrics} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  widget: {
    width: WIDGET_WIDTH,
    marginBottom: spacing.md,
  },
  expandedWidget: {
    width: width - spacing.lg * 2,
  },
  widgetContent: {
    padding: spacing.md,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  widgetTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    flex: 1,
  },
  progressSection: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'right',
  },
  widgetDescription: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  widgetAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  metricNumber: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyState: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  nextInterview: {
    fontSize: fontSizes.xs,
    color: colors.success,
    textAlign: 'center',
    fontWeight: fontWeights.medium,
  },
  urgentText: {
    fontSize: fontSizes.xs,
    color: colors.error,
    textAlign: 'center',
    fontWeight: fontWeights.medium,
  },
  communityPost: {
    marginBottom: spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  postAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postAuthor: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginRight: spacing.xs,
  },
  verifiedBadge: {
    fontSize: fontSizes.xs,
  },
  postContent: {
    fontSize: fontSizes.xs,
    color: colors.text,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  postActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postActionText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  tipText: {
    fontSize: fontSizes.sm,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  quickAction: {
    marginTop: spacing.sm,
  },
  streakMotivation: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});