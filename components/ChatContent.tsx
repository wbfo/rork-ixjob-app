import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { Send, User, AlertTriangle, Mic } from 'lucide-react-native';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

type Sender = 'bot' | 'user';
interface UiMessage { id: number; text: string; sender: Sender }

type ContentPart = { type: 'text'; text: string } | { type: 'image'; image: string };
 type CoreMessage =
  | { role: 'system'; content: string | ContentPart[] }
  | { role: 'user'; content: string | ContentPart[] }
  | { role: 'assistant'; content: string | ContentPart[] };

export function ChatContent() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const webMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const webStreamRef = useRef<MediaStream | null>(null);
  const webChunksRef = useRef<Blob[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<FlatList>(null);
  const HEADER_H = 56;

  useEffect(() => {
    if (showWelcome) {
      const welcomeMsg: UiMessage = {
        id: 1,
        text: "Hello! I'm Jobii, your AI career assistant. I'm here to help you with resumes, interview prep, job search strategies, and career advice. What can I help you with today?",
        sender: 'bot',
      };
      setMessages([welcomeMsg]);
      setShowWelcome(false);
    }
  }, [showWelcome]);

  const apiMessages = useMemo<CoreMessage[]>(() => {
    const mapped = messages.map<CoreMessage>((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));
    return [
      { role: 'system', content: 'You are ixJOB career assistant. Be concise and helpful.' },
      ...mapped,
    ];
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!message.trim() || isSending) return;
    console.log('[Chat] Sending message:', message);
    setError(null);

    const userMsg: UiMessage = { id: Date.now(), text: message, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');

    try {
      setIsSending(true);
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const body = { messages: [...apiMessages, { role: 'user', content: message }] };
      console.log('[Chat] Request body', JSON.stringify(body).slice(0, 400));

      // Try backend first, fallback to external API
      let data: { completion?: string };
      try {
        // Try backend API first (if available)
        const backendRes = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(body),
          signal: abortRef.current.signal,
        });
        
        if (backendRes.ok) {
          data = await backendRes.json();
          console.log('[Chat] Backend API response:', data);
        } else {
          throw new Error('Backend unavailable');
        }
      } catch (backendError) {
        console.log('[Chat] Backend unavailable, using external API');
        
        // Fallback to external API
        const res = await fetch('https://toolkit.rork.com/text/llm/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(body),
          signal: abortRef.current.signal,
        });

        console.log('[Chat] External API response status:', res.status, res.statusText);

        if (!res.ok) {
          const errorText = await res.text().catch(() => 'Unknown error');
          console.log('[Chat] API error response:', errorText);
          throw new Error(`API Error ${res.status}: ${res.statusText}`);
        }

        data = (await res.json()) as { completion?: string };
        console.log('[Chat] External API response data:', data);
      }
      
      const completion = data?.completion ?? '';
      if (!completion.trim()) {
        console.warn('[Chat] Empty completion received from API');
      }
      
      const botMsg: UiMessage = { 
        id: Date.now() + 1, 
        text: completion || 'I apologize, but I could not generate a response right now. Please try again.', 
        sender: 'bot' 
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      console.error('[Chat] Send failed:', msg, e);
      
      if (e instanceof Error && e.name === 'AbortError') {
        console.log('[Chat] Request was aborted');
        return; // Don't show error for aborted requests
      }
      
      setError('Unable to connect to AI assistant. Please check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  }, [apiMessages, isSending, message]);

  const handleMicPress = useCallback(async () => {
    try {
      if (isRecording) {
        if (Platform.OS === 'web') {
          const mr = webMediaRecorderRef.current;
          mr?.stop();
          webStreamRef.current?.getTracks().forEach((t) => t.stop());
          setIsRecording(false);
          // Wait a tick for dataavailable
          setTimeout(async () => {
            const blob = new Blob(webChunksRef.current, { type: 'audio/webm' });
            webChunksRef.current = [];
            const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('audio', file);
            const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: formData });
            const data = (await res.json()) as { text?: string };
            const transcript = data?.text ?? '';
            if (transcript) setMessage((prev) => (prev ? prev + ' ' : '') + transcript);
          }, 0);
        } else {
          const rec = recordingRef.current;
          if (!rec) return;
          await rec.stopAndUnloadAsync();
          const uri = rec.getURI();
          recordingRef.current = null;
          await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
          setIsRecording(false);
          if (!uri) return;
          const uriParts = uri.split('.');
          const fileType = uriParts[uriParts.length - 1] ?? 'm4a';
          const audioFile: any = { uri, name: `recording.${fileType}`, type: `audio/${fileType}` };
          const formData = new FormData();
          formData.append('audio', audioFile as any);
          const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: formData });
          const data = (await res.json()) as { text?: string };
          const transcript = data?.text ?? '';
          if (transcript) setMessage((prev) => (prev ? prev + ' ' : '') + transcript);
        }
        return;
      }

      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        webStreamRef.current = stream;
        const mr = new MediaRecorder(stream);
        webChunksRef.current = [];
        mr.ondataavailable = (e) => { if (e.data.size > 0) webChunksRef.current.push(e.data); };
        mr.start();
        webMediaRecorderRef.current = mr;
        setIsRecording(true);
      } else {
        const perm = await Audio.requestPermissionsAsync();
        if (!perm.granted) {
          setError('Microphone permission denied');
          return;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await recording.startAsync();
        recordingRef.current = recording;
        setIsRecording(true);
      }
    } catch (e) {
      console.error('mic.error', e);
      setIsRecording(false);
      setError('Voice input failed. Please try again.');
    }
  }, [isRecording]);

  const renderMessage = useCallback(({ item }: { item: UiMessage }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === 'user' ? styles.userRow : styles.botRow,
      ]}
      testID={`chat-msg-${item.id}`}
    >
      {item.sender === 'bot' && (
        <View style={styles.owlAvatar}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/1g361d9kke4l5b6xm2xeb' }}
            style={styles.owlImage}
            resizeMode="contain"
          />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.botText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      {item.sender === 'user' && (
        <View style={styles.avatar}>
          <User size={20} color={colors.textMuted} />
        </View>
      )}
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={HEADER_H + insets.top}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
        <View style={styles.modeSelector}>
          <TouchableOpacity style={[styles.modeButton, styles.modeActive]} testID="chat-mode-auto">
            <Text style={styles.modeTextActive}>Do it for me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton} testID="chat-mode-manual">
            <Text style={styles.modeText}>I&apos;ll do it myself</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorRow}>
            <AlertTriangle size={16} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          inverted
          onContentSizeChange={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          contentContainerStyle={[styles.messagesContent, { paddingBottom: (insets.bottom ?? 0) + 72 }]}
          showsVerticalScrollIndicator={false}
          testID="chat-scroll"
        />

        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <TouchableOpacity 
            onPress={handleMicPress}
            accessibilityLabel="Voice input"
            style={[styles.micButton, isRecording ? styles.micActive : null]}
            testID="mic-button"
          >
            <Mic size={20} color={isRecording ? colors.textInverse : colors.text} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            testID="chat-input"
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: message.trim() && !isSending ? 1 : 0.5 }]}
            onPress={handleSend}
            disabled={!message.trim() || isSending}
            testID="send-button"
          >
            {isSending ? <ActivityIndicator size="small" color={colors.textInverse} /> : <Send size={20} color={colors.textInverse} />}
          </TouchableOpacity>
        </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatContainer: {
    flex: 1,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeText: {
    color: colors.text,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sm,
  },
  modeTextActive: {
    color: colors.textInverse,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sm,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  owlAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 2,
    borderColor: '#f0f9ff',
  },
  owlImage: {
    width: 32,
    height: 32,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  botBubble: {
    backgroundColor: colors.card,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  messageText: {
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  userText: {
    color: colors.textInverse,
  },
  botText: {
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  errorText: { color: colors.error },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    maxHeight: 100,
    fontSize: fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  micActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
});