import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import your screens
import HomeScreen from "./screens/HomeScreen";
import AddWorkoutScreen from "./screens/AddWorkoutScreen";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // NEW
  const [currentScreen, setCurrentScreen] = useState("home");
  const [userEmail, setUserEmail] = useState("");

  // Check token on app start
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        setIsLoggedIn(true);
      }
    };

    checkLogin();
  }, []);

  // SIGNUP
  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 3) {
      alert("Password too short");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.8:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      alert(data.message);

      if (data.message === "Signup success") {
        setScreen("login");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      alert("Error connecting to server");
    }

    setLoading(false);
  };

  // LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 3) {
      alert("Password too short");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.8:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.message === "Login success") {
        await AsyncStorage.setItem("token", data.token);

        setUserEmail(email); //  IMPORTANT
        setEmail("");
        setPassword("");
        setIsLoggedIn(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error connecting to server");
    }

    setLoading(false);
  };

  //  LOGGED-IN FLOW
  if (isLoggedIn) {
    if (currentScreen === "addWorkout") {
      return (
        <AddWorkoutScreen
          email={userEmail}
          onBack={() => setCurrentScreen("home")}
        />
      );
    }

    return (
      <HomeScreen
        onAddWorkout={() => setCurrentScreen("addWorkout")}
        onLogout={async () => {
          await AsyncStorage.removeItem("token");
          setIsLoggedIn(false);
        }}
      />
    );
  }

  //  AUTH SCREENS
  return (
    <View style={styles.container}>
      {screen === "login" ? (
        <>
          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : "Login"}
            </Text>
          </TouchableOpacity>

          <Text
            onPress={() => setScreen("signup")}
            style={styles.link}
          >
            Don’t have an account? Signup
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Signup</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : "Signup"}
            </Text>
          </TouchableOpacity>

          <Text
            onPress={() => setScreen("login")}
            style={styles.link}
          >
            Already have an account? Login
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    color: "#22c55e",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
});