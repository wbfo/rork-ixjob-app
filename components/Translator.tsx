import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import { Mic, Copy, ArrowRightLeft } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, spacing, radius } from '@/theme/tokens';

interface TranslatorProps {
  sourceTag: 'interview_prep' | 'resources_tools';
}

type WebMediaRecorder = any;

export function Translator({ sourceTag }: TranslatorProps) {
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<WebMediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const log = useCallback((event: string, meta?: Record<string, unknown>) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[analytics]', event, { source: sourceTag, ...(meta ?? {}) });
    } catch {}
  }, [sourceTag]);

  React.useEffect(() => {
    log('translator_opened');
  }, [log]);

  const swap = useCallback(() => {
    setSourceLang((prev) => {
      const nextSource = targetLang;
      setTargetLang(prev === 'auto' ? 'en' : prev);
      return nextSource;
    });
  }, [targetLang]);

  const onTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      Alert.alert('No text', 'Please enter or paste some text to translate.');
      return;
    }
    setIsTranslating(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const fake = `${sourceText}\n\n— translated (${targetLang})`;
      setTranslatedText(fake);
      log('translator_translated');
    } catch (e) {
      Alert.alert('Translation failed', 'Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, targetLang, log]);

  const stopAllWebTracks = useCallback(() => {
    try {
      mediaStreamRef.current?.getTracks()?.forEach((t) => t.stop());
    } catch {}
  }, []);

  const startRecording = useCallback(async () => {
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const MediaRecorderCtor: any = (window as any).MediaRecorder;
        const mr: WebMediaRecorder = new MediaRecorderCtor(stream);
        mediaRecorderRef.current = mr;
        mediaChunksRef.current = [];
        mr.ondataavailable = (ev: BlobEvent) => {
          if (ev.data && ev.data.size > 0) mediaChunksRef.current.push(ev.data);
        };
        mr.onstop = async () => {
          const blob = new Blob(mediaChunksRef.current, { type: 'audio/webm' });
          const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
          const form = new FormData();
          form.append('audio', file as unknown as Blob);
          try {
            const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: form });
            const data: { text: string; language: string } = await res.json();
            setSourceText((prev) => (prev ? `${prev}\n${data.text}` : data.text));
          } catch (e) {
            Alert.alert('Transcription failed', 'Please try again.');
          } finally {
            stopAllWebTracks();
            setIsRecording(false);
          }
        };
        mr.start();
        setIsRecording(true);
      } catch (e) {
        Alert.alert('Microphone error', 'Permission denied or unavailable.');
      }
      return;
    }

    Alert.alert('Microphone unsupported', 'Voice input will be available on mobile in a later update.');
  }, [stopAllWebTracks]);

  const stopRecording = useCallback(async () => {
    if (Platform.OS === 'web') {
      try {
        mediaRecorderRef.current?.stop?.();
      } catch {
        stopAllWebTracks();
        setIsRecording(false);
      }
      return;
    }
    Alert.alert('Microphone unsupported', 'Voice input will be available on mobile in a later update.');
  }, [stopAllWebTracks]);

  const copy = useCallback(async (text: string) => {
    try {
      if (Platform.OS === 'web') {
        await (navigator as any)?.clipboard?.writeText?.(text);
      } else {
        // Fallback minimal copy using prompt if clipboard API is unavailable
        // eslint-disable-next-line no-alert
        Alert.alert('Copy text', 'Select and copy manually on this device.');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('copy failed', e);
    }
  }, []);

  return (
    <View style={styles.wrapper} testID="translator">
      <Text style={styles.label}>
        Translate your practice answers or job questions into English (or your target language).
      </Text>

      <View style={styles.langRow}>
        <Card style={styles.langCard}>
          <View style={styles.langButton}> 
            <Text style={styles.langText}>{sourceLang === 'auto' ? 'Auto' : sourceLang.toUpperCase()}</Text>
          </View>
        </Card>
        <Card style={styles.swapCard}>
          <TouchableOpacity accessibilityRole="button" onPress={swap} style={styles.swapButton} testID="translator-swap">
            <ArrowRightLeft size={20} color={colors.primary} />
          </TouchableOpacity>
        </Card>
        <Card style={styles.langCard}>
          <View style={styles.langButton}> 
            <Text style={styles.langText}>{targetLang.toUpperCase()}</Text>
          </View>
        </Card>
      </View>

      <Card style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          placeholder="Paste or type your text here"
          placeholderTextColor={colors.textMuted}
          multiline
          value={sourceText}
          onChangeText={setSourceText}
          testID="translator-input"
        />
        <View style={styles.actionsRow}>
          <TouchableOpacity accessibilityLabel="copy source" onPress={() => copy(sourceText)}>
            <Copy size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={isRecording ? 'stop recording' : 'start recording'}
            onPress={isRecording ? stopRecording : startRecording}
            testID="translator-mic"
          >
            <Mic size={18} color={isRecording ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </Card>

      <PrimaryButton
        title={isTranslating ? 'Translating…' : 'Translate'}
        onPress={onTranslate}
        disabled={isTranslating}
        testID="translator-cta"
      />

      {!!translatedText && (
        <Card style={styles.outputCard}>
          <Text style={styles.outputLabel}>Original</Text>
          <ScrollView style={styles.outputBox}>
            <Text selectable style={styles.outputText}>{sourceText}</Text>
          </ScrollView>
          <View style={styles.copyRow}>
            <TouchableOpacity onPress={() => copy(sourceText)}>
              <Copy size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.outputLabel, { marginTop: spacing.md }]}>Translation</Text>
          <ScrollView style={styles.outputBox}>
            <Text selectable style={styles.outputText}>{translatedText}</Text>
          </ScrollView>
          <View style={styles.copyRow}>
            <TouchableOpacity onPress={() => copy(translatedText)}>
              <Copy size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    color: colors.textOnBlue,
    marginBottom: spacing.md,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  langCard: {
    flex: 1,
  },
  langButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  langText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  swapCard: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButton: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCard: {
    marginBottom: spacing.md,
  },
  textInput: {
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.sm + 4,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  outputCard: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  outputLabel: {
    fontSize: 13,
    color: colors.textOnBlue,
    marginBottom: 6,
    fontWeight: '600',
  },
  outputBox: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
  },
  outputText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    padding: spacing.md,
  },
  copyRow: {
    alignItems: 'flex-end',
    padding: spacing.sm,
  },
});
