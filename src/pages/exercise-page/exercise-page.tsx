import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import s from './exercise-page.module.css';
import {pluralize} from "../../utils";
import {IDictionary} from "../../types";
import {ExerciseTypes, KNOWING_CORRECT_REPEATS_THRESHOLD, useWordsPull} from "./useWordsPull";
import {useSpeaker} from "./useSpeaker";
import Tooltip from "../../components/tooltip/tooltip";
import Button from "../../components/button/button";
import ExerciseInput from "./exercise-input/exercise-input";

interface IProps {
    wordLists: {
        [key: string]: IDictionary
    },
    curListKeys: Array<string>,

    onBackButtonClick: () => void,
    onAnswer: (list:string, word: string, isPositive: boolean, isLearned: boolean) => void,
}

const MAX_INPUT_ERR_COUNT = 4;

function ExercisePage({ wordLists, curListKeys, onBackButtonClick, onAnswer }: IProps) {
    const [counter, setCounter] = useState(0);
    const [correctCounter, setCorrectCounter] = useState(0);
    const [learnedCounter, setLearnedCounter] = useState(0);

    const {soundSetting, toggleSoundSetting, speak} = useSpeaker();
    const {ex: {curWord, curList, exerciseType}, updateExercise, updatePull } =
        useWordsPull(wordLists, curListKeys);
    const [isInCheckState, setCheckStateFlag] = useState(false);
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

        updateExercise();
        setCheckStateFlag(false);

        onAnswer(curList, curWord, isCorrect, isLearned);
    }, [counter, wordLists, curList, curWord, updateExercise, onAnswer, correctCounter, learnedCounter, updatePull]);

    const handleInputCheck = useCallback((isCorrect: boolean) => {
        if(isCorrect) {
            handleAnswer(true);
            setInputErrorCount(0);
        } else {
            setInputErrorCount(inputErrorsCount + 1);
        }
    }, [handleAnswer, inputErrorsCount]);

    const handleInputNextWordClick = useCallback(() => {
        handleAnswer(false);
        setInputErrorCount(0);
    }, [handleAnswer]);

    const handleInputSkip = useCallback(() =>
        setInputErrorCount(MAX_INPUT_ERR_COUNT)
    , []);

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
            <ExerciseInput
                key={definition + wordLists[curList][curWord].correctAnswersStreak}
                autoFocus
                checkVal={definition}
                onConfirm={handleInputCheck}
                onSkip={handleInputSkip}
            />
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

    const wordsCount = useRef<{total: number, newWords: number} | null>(null);

    useMemo(() => {
        let total = 0;
        let newWords = 0;

        curListKeys.forEach(listKey => {
            const words = Object.keys(wordLists[listKey]);
            total += words.length;

            words.forEach(word => {
                if ((wordLists[listKey][word]?.correctAnswersStreak || 0) < KNOWING_CORRECT_REPEATS_THRESHOLD) {
                    newWords++;
                }
            })
        });

        wordsCount.current = {
            total,
            newWords,
        };
    }, [counter]);


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
            Words in pull: {wordsCount.current?.total} ({wordsCount.current?.newWords} new)
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