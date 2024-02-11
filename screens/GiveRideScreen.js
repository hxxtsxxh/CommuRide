import React, { useRef, useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
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
import { auth } from "../firebase";
import { db } from '../config';
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";

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

const GiveRideScreen= ({navigation}) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seats, setSeats] = useState('');
  const [radius, setRadius] = useState('');
  const mapRef = useRef(null);

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const updateAvailableRides = (origin, destination, seats, radius) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const id = user.uid;

    setDoc(doc(db, "avail_rides", id), {
      origin: origin,
      destination: destination,
      seats: seats,
      radius: radius,
      uid: id,
    });
    console.log("Ride Created");
    navigation.replace("Home") // TODO: MAKE THIS GO TO THE HOME PAGE
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      const distanceInMiles = args.distance * 0.621371;
      setDistance(distanceInMiles);
      setDuration(args.duration);
    }
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
    if (seats < 1) {
      Alert.alert("Number of seats must be at minimum 1.")
      setSeats(0)
    } else {
      setSeats(seats)
    }
    const validatedRadius = parseFloat(radius);
    if (isNaN(validatedRadius) || validatedRadius < 0) {
      Alert.alert("Pickup radius must be a non-negative number.")
      setRadius(0)
      return; // Exit the function if radius is negative or not a number
    }
    setRadius(validatedRadius);
    Keyboard.dismiss(); // Dismiss the keyboard
    updateAvailableRides(origin, destination, seats, radius);
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

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
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
          {origin && radius && (
            <Circle
              center={origin}
              radius={parseFloat(radius) * 1609.34} // Convert miles to meters
              strokeWidth={2}
              strokeColor="rgba(255,0,0,0.5)"
              fillColor="rgba(255,0,0,0.3)"
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
          <View style={styles.subContainer}>
            <View style={{alignItems: "center", gap: 3}}>
              <Text style={{fontWeight: "bold"}}>Seats</Text>
              <TextInput
                style={styles.subContainerInputs}
                keyboardType="numeric"
                placeholder="#"
                value={seats.toString()}
                onChangeText={(text) => setSeats((text))}
              />
            </View>
            <View style={{alignItems: "center", gap: 3}}>
              <Text style={{fontWeight: "bold"}}>Pickup Radius (mi)</Text>
              <TextInput
                style={styles.subContainerInputs}
                keyboardType="numeric"
                placeholder="#"
                value={radius.toString()}
                onChangeText={(text) => setRadius((text))}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          {distance && duration ? (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Distance: {distance.toFixed(2)}</Text>
              <Text style={styles.infoText}>Duration: {Math.ceil(duration)} min</Text>
              <Text style={styles.infoText}>Seats: {seats}</Text>
              <Text style={styles.infoText}>Pickup Radius: {radius}</Text>
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
    borderRadius: 10,
    borderWidth: 0,
    top: Constants.statusBarHeight + 16,
  },
  subContainerInputs: {
    width: 70,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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

export default GiveRideScreen;
