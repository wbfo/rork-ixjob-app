import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Languages, NotebookPen } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ToolsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tools</Text>
      <Text style={styles.subtitle}>Helpful utilities to boost your job search</Text>

      <Card style={styles.toolCard} testID="translator-tool-card">
        <TouchableOpacity style={styles.toolRow} onPress={() => router.push('/(tabs)/resources/tools/translator')}>
          <View style={[styles.iconContainer, { backgroundColor: '#3B82F615' }]}>
            <Languages size={28} color="#3B82F6" />
          </View>
          <View style={styles.toolInfo}>
            <Text style={styles.toolTitle}>Translator</Text>
            <Text style={styles.toolDescription}>
              Quickly translate text, audio, or job-related content into your preferred language for work.
            </Text>
          </View>
        </TouchableOpacity>
      </Card>

      <Card style={styles.toolCard} testID="notes-tool-card">
        <TouchableOpacity style={styles.toolRow} onPress={() => router.push('/(tabs)/resources/tools/notes')}>
          <View style={[styles.iconContainer, { backgroundColor: '#10B98115' }]}>
            <NotebookPen size={28} color="#10B981" />
          </View>
          <View style={styles.toolInfo}>
            <Text style={styles.toolTitle}>Notes</Text>
            <Text style={styles.toolDescription}>
              Capture interview prep, resume tweaks, and ideas. Organize with tags and quick search.
            </Text>
          </View>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  toolCard: {
    marginBottom: 12,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});