import React, { useRef, useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "../environments";
import Constants from "expo-constants";
import MapViewDirections from "react-native-maps-directions";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 40.76711,
  longitude: -73.979704,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const InputAutocomplete = ({ label, placeholder, onPlaceSelected }) => {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || "Search"}
        fetchDetails
        onPress={(data, details = null) => {
          if (details) {
            onPlaceSelected(details);
          } else {
            console.error("No details provided for selected place.");
          }
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "pt-BR",
        }}
      />
    </>
  );
};

const ShareRideScreen = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [passengers, setPassengers] = useState(''); // Default to 1 passenger
  const mapRef = useRef(null);

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
    if (passengers < 1) {
        Alert.alert("Number of passengers must be at minimum 1.")
        setPassengers(0)
    } else {
      setPassengers(passengers)
    }
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const onPlaceSelected = (details, flag) => {
    if (details) {
      const set = flag === "origin" ? setOrigin : setDestination;
      const position = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };
      set(position);
      moveTo(position);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_POSITION}
        >
          {origin && <Marker coordinate={origin} />}
          {destination && <Marker coordinate={destination} />}
          {showDirections && origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_API_KEY}
              strokeColor="#6644ff"
              strokeWidth={4}
              onReady={traceRouteOnReady}
            />
          )}
        </MapView>
        <View style={styles.searchContainer}>
          <InputAutocomplete
            style={styles.input}
            label="Origin"
            placeholder="Enter origin"
            onPlaceSelected={(details) => {
              onPlaceSelected(details, "origin");
            }}
          />
          <InputAutocomplete
            style={styles.input}
            label="Destination"
            placeholder="Enter destination"
            onPlaceSelected={(details) => {
              onPlaceSelected(details, "destination");
            }}
          />
          <Text style = {{}}>Passengers</Text>
          <TextInput
            style={styles.passengerInput}
            keyboardType="numeric"
            placeholder="Enter number of passengers"
            value={passengers.toString()}
            onChangeText={(text) => setPassengers((text))}
          />
          <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          {distance && duration ? (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Distance: {distance.toFixed(2)}</Text>
              <Text style={styles.infoText}>Duration: {Math.ceil(duration)} min</Text>
              <Text style={styles.infoText}>Passengers: {passengers}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  searchContainer: {
    position: "absolute",
    gap: 7,
    width: "90%",
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    borderRadius:10,
    borderWidth: 0,
    top: Constants.statusBarHeight + 16,
  },
  passengerInput: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#6699ff",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
  },
  input: {
    borderColor: "#888",
    backgroundColor:'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderRadius: 20,
  },
});

export default ShareRideScreen;

