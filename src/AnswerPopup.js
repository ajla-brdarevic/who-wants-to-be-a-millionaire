import React, { useEffect } from 'react';

const AnswerPopup = ({ correctAnswer, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="answer-popup">
            <p>Incorrect! The correct answer is: <br/><br/>{correctAnswer}</p>
        </div>
    );
};

export default AnswerPopup;
