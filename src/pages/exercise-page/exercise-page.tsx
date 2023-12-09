import React, {Fragment, useCallback, useState} from 'react';
import s from './exercise-page.module.css';

interface IProps {
    words: { [key: string]: string },
    onBackButtonClick: () => void,
}

const getRandomWord = (words: IProps['words']) => {
    const keys = Object.keys(words);
    return keys[Math.round(Math.random() * keys.length)];
}

function ExercisePage({ words, onBackButtonClick }: IProps) {
    const [counter, setCounter] = useState(0);
    const [correctCounter, setCorrectCounter] = useState(0);
    const [currentWord, setNewWord] = useState(getRandomWord(words));
    const [isInCheckState, setCheckStateFlag] = useState(false);

    const handleCheckBtnClick = useCallback(() => {
        setCheckStateFlag(true);
    }, []);

    const handleBtnClick = useCallback((isCorrect: boolean) => {
        setCounter(counter + 1);
        if (isCorrect) {
            setCorrectCounter(correctCounter + 1);
        }
        setNewWord(getRandomWord(words));
        setCheckStateFlag(false);
    }, [counter, words]);

    return <div className={s.container}>
        <button
            className={s.backButton}
            onClick={onBackButtonClick}
        >
            ⬅︎
        </button>

        <div className={s.counter}>
            Words in pull: {Object.keys(words).length}
            <br/>
            Session correctness: {counter === 0 ? '-' :
            `${Math.round(correctCounter / counter * 10000) / 100}% (${correctCounter} / ${counter})`
        }
        </div>
        <div>How to translate the next word:</div>
        <span><b>{currentWord}</b>?</span>
        <br/>
        {isInCheckState ?
            <div className={s.checkBlock}>
                <div>This means:</div>
                <div><b>{words[currentWord]}</b></div>
                <br/>
                <div className={s.checkTitle}>You were right?</div>
                <div>
                    <button onClick={() => handleBtnClick(true)}>Yes</button>
                    &nbsp;&nbsp;
                    <button onClick={() => handleBtnClick(false)}>Nope</button>
                </div>
            </div> :
            <div className={s.checkBlock}>
                <button onClick={handleCheckBtnClick}>Check</button>
            </div>}

    </div>;
}

export default ExercisePage;