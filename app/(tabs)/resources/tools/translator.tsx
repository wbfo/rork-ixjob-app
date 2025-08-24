import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/colors';
import { Translator } from '@/components/Translator';

export default function TranslatorToolScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Translator</Text>
      <Translator sourceTag="resources_tools" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
});