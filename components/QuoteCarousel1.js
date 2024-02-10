import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const quotes = [
  `"Neighbors unite, a green future takes flight."`,
  `"Fuel with connection, not gas."`,
  `"Strangers to friends, the journey transcends."`,
  // Add more quotes as needed
];

const QuoteCarousel = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
  const fadeQuote = (index) => {
    // Fade in the quote
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // Wait for a delay before fading out
      setTimeout(() => {
        fadeOutQuote(index);
      }, 2000);
    });
  };

  const fadeOutQuote = (index) => {
    // Fade out the quote
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // Move to the next quote
      const nextIndex = (index + 1) % quotes.length;
      setCurrentQuoteIndex(nextIndex);
      // Fade in the next quote
      fadeQuote(nextIndex);
    });
  };

    // Start with the first quote
    fadeQuote(0);

    // Cleanup animation value
    return () => {
      fadeAnim.setValue(0);
    };
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.quoteText, { opacity: fadeAnim }]}>
        {quotes[currentQuoteIndex]}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "90%",
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default QuoteCarousel;
