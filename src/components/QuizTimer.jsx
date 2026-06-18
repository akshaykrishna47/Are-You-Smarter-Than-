export default function QuizTimer({ timeLeft }) {
    return (
        <div className="numero_counting_wrapper">
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="numero_shape"
                    style={{ display: (10 - i) === timeLeft ? 'block' : 'none' }}
                />
            ))}
        </div>
    );
}