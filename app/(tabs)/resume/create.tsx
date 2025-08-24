import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { X, FileText, Camera, Upload, MessageCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '@/theme/tokens';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const RESUME_TEMPLATES: ResumeTemplate[] = [
  { id: 'healthcare', name: 'Healthcare', description: 'For medical and healthcare professionals', preview: '🏥' },
  { id: 'trades', name: 'Trades', description: 'For skilled trades and technical roles', preview: '🔧' },
  { id: 'security', name: 'Security', description: 'For security and law enforcement', preview: '🛡️' },
  { id: 'hospitality', name: 'Hospitality', description: 'For service and hospitality industry', preview: '🏨' },
  { id: 'general', name: 'General', description: 'Professional template for any industry', preview: '📄' },
];

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Arabic', value: 'ar' },
];

const MARKETS = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es' },
  { label: 'Brazil', value: 'br' },
  { label: 'Mexico', value: 'mx' },
  { label: 'Other', value: 'other' },
];

export default function CreateResumeScreen() {
  const { isLoading } = useProtectedRoute();
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedMarket, setSelectedMarket] = useState('us');
  const [isCreating, setIsCreating] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<string>('');

  console.log('Create resume screen state:', { step, selectedMethod, selectedTemplate });

  if (isLoading) {
    return <LoadingView message="Loading resume builder..." />;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: step === 1 ? 'How would you like to start?' : 
                 step === 2 ? 'Choose a template' : 
                 'Language & Market',
          headerBackTitle: 'Back'
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {step === 1 && renderMethodSelection()}
          {step === 2 && renderTemplateSelection()}
          {step === 3 && renderLanguageMarketSelection()}
        </View>

        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          {step < 3 && selectedMethod && step !== 1 && (
            <PrimaryButton
              title="Continue"
              onPress={() => {
                console.log('Continue button pressed, current step:', step, 'selected method:', selectedMethod);
                setStep(step + 1);
              }}
              style={styles.continueButton}
            />
          )}
          {step === 3 && selectedTemplate && (
            <PrimaryButton
              title={isCreating ? "Creating..." : "Create Résumé"}
              onPress={handleCreateResume}
              disabled={isCreating}
              style={styles.continueButton}
            />
          )}
        </View>
      </ScrollView>
    </>
  );

  function renderMethodSelection() {
    const methods = [
      {
        id: 'scratch',
        title: 'Start from Scratch',
        description: 'Build your resume step by step',
        icon: <FileText size={24} color={colors.primary} />,
        testId: 'cr-start'
      },
      {
        id: 'photo',
        title: 'Import Photo (OCR)',
        description: 'Take a photo of your existing resume',
        icon: <Camera size={24} color={colors.primary} />,
        testId: 'cr-ocr'
      },
      {
        id: 'upload',
        title: 'Upload File',
        description: 'Import from PDF or DOCX file',
        icon: <Upload size={24} color={colors.primary} />,
        testId: 'cr-upload'
      },
      {
        id: 'ai',
        title: 'Build via AI Chat',
        description: 'Let AI help you create your resume',
        icon: <MessageCircle size={24} color={colors.primary} />,
        testId: 'cr-chat'
      },
    ];

    return (
      <View style={styles.methodGrid}>
        {methods.map((method) => {
          const isLoading = loadingMethod === method.id;
          const isDisabled = loadingMethod !== '' && loadingMethod !== method.id;
          
          return (
            <TouchableOpacity
              key={method.id}
              testID={method.testId}
              accessibilityRole="button"
              accessibilityLabel={`${method.title}: ${method.description}`}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.selectedMethodCard,
                isDisabled && styles.disabledMethodCard,
              ]}
              onPress={() => handleMethodSelection(method.id)}
              disabled={isDisabled}
            >
              <View style={styles.methodIcon}>
                {isLoading ? (
                  <ActivityIndicator size={24} color={colors.primary} />
                ) : (
                  method.icon
                )}
              </View>
              <View style={styles.methodContent}>
                <Text style={[styles.methodTitle, isDisabled && styles.disabledText]}>
                  {method.title}
                </Text>
                <Text style={[styles.methodDescription, isDisabled && styles.disabledText]}>
                  {method.description}
                </Text>
              </View>
              {!isLoading && (
                <ChevronRight 
                  size={16} 
                  color={isDisabled ? colors.textMuted : colors.textSecondary} 
                  style={styles.methodArrow} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  function renderTemplateSelection() {
    return (
      <View style={styles.templateGrid}>
        {RESUME_TEMPLATES.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              selectedTemplate === template.id && styles.selectedTemplateCard,
            ]}
            onPress={() => setSelectedTemplate(template.id)}
          >
            <Text style={styles.templatePreview}>{template.preview}</Text>
            <Text style={styles.templateName}>{template.name}</Text>
            <Text style={styles.templateDescription}>{template.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  function renderLanguageMarketSelection() {
    return (
      <View style={styles.selectionContainer}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Editing Language</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={setSelectedLanguage}
              style={styles.picker}
            >
              {LANGUAGES.map((lang) => (
                <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Target Market</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMarket}
              onValueChange={setSelectedMarket}
              style={styles.picker}
            >
              {MARKETS.map((market) => (
                <Picker.Item key={market.value} label={market.label} value={market.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    );
  }

  async function handleMethodSelection(methodId: string) {
    console.log('Analytics: create_resume_option_clicked', { option: methodId });
    
    setLoadingMethod(methodId);
    setSelectedMethod(methodId);

    try {
      // Handle different methods immediately
      if (methodId === 'photo') {
        await handlePhotoImport();
      } else if (methodId === 'upload') {
        await handleFileUpload();
      } else if (methodId === 'ai') {
        // Route to AI chat flow
        router.push('/resume/ai-start' as any);
      } else {
        // For "Start from Scratch", immediately create a draft and go to editor
        await createDraftWithDefaults('scratch');
      }
    } catch (error) {
      console.error('Failed to handle method selection:', error);
      console.log('Analytics: resume_create_failed', { method: methodId, code: 'method_selection_error' });
      Alert.alert('Error', 'Couldn\'t start that flow. Please try again.');
    } finally {
      setLoadingMethod('');
    }
  }

  async function handleCreateResume() {
    if (!selectedMethod || !selectedTemplate) return;

    setIsCreating(true);

    try {
      await createDraft();
    } catch (error) {
      console.error('Failed to create resume:', error);
      console.log('Analytics: resume_create_failed', { method: selectedMethod, code: 'draft_creation_error' });
      Alert.alert('Error', 'Couldn\'t create draft. Try again.');
    } finally {
      setIsCreating(false);
    }
  }

  async function handlePhotoImport() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Analytics: import_ocr_started');
        // TODO: Implement OCR import API call
        // const ocrResult = await fetch('/api/resumes.ocrImport', {
        //   method: 'POST',
        //   body: formData
        // });
        console.log('Photo selected for OCR:', result.assets[0].uri);
        console.log('Analytics: import_ocr_completed');
        
        // For now, create draft with default template and proceed to edit
        await createDraftWithDefaults('photo');
      }
    } catch (error) {
      console.error('Photo import error:', error);
      throw error;
    }
  }

  async function handleFileUpload() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Analytics: import_file_started');
        // TODO: Implement file import API call
        // const importResult = await fetch('/api/resumes.fileImport', {
        //   method: 'POST',
        //   body: formData
        // });
        console.log('File selected for import:', result.assets[0].uri);
        console.log('Analytics: import_file_completed');
        
        // For now, create draft with default template and proceed to edit
        await createDraftWithDefaults('upload');
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  async function createDraft() {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/resumes.createDraft', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     method: selectedMethod,
    //     template: selectedTemplate,
    //     editingLanguage: selectedLanguage,
    //     targetMarket: selectedMarket
    //   })
    // });
    
    const mockResumeId = `resume_${Date.now()}`;
    
    // Log analytics
    console.log('Analytics: resume_draft_created', {
      method: selectedMethod,
      template: selectedTemplate,
      language: selectedLanguage,
      market: selectedMarket,
    });

    // Navigate to resume editor
    router.push(`/(tabs)/resume/${mockResumeId}/edit` as any);
  }

  async function createDraftWithDefaults(method: string) {
    // TODO: Replace with actual API call
    const mockResumeId = `resume_${Date.now()}`;
    
    // Log analytics
    console.log('Analytics: resume_draft_created', {
      method: method,
      template: 'general', // Default template
      language: 'en',
      market: 'us',
    });

    // Navigate to resume editor
    router.push(`/(tabs)/resume/${mockResumeId}/edit` as any);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  continueButton: {
    flex: 1,
    marginLeft: 16,
  },
  methodGrid: {
    gap: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 88,
  },
  disabledMethodCard: {
    opacity: 0.5,
  },
  selectedMethodCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodIcon: {
    marginRight: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.textMuted,
  },
  methodArrow: {
    marginLeft: 8,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  templateCard: {
    width: '47%',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedTemplateCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  templatePreview: {
    fontSize: 32,
    marginBottom: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectionContainer: {
    gap: 24,
  },
  dropdownContainer: {
    gap: 8,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
});