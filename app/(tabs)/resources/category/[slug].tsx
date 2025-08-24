import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ROUTES } from '@/constants/routes';


export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();

  const categoryTitles: Record<string, string> = {
    gigs: 'Gig Economy',
    finance: 'Financial Services',
    banking: 'Banking Solutions',
    essentials: 'Essential Services',
    training: 'Training & Education',
    community: 'Community Resources',
  };



  // Mock data - replace with actual data
  const resources = [
    {
      id: '1',
      title: 'Uber Driver',
      subtitle: 'Drive and earn on your schedule',
      logo: 'https://via.placeholder.com/60',
      category: slug,
    },
    {
      id: '2',
      title: 'DoorDash',
      subtitle: 'Deliver food and earn flexibly',
      logo: 'https://via.placeholder.com/60',
      category: slug,
    },
    {
      id: '3',
      title: 'TaskRabbit',
      subtitle: 'Complete tasks and projects',
      logo: 'https://via.placeholder.com/60',
      category: slug,
    },
  ];



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoryTitles[slug as string] || 'Resources'}</Text>
        <Text style={styles.subtitle}>
          Explore opportunities and services in this category
        </Text>
      </View>

      <View style={styles.resourceList}>
        {resources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={styles.resourceCard}
            onPress={() => router.push(`/(tabs)/resources/${resource.id}` as any)}
          >
            <View style={styles.resourceContent}>
              <View style={styles.logoContainer}>
                <Image source={{ uri: resource.logo }} style={styles.logo} />
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceSubtitle}>{resource.subtitle}</Text>
              </View>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaText}>Get Started</Text>
                <ExternalLink size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  resourceList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  resourceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  resourceSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});