import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../config';
import { GOOGLE_API_KEY } from "../environments";
import axios from 'axios';
import { auth } from "../firebase";

const RideCard = (props) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [seats, setSeats] = useState("");

    useEffect(() => {
      const fetchData = async () => {
          try {
              const usersRef = doc(db, "users", props.id);
              const usersSnapshot = await getDoc(usersRef);
              const usersData = usersSnapshot.data();

              if (!usersData) {
                  console.error('User data not found');
                  return;
              }

              const name = usersData.name;
              const phone = usersData.phoneNumber;
              setName(name);
              setPhone(phone);

              const ridesRef = doc(db, "avail_rides", props.id);
              const ridesSnapshot = await getDoc(ridesRef);
              const ridesData = ridesSnapshot.data();

              if (!ridesData) {
                  console.error('Ride data not found');
                  return;
              }

              const seats = ridesData.seats;
              setSeats(seats);

              const originLat = ridesData.origin.latitude;
              const originLon = ridesData.origin.longitude;
              const destinationLat = ridesData.destination.latitude;
              const destinationLon = ridesData.destination.longitude;

              const originURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${originLat},${originLon}&key=${GOOGLE_API_KEY}`;
              const originResponse = await axios.get(originURL);
              const fromAddress = originResponse.data.results[0].formatted_address;
              setFrom(fromAddress);

              const destinationURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${destinationLat},${destinationLon}&key=${GOOGLE_API_KEY}`;
              const destinationResponse = await axios.get(destinationURL);
              const toAddress = destinationResponse.data.results[0].formatted_address;
              setTo(toAddress);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
      console.log("name:", name);
      console.log(from);
      console.log(to);
      console.log(phone);
      console.log(seats);

  }, []);

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => {}}>
                <Text style={[styles.details, styles.words]} selectable={true} selectionColor="blue">
                    Name: {name}
                </Text>
                <Text style={[styles.details, styles.words]} selectable={true} selectionColor="blue">
                    From: {from}
                </Text>
                <Text style={[styles.details, styles.words]} selectable={true} selectionColor="blue">
                    To: {to}
                </Text>
                <Text style={[styles.details, styles.words]} selectable={true} selectionColor="blue">
                    Seats: {seats}
                </Text>
                <Text style={[styles.details, styles.words]} selectable={true} selectionColor="blue">
                    Phone: {phone}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    words: {
      color: "black",
    },
    highlightedText: {
        fontSize: 16,
        marginBottom: 5,
    },
    highlightStyle: {
        backgroundColor: 'yellow', // Adjust the background color as needed
    },
});

export default RideCard;
