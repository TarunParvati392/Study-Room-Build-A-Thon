export default function Flashcards() {
  const flashcards = [
    {
      topic: "React",
      question: "What is React?",
      answer: "A JavaScript library for building UIs.",
      link: "https://react.dev/"
    },
    {
      topic: "Node.js",
      question: "What is Node.js?",
      answer: "A JavaScript runtime built on Chrome's V8 engine.",
      link: "https://nodejs.org/"
    },
    {
      topic: "MongoDB",
      question: "What is MongoDB?",
      answer: "A NoSQL document-oriented database.",
      link: "https://www.mongodb.com/"
    },
    {
      topic: "Tailwind CSS",
      question: "What is Tailwind CSS?",
      answer: "A utility-first CSS framework.",
      link: "https://tailwindcss.com/"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Flashcards</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {flashcards.map((card, idx) => (
          <div key={idx} className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-between">
            <h2 className="text-2xl font-bold mb-2">{card.topic}</h2>
            <p className="text-lg font-semibold mb-2">{card.question}</p>
            <p className="text-base mb-4 opacity-80">{card.answer}</p>
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white font-semibold"
            >
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
