const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userEmail: String,
  exercise: String,
  weight: Number,
  reps: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Workout", workoutSchema);