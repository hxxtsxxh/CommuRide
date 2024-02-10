import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const ShareRideScreen = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [coordinates, setCoordinates] = useState(null);

  // Function to handle address input change
  const handleAddressChange = (text) => {
    setDestination(text);
    // You can add logic here to fetch coordinates based on the address using geocoding APIs
    // For simplicity, let's assume the coordinates are fetched and updated here
    // For example: setCoordinates({ latitude: 37.78825, longitude: -122.4324 });
  };

  const handleSubmit = () => {
    // You can implement submission logic here, such as sending the ride details to a server
    console.log("Submitting ride details:", { pickupLocation, destination, passengers });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={pickupLocation}
          onChangeText={(text) => setPickupLocation(text)}
        />
        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={handleAddressChange}
        />
        <Text style={styles.label}>Passengers</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of passengers"
          keyboardType="numeric"
          value={passengers.toString()}
          onChangeText={(text) => setPassengers(parseInt(text) || 1)} // look into this.
        />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        {coordinates && <Marker coordinate={coordinates} title="Destination" />}
        {(pickupLocation && destination) && (
          <MapViewDirections
            origin={pickupLocation}
            destination={destination}
            //apikey={YOUR_GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#ff6347',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShareRideScreen;
