import React, { useCallback, useMemo, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors, fontSizes, fontWeights, radius, shadows, spacing } from '@/theme/tokens';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MessageCircle, PartyPopper, ThumbsUp, User, Globe, ArrowLeft } from 'lucide-react-native';
import { useAuthContext } from '@/providers/AuthProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/Screen';
import { GradientBackground } from '@/theme/GradientBackground';
import { useNavigation } from 'expo-router';



import { useTranslation } from 'react-i18next';

interface Post {
  id: string;
  user: { id: string; name: string; language: string; market?: string };
  content: string;
  createdAt: string;
  reactions: { up: number; celebrate: number; comments: number };
  verifiedHire?: boolean;
  comments?: Array<{ id: string; user: string; text: string }>;
}

export default function CommunityFeedScreen() {
  const { t } = useTranslation();

  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Community',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          testID="community-back-button"
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: { id: 'sarah', name: 'Sarah M.', language: 'en', market: 'US' },
      content: 'Just got hired as a CNA using ixJOB! The interview prep really helped. Thank you!',
      createdAt: '2 hours ago',
      reactions: { up: 12, celebrate: 8, comments: 3 },
      verifiedHire: true,
    },
    {
      id: '2',
      user: { id: 'carlos', name: 'Carlos R.', language: 'es', market: 'US' },
      content: 'Completed my first resume today. The ATS optimization tips were amazing!',
      createdAt: '5 hours ago',
      reactions: { up: 6, celebrate: 2, comments: 1 },
    },
  ]);

  const submit = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        user: { id: user?.id ?? 'me', name: user?.name ?? 'You', language: 'en', market: 'US' },
        content: text.trim(),
        createdAt: new Date().toISOString(),
        reactions: { up: 0, celebrate: 0, comments: 0 },
      };
      setPosts(prev => [newPost, ...prev]);
      setText('');
      console.log('analytics.community_post_created');
    } catch (e) {
      console.error('community.post.error', e);
    } finally {
      setLoading(false);
    }
  }, [text, user]);

  const renderItem = useCallback(({ item }: { item: Post }) => {
    return (
      <Card style={styles.post}>
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.postAvatar} onPress={() => console.log('profile', item.user.id)}>
            <User size={18} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.userMeta}>
            <TouchableOpacity onPress={() => console.log('profile', item.user.id)}>
              <Text style={styles.username}>{item.user.name}</Text>
            </TouchableOpacity>
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{item.createdAt}</Text>
              <View style={styles.languageBadge}>
                <Globe size={12} color={colors.textInverse} />
                <Text style={styles.languageText}>{item.user.language.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          {item.verifiedHire && (
            <View style={styles.verifiedContainer}>
              <Text style={styles.verified}>✅</Text>
              <Text style={styles.verifiedText}>Hired!</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.content}>{item.content}</Text>
        
        <View style={styles.actionsContainer}>
          <View style={styles.actionStats}>
            <Text style={styles.statsText}>
              {item.reactions.up + item.reactions.celebrate} reactions • {item.reactions.comments} comments
            </Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.action} 
              accessibilityRole="button" 
              onPress={() => console.log('reaction.up', item.id)}
            >
              <ThumbsUp size={18} color={colors.textMuted} />
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.action} 
              accessibilityRole="button" 
              onPress={() => console.log('reaction.celebrate', item.id)}
            >
              <PartyPopper size={18} color={colors.textMuted} />
              <Text style={styles.actionText}>Celebrate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.action} 
              accessibilityRole="button" 
              onPress={() => console.log('comment', item.id)}
            >
              <MessageCircle size={18} color={colors.textMuted} />
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  }, []);

  const header = useMemo(() => (
    <View style={styles.headerContainer}>
      <View style={styles.composer}>
        <View style={styles.composerHeader}>
          <View style={styles.composerAvatar}>
            <User size={20} color={colors.primary} />
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Share your progress or ask the community..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            maxLength={280}
            multiline
            testID="community-input"
          />
        </View>
        <View style={styles.composerActions}>
          <Text style={styles.charCount}>{text.length}/280</Text>
          <PrimaryButton 
            title="Post" 
            onPress={submit} 
            disabled={loading || text.trim().length === 0} 
            style={styles.postBtn} 
            testID="community-post" 
          />
        </View>
      </View>

      <View style={styles.successWall}>
        <View style={styles.successHeader}>
          <Text style={styles.successTitle}>🏆 Success Wall</Text>
          <Text style={styles.successSubtitle}>Celebrate community wins!</Text>
        </View>
      </View>
    </View>
  ), [loading, submit, text]);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <GradientBackground>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        testID="community-feed"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
  headerContainer: {
    marginBottom: spacing.lg,
  },
  composer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  composerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  composerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    color: colors.text,
    minHeight: 60,
    fontSize: fontSizes.md,
    textAlignVertical: 'top',
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  postBtn: {
    paddingHorizontal: spacing.lg,
  },
  successWall: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  successHeader: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  post: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userMeta: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.md,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    gap: 2,
  },
  languageText: {
    color: colors.textInverse,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
  },
  verifiedContainer: {
    alignItems: 'center',
  },
  verified: {
    fontSize: fontSizes.lg,
  },
  verifiedText: {
    fontSize: fontSizes.xs,
    color: colors.success,
    fontWeight: fontWeights.medium,
  },
  content: {
    color: colors.text,
    fontSize: fontSizes.md,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  actionStats: {
    marginBottom: spacing.sm,
  },
  statsText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  actionText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});