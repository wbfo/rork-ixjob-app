import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ExternalLink, Star, Users, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';


export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams();

  // Mock data - replace with actual data
  const resource = {
    id,
    title: 'Uber Driver',
    subtitle: 'Drive and earn on your schedule',
    logo: 'https://via.placeholder.com/100',
    description: 'Uber is a flexible way to earn money by driving your own car. Set your own hours and be your own boss while helping people get around your city.',
    features: [
      'Flexible schedule - work when you want',
      'Weekly payments with instant pay options',
      'In-app navigation and support',
      'Surge pricing for higher earnings',
    ],
    requirements: [
      'Valid driver\'s license',
      'Vehicle insurance',
      'Background check',
      'Smartphone with data plan',
    ],
    stats: {
      rating: 4.5,
      users: '1M+',
      avgEarnings: '$15-25/hour',
    },
  };



  const handleGetStarted = () => {
    console.log('Get Started clicked for resource:', id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: resource.logo }} style={styles.logo} />
        </View>
        <Text style={styles.title}>{resource.title}</Text>
        <Text style={styles.subtitle}>{resource.subtitle}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Star size={20} color={Colors.warning} />
          <Text style={styles.statValue}>{resource.stats.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Users size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{resource.stats.users}</Text>
          <Text style={styles.statLabel}>Users</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={20} color={Colors.success} />
          <Text style={styles.statValue}>{resource.stats.avgEarnings}</Text>
          <Text style={styles.statLabel}>Avg Earnings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{resource.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        {resource.features.map((feature, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {resource.requirements.map((requirement, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{requirement}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
        <Text style={styles.ctaText}>Get Started</Text>
        <ExternalLink size={20} color={Colors.text.inverse} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.surface,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});