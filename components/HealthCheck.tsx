import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { API_BASE } from '@/lib/api/config';
import { trpc } from '@/lib/trpc';

export const HealthCheck = () => {
  const [restStatus, setRestStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [trpcStatus, setTrpcStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trpcResponse, setTrpcResponse] = useState<string | null>(null);

  const hiQuery = trpc.example.hi.useQuery({ name: 'tester' }, {
    enabled: false,
    retry: 1
  });
  
  // Update tRPC status based on query state
  useEffect(() => {
    if (hiQuery.isSuccess) {
      setTrpcStatus('success');
      setTrpcResponse(JSON.stringify(hiQuery.data, null, 2));
    } else if (hiQuery.isError) {
      setTrpcStatus('error');
      setErrorMessage(prev => `${prev ? prev + '\n\n' : ''}tRPC Error: ${hiQuery.error?.message || 'Unknown error'}`);
    }
  }, [hiQuery.isSuccess, hiQuery.isError, hiQuery.data, hiQuery.error?.message]);

  const checkRestEndpoint = async () => {
    try {
      setRestStatus('loading');
      // Try to access the API ping endpoint
      const response = await fetch(`${API_BASE}/api/ping`);
      if (response.ok) {
        const text = await response.text();
        console.log('REST API response:', text);
        if (text.trim().toLowerCase() === 'pong' || text.length > 0) {
          setRestStatus('success');
        } else {
          throw new Error('Unexpected response from /ping');
        }
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (error) {
      setRestStatus('error');
      setErrorMessage(prev => `${prev ? prev + '\n\n' : ''}REST Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error('REST API error:', error);
    }
  };

  useEffect(() => {
    checkRestEndpoint();
    hiQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = () => {
    setErrorMessage(null);
    setTrpcResponse(null);
    checkRestEndpoint();
    hiQuery.refetch();
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Backend Connection Status</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.label}>REST API:</Text>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(restStatus) }]} />
          <Text style={styles.statusText}>{getStatusText(restStatus)}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={styles.label}>tRPC API:</Text>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(trpcStatus) }]} />
          <Text style={styles.statusText}>{getStatusText(trpcStatus)}</Text>
        </View>

        {trpcResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>tRPC Response:</Text>
            <Text style={styles.responseText}>{trpcResponse}</Text>
          </View>
        )}

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error Details:</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>API Base: {API_BASE}</Text>
          <Text style={styles.infoText}>tRPC Endpoint: {API_BASE}/api/trpc</Text>
          <Text style={styles.infoText}>REST Endpoint: {API_BASE}/api/ping</Text>
          <Text style={styles.infoText}>Platform: {Platform.OS}</Text>
          <Text style={styles.infoText}>Tip: On a real device, set EXPO_PUBLIC_API_BASE to your computer&apos;s LAN IP, e.g. http://192.168.x.x:3001</Text>
        </View>

        <View style={styles.troubleshootContainer}>
          <Text style={styles.troubleshootTitle}>Troubleshooting:</Text>
          <Text style={styles.troubleshootText}>1. Make sure the backend server is running</Text>
          <Text style={styles.troubleshootText}>2. Check if the API_BASE URL is correct</Text>
          <Text style={styles.troubleshootText}>3. Run {"node start-backend.js"} in terminal</Text>
          <Text style={styles.troubleshootText}>4. Verify network connectivity</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={retry}>
          <Text style={styles.buttonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStatusColor = (status: 'loading' | 'success' | 'error') => {
  switch (status) {
    case 'loading': return '#f5a623';
    case 'success': return '#4cd964';
    case 'error': return '#ff3b30';
  }
};

const getStatusText = (status: 'loading' | 'success' | 'error') => {
  switch (status) {
    case 'loading': return 'Checking...';
    case 'success': return 'Connected';
    case 'error': return 'Failed';
  }
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 80,
    fontSize: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
  },
  responseContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e6f7ff',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1890ff',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0066cc',
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ffeeee',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#cc0000',
  },
  errorText: {
    fontSize: 14,
    color: '#333',
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  troubleshootContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff9e6',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#f5a623',
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#996600',
  },
  troubleshootText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HealthCheck;