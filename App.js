// App.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TimeZoneStatus from './TimeZoneStatus.js';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
     <TimeZoneStatus/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
