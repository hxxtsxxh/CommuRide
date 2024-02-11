import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

const InitialScreen = ({ navigation }) => {
  const rotation = new Animated.Value(0);

  useEffect(() => {
    const rotationAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500, // 3 seconds
        useNativeDriver: true,
      })
    );

    rotationAnimation.start();

    // After 3 seconds, navigate to StartingScreen
    const timer = setTimeout(() => {
      navigation.replace('Start Screen');
    }, 1500);

    return () => {
      rotationAnimation.stop();
      clearTimeout(timer);
    };
  }, []);

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
