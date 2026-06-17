import { Link } from "react-router-dom";
import { useState } from "react";

import './Menu.css';

export default function Menu(){
    const [showHow, setHow] = useState(false);

    const handleHowToPlay = () => {
        setHow(!showHow);
    }

    const [difficulty, setDifficulty] = useState(0);

    const difficulties = ["5 year old", "8th Grader", "Scholar"];

    function handleDifficultynext(){
        const newDifficulty = (difficulty+1)%3;
        setDifficulty(newDifficulty);
    }
    function handleDifficultyprev(){
        const newDifficulty = (difficulty+3-1)%3;
        setDifficulty(newDifficulty);
    }

    return (
        <div className="menu-neon">
            <div className="menu-stage">
                <h1 className="menu-title">Welcome to <span>AYST</span></h1>

                <section className="menu-card menu-card-cyan">
                    <div className="menu-card-tier">Game Description</div>
                    <div className="menu-card-divider" aria-hidden="true"></div>
                    <p className="menu-card-body">
                        Test your knowledge across a variety of fun and challenging trivia
                        questions! From general knowledge to tricky brain teasers, this game
                        will push your thinking skills to the limit.
                    </p>
                </section>

                <section className="menu-card menu-card-pink">
                    <span className="menu-badge">Tap</span>
                    <button
                        type="button"
                        className="menu-card-tier menu-card-toggle"
                        onClick={handleHowToPlay}
                        aria-expanded={showHow}
                        aria-controls="how-to-play-content"
                    >
                        How to Play
                        <span className="chevron" aria-hidden="true">▸</span>
                    </button>
                    {showHow && (
                        <div id="how-to-play-content">
                            <div className="menu-card-divider" aria-hidden="true"></div>
                            <ol className="menu-how-list">
                                <li>Read each question carefully</li>
                                <li>Choose the correct answer from the options</li>
                                <li>Progress through increasingly difficult levels</li>
                                <li>Try to get the highest score possible!</li>
                            </ol>
                        </div>
                    )}
                </section>

                <section className="menu-card menu-card-violet">
                    <div className="menu-card-tier">Set Difficulty</div>
                    <div className="menu-card-divider" aria-hidden="true"></div>
                    <div className="difficulty-box">
                        <button
                            type="button"
                            className="difficulty-arrow"
                            onClick={handleDifficultyprev}
                            aria-label="Easier difficulty"
                        >‹</button>
                        <h3 className="difficulty-label">{difficulties[difficulty]}</h3>
                        <button
                            type="button"
                            className="difficulty-arrow"
                            onClick={handleDifficultynext}
                            aria-label="Harder difficulty"
                        >›</button>
                    </div>
                </section>

                <div className="menu-footer">
                    <Link to="/Quiz" state={{ difficulty: difficulties[difficulty] }}>
                        <button type="button" className="menu-ctas">Start Game</button>
                    </Link>
                </div>
                <div className="menu-footer">
                    <Link to="/">
                        <button type="button" className="menu-cta">Back</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}