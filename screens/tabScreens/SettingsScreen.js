import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/core'


const Settings = () => {

  const navigation = useNavigation()

  const options = [
    'Account',
    'Notifications',
    'Privacy',
    'Help',
    'Sign Out', // this button will be the only one that functions on this screen.
  ];

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={item === 'Sign Out' ? handleSignOut : null}
    >
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  // will navigate to Start Screen once pressed.
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Start Screen")
      })
      .catch(error => alert(error.message))
  }


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
    backgroundColor: "#D7D1C4",
  },
  header: {
    backgroundColor:"rgba(133, 147, 93, 1)",
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

export default Settings;
