export default function QuizOptions({ options, selectedOption, answerResult, onAnswer }) {
    return (
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
                        onClick={() => onAnswer(opt)}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
}