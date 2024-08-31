import React from "react";
import QuestionForm from "./Components/QuestionForm";
import QuestionList from "./Components/QuestionList";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<QuestionForm />} />
        <Route path="/questionlist" element={<QuestionList />} />
        <Route path="/edit-quiz/:quizId" element={<QuestionForm />} />
      </Routes>
    </div>
  );
};

export default App;
