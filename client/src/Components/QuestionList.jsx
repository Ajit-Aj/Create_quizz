import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { BsTrash, BsPencil } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuestionList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [deleteQuiz, setDeleteQuiz] = useState(null);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDeleteQuestion = async () => {
    try {
      const { quizId, questionId } = deleteQuestion;
      await axios.delete(
        `http://localhost:5000/api/quizzes/${quizId}/questions/${questionId}`
      );
      const updatedQuizzes = quizzes.map((quiz) => {
        if (quiz._id === quizId) {
          quiz.questions = quiz.questions.filter((q) => q._id !== questionId);
        }
        return quiz;
      });
      setQuizzes(updatedQuizzes);
      toast.success("Question deleted successfully.");
      setShowDeleteQuestionModal(false);
      setDeleteQuestion(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Error deleting question.");
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${deleteQuiz}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== deleteQuiz));
      toast.success("Quiz deleted successfully.");
      setShowDeleteQuizModal(false);
      setDeleteQuiz(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Error deleting quiz.");
    }
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center my-5">Quizzes</h1>
      <Link to="/">
        <Button variant="primary" className="mb-2">
          Add New Quizz
        </Button>
      </Link>
      <Accordion>
        {quizzes.map(
          (quiz, index) =>
            quiz.questions.length > 0 && (
              <Accordion.Item eventKey={index.toString()} key={quiz._id}>
                <Accordion.Header className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="fw-bold">{quiz.quizName}</span> - Questions
                    ({quiz.questions.length})
                  </div>
                  <div style={{ marginLeft: "10px" }} className=" d-flex gap-2">
                    <Button
                      variant="link"
                      // className="p-0 me-2"
                      onClick={() => handleEditQuiz(quiz._id)}
                      style={{ color: "blue" }}
                    >
                      <BsPencil size={20} />
                    </Button>
                    <Button
                      variant="link"
                      className="p-0"
                      style={{ color: "red" }}
                      onClick={() => {
                        setDeleteQuiz(quiz._id);
                        setShowDeleteQuizModal(true);
                      }}
                    >
                      <BsTrash size={20} />
                    </Button>
                  </div>
                </Accordion.Header>

                <Accordion.Body>
                  <Table striped bordered hover className="question-table mt-3">
                    <thead className="text-center">
                      <tr>
                        <th>#</th>
                        <th>Question Text</th>
                        <th>Choices</th>
                        <th>Correct Choice</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quiz.questions.map((question, qIndex) => (
                        <tr key={question._id}>
                          <td className="text-center align-middle">
                            {qIndex + 1}
                          </td>
                          <td className="align-middle">
                            {question.questionText}
                          </td>
                          <td className="align-middle">
                            <ul>
                              {question.choices.map((choice, cIndex) => (
                                <li key={cIndex}>{choice}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-center align-middle">
                            {question.correctChoice + 1}
                          </td>
                          <td className="text-center align-middle">
                            <Button
                              variant="danger"
                              onClick={() => {
                                setDeleteQuestion({
                                  quizId: quiz._id,
                                  questionId: question._id,
                                });
                                setShowDeleteQuestionModal(true);
                              }}
                            >
                              <BsTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            )
        )}
      </Accordion>
      {deleteQuestion && (
        <Modal
          show={showDeleteQuestionModal}
          onHide={() => setShowDeleteQuestionModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this question?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteQuestionModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteQuestion}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {deleteQuiz && (
        <Modal
          show={showDeleteQuizModal}
          onHide={() => setShowDeleteQuizModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this quiz?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteQuizModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteQuiz}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <ToastContainer pauseOnHover />
    </div>
  );
};

export default QuestionList;
