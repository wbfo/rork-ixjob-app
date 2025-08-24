import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Save, Download, Share, Eye } from 'lucide-react-native';
import { colors } from '@/theme/tokens';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useLocalSearchParams, router, Stack } from 'expo-router';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'experience';
}

export default function EditResumeScreen() {
  const { isLoading } = useProtectedRoute();
  const { resumeId } = useLocalSearchParams<{ resumeId: string }>();
  const [resumeData, setResumeData] = useState<ResumeSection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  console.log('Edit resume screen for ID:', resumeId);

  useEffect(() => {
    loadResumeData();
  }, [resumeId]);

  useEffect(() => {
    // Auto-save every 5 seconds (debounced)
    const autoSaveInterval = setInterval(() => {
      if (resumeData.length > 0) {
        handleAutoSave();
      }
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [resumeData]);

  if (isLoading) {
    return <LoadingView message="Loading resume editor..." />;
  }

  async function loadResumeData() {
    try {
      // TODO: Replace with actual API call
      const mockData: ResumeSection[] = [
        {
          id: 'personal',
          title: 'Personal Information',
          content: 'John Doe\nSoftware Engineer\njohn.doe@email.com\n(555) 123-4567',
          type: 'text'
        },
        {
          id: 'summary',
          title: 'Professional Summary',
          content: 'Experienced software engineer with 5+ years of experience in full-stack development.',
          type: 'text'
        },
        {
          id: 'experience',
          title: 'Work Experience',
          content: 'Senior Software Engineer\nTech Company Inc.\n2020 - Present\n• Led development of mobile applications\n• Improved system performance by 40%',
          type: 'experience'
        },
        {
          id: 'education',
          title: 'Education',
          content: 'Bachelor of Science in Computer Science\nUniversity of Technology\n2016 - 2020',
          type: 'text'
        },
        {
          id: 'skills',
          title: 'Skills',
          content: '• JavaScript, TypeScript, React Native\n• Node.js, Express, MongoDB\n• AWS, Docker, Kubernetes',
          type: 'list'
        }
      ];
      
      setResumeData(mockData);
      console.log('Resume data loaded:', mockData);
    } catch (error) {
      console.error('Failed to load resume data:', error);
      Alert.alert('Error', 'Failed to load resume data.');
    }
  }

  async function handleAutoSave() {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      console.log('Auto-saving resume:', resumeId, resumeData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleManualSave() {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      console.log('Manually saving resume:', resumeId, resumeData);
      setLastSaved(new Date());
      Alert.alert('Success', 'Resume saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  }

  function updateSection(sectionId: string, newContent: string) {
    setResumeData(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, content: newContent }
          : section
      )
    );
  }

  function handlePreview() {
    Alert.alert('Preview', 'Resume preview feature coming soon!');
  }

  function handleDownload() {
    Alert.alert('Download', 'Resume download feature coming soon!');
  }

  function handleShare() {
    Alert.alert('Share', 'Resume sharing feature coming soon!');
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Edit Resume',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handlePreview} style={styles.headerButton}>
                <Eye size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleManualSave} style={styles.headerButton}>
                <Save size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {isSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Ready'}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isSaving ? colors.warning : colors.success }]} />
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.editorContainer}>
            <View style={styles.leftPanel}>
              {resumeData.map((section) => (
                <View key={section.id} style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <TextInput
                    style={[
                      styles.sectionInput,
                      section.type === 'experience' && styles.experienceInput,
                      section.type === 'list' && styles.listInput
                    ]}
                    value={section.content}
                    onChangeText={(text) => updateSection(section.id, text)}
                    multiline
                    placeholder={`Enter ${section.title.toLowerCase()}...`}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              ))}
            </View>

            <View style={styles.rightPanel}>
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Live Preview</Text>
                <View style={styles.previewContent}>
                  {resumeData.map((section) => (
                    <View key={section.id} style={styles.previewSection}>
                      <Text style={styles.previewSectionTitle}>{section.title}</Text>
                      <Text style={styles.previewSectionContent}>{section.content}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleDownload} style={styles.footerButton}>
            <Download size={20} color={colors.primary} />
            <Text style={styles.footerButtonText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleShare} style={styles.footerButton}>
            <Share size={20} color={colors.primary} />
            <Text style={styles.footerButtonText}>Share</Text>
          </TouchableOpacity>
          
          <PrimaryButton
            title="Save & Continue"
            onPress={handleManualSave}
            disabled={isSaving}
            style={styles.saveButton}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  editorContainer: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 600,
  },
  leftPanel: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  rightPanel: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.surface,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  experienceInput: {
    minHeight: 120,
  },
  listInput: {
    minHeight: 100,
  },
  previewContainer: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  previewContent: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    flex: 1,
  },
  previewSection: {
    marginBottom: 16,
  },
  previewSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  previewSectionContent: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  footerButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
  },
});