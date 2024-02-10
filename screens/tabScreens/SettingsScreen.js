import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ImageBackground } from 'react-native';

const Settings = () => {
  const options = [
    'Account',
    'Notifications',
    'Privacy',
    'Help',
    'Sign Out',
  ];

  const renderOption = ({ item }) => (
    <TouchableOpacity style={styles.option}>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
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
  },

  header: {
    backgroundColor:"#0c023f",
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerText: {
    color: 'white',
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

export default Settings;
