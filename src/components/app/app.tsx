import React, {useCallback, useState} from 'react';
import s from './app.module.css';
import {LS, mapObj} from "../../utils";
import DictionaryPage from "../../pages/dictionary-page/dictionary-page";
import ExercisePage from "../../pages/exercise-page/exercise-page";
import Stats from "../stats/stats";
export interface IStatState {
    [date: string]: { pos: number, total: number }
}

const LS_DICT_KEY = '__wordList';
const LS_STAT_KEY = '__ex_stats';


function App() {
    const [stats, setStats] =
        useState<IStatState>(LS.get<IStatState>(LS_STAT_KEY) || {});
    const [currentDictionariesKeys, setCurDictKeys] =
        useState<Array<string>>([]);
    const [dictionaries, updateDictionaries] =
        useState<{ [key: string]: { [key: string]: string } }>(LS.get(LS_DICT_KEY) || {});

    const handleAddConfirm = useCallback((dict: { [key: string]: string }) => {
        const newBlock = Object.keys(dict)?.length ? { [Date.now()]: dict } : {};

        const dicts = {
            ...dictionaries,
            ...newBlock,
        };

        updateDictionaries(dicts);
        LS.set(LS_DICT_KEY, dicts);
    }, [dictionaries]);

    const handleBackBtnClick = useCallback(() => {
        setCurDictKeys( []);
    }, []);

    const handleCrossClick = useCallback((key: string)  => {
        if (!confirm('Do you really want to remove this item?')) { // eslint-disable-line
            return;
        }

        const newDictionaries = { ...dictionaries };
        delete newDictionaries[key];

        updateDictionaries(newDictionaries)

        LS.set(LS_DICT_KEY, newDictionaries);
    }, [dictionaries]);

    const handleStartExercise = useCallback((dictKeys: Array<string>) => {
        setCurDictKeys(dictKeys);
    }, []);


    const handleStatCountersUpdate = useCallback((isPositive: boolean) => {
        const key = new Date(new Date().toDateString()).valueOf();
        const newStats = {
            ...stats,
            [key]: {
                pos: (stats[key]?.pos || 0) + (isPositive ? 1 : 0),
                total: (stats[key]?.total || 0) + 1,
            }
        };

        setStats(newStats);
        LS.set(LS_STAT_KEY, newStats);
    }, [stats]);

    return (
        <div className={s.app}>
            {!currentDictionariesKeys.length ?
                    <DictionaryPage
                        dictionaries={dictionaries}
                        onDictionaryRemove={handleCrossClick}
                        onDictionaryAdd={handleAddConfirm}
                        onDictionariesSelected={handleStartExercise}
                    />
                :
                <ExercisePage
                    words={currentDictionariesKeys.reduce((words, key) => ({
                        ...words,
                        ...mapObj(dictionaries[key], (val) => ({
                            definition: val,
                        })),
                    }), {})}
                    onBackButtonClick={handleBackBtnClick}
                    onAnswer={handleStatCountersUpdate}
                />}
            <Stats stats={stats} />
        </div>
    );
}

export default App;
