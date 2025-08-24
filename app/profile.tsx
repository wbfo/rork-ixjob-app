import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { User, MapPin, Globe, CheckCircle } from 'lucide-react-native';
import { useAuthContext } from '@/providers/AuthProvider';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';

export default function ProfileScreen() {
  useHeaderTitle('nav.profile');
  const { isLoading } = useProtectedRoute();
  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();
  const [isPublic, setIsPublic] = useState<boolean>(true);

  if (isLoading) {
    return <LoadingView message="Loading profile..." />;
  }

  const userPosts = [
    {
      id: '1',
      content: 'Just completed my resume using the builder! The ATS optimization tips were really helpful.',
      createdAt: '2 hours ago',
      reactions: { up: 8, celebrate: 3, comments: 2 },
    },
    {
      id: '2', 
      content: 'Interview prep session went great today. Feeling more confident about my upcoming interview!',
      createdAt: '1 day ago',
      reactions: { up: 12, celebrate: 5, comments: 4 },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={48} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.textMuted} />
            <Text style={styles.location}>United States</Text>
          </View>
          <View style={styles.languageRow}>
            <Globe size={16} color={colors.textMuted} />
            <View style={styles.languageBadge}>
              <Text style={styles.languageText}>EN</Text>
            </View>
            <View style={styles.languageBadge}>
              <Text style={styles.languageText}>ES</Text>
            </View>
          </View>
        </View>

        <Card style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>
            Dedicated healthcare professional seeking CNA opportunities. 
            Passionate about patient care and committed to making a difference in people&apos;s lives.
          </Text>
        </Card>

        <Card style={styles.resumeSection}>
          <View style={styles.resumeHeader}>
            <Text style={styles.sectionTitle}>Résumé Status</Text>
            <CheckCircle size={20} color={colors.success} />
          </View>
          <Text style={styles.resumeStatus}>Résumé Complete ✅</Text>
          <Text style={styles.resumeSubtext}>Last updated 3 days ago</Text>
        </Card>

        <Card style={styles.privacySection}>
          <View style={styles.privacyHeader}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              testID="privacy-toggle"
            />
          </View>
          <Text style={styles.privacyText}>
            {isPublic ? 'Public Profile' : 'Community Only'}
          </Text>
          <Text style={styles.privacySubtext}>
            {isPublic 
              ? 'Your profile is visible to everyone'
              : 'Your profile is only visible to community members'
            }
          </Text>
        </Card>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>My Posts</Text>
          {userPosts.map((post) => (
            <Card key={post.id} style={styles.postCard}>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.postTime}>{post.createdAt}</Text>
                <View style={styles.postStats}>
                  <Text style={styles.postStat}>👍 {post.reactions.up}</Text>
                  <Text style={styles.postStat}>🎉 {post.reactions.celebrate}</Text>
                  <Text style={styles.postStat}>💬 {post.reactions.comments}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.actionSection}>
          <PrimaryButton
            title="Edit Profile"
            onPress={() => console.log('Edit profile')}
            testID="edit-profile-button"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  userName: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  location: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  languageBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  languageText: {
    fontSize: fontSizes.xs,
    color: colors.textInverse,
    fontWeight: fontWeights.medium,
  },
  aboutSection: {
    margin: spacing.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  aboutText: {
    fontSize: fontSizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  resumeSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  resumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  resumeStatus: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  resumeSubtext: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  privacySection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  privacyText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  privacySubtext: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  postsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  postCard: {
    padding: spacing.md,
    marginTop: spacing.md,
  },
  postContent: {
    fontSize: fontSizes.md,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTime: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  postStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  postStat: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  actionSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
});