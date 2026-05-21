import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ onAddWorkout, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IronTrack 🔥</Text>

      <TouchableOpacity style={styles.button} onPress={onAddWorkout}>
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 30 },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10
  },
  buttonText: {
    color: "white",
    textAlign: "center"
  }
});