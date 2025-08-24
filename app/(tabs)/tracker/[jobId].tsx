import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, MapPin, DollarSign, Edit, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingView } from '@/components/LoadingView';

export default function JobDetailScreen() {
  const { jobId } = useLocalSearchParams();
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return <LoadingView message="Loading application..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.company}>Google</Text>
          <Text style={styles.position}>Software Engineer</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Trash2 size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${Colors.warning}20` }]}>
          <Text style={[styles.statusText, { color: Colors.warning }]}>In Progress</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MapPin size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>San Francisco, CA</Text>
        </View>
        <View style={styles.detailRow}>
          <DollarSign size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>$100k - $150k</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={20} color={Colors.text.secondary} />
          <Text style={styles.detailText}>Applied on Dec 1, 2024</Text>
        </View>
      </View>

      <View style={styles.timeline}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <View style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>Dec 1, 2024</Text>
            <Text style={styles.timelineEvent}>Application Submitted</Text>
          </View>
        </View>
      </View>

      <View style={styles.notes}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.notesText}>
          Great company culture. Looking for React Native experience.
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: Colors.surface,
  },
  company: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  position: {
    fontSize: 18,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    padding: 24,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  details: {
    padding: 24,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  timeline: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  timelineEvent: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  notes: {
    padding: 24,
  },
  notesText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
});