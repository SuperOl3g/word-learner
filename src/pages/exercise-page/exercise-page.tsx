import React, {KeyboardEvent, useCallback, useEffect, useRef, useState} from 'react';
import s from './exercise-page.module.css';
import {pluralize} from "../../utils";
import {IDictionary} from "../../types";
import {ExerciseTypes, KNOWING_CORRECT_REPEATS_THRESHOLD, useWordsPull} from "./useWordsPull";
import {useSpeaker} from "./useSpeaker";
import Tooltip from "../../components/tooltip/tooltip";
import classNames from "classnames";
import Button from "../../components/button/button";

interface IProps {
    wordLists: {
        [key: string]: IDictionary
    },
    curListKeys: Array<string>,

    onBackButtonClick: () => void,
    onAnswer: (list:string, word: string, isPositive: boolean, isLearned: boolean) => void,
}

const MAX_INPUT_ERR_COUNT = 4;

const normalize = (str: string) => str.trim().toLowerCase();

function ExercisePage({ wordLists, curListKeys, onBackButtonClick, onAnswer }: IProps) {
    const [counter, setCounter] = useState(0);
    const {soundSetting, toggleSoundSetting, speak} = useSpeaker();
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
            speak(word);
        }
    }, [exerciseType, speak, word]);

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
                <Button
                    size='m'
                    autoFocus
                    onClick={() => handleAnswer(true)}
                >
                    <div className={s.confirmButton}>Yes</div>
                </Button>
                &nbsp;&nbsp;
                <Button
                    size='m'
                    onClick={() => handleAnswer(false)}
                >
                    <div className={s.confirmButton}>Nope</div>
                </Button>
            </div>
        </div> :
        <div className={s.checkBlock}>
            <Button
                size='m'
                autoFocus
                onClick={handleCheckBtnClick}
            >Check</Button>
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
                <Button onClick={handleInputCheckClick}>Check</Button>
                &nbsp;
                <Button onClick={handleInputSkipClick}>Skip</Button>
            </div>
            <div className={s.inputError}>{inputErrorsCount ? 'This is wrong, please try again' : null}</div>
        </div> : <div className={s.checkBlock}>
            <div>This means:</div>
            <div><b>{definition}</b></div>
            <br/>
            <Button
                size='m'
                autoFocus
                onClick={handleInputNextWordClick}
            >Next word</Button>
        </div>
    }

    const wordsCount = curListKeys.reduce((sum, listKey) => (sum + Object.keys(wordLists[listKey]).length), 0);

    return <div className={s.container}>
        <div className={s.backButton}>
            <Button
                onClick={onBackButtonClick}
            >
                ⬅︎
            </Button>
        </div>

        <div className={s.soundSetting}>
            <Tooltip content='Toggle sound'>
                <Button
                    onClick={toggleSoundSetting}
                >
                    {soundSetting ? '🔈' : '🔇'}
                </Button>
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