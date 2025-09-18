import { useEffect, useState } from "react";
import axios from "axios";

export default function Quiz({ roomId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Load quizzes for this room
  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${roomId}`)
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err));
  }, [roomId]);

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowScore(false);
  };

  const handleNext = () => {
    if (selectedOption === currentQuiz.questions[currentIndex].correctIndex) {
      setScore(score + 1);
    }
    if (currentIndex + 1 < currentQuiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };

  if (!currentQuiz) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
        <div className="flex flex-col space-y-2">
          {quizzes.map((quiz) => (
            <button
              key={quiz._id}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
              onClick={() => startQuiz(quiz)}
            >
              {quiz.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold">Quiz Finished!</h2>
        <p className="text-lg mt-2">Your Score: {score} / {currentQuiz.questions.length}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          onClick={() => setCurrentQuiz(null)}
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const question = currentQuiz.questions[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-2">{question.question}</h2>
      <div className="flex flex-col space-y-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedOption(idx)}
            className={`px-4 py-2 rounded ${
              selectedOption === idx ? "bg-yellow-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        disabled={selectedOption === null}
      >
        {currentIndex + 1 < currentQuiz.questions.length ? "Next" : "Finish"}
      </button>
    </div>
  );
}
