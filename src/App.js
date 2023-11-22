import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);

  const maxQuestions = 15;
  const prices = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=50&type=multiple");
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
      handleNextQuestion();
    } else {
      setGameOver(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length && questionCount + 1 < maxQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionCount(questionCount + 1);
    } else {
      console.log("You are a millionaire!");
      setGameOver(true);
    }
  };

  const handleRestartGame = () => {
    setQuestions(shuffleQuestions(questions));
    setCurrentQuestionIndex(0);
    setGameOver(false);
    setQuestionCount(0);
    setMoneyEarned(0);
  };

  return (
    <div className="App">
      <h1>Who Wants to Be a Millionaire?</h1>
      <div className="container">
        {currentQuestionIndex < questions.length && !gameOver && (
          <>
            <button onClick={() => setGameOver(true)}>Give up!</button>
            <h2>Question:</h2>
            <div className="question">
              <p>
                <b>{questions[currentQuestionIndex].question}</b>
              </p>
            </div>

            <div className="answers">
              {questions[currentQuestionIndex].type === "multiple" &&
                questions[currentQuestionIndex].incorrect_answers.map((answer, index) => (
                  <div key={index}>
                    <button onClick={() => handleAnswer(answer)}>{answer}</button>
                  </div>
                ))}
              {questions[currentQuestionIndex].type === "multiple" && (
                <div>
                  <button onClick={() => handleAnswer(questions[currentQuestionIndex].correct_answer)}>
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
          <tr>
            <th>Question</th>
            <th>Price</th>
          </tr>
          <tr>
            <td>15</td>
            <td>1 Million</td>
          </tr>
          <tr>
            <td>14</td>
            <td>500 000€</td>
          </tr>
          <tr>
            <td>13</td>
            <td>250 000€</td>
          </tr>
          <tr>
            <td>12</td>
            <td>125 000€</td>
          </tr>
          <tr>
            <td>11</td>
            <td>64 000€</td>
          </tr>
          <tr>
            <td>10</td>
            <td>32 000€</td>
          </tr>
          <tr>
            <td>9</td>
            <td>16 000€</td>
          </tr>
          <tr>
            <td>8</td>
            <td>80 00€</td>
          </tr>
          <tr>
            <td>7</td>
            <td>4 000€</td>
          </tr>
          <tr>
            <td>6</td>
            <td>2 000€</td>
          </tr>
          <tr>
            <td>5</td>
            <td>1 000€</td>
          </tr>
          <tr>
            <td>4</td>
            <td>500€</td>
          </tr>
          <tr>
            <td>3</td>
            <td>300€</td>
          </tr>
          <tr>
            <td>2</td>
            <td>200€</td>
          </tr>
          <tr>
            <td>1</td>
            <td>100€</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default App;
