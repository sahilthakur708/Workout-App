import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function AddWorkoutScreen({ email, onBack }) {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleSave = async () => {
    if (!exercise || !weight || !reps) {
      alert("Fill all fields");
      return;
    }

    try {
      const response = await fetch("http://YOUR_IP:3000/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          exercise,
          weight: Number(weight),
          reps: Number(reps)
        })
      });

      const data = await response.json();
      alert(data.message);

      setExercise("");
      setWeight("");
      setReps("");

    } catch (error) {
      alert("Error saving workout");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Workout</Text>

      <TextInput
        placeholder="Exercise (Bench, Squat...)"
        value={exercise}
        onChangeText={setExercise}
        style={styles.input}
      />

      <TextInput
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack}>
        <Text style={{ marginTop: 20 }}>⬅ Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5
  },
  buttonText: {
    color: "white",
    textAlign: "center"
  }
});