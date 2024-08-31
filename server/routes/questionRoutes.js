const express = require("express");
const {
  createQuiz,
  addQuestionByQuizId,
  getQuizzes,
  getQuizById,
  updateQuestionInQuiz,
  deleteQuestionFromQuiz,
  deleteQuizById,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/quizzes", createQuiz);

router.post("/quizzes/:quizId/questions", addQuestionByQuizId);

router.get("/quizzes", getQuizzes);

router.get("/quizzes/:quizId", getQuizById);

router.put("/quizzes/:quizId/questions/:questionId", updateQuestionInQuiz);

router.delete("/quizzes/:quizId/questions/:questionId", deleteQuestionFromQuiz);

router.delete("/quizzes/:quizId", deleteQuizById);

module.exports = router;
