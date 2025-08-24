import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { 
  Briefcase, 
  DollarSign, 
  Building, 
  Package, 
  GraduationCap, 
  Users, 
  Wrench,
  StickyNote,
  X,
  ChevronRight
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { colors, spacing, fontSizes, fontWeights, radius } from '@/theme/tokens';

export default function ResourcesScreen() {
  const { t } = useTranslation();
  useHeaderTitle('nav.resources');
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkBannerStatus = async () => {
      try {
        const dismissed = await AsyncStorage.getItem('banner.community.dismissed');
        setBannerDismissed(dismissed === 'true');
      } catch (error) {
        console.error('Error checking banner status:', error);
      }
    };
    checkBannerStatus();
  }, []);

  const handleDismissBanner = async () => {
    try {
      await AsyncStorage.setItem('banner.community.dismissed', 'true');
      setBannerDismissed(true);
    } catch (error) {
      console.error('Error dismissing banner:', error);
    }
  };

  const categories = [
    {
      slug: 'tools',
      title: 'Tools',
      icon: Wrench,
      color: '#3B82F6',
      description: 'Utilities to speed up your workflow',
      count: 2,
    },
    {
      slug: 'gigs',
      title: 'Gigs',
      icon: Briefcase,
      color: '#3B82F6',
      description: 'Freelance and gig economy platforms',
      count: 4,
    },
    {
      slug: 'finance',
      title: 'Finance',
      icon: DollarSign,
      color: '#10B981',
      description: 'Banking and financial services',
      count: 3,
    },
    {
      slug: 'banking',
      title: 'Banking',
      icon: Building,
      color: '#F59E0B',
      description: 'Digital banks and credit unions',
      count: 2,
    },
    {
      slug: 'essentials',
      title: 'Essentials',
      icon: Package,
      color: '#8B5CF6',
      description: 'Must-have services and tools',
      count: 5,
    },
    {
      slug: 'training',
      title: 'Training',
      icon: GraduationCap,
      color: '#EC4899',
      description: 'Courses and skill development',
      count: 6,
    },
    {
      slug: 'community',
      title: 'Community',
      icon: Users,
      color: '#06B6D4',
      description: 'Networks and support groups',
      count: 3,
    },
  ];

  const renderPromoBanner = () => {
    if (bannerDismissed) return null;
    
    return (
      <View style={styles.promoBanner}>
        <TouchableOpacity 
          style={styles.promoBannerContent}
          onPress={() => router.push('/community')}
          testID="community-promo-banner"
        >
          <Text style={styles.promoBannerText}>
            {t('resources.banner.community', '💬 Connect with other job seekers — Join the Community')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={handleDismissBanner}
          testID="dismiss-banner"
        >
          <X size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCard = ({ item }: any) => {
    const Icon = item.icon;
    const handlePress = () => {
      try {
        if (item.slug === 'tools') {
          router.push('/(tabs)/resources/tools/');
        } else if (item.slug === 'community') {
          router.push('/community');
        } else {
          router.push({
            pathname: '/(tabs)/resources/category/[slug]',
            params: { slug: item.slug },
          });
        }
      } catch (e) {
        console.error('Navigation error in ResourcesScreen.handlePress', e);
      }
    };

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={handlePress}
        testID={`resources-card-${item.slug}`}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Icon size={28} color={item.color} />
        </View>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <Text style={styles.categoryCount}>{item.count} resources</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgStart} />
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Blue hero section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Career Resources</Text>
          <Text style={styles.heroSubtitle}>
            Curated tools and services to support your job search
          </Text>
          {renderPromoBanner()}
        </View>

        {/* Card grid */}
        <FlatList
          data={categories}
          renderItem={renderCard}
          numColumns={2}
          keyExtractor={(item) => item.slug}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgStart,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.bgStart,
  },
  heroTitle: {
    color: colors.textOnBlue,
    fontSize: 28,
    fontWeight: fontWeights.bold,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: colors.textOnBlueSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  promoBanner: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  promoBannerContent: {
    flex: 1,
  },
  promoBannerText: {
    color: '#0A2540',
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  dismissButton: {
    padding: spacing.xs,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: colors.bgStart,
  },
  row: {
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: fontWeights.bold,
    color: '#0A2540',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#667085',
    lineHeight: 18,
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 12,
    color: '#667085',
    fontWeight: fontWeights.medium,
  },
});