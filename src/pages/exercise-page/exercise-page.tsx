import React, {KeyboardEvent, useCallback, useEffect, useRef, useState} from 'react';
import s from './exercise-page.module.css';
import {pluralize} from "../../utils";
import {IDictionary} from "../../types";
import {ExerciseTypes, KNOWING_CORRECT_REPEATS_THRESHOLD, useWordsPull} from "./useWordsPull";
import {useSpeaker} from "./useSpeaker";
import Tooltip from "../../components/tooltip/tooltip";

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
    const {soundSetting, toggleSoundSetting, play} = useSpeaker();
    const [correctCounter, setCorrectCounter] = useState(0);
    const [learnedCounter, setLearnedCounter] = useState(0);
    const {ex: {curWord, curList, exerciseType}, setNewWord, updatePull } =
        useWordsPull(wordLists, curListKeys);
    const [isInCheckState, setCheckStateFlag] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputErrorsCount, setInputErrorCount] = useState(0);

    const word = exerciseType === ExerciseTypes.translationByWord ? curWord : wordLists[curList][curWord].definition;
    const definition = exerciseType === ExerciseTypes.translationByWord ? wordLists[curList][curWord].definition : curWord;

    useEffect(() => {
        if (exerciseType === ExerciseTypes.translationByWord) {
            play(word);
        }
    }, [exerciseType, play, word]);

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
    }, [counter, wordLists, curList, curWord, setNewWord, onAnswer, correctCounter, learnedCounter, updatePull]);

    const handleInputCheckClick = useCallback(() => {
        if(normalize(inputRef.current?.value || '') === normalize(definition)) {
            handleAnswer(true);
            setInputErrorCount(0);
        } else {
            setInputErrorCount(inputErrorsCount + 1);
        }
    }, [definition, handleAnswer, inputErrorsCount]);

    const handleInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            handleInputCheckClick();
        }
    }, [handleInputCheckClick]);

    const handleInputNextWordClick = useCallback(() => {
        handleAnswer(false);
        setInputErrorCount(0);
    }, [handleAnswer]);

    const handleInputSkipClick = useCallback(() => {
        setInputErrorCount(MAX_INPUT_ERR_COUNT);
    }, []);

    let checkBlock = isInCheckState ?
        <div className={s.checkBlock}>
            <div>This means:</div>
            <div className={s.definition}>{definition}</div>
            <br/>
            <div className={s.checkTitle}>You were right?</div>
            <div>
                <button className={s.actionButton} autoFocus onClick={() => handleAnswer(true)}>Yes</button>
                &nbsp;&nbsp;
                <button className={s.actionButton} onClick={() => handleAnswer(false)}>Nope</button>
            </div>
        </div> :
        <div className={s.checkBlock}>
            <button
                className={s.actionButton}
                autoFocus
                onClick={handleCheckBtnClick}
            >Check</button>
        </div>;

    if (exerciseType === ExerciseTypes.typingByDefinition) {
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
                &nbsp;
                <button onClick={handleInputSkipClick}>Skip</button>
            </div>
            <div className={s.inputError}>{inputErrorsCount ? 'This is wrong, please try again' : null}</div>
        </div> : <div className={s.checkBlock}>
            <div>This means:</div>
            <div><b>{definition}</b></div>
            <br/>
            <button
                className={s.actionButton}
                autoFocus
                onClick={handleInputNextWordClick}
            >Next word</button>
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

        <div className={s.soundSetting}>
            <Tooltip content='Toggle sound'>
                <button
                    onClick={toggleSoundSetting}
                >
                    {soundSetting ? '🔈' : '🔇'}
                </button>
            </Tooltip>
        </div>

        <div className={s.counter}>
            Words in pull: {wordsCount}
            <br/>
            Session correctness: {counter === 0 ? '-' :
            `${Math.round(correctCounter / counter * 10000) / 100}% (${correctCounter} / ${counter})`
        }
            <br/>
            Words learned: {learnedCounter}
        </div>
        <div>How to translate the next {pluralize(word.split(' ').length, ['word', 'words'])}:</div>
        <div className={s.word}>{word} ?</div>
        <br/>
        <br/>
        {checkBlock}

    </div>;
}

export default ExercisePage;