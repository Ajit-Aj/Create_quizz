const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  choices: { type: [String], required: true },
  correctChoice: { type: Number, required: true },
});

const quizSchema = new Schema({
  quizName: { type: String, required: true },
  questions: [questionSchema],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
