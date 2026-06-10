import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailRow = ({ icon, label, value, isLast }) => {
  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      <View style={styles.leftContent}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  label: {
    color: '#a0aec0',
    fontSize: 14,
  },
  value: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DetailRow;
