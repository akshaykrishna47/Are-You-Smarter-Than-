import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { easy } from "./easyQns";
import { med } from "./medQns";
import { hard } from "./hardQns";
import "./Quiz.css";
import QuizTimer from "./QuizTimer";
import QuizOptions from "./QuizOptions";
import GameOver from "./GameOver";

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
    } catch { return null; }
}

function buildQuestions(difficulty) {
    const source = difficulty === "5 year old" ? easy : difficulty === "8th Grader" ? med : hard;
    return shuffleArray(Object.entries(source));
}

export default function Quiz() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);
    const location = useLocation();
    const saved = useRef(getSavedState()).current;
    const difficulty = location.state?.difficulty ?? saved?.difficulty;
    const resumable = Boolean(saved) && saved.difficulty === difficulty;

    const [questions]    = useState(() => resumable ? saved.questions    : buildQuestions(difficulty));
    const [currentIndex, setCurrentIndex] = useState(() => resumable ? saved.currentIndex : 0);
    const [gameOver, setGameOver]         = useState(() => resumable ? saved.gameOver     : false);
    const [won, setWon]                   = useState(() => resumable ? saved.won          : false);
    const [options, setOptions]           = useState([]);

    useEffect(() => {
        if (questions.length === 0) return;
        const [, choices] = questions[currentIndex];
        setOptions(shuffleArray(choices));
    }, [questions, currentIndex]);

    useEffect(() => {
        if (questions.length === 0) return;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ difficulty, questions, currentIndex, gameOver, won }));
    }, [difficulty, questions, currentIndex, gameOver, won]);

    const QUESTION_TIME = 10;
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

    useEffect(() => { setTimeLeft(QUESTION_TIME); }, [currentIndex]);

    useEffect(() => {
        if (gameOver || answerResult !== null) return;
        const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [gameOver, answerResult]);

    useEffect(() => { if (timeLeft <= 0) setGameOver(true); }, [timeLeft]);

    function handleAnswer(option) {
        if (answerResult !== null) return;
        const [, choices] = questions[currentIndex];
        const isCorrect = option === choices[0];
        setSelectedOption(option);
        setTimeout(() => {
            setAnswerResult(isCorrect ? "correct" : "wrong");
            setTimeout(() => {
                setSelectedOption(null);
                setAnswerResult(null);
                if (!isCorrect)                    setGameOver(true);
                else if (currentIndex + 1 >= 1)    { setWon(true); setGameOver(true); }
                else                               setCurrentIndex(currentIndex + 1);
            }, 2000);
        }, 900);
    }

    function handleQuit() { sessionStorage.removeItem(STORAGE_KEY); }

    if (questions.length === 0) return <p>Loading...</p>;

    if (gameOver) return (
        <GameOver
            won={won}
            difficulty={difficulty}
            currentIndex={currentIndex}
            onQuit={handleQuit}
        />
    );

    const [currentQuestion] = questions[currentIndex];

    return (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"0 2rem" }}>
            <div className="ret-06__win" style={{ width:"100%", maxWidth:"600px" }}>
                <div className="ret-06__winbar">
                    <i></i><i></i><i></i>
                    <span>Question {currentIndex + 1}</span>
                </div>
                <div className="ret-06__wincontent" style={{ textAlign:"center" }}>
                    <QuizTimer timeLeft={timeLeft} />
                    {currentQuestion}
                    <QuizOptions
                        options={options}
                        selectedOption={selectedOption}
                        answerResult={answerResult}
                        onAnswer={handleAnswer}
                    />
                </div>
            </div>
            <Link to="/" onClick={handleQuit} style={{ margin:"auto" }}>
                <button type="button" className="ret-06__btn">Quit</button>
            </Link>
        </div>
    );
}