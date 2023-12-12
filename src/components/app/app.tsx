import React, {useCallback, useState} from 'react';
import s from './app.module.css';
import DictionaryPage from "../../pages/dictionary-page/dictionary-page";
import ExercisePage from "../../pages/exercise-page/exercise-page";
import Stats from "../stats/stats";
import {useStats} from "./useStats";
import {useDictionary} from "./useDictionary";

function App() {
    const { stats, updateStats } = useStats();
    const {wordLists, addWordList, removeWordList} = useDictionary();
    const [curListKeys, setCurListsKeys] =
        useState<Array<string>>([]);


    const handleWordListAdd = useCallback((list: { [key: string]: string }) => {
        addWordList(list);
    }, [addWordList]);

    const handleBackBtnClick = useCallback(() => {
        setCurListsKeys( []);
    }, []);

    const handleWordListRemove = useCallback((key: string)  => {
        if (!confirm('Do you really want to remove this item?')) { // eslint-disable-line
            return;
        }

        removeWordList(key)
    }, [removeWordList]);

    const handleStartExercise = useCallback((listKeys: Array<string>) => {
        setCurListsKeys(listKeys);
    }, []);


    const handleAnswer = useCallback((currentWord: string, isPositive: boolean) => {
        updateStats(isPositive);
    }, [updateStats]);

    return (
        <div className={s.app}>
            {!curListKeys.length ?
                <DictionaryPage
                    wordLists={wordLists}
                    onListRemove={handleWordListRemove}
                    onListAdd={handleWordListAdd}
                    onListSelected={handleStartExercise}
                /> :
                <ExercisePage
                    words={curListKeys.reduce((words, key) => ({
                        ...words,
                        ...wordLists[key],
                    }), {})}
                    onBackButtonClick={handleBackBtnClick}
                    onAnswer={handleAnswer}
                />}
            <Stats stats={stats} />
        </div>
    );
}

export default App;
