import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const History = () => {
  const navigation = useNavigation();

  // Creates different options in the History section of the nav bar
  const options = [
    'Ride History',
    'Driver History',
    'Last Available Drivers',
    'Feedback',
    'FAQs',
    // Add more options as needed
  ];

  const renderOption = ({ item }) => {
    const handleOptionPress = () => {
      // Checks if Last available Drivers was clicked to generate it
      if (item === 'Last Available Drivers') {
        navigation.navigate('List Screen'); // Change 'AvailableDrivers' to your screen name for available drivers
      } else {
        // Handle other options if needed
      }
    };

    return (
      <TouchableOpacity style={styles.option} onPress={handleOptionPress}>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  // Adjusts for notch on phones and adds History text on top part of phone
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

// Styles
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
