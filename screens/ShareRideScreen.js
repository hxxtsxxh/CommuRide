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
import { doc, getDocs, query, collection, setDoc, getDoc } from "firebase/firestore";
import { db } from '../config';
import { auth } from "../firebase";

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

/**
 * ShareRideScreen component for sharing ride details, selecting origin and destination,
 * and finding available rides.
 *
 * @param {object} navigation - React Navigation prop for navigating between screens.
 * @returns {JSX.Element} - Rendered component for sharing ride details.
 */

const ShareRideScreen = ({navigation}) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [passengers, setPassengers] = useState(''); // Default to 1 passenger
  const mapRef = useRef(null);


  const CreateTicket = (origin, destination, passengers) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const id = user.uid;
    setDoc(doc(db, "ride_tickets", id), {
      origin: origin,
      destination: destination,
      passengers: passengers,
      uid: id,
    });
    navigation.replace("List Screen") // TODO: MAKE THIS GO TO THE HOME PAGE
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance;
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const FindAllEligibleRides = async () => {
    const listOfRideId = [];
    const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const id = user.uid;

      const originRef = doc(db, "ride_tickets", id);
      const originSnapshot = await getDoc(originRef);
      const originData = originSnapshot.data();
      const originLat = originData.origin.latitude;
      const originLon = originData.origin.longitude;


      const destinationRef = doc(db, "ride_tickets", id);
      const destinationSnapshot = await getDoc(destinationRef);
      const destinationData = destinationSnapshot.data();
      const destinationLat = destinationData.destination.latitude;
      const destinationLon = destinationData.destination.longitude;

      const q = query(collection(db, "avail_rides"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {

        const radiusLimit = doc.data().radius;

        const fOriginData = doc.data().origin;
        const fOriginLat = fOriginData.latitude;
        const fOriginLon = fOriginData.longitude;

        const fDestinationData = doc.data().destination;
        const fDestinationLat = fDestinationData.latitude;
        const fDestinationLon = fDestinationData.longitude;

        if ((calculateDistance(originLat, originLon, fOriginLat, fOriginLon) <= parseInt(radiusLimit)) &&
            (calculateDistance(destinationLat, destinationLon, fDestinationLat, fDestinationLon) <= 20 )){
              listOfRideId.push(doc.data().uid);
        }
      });
    };

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
    if (passengers < 1) {
        Alert.alert("Number of passengers must be at minimum 1.")
        setPassengers(0)
    } else {
      setPassengers(passengers)
    }
    Keyboard.dismiss();
    CreateTicket(origin, destination, passengers);
    FindAllEligibleRides();
    navigation.navigate("List Screen");
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
