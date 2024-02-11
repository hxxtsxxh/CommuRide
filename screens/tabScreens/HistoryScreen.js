import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';

const History = () => {
  const options = [
    'Ride History',
    'Driver History',
    'Feedback',
    'FAQs',
    // Add more options as needed
  ];

  const renderOption = ({ item }) => (
    <TouchableOpacity style={styles.option}>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>History</Text>
      </View>
      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={(item, index) => index.toString()}
        style={styles.listContainer}
      />
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D7D1C4",
  },

  header: {
    backgroundColor: "rgba(133, 147, 93, 1)",
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerText: {
    color: '#0c023f',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  option: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionText: {
    fontSize: 18,
    color: "black",
  },
});

export default History;
