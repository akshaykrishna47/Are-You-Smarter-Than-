import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { easy } from "./easyQns";
import { med } from "./medQns";
import { hard } from "./hardQns";
import "./Quiz.css"

const STORAGE_KEY = "quizState";
const QUESTION_TIME = 10;

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
    const saved = useRef(getSavedState()).current;

    const difficulty = location.state?.difficulty ?? saved?.difficulty;
    const resumable = Boolean(saved) && saved.difficulty === difficulty;

    const [questions, setQuestions] = useState(() =>
        resumable ? saved.questions : buildQuestions(difficulty)
    );
    const [currentIndex, setCurrentIndex] = useState(() => (resumable ? saved.currentIndex : 0));
    const [gameOver, setGameOver] = useState(() => (resumable ? saved.gameOver : false));
    const [won, setWon] = useState(() => (resumable ? saved.won : false));
    const [options, setOptions] = useState([]);

    // ✅ Declared BEFORE the sessionStorage useEffect so it's in scope
    const [timeLeft, setTimeLeft] = useState(() =>
        resumable ? saved.timeLeft ?? QUESTION_TIME : QUESTION_TIME
    );

    // Shuffle options when question changes
    useEffect(() => {
        if (questions.length === 0) return;
        const [, choices] = questions[currentIndex];
        setOptions(shuffleArray(choices));
    }, [questions, currentIndex]);

    // Keep sessionStorage in sync — timeLeft is now safely in scope
    useEffect(() => {
        if (questions.length === 0) return;
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ difficulty, questions, currentIndex, gameOver, won, timeLeft })
        );
    }, [difficulty, questions, currentIndex, gameOver, won, timeLeft]);

    // ✅ Only reset when the index actually changes, not on mount
    const prevIndexRef = useRef(currentIndex);
    useEffect(() => {
        if (prevIndexRef.current === currentIndex) return;
        prevIndexRef.current = currentIndex;
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
        if (answerResult !== null) return;

        const [, choices] = questions[currentIndex];
        const correctAnswer = choices[0];
        const isCorrect = option === correctAnswer;

        setSelectedOption(option);

        setTimeout(() => {
            setAnswerResult(isCorrect ? "correct" : "wrong");

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
                <div className="credits">
                    <div className="credits__inner">
                        <p>Quiz created by Akky</p>
                        <p>Lead Question Inventor: Akky</p>
                        <p>Asst. Question Inventor: Also Akky</p>
                        <p>Senior Button Click Engineer: Akky</p>
                        <p>Chief Timer Enjoyer: Akky</p>

                        <p>☕ Powered by questionable amounts of caffeine</p>
                        <p>🦆 Official Duck Consultant: Sir Quacksalot</p>
                        <p>🐛 Bugs Found: 48</p>
                        <p>🐛 Bugs Fixed: 47</p>
                        <p>🐛 The Remaining Bug: Classified</p>

                        <p>Special Thanks To:</p>
                        <p>The Stack Overflow Wizards</p>
                        <p>The Rubber Duck</p>
                        <p>The Last Remaining Brain Cell</p>
                        <p>The Person Reading This</p>

                        <p>Achievement Unlocked:</p>
                        <p>"You Actually Reached The Credits"</p>

                        <p>There is no post-credit scene.</p>
                        <p>Seriously.</p>
                        <p>Stop waiting.</p>
                        <p>Go touch some grass.</p>
                        <p>🌱</p>

                        <p>...still here?</p>
                        <p>Okay.</p>
                        <p>Thanks for playing! ❤️</p>
                    </div>
                </div>
            </div>
        );
    }

    const [currentQuestion] = questions[currentIndex];

    return (
        <div style={{
            background:"rgba(26, 11, 46, 0.7)",
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
                <div className="ret-06__wincontent" style={{ textAlign: "center" }}>
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