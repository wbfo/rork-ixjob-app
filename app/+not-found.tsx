import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from 'react-i18next';
import { FileQuestion } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ROUTES } from '@/constants/routes';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  
  return (
    <>
      <Stack.Screen options={{ title: t('errors.notFoundTitle') }} />
      <View style={styles.container}>
        <FileQuestion size={64} color={Colors.text.light} />
        <Text style={styles.title}>{t('errors.notFoundTitle')}</Text>
        <Text style={styles.message}>This page doesn&apos;t exist.</Text>
        
        <Link href={ROUTES.WELCOME} style={styles.link}>
          <Text style={styles.linkText}>{t('errors.backHome')}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});