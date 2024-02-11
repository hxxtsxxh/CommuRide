import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../config';
import { GOOGLE_API_KEY } from "../environments";
import axios from 'axios';
import Sms from 'react-native-sms';

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

                const { name, phoneNumber } = usersData;
                setName(name);
                setPhone(phoneNumber);

                const ridesRef = doc(db, "avail_rides", props.id);
                const ridesSnapshot = await getDoc(ridesRef);
                const ridesData = ridesSnapshot.data();

                if (!ridesData) {
                    console.error('Ride data not found');
                    return;
                }

                const { seats, origin, destination } = ridesData;
                setSeats(seats);

                const originURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${origin.latitude},${origin.longitude}&key=${GOOGLE_API_KEY}`;
                const originResponse = await axios.get(originURL);
                const fromAddress = originResponse.data.results[0].formatted_address;
                setFrom(fromAddress);

                const destinationURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`;
                const destinationResponse = await axios.get(destinationURL);
                const toAddress = destinationResponse.data.results[0].formatted_address;
                setTo(toAddress);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [props.id]);

    const notify = () => {
        if (!phone) {
            console.error('Phone number is not provided');
            return;
        }

        const message = "Hi, I accepted your carpool offer.";

        // Using Linking API to send SMS
        const url = `sms:${phone}?body=${encodeURIComponent(message)}`;
        Linking.openURL(url)
            .then(() => {
                console.log('SMS sent successfully');
                Alert.alert('SMS Sent', 'Your message has been sent successfully.');
            })
            .catch((error) => {
                console.error('Error while sending SMS:', error);
                Alert.alert('Error', 'Failed to send SMS. Please try again later.');
            });
    };

    return (
        <TouchableOpacity onPress={notify}>
            <View style={styles.card}>
                <Text style={[styles.details, styles.words]} selectable={true} selectionColor="blue" >
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
            </View>
        </TouchableOpacity>
    );
};

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
});

export default RideCard;
