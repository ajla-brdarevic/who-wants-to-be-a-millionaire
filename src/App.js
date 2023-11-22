import React, { useEffect, useState } from "react";
import AnswerPopup from "./AnswerPopup"; 

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);
  const [clickedAnswer, setClickedAnswer] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);

  const maxQuestions = 15;
  const prices = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple");
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const shuffledQuestions = shuffleQuestions(data.results);
          setQuestions(shuffledQuestions);
        } else {
          console.error("API returned empty or invalid data.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const shuffleQuestions = (questions) => {
    const shuffledQuestions = [...questions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    return shuffledQuestions;
  };

  const decodeHtmlEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleAnswer = (selectedAnswer, index) => {
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setMoneyEarned(prices[questionCount]);
      setIsAnswerCorrect(true);

      setTimeout(() => {
        setIsAnswerCorrect(null);
        handleNextQuestion();
      }, 2000);
    } else {
      setIsAnswerCorrect(false);
      setIsAnswerIncorrect(true);
      setCorrectAnswerIndex(questions[currentQuestionIndex].correct_answer);
      setShowAnswerPopup(true);

      setTimeout(() => {
        setIsAnswerCorrect(null);
        setIsAnswerIncorrect(false);
        setGameOver(true);
      }, 3000);
    }

    setClickedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < maxQuestions && questionCount + 1 < maxQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionCount(questionCount + 1);
    } else {
      if (questionCount === maxQuestions - 1) {
        console.log("Congratulations! You are a millionaire!");
      } else {
        console.log("Game Over!");
      }
      setGameOver(true);
    }
  };

  const handleRestartGame = () => {
    setMoneyEarned(0);
    setQuestions(shuffleQuestions(questions));
    setCurrentQuestionIndex(0);
    setGameOver(false);
    setQuestionCount(0);
    setShowAnswerPopup(false);
  };

  return (
    <div className="App">
      <h1>Who Wants to Be a Millionaire?</h1>
      <div className="container">
        <div className="game">
          {currentQuestionIndex < questions.length && !gameOver && (
            <>
              <button onClick={() => setGameOver(true)}>Give up!</button>
              <div className="question">
                <h2 dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(questions[currentQuestionIndex].question) }} />
              </div>

              <div className="answers">
                {questions[currentQuestionIndex].type === "multiple" &&
                  questions[currentQuestionIndex].incorrect_answers.map((answer, index) => (
                    <div key={index}>
                      <button
                        onClick={() => handleAnswer(answer, index)}
                        className={isAnswerCorrect ? (clickedAnswer === index ? 'correct-answer' : '') : isAnswerIncorrect ? (clickedAnswer === index ? 'incorrect-answer' : '') : ''}
                      >
                        {answer}
                      </button>
                    </div>
                  ))}
                {questions[currentQuestionIndex].type === "multiple" && (
                  <div>
                    <button
                      onClick={() => handleAnswer(questions[currentQuestionIndex].correct_answer)}
                      className={isAnswerCorrect ? 'correct-answer' : ''}
                    >
                      {decodeHtmlEntities(questions[currentQuestionIndex].correct_answer)}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="gameover">
            {gameOver && (
              <>
                <p>{questionCount === maxQuestions - 1 ? "Congratulations! You are a millionaire!" : "Game Over!"}</p>
                <p>You won: ${moneyEarned}</p>
                <button onClick={handleRestartGame}>Start again!</button>
              </>
            )}
          </div>
        </div>
        <div className="prizes">
          <table>
            <tbody>
              {prices.slice().reverse().map((price, index) => (
                <tr key={index} style={{ backgroundColor: currentQuestionIndex + 1 === maxQuestions - index ? '#D6640F' : 'inherit' }}>
                  <td className="numbquestions">{maxQuestions - index}</td>
                  <td className="pricetable">{maxQuestions - index === 1 ? `${price}€` : `${price}€`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAnswerPopup && (
        <AnswerPopup
          correctAnswer={decodeHtmlEntities(questions[currentQuestionIndex].correct_answer)}
          onClose={() => setShowAnswerPopup(false)}
        />
      )}
    </div>
  );
}

export default App;
