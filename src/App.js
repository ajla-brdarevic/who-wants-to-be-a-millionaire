import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

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

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setMoneyEarned(prices[questionCount]);
      setIsAnswerCorrect(true);
  
      setTimeout(() => {
        setIsAnswerCorrect(false);
        handleNextQuestion();
      }, 1000);
    } else {
      setGameOver(true);
    }
  };  

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < maxQuestions && questionCount + 1 < maxQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionCount(questionCount + 1);
    } else {
      console.log("You are a millionaire!");
      setGameOver(true);
    }
  };

  const handleRestartGame = () => {
    setMoneyEarned(0);
    setQuestions(shuffleQuestions(questions));
    setCurrentQuestionIndex(0);
    setGameOver(false);
    setQuestionCount(0);
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
                <h2> {questions[currentQuestionIndex].question} </h2>
              </div>

              <div className="answers">
                {questions[currentQuestionIndex].type === "multiple" &&
                  questions[currentQuestionIndex].incorrect_answers.map((answer, index) => (
                    <div key={index}>
                      <button
                        onClick={() => handleAnswer(answer)}
                        className={isAnswerCorrect && answer === questions[currentQuestionIndex].correct_answer ? 'correct-answer' : ''}
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
                      {questions[currentQuestionIndex].correct_answer}
                    </button>
                  </div>
                )}
              </div>

            </>
          )}

          {gameOver && (
            <>
              <p>Game Over!</p>
              <p>You won: ${moneyEarned}</p>
              <button onClick={handleRestartGame}>Start again!</button>
            </>
          )}
        </div>
        <div className="prizes">
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {prices.slice().reverse().map((price, index) => (
                <tr key={index} style={{ backgroundColor: currentQuestionIndex + 1 === maxQuestions - index ? '#D6640F' : 'inherit' }}>
                  <td>{maxQuestions - index}</td>
                  <td>{maxQuestions - index === 1 ? `${price}€` : `${price}$`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
