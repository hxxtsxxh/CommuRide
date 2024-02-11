import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignUpScreen = () => {
  return (
    <View style={styles.container}>
      {/* Other signup content */}
      <Text style={styles.termsAndConditions}>
        {/* Your terms and conditions text here */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsAndConditions: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default SignUpScreen;
