"use client";
import "./styles.css";

type Props = {
    value: number;
    onChange?: (val: number) => void;
    readonly?: boolean;
};

const StarRating = ({ value, onChange, readonly = false }: Props) => {
    return (
        <div className="starContainer">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    className={`star ${readonly ? "starReadonly" : ""}`}
                    onClick={() => !readonly && onChange && onChange(star)}
                    type="button"
                    aria-label={`${star} estrellas`}
                >
                    {star <= value ? "⭐" : "☆"}
                </button>
            ))}
            {readonly && <span className="ratingValue">{value}/5</span>}
        </div>
    );
};

export default StarRating;
