import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { easy } from "./easyQns";
import { med } from "./medQns";
import { hard } from "./hardQns";
import "./Quiz.css"

const STORAGE_KEY = "quizState";

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getSavedState() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function buildQuestions(difficulty) {
    const source =
        difficulty === "5 year old"
            ? easy
            : difficulty === "8th Grader"
            ? med
            : hard;
    return shuffleArray(Object.entries(source));
}

export default function Quiz() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);

    const location = useLocation();
    // Read sessionStorage once on mount, not on every render
    const saved = useRef(getSavedState()).current;

    // If we got refreshed, location.state can be empty, so fall back to the saved difficulty
    const difficulty = location.state?.difficulty ?? saved?.difficulty;
    const resumable = Boolean(saved) && saved.difficulty === difficulty;

    const [questions, setQuestions] = useState(() =>
        resumable ? saved.questions : buildQuestions(difficulty)
    );
    const [currentIndex, setCurrentIndex] = useState(() => (resumable ? saved.currentIndex : 0));
    const [gameOver, setGameOver] = useState(() => (resumable ? saved.gameOver : false));
    const [won, setWon] = useState(() => (resumable ? saved.won : false));
    const [options, setOptions] = useState([]);

    // Shuffle the 4 options every time we land on a new question
    useEffect(() => {
        if (questions.length === 0) return;
        const [, choices] = questions[currentIndex];
        setOptions(shuffleArray(choices));
    }, [questions, currentIndex]);

    // Keep sessionStorage in sync so a refresh resumes instead of regenerating
    useEffect(() => {
        if (questions.length === 0) return;
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ difficulty, questions, currentIndex, gameOver, won })
        );
    }, [difficulty, questions, currentIndex, gameOver, won]);

    const QUESTION_TIME = 10;
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

    // Reset when question changes
    useEffect(() => {
        setTimeLeft(QUESTION_TIME);
    }, [currentIndex]);

    // Countdown
    useEffect(() => {
        if (gameOver || answerResult !== null) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [gameOver, answerResult]);

    // Time ran out
    useEffect(() => {
        if (timeLeft <= 0) {
            setGameOver(true);
        }
    }, [timeLeft]);

    function handleAnswer(option) {
    if (answerResult !== null) return; // locked while animating

    const [, choices] = questions[currentIndex];
    const correctAnswer = choices[0];
    const isCorrect = option === correctAnswer;

    setSelectedOption(option);

    // blink for 900ms (3 × 300ms steps), then show colour
    setTimeout(() => {
        setAnswerResult(isCorrect ? "correct" : "wrong");

        // hold colour for 3 seconds, then advance
        setTimeout(() => {
        setSelectedOption(null);
        setAnswerResult(null);

        if (!isCorrect) {
            setGameOver(true);
        } else if (currentIndex + 1 >= 5) {
            setWon(true);
            setGameOver(true);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
        }, 2000);
    }, 900);
    }

    function handleQuit() {
        sessionStorage.removeItem(STORAGE_KEY);
    }

    if (questions.length === 0) {
        return (
            <div>
                <h1>Quiz Page</h1>
                <p>Loading questions...</p>
            </div>
        );
    }

    if (gameOver) {
        return (
            <div className="ret-06__gameover">
                <div className={`ret-06__gameover-box ${won ? "ret-06__gameover-box--win" : "ret-06__gameover-box--lose"}`}>
                    <div className={`ret-06__gameover-bar ${won ? "ret-06__gameover-bar--win" : "ret-06__gameover-bar--lose"}`}>
                        <i></i><i></i><i></i>
                        <span>{won ? "Victory" : "Game Over"}</span>
                    </div>
                    <div className="ret-06__gameover-body">
                        <h1 className={`ret-06__gameover-title ${won ? "ret-06__gameover-title--win" : "ret-06__gameover-title--lose"}`}>
                            {won ? "You Win!" : "Game Over"}
                        </h1>
                        <p className="ret-06__gameover-msg">
                            {won
                                ? `You are smarter than a ${difficulty}.`
                                : `You made it to question ${currentIndex + 1} of 5.`}
                        </p>
                        <Link to="/" onClick={handleQuit} style={{ marginTop: "8px" }}>
                            <button type="button" className="ret-06__btn">Quit</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const [currentQuestion] = questions[currentIndex];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "0 2rem 0 2rem"
        }}>
            <div className="ret-06__win" style={{ width: "100%", maxWidth: "600px" }}>
                <div className="ret-06__winbar">
                    <i></i><i></i><i></i>
                    <span>Question {currentIndex + 1}</span>
                </div>
                <div className="ret-06__wincontent" style={{textAlign:"center"}}>
                    <div className="quiz-timer">
                        {timeLeft}
                    </div>
                    {currentQuestion}
                    <div className="ret-06__row">
                        {options.map((opt) => {
                            const isSelected = opt === selectedOption;
                            let feedbackClass = "";
                            if (isSelected && answerResult === null)      feedbackClass = "ret-06__btn--blink";
                            if (isSelected && answerResult === "correct") feedbackClass = "ret-06__btn--correct";
                            if (isSelected && answerResult === "wrong")   feedbackClass = "ret-06__btn--wrong";

                            return (
                                <button
                                    key={opt}
                                    className={`ret-06__btn ${feedbackClass}`}
                                    onClick={() => handleAnswer(opt)}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Link to="/" onClick={handleQuit} style={{ margin: "auto" }}>
                <button type="button" className="ret-06__btn">Quit</button>
            </Link>
        </div>
    );
}
