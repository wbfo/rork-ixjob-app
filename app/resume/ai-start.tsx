import React, { useCallback, useMemo, useRef, useState, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MessageCircle, Send, Loader } from 'lucide-react-native';
import { colors, spacing, radius, fontSizes, fontWeights, shadows } from '@/theme/tokens';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { router, Stack } from 'expo-router';
import { Screen } from '@/components/Screen';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBubble = memo(function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage,
      ]}
      testID={`chat-bubble-${message.id}`}
      accessibilityRole="text"
      accessibilityLabel={`${message.role} message`}
    >
      <Text
        style={[styles.messageText, isUser ? styles.userMessageText : styles.assistantMessageText]}
      >
        {message.content}
      </Text>
      <Text style={styles.messageTime}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
});

export default function AIResumeStartScreen() {
  const { isLoading } = useProtectedRoute();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m here to help you build an amazing resume. Let\'s start with some basic information. What\'s your name and what type of job are you looking for?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView | null>(null);

  console.log('AI Resume Start screen loaded');

  const canSend = useMemo(() => inputText.trim().length > 0 && !isTyping, [inputText, isTyping]);

  const scrollToEnd = useCallback(() => {
    try {
      scrollRef.current?.scrollToEnd({ animated: true });
    } catch (e) {
      console.log('scrollToEnd error', e);
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    requestAnimationFrame(scrollToEnd);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Great! Based on what you\'ve told me, I can help you create a tailored resume. Would you like me to generate a draft now, or do you have more information to share?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      requestAnimationFrame(scrollToEnd);
    } catch (error) {
      console.error('AI chat error:', error);
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, [inputText, scrollToEnd]);

  const handleGenerateResume = useCallback(() => {
    console.log('Analytics: resume_draft_created', {
      method: 'ai',
      template: 'general',
      language: 'en',
      market: 'us',
    });

    const mockResumeId = `resume_${Date.now()}`;
    router.push(`/(tabs)/resume/${mockResumeId}/edit` as any);
  }, []);

  if (isLoading) {
    return <LoadingView message="Loading AI assistant..." />;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'AI Resume Builder',
          headerBackTitle: 'Back'
        }} 
      />

      <Screen>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Resume Assistant</Text>
          <Text style={styles.headerTitle}>Build via AI Chat</Text>
          <View style={styles.accentBar} />
          <Text style={styles.headerSubtitle}>
            Share your experience and role goals. I will turn your notes into a polished resume you can edit.
          </Text>
        </View>

        <View style={styles.chatWrapper}>
          <ScrollView
            ref={scrollRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}

            {isTyping && (
              <View style={[styles.messageContainer, styles.assistantMessage]}>
                <View style={styles.typingIndicator}>
                  <Loader size={16} color={colors.primary} />
                  <Text style={styles.typingText}>AI is typing...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Tell me about your experience..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={500}
                accessibilityLabel="Message input"
                testID="ai-input"
              />
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Send message"
                style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!canSend}
                testID="ai-send"
              >
                <Send size={20} color={canSend ? colors.primary : colors.textMuted} />
              </TouchableOpacity>
            </View>

            <PrimaryButton
              title="Generate Resume Now"
              onPress={handleGenerateResume}
              style={styles.generateButton}
              leftIcon={<MessageCircle size={18} color="#FFFFFF" />}
              disabled={messages.length < 2}
              testID="ai-generate"
            />
          </View>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.textOnBlueQuaternary,
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.textOnBlue,
  },
  accentBar: {
    height: 4,
    width: 64,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textOnBlueSecondary,
    maxWidth: 320,
  },
  chatWrapper: {
    flex: 1,
    marginTop: spacing.lg,
    backgroundColor: 'transparent',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 12,
    ...shadows.subtle,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 12,
    ...shadows.card,
  },
  messageText: {
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
    maxHeight: 120,
    paddingVertical: spacing.xs,
    minHeight: 40,
  },
  sendButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  generateButton: {
    marginTop: spacing.xs,
  },
});