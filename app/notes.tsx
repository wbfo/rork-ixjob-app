import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { Screen } from '@/components/Screen';
import { GradientBackground } from '@/theme/GradientBackground';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Tag,
  Calendar
} from 'lucide-react-native';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  entityRef?: string; // Reference to job, interview, etc.
}

export default function NotesScreen() {
  const { t } = useTranslation();
  const { entityRef } = useLocalSearchParams<{ entityRef?: string }>();
  console.log('entityRef:', entityRef); // For future use
  
  useHeaderTitle('resources.notes.title');
  
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Interview prep notes',
      content: 'Remember to research company culture and prepare STAR method examples.',
      tags: ['interview', 'preparation'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Resume improvements',
      content: 'Add quantified achievements to work experience section. Update skills with React Native.',
      tags: ['resume', 'skills'],
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
    },
  ]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = useCallback(() => {
    // TODO: Create note editor page
    console.log('Create note');
  }, []);

  const handleEditNote = useCallback((noteId: string) => {
    // TODO: Create note editor page
    console.log('Edit note:', noteId);
  }, []);

  const handleDeleteNote = useCallback((noteId: string) => {
    Alert.alert(
      t('common.confirm'),
      'Are you sure you want to delete this note?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            setNotes(prev => prev.filter(note => note.id !== noteId));
          },
        },
      ]
    );
  }, [t]);

  const renderNote = useCallback(({ item }: { item: Note }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <Card style={styles.noteCard}>
        <TouchableOpacity 
          style={styles.noteContent}
          onPress={() => handleEditNote(item.id)}
          testID={`note-${item.id}`}
        >
          <View style={styles.noteHeader}>
            <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.noteActions}>
              <TouchableOpacity 
                onPress={() => handleEditNote(item.id)}
                style={styles.actionButton}
                testID={`edit-note-${item.id}`}
              >
                <Edit3 size={16} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDeleteNote(item.id)}
                style={styles.actionButton}
                testID={`delete-note-${item.id}`}
              >
                <Trash2 size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.notePreview} numberOfLines={2}>
            {item.content}
          </Text>
          
          <View style={styles.noteMeta}>
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Tag size={10} color={colors.primary} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {item.tags.length > 2 && (
                <Text style={styles.moreTagsText}>+{item.tags.length - 2}</Text>
              )}
            </View>
            
            <View style={styles.dateContainer}>
              <Calendar size={12} color={colors.textMuted} />
              <Text style={styles.dateText}>{formatDate(item.updatedAt)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  }, [handleEditNote, handleDeleteNote]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('common.search', 'Search notes...')}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="notes-search"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateNote}
        testID="create-note-button"
      >
        <Plus size={20} color={colors.textInverse} />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No notes yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first note to save ideas and track your progress
      </Text>
      <PrimaryButton
        title="Create Note"
        onPress={handleCreateNote}
        style={styles.emptyButton}
        testID="empty-create-note"
      />
    </View>
  );

  return (
    <Screen>
      <GradientBackground>
        <View style={styles.container}>
          {renderHeader()}
          
          {filteredNotes.length === 0 && searchQuery === '' ? (
            renderEmpty()
          ) : (
            <FlatList
              data={filteredNotes}
              keyExtractor={(item) => item.id}
              renderItem={renderNote}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.bottom + 100 }
              ]}
              showsVerticalScrollIndicator={false}
              testID="notes-list"
            />
          )}
        </View>
      </GradientBackground>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  noteCard: {
    padding: 0,
  },
  noteContent: {
    padding: spacing.lg,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  noteTitle: {
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  noteActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
  notePreview: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    gap: 2,
  },
  tagText: {
    fontSize: fontSizes.xs,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  moreTagsText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
  },
});