import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { getDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../config';
import RideCard from '../components/RideCard'; // Import the RideCard component

/**
 * ListScreen component for displaying available drivers' information.
 * Fetches data from the 'avail_rides' collection in Firebase and renders RideCard components.
 *
 * @param {object} navigation - React Navigation prop for navigating between screens.
 * @returns {JSX.Element} - Rendered component displaying a list of available drivers.
 */

const ListScreen = ({ navigation }) => {
  const [rides, setRides] = useState([]);

  useEffect(() => {

      /**
     * Fetches available rides from Firebase 'avail_rides' collection and updates state.
     */

    const fetchRides = async () => {
      try {
        const ridesCollection = collection(db, 'avail_rides');
        const ridesSnapshot = await getDocs(ridesCollection);
        const ridesData = ridesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRides(ridesData);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Drivers</Text>
      </View>
      <ScrollView>
        {/* Render a RideCard component for each ride */}
        {rides.map(ride => (
          <RideCard key={ride.id} id={ride.id} />
        ))}
      </ScrollView>
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
});

export default ListScreen;
