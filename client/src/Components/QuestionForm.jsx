import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizForm = () => {
  const initialQuestionState = {
    questionText: "",
    choices: ["", "", "", ""],
    correctChoice: 0,
  };

  const [quizName, setQuizName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState([initialQuestionState]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);

  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/quizzes/${quizId}`
          );
          setQuiz(response.data);
          setQuizName(response.data.quizName);
          setQuestions(response.data.questions);
          setShowForm(true);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          toast.error("Failed to fetch quiz.");
        }
      };
      fetchQuiz();
    }
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChoiceChange = (questionIndex, choiceIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctChoice = choiceIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...initialQuestionState }]);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleNewQuestionChange = (index, field, value, choiceIndex) => {
    const updatedNewQuestions = [...newQuestions];
    const updatedNewQuestion = { ...updatedNewQuestions[index] };

    if (field === "choices") {
      updatedNewQuestion.choices[choiceIndex] = value;
    } else {
      updatedNewQuestion[field] = value;
    }
    updatedNewQuestions[index] = updatedNewQuestion;
    setNewQuestions(updatedNewQuestions);
  };

  const handleNewRadioChange = (index, choiceIndex) => {
    const updatedNewQuestions = [...newQuestions];
    const updatedNewQuestion = { ...updatedNewQuestions[index] };
    updatedNewQuestion.correctChoice = choiceIndex;
    updatedNewQuestions[index] = updatedNewQuestion;
    setNewQuestions(updatedNewQuestions);
  };

  const handleAddNewQuestion = () => {
    setNewQuestions([
      ...newQuestions,
      {
        questionText: "",
        choices: ["", "", "", ""],
        correctChoice: 0,
      },
    ]);
  };

  const handleDeleteNewQuestion = (index) => {
    const updatedNewQuestions = newQuestions.filter((_, i) => i !== index);
    setNewQuestions(updatedNewQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = { quizName, questions };

    if (quizId) {
      try {
        for (const question of questions) {
          await axios.put(
            `http://localhost:5000/api/quizzes/${quizId}/questions/${question._id}`,
            {
              questionText: question.questionText,
              choices: question.choices,
              correctChoice: question.correctChoice,
            }
          );
        }
        for (const newQuestion of newQuestions) {
          await axios.post(
            `http://localhost:5000/api/quizzes/${quizId}/questions`,
            newQuestion
          );
        }
        toast.success("Quiz updated successfully.");

        setTimeout(() => {
          navigate("/questionlist");
        }, 1500);
      } catch (error) {
        console.error("Error updating quiz:", error);
        toast.error("Error updating quiz.");
      }
    } else {
      try {
        await axios.post("http://localhost:5000/api/quizzes", quizData);
        toast.success("Quiz created successfully!");
        setTimeout(() => {
          navigate("/questionlist");
        }, 1300);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 409) {
            toast.error("Conflict error: Duplicate quiz found.");
          } else {
            toast.error(
              `Error: ${error.response.data.message || "An error occurred"}`
            );
          }
        } else if (error.request) {
          toast.error("No response from server. Please try again later.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      }
    }
  };

  const handleCreateClick = () => {
    if (quizName.trim()) {
      setShowForm(true);
    } else {
      toast.error("Please enter a quiz name.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center my-5">
        {quizId ? "Edit Quiz" : "Create Quiz"}
      </h1>
      <div className="d-flex gap-3">
        <Link to="/questionlist">
          <Button variant="primary" className="mb-2">
            View Posted Quizzes
          </Button>
        </Link>
      </div>

      <Form>
        <Form.Group controlId="quizName">
          <h4 className="fw-bold">Quiz Name</h4>
          {!quizId && (
            <Form.Control
              type="text"
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          )}
          {quizId && (
            <Form.Control
              readOnly
              type="text"
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          )}
        </Form.Group>

        {!quizId && (
          <Button
            variant="primary"
            type="button"
            onClick={handleCreateClick}
            className="my-3"
          >
            Create Quiz
          </Button>
        )}
      </Form>

      {showForm && (
        <Form onSubmit={handleSubmit}>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <h5 style={{ marginTop: "10px" }}>
                  Question {questionIndex + 1}
                </h5>
                {!quizId && (
                  <Button
                    variant="danger"
                    onClick={() => deleteQuestion(questionIndex)}
                  >
                    <BsTrash />
                  </Button>
                )}
              </div>
              <Form.Group controlId={`question${questionIndex}`}>
                {/* <Form.Label className="fw-bold">Question</Form.Label> */}
                <Form.Control
                  type="text"
                  placeholder="Enter question"
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(
                      questionIndex,
                      "questionText",
                      e.target.value
                    )
                  }
                />
              </Form.Group>

              {question.choices.map((choice, choiceIndex) => (
                <Form.Group key={choiceIndex} className="mb-0">
                  <div className="d-flex m-2 mt-3 align-center gap-2 justify-center">
                    <Form.Check
                      type="radio"
                      className="mt-1"
                      id={`choice-${questionIndex}-${choiceIndex}`}
                      checked={question.correctChoice === choiceIndex}
                      onChange={() =>
                        handleCorrectChoiceChange(questionIndex, choiceIndex)
                      }
                    />
                    <Form.Control
                      type="text"
                      placeholder={`Enter choice ${choiceIndex + 1}`}
                      value={choice}
                      className="w-50"
                      onChange={(e) =>
                        handleChoiceChange(
                          questionIndex,
                          choiceIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </Form.Group>
              ))}
            </div>
          ))}
          {newQuestions.map((newQuestion, index) => (
            <div key={index}>
              <div className="d-flex align-items-center gap-3 mb-2">
                <h3>New Question {index + 1}</h3>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteNewQuestion(index)}
                >
                  <FaTrash />
                </Button>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Form.Group controlId={`newQuestionText-${index}`}>
                  <Form.Label className="fw-bold">Question</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuestion.questionText}
                    onChange={(e) =>
                      handleNewQuestionChange(
                        index,
                        "questionText",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </div>
              <Form.Group>
                <Form.Label>Options</Form.Label>
                {newQuestion.choices.map((choice, choiceIndex) => (
                  <InputGroup key={choiceIndex} className="mb-2">
                    <InputGroup.Radio
                      name={`newQuestionRadio-${index}`}
                      checked={newQuestion.correctChoice === choiceIndex}
                      onChange={() => handleNewRadioChange(index, choiceIndex)}
                    />
                    <Form.Control
                      type="text"
                      value={choice}
                      style={{ width: "90%" }}
                      onChange={(e) =>
                        handleNewQuestionChange(
                          index,
                          "choices",
                          e.target.value,
                          choiceIndex
                        )
                      }
                    />
                  </InputGroup>
                ))}
              </Form.Group>
            </div>
          ))}

          {!quizId && (
            <Button
              variant="primary"
              type="button"
              style={{ marginRight: "10px" }}
              onClick={addQuestion}
            >
              Add Question
            </Button>
          )}
          {quizId && (
            <Button
              variant="warning"
              type="button"
              style={{ marginRight: "10px" }}
              onClick={handleAddNewQuestion}
            >
              Add More Question
            </Button>
          )}

          <Button variant="primary" type="submit">
            {quizId ? "Update Quiz" : "Save"}
          </Button>
        </Form>
      )}

      <ToastContainer pauseOnHover />
    </div>
  );
};

export default QuizForm;
