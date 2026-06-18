import { Link } from "react-router-dom";

export default function GameOver({ won, difficulty, currentIndex, onQuit }) {
    return (
        <div className="ret-06__gameover">

            {/* Credits roll in the background */}
            <div className="credits">
                <div className="credits__inner">
                    <p>Quiz created by Akky</p>
                    <p>Lead Question Inventor: Akky's Last Brain Cell</p>
                    <p>Bug Producer: Unknown Keyboard Gremlin</p>
                    <p>Coffee Consumption Manager: Akky</p>
                    <p>Random Fact Department: Internet Rabbit Holes</p>
                    <p>Quality Assurance: "Works on My Machine"</p>
                    <p>Special Thanks: Stack Overflow</p>
                    <p>Moral Support: The Refresh Button</p>
                    <p>Emergency Debugging Team: 2 AM Panic</p>
                    <p>Powered by Curiosity and Questionable Decisions</p>
                    <p>No keyboards were harmed during development*</p>
                    <p>*Probably</p>
                    <p>Thanks for playing!</p>
                </div>
            </div>

            {/* Result box pinned to bottom */}
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
                    <Link to="/" onClick={onQuit} style={{ marginTop: "8px" }}>
                        <button type="button" className="ret-06__btn">Quit</button>
                    </Link>
                </div>
            </div>

        </div>
    );
}