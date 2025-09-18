import { useEffect, useState } from "react";
import axios from "axios";

export default function Quiz({ roomId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showAttemptList, setShowAttemptList] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: "", questions: [] });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  });

  // Load quizzes
  const fetchQuizzes = () => {
    axios
      .get(`http://localhost:5000/api/quizzes/${roomId}`)
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [showCreate]);

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

  const handleAddQuestion = () => {
    setNewQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setNewQuestion({ question: "", options: ["", "", "", ""], correctIndex: 0 });
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.title || newQuiz.questions.length === 0) {
      alert("Quiz title and at least one question are required.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/quizzes`, {
        roomCode: roomId,
        title: newQuiz.title,
        questions: newQuiz.questions,
      });
      console.log('Quiz created:', response.data);
      setShowCreate(false);
      setNewQuiz({ title: "", questions: [] });
      fetchQuizzes();
    } catch (err) {
      console.error('Quiz creation error:', err);
      if (err.response) {
        alert(`Error creating quiz: ${err.response.data.error || err.response.statusText}`);
      } else {
        alert("Error creating quiz: Network or server issue.");
      }
    }
  };

  // ======= UI =======
  if (showCreate) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
        <input
          type="text"
          value={newQuiz.title}
          onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
          placeholder="Quiz Title"
          className="mb-4 px-4 py-2 rounded bg-gray-800 text-white w-64"
        />
        <div className="mb-4 w-96">
          <h3 className="font-bold mb-2">Add Question</h3>
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
            placeholder="Question"
            className="mb-2 px-4 py-2 rounded bg-gray-800 text-white w-full"
          />
          {newQuestion.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => {
                const options = [...newQuestion.options];
                options[idx] = e.target.value;
                setNewQuestion({ ...newQuestion, options });
              }}
              placeholder={`Option ${idx + 1}`}
              className="mb-2 px-4 py-2 rounded bg-gray-800 text-white w-full"
            />
          ))}
          <div className="mb-2">
            <label className="mr-2">Correct Option:</label>
            <select
              value={newQuestion.correctIndex}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, correctIndex: Number(e.target.value) })
              }
              className="px-2 py-1 rounded bg-gray-700 text-white"
            >
              {newQuestion.options.map((_, idx) => (
                <option key={idx} value={idx}>{`Option ${idx + 1}`}</option>
              ))}
            </select>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
        </div>
        <div className="mb-4">
          <h3 className="font-bold mb-2">Questions Added:</h3>
          <ul>
            {newQuiz.questions.map((q, idx) => (
              <li key={idx} className="mb-1">{q.question}</li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            onClick={handleCreateQuiz}
          >
            Save Quiz
          </button>
          <button
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
            onClick={() => setShowCreate(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuiz) {
    if (showAttemptList) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
          <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
          <div className="flex flex-col space-y-2 w-64 mb-4">
            {quizzes.length === 0 && <p>No quizzes available.</p>}
            {quizzes.map((quiz) => (
              <button
                key={quiz._id}
                className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
                onClick={() => startQuiz(quiz)}
              >
                {quiz.title}
              </button>
            ))}
          </div>
          <button
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setShowAttemptList(false)}
          >
            Back
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
        <div className="flex space-x-4 mb-6">
          <button
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            onClick={() => setShowCreate(true)}
          >
            Create Quiz
          </button>
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            onClick={() => setShowAttemptList(true)}
          >
            Attempt Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold">Quiz Finished!</h2>
        <p className="text-lg mt-2">
          Your Score: {score} / {currentQuiz.questions.length}
        </p>
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
