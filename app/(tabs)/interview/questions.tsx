import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { Search, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { EmptyView } from '@/components/EmptyView';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const mockQuestions: Question[] = [
  { id: '1', text: 'Tell me about yourself', category: 'General', difficulty: 'Easy' },
  { id: '2', text: 'Why do you want to work here?', category: 'Company', difficulty: 'Medium' },
  { id: '3', text: 'Describe a challenging project you worked on', category: 'Behavioral', difficulty: 'Medium' },
  { id: '4', text: 'Where do you see yourself in 5 years?', category: 'Career Goals', difficulty: 'Easy' },
  { id: '5', text: 'How do you handle conflict in a team?', category: 'Behavioral', difficulty: 'Hard' },
  { id: '6', text: 'What are your greatest strengths?', category: 'General', difficulty: 'Easy' },
  { id: '7', text: 'Describe a time you failed and how you handled it', category: 'Behavioral', difficulty: 'Hard' },
  { id: '8', text: 'Why are you leaving your current job?', category: 'Career', difficulty: 'Medium' },
];

export default function QuestionBankScreen() {
  const { t } = useTranslation();
  useHeaderTitle('nav:questionBank');
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [questions] = useState<Question[]>(mockQuestions);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('[QuestionBank] Refreshed questions');
    setRefreshing(false);
  };

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPractice = (question: Question) => {
    console.log('[QuestionBank] Opening practice for:', question.text);
    router.push({
      pathname: '/(tabs)/interview/feedback',
      params: { question: question.text }
    });
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <TouchableOpacity onPress={() => openPractice(item)} style={styles.questionItem}>
      <Card style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.questionInfo}>
            <Text style={styles.questionText} numberOfLines={2}>{item.text}</Text>
            <View style={styles.questionMeta}>
              <Text style={styles.categoryText}>{item.category}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return colors.textMuted;
    }
  };

  return (
    <Screen>
      <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('interview:searchQuestions')}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="question-search-input"
            />
          </View>
        </View>

        <FlatList
          data={filteredQuestions}
          keyExtractor={(item) => item.id}
          renderItem={renderQuestion}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyView 
              title={t('common:noResults')}
              message="Try adjusting your search terms"
              testID="questions-empty-state"
            />
          }
          contentContainerStyle={filteredQuestions.length === 0 ? styles.emptyContainer : styles.listContainer}
          showsVerticalScrollIndicator={false}
          testID="questions-list"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  questionItem: {
    marginBottom: spacing.md,
  },
  questionCard: {
    padding: spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  questionText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  difficultyText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.textOnBlue,
  },
});