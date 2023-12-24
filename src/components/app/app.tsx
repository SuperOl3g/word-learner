import React, {useCallback, useState} from 'react';
import s from './app.module.css';
import DictionaryPage from "../../pages/dictionary-page/dictionary-page";
import ExercisePage from "../../pages/exercise-page/exercise-page";
import Stats from "../stats/stats";
import {useStats} from "./useStats";
import {useDictionary} from "./useDictionary";
import Loader from "../loader/loader";

function App() {
    const { stats, updateStats } = useStats();
    const {isWordListLoading, wordLists, addWordList, removeWordList, updateWordList, updateWordStat}
        = useDictionary();
    const [curListKeys, setCurListsKeys] =
        useState<Array<string>>([]);

    const handleBackBtnClick = useCallback(() => {
        setCurListsKeys( []);
    }, []);

    const handleWordListRemove = useCallback((key: string)  => {
        if (!confirm('Do you really want to remove this item?')) { // eslint-disable-line
            return;
        }

        removeWordList(key)
    }, [removeWordList]);

    const handleAnswer = useCallback((listKey: string, word: string, isPositive: boolean, isLearned: boolean) => {
        updateStats(isPositive, isLearned);
        updateWordStat(listKey, word, isPositive);
    }, [updateStats, updateWordStat]);

    return (
        isWordListLoading ?
            <Loader overlay size='xl' /> :
            <div className={s.app}>
                {!curListKeys.length ?
                    <DictionaryPage
                        wordLists={wordLists}
                        onListRemove={handleWordListRemove}
                        onListUpdate={updateWordList}
                        onListAdd={addWordList}
                        onListSelected={setCurListsKeys}
                    /> :
                    <ExercisePage
                        wordLists={wordLists}
                        curListKeys={curListKeys}
                        onBackButtonClick={handleBackBtnClick}
                        onAnswer={handleAnswer}
                    />}
                <Stats stats={stats} />
            </div>
    );
}

export default App;
