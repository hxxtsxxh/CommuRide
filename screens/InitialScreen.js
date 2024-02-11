import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

/**
 * InitialScreen component for displaying a rotating logo during app initialization.
 * Navigates to 'Start Screen' after a brief animation loop.
 *
 * @param {object} navigation - React Navigation prop for navigating between screens.
 * @returns {JSX.Element} - Rendered component with animated rotating logo.
 */

const InitialScreen = ({ navigation }) => {
    // Initialize a rotation animation value
  const rotation = new Animated.Value(0);

  useEffect(() => {
        // Create a rotation animation loop
    const rotationAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500, // 1.5 seconds for each rotation
        useNativeDriver: true,
      })
    );

    // Start the rotation animation loop
    rotationAnimation.start();

    // After 1.5 seconds, navigate to 'Start Screen'
    const timer = setTimeout(() => {
      navigation.replace('Start Screen');
    }, 1500);

    // Clean up: stop the rotation animation and clear the timeout
    return () => {
      rotationAnimation.stop();
      clearTimeout(timer);
    };
  }, []);

  // Map the rotation value to degrees for visual effect
  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.logo, { transform: [{ rotate: rotateInterpolation }] }]}
      >
        <Image
          source={require('../assets/images/logo.png')} // Adjust the path as per your file structure
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7D1C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});

export default InitialScreen;
