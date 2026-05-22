const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Workout = require("./models/Workout");

const app = express();

app.use(cors());
app.use(express.json());

//  CONNECT MONGODB
mongoose.connect("mongodb+srv://sahilthakurgocart_db_user:eN2yA2MdlxCh1vsg@project1.q1ha2zp.mongodb.net/")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running");
});
// SAVE WORKOUT API
app.post("/api/workout", async (req, res) => {
  const { email, exercise, weight, reps } = req.body;

  try {
    const newWorkout = new Workout({
      userEmail: email,
      exercise,
      weight,
      reps
    });

    await newWorkout.save();

    res.json({ message: "Workout saved" });

  } catch (error) {
    res.json({ message: "Error saving workout" });
  }
});
// GET WORKOUT API

app.get("/api/workouts/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const workouts = await Workout.find({ userEmail: email })
      .sort({ date: -1 });

    res.json(workouts);

  } catch (error) {
    res.json({ message: "Error fetching workouts" });
  }
});

// SIGN UP ROUTE

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "Signup success" });

  } catch (error) {
    res.json({ message: "Error occurred" });
  }
});

// LOGIN ROUTE
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      "mySuperSecret123",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login success", token });

  } catch (error) {
    res.json({ message: "Error occurred" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});