import React, { KeyboardEvent, useCallback, useRef, useState} from 'react';
import s from './exercise-page.module.css';
import {pluralize} from "../../utils";
import {IDictionary} from "../../types";
import {useWordsPull} from "./useWordsPull";

interface IProps {
    words: IDictionary,
    onBackButtonClick: () => void,
    onAnswer: (currentWord: string, isPositive: boolean) => void,
}

const MAX_INPUT_ERR_COUNT = 5;

const normalize = (str: string) => str.trim().toLowerCase();

function ExercisePage({ words, onBackButtonClick, onAnswer }: IProps) {
    const [counter, setCounter] = useState(0);
    const [correctCounter, setCorrectCounter] = useState(0);
    const {ex: {newWord: currentWord, isReversedEx, isTypingEx}, setNewWord } = useWordsPull(words);
    const [isInCheckState, setCheckStateFlag] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputErrorsCount, setInputErrorCount] = useState(0);

    const word = isReversedEx ? words[currentWord].definition : currentWord;
    const definition = isReversedEx ? currentWord : words[currentWord].definition;

    const handleCheckBtnClick = useCallback(() => {
        setCheckStateFlag(true);
    }, []);

    const handleBtnClick = useCallback((isCorrect: boolean) => {
        setCounter(counter + 1);
        if (isCorrect) {
            setCorrectCounter(correctCounter + 1);
        }
        setNewWord();
        setCheckStateFlag(false);

        onAnswer(currentWord, isCorrect);
    }, [currentWord, counter, setNewWord, onAnswer, correctCounter]);

    const handleInputCheckClick = useCallback(() => {
        if(normalize(inputRef.current?.value || '') === normalize(definition)) {
            handleBtnClick(true);
            setInputErrorCount(0);
        } else {
            setInputErrorCount(inputErrorsCount + 1);
        }
    }, [definition, handleBtnClick, inputErrorsCount]);

    const handleInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleInputCheckClick();
        }
    }, [handleInputCheckClick]);

    const handleInputSkipClick = useCallback(() => {
        handleBtnClick(false);
        setInputErrorCount(0);
    }, [handleBtnClick]);

    let checkBlock = isInCheckState ?
        <div className={s.checkBlock}>
            <div>This means:</div>
            <div><b>{definition}</b></div>
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
        </div>;

    if (isReversedEx && isTypingEx) {
        checkBlock = inputErrorsCount < MAX_INPUT_ERR_COUNT ? <div className={s.checkBlock}>
            <div className={s.checkTitle}>Type the answer:</div>

            <div>
                <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    onKeyDown={handleInputKeyDown}
                />
                &nbsp;
                <button onClick={handleInputCheckClick}>Check</button>
            </div>
            <div className={s.inputError}>{inputErrorsCount ? 'This is wrong, please try again' : null}</div>
        </div> : <div className={s.checkBlock}>
            <div>This means:</div>
            <div><b>{definition}</b></div>
            <br/>
            <button onClick={handleInputSkipClick}>Next word</button>
        </div>
    }

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
        <div>How to translate the next {pluralize(word.split(' ').length, ['word', 'words'])}:</div>
        <span><b>{word}</b> ?</span>
        <br/>
        {checkBlock}

    </div>;
}

export default ExercisePage;