const Quiz = require("../models/questionModel");

//post

const createQuiz = async (req, res) => {
  const { quizName, questions } = req.body;
  try {
    if (!quizName || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid request body." });
    }
    const existingQuiz = await Quiz.findOne({ quizName });
    if (existingQuiz) {
      return res
        .status(409)
        .json({ message: "Quiz with this name already exists." });
    }
    const newQuiz = new Quiz({ quizName, questions });
    const createdQuiz = await newQuiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const addQuestionByQuizId = async (req, res) => {
  // console.log(req.params, "This is params");
  // console.log(req.body, "This is body");
  const { quizId } = req.params;
  const { questionText, choices, correctChoice } = req.body;

  try {
    if (
      !questionText ||
      !Array.isArray(choices) ||
      choices.length === 0 ||
      correctChoice === undefined
    ) {
      return res.status(400).json({ message: "Invalid request body." });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const newQuestion = { questionText, choices, correctChoice };
    quiz.questions.push(newQuestion);
    await quiz.save();
    res
      .status(201)
      .json({ message: "Question added successfully.", newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//get
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getQuizById = async (req, res) => {
  console.log(req.params);
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//put
const updateQuestionInQuiz = async (req, res) => {
  const { quizId, questionId } = req.params;
  const { questionText, choices, correctChoice } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    question.questionText = questionText || question.questionText;
    question.choices = choices || question.choices;
    question.correctChoice = correctChoice || question.correctChoice;

    await quiz.save();
    res.status(200).json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// delete
const deleteQuestionFromQuiz = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    question.deleteOne();
    await quiz.save();
    res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const deleteQuizById = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    res.status(200).json({ message: "Quiz deleted successfully." });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  createQuiz,
  addQuestionByQuizId,
  getQuizzes,
  getQuizById,
  updateQuestionInQuiz,
  deleteQuestionFromQuiz,
  deleteQuizById,
};
