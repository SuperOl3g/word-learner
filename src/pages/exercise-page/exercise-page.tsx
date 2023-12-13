import React, { KeyboardEvent, useCallback, useRef, useState} from 'react';
import s from './exercise-page.module.css';
import {pluralize} from "../../utils";
import {IDictionary} from "../../types";
import {KNOWING_CORRECT_REPEATS_THRESHOLD, useWordsPull} from "./useWordsPull";

interface IProps {
    wordLists: {
        [key: string]: IDictionary
    },
    curListKeys: Array<string>,

    onBackButtonClick: () => void,
    onAnswer: (list:string, word: string, isPositive: boolean, isLearned: boolean) => void,
}

const MAX_INPUT_ERR_COUNT = 5;

const normalize = (str: string) => str.trim().toLowerCase();

function ExercisePage({ wordLists, curListKeys, onBackButtonClick, onAnswer }: IProps) {
    const [counter, setCounter] = useState(0);
    const [correctCounter, setCorrectCounter] = useState(0);
    const [learnedCounter, setLearnedCounter] = useState(0);
    const {ex: {curWord, curList, isReversedEx, isTypingEx}, setNewWord, updatePull } =
        useWordsPull(wordLists, curListKeys);
    const [isInCheckState, setCheckStateFlag] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputErrorsCount, setInputErrorCount] = useState(0);

    const word = isReversedEx ? wordLists[curList][curWord].definition : curWord;
    const definition = isReversedEx ? curWord : wordLists[curList][curWord].definition;

    const handleCheckBtnClick = useCallback(() => {
        setCheckStateFlag(true);
    }, []);

    const handleAnswer = useCallback((isCorrect: boolean) => {
        setCounter(counter + 1);
        if (isCorrect) {
            setCorrectCounter(correctCounter + 1);
        }

        const isLearned = isCorrect && wordLists[curList][curWord].correctAnswersStreak === (KNOWING_CORRECT_REPEATS_THRESHOLD - 1);

        if (isLearned) {
            setLearnedCounter(learnedCounter + 1);
            updatePull(curList, curWord);
        }

        setNewWord();
        setCheckStateFlag(false);

        onAnswer(curList, curWord, isCorrect, isLearned);
    }, [counter, setNewWord, onAnswer, curList, curWord, correctCounter]);

    const handleInputCheckClick = useCallback(() => {
        if(normalize(inputRef.current?.value || '') === normalize(definition)) {
            handleAnswer(true);
            setInputErrorCount(0);
        } else {
            setInputErrorCount(inputErrorsCount + 1);
        }
    }, [definition, handleAnswer, inputErrorsCount]);

    const handleInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleInputCheckClick();
        }
    }, [handleInputCheckClick]);

    const handleInputSkipClick = useCallback(() => {
        handleAnswer(false);
        setInputErrorCount(0);
    }, [handleAnswer]);

    let checkBlock = isInCheckState ?
        <div className={s.checkBlock}>
            <div>This means:</div>
            <div><b>{definition}</b></div>
            <br/>
            <div className={s.checkTitle}>You were right?</div>
            <div>
                <button autoFocus onClick={() => handleAnswer(true)}>Yes</button>
                &nbsp;&nbsp;
                <button onClick={() => handleAnswer(false)}>Nope</button>
            </div>
        </div> :
        <div className={s.checkBlock}>
            <button
                autoFocus
                onClick={handleCheckBtnClick}
            >Check</button>
        </div>;

    if (isReversedEx && isTypingEx) {
        checkBlock = inputErrorsCount < MAX_INPUT_ERR_COUNT ? <div className={s.checkBlock}>
            <div className={s.checkTitle}>Type the answer:</div>

            <div>
                <input
                    ref={inputRef}
                    key={definition}
                    type="text"
                    autoComplete='off'
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

    const wordsCount = curListKeys.reduce((sum, listKey) => (sum + Object.keys(wordLists[listKey]).length), 0);

    return <div className={s.container}>
    <button
            className={s.backButton}
            onClick={onBackButtonClick}
        >
            ⬅︎
        </button>

        <div className={s.counter}>
            Words in pull: {wordsCount}
            <br/>
            Session correctness: {counter === 0 ? '-' :
            `${Math.round(correctCounter / counter * 10000) / 100}% (${correctCounter} / ${counter})`
            }
            <br/>
            Learned words: {learnedCounter}
        </div>
        <div>How to translate the next {pluralize(word.split(' ').length, ['word', 'words'])}:</div>
        <span><b>{word}</b> ?</span>
        <br/>
        {checkBlock}

    </div>;
}

export default ExercisePage;