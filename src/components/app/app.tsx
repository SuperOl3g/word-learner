import React, {useCallback, useState} from 'react';
import s from './app.module.css';
import {LS} from "../../utils";
import {IDictionary} from "../../types";
import DictionaryPage from "../../pages/dictionary-page/dictionary-page";
import ExercisePage from "../../pages/exercise-page/exercise-page";

interface IState {
    dictionaries: {
        [key: string]: IDictionary
    },
    currentDictionariesKeys: Array<string>,
}

const LS_DICT_KEY = '__wordList';

function App() {
    const [{ currentDictionariesKeys, dictionaries, }, setState] =
        useState<IState>({
            dictionaries: LS.get(LS_DICT_KEY) || {},
            currentDictionariesKeys: []
        });

    const handleAddConfirm = useCallback((dict: IDictionary) => {
        const newBlock = Object.keys(dict)?.length ? { [new Date().valueOf()]: dict } : {};

        const dicts = {
            ...dictionaries,
            ...newBlock,
        };

        setState({
            dictionaries: dicts,
            currentDictionariesKeys: []
        });

        LS.set(LS_DICT_KEY, dicts);
    }, [dictionaries]);

    const handleCrossClick = useCallback((key: string)  => {
        if (!confirm('Do you really want to remove this item?')) { // eslint-disable-line
            return;
        }

        const newDictionaries = { ...dictionaries };
        delete newDictionaries[key];

        setState({
            dictionaries: newDictionaries,
            currentDictionariesKeys: [],
        })

        LS.set(LS_DICT_KEY, newDictionaries);
    }, [dictionaries]);

    const handleStartExercise = useCallback((dictKeys: Array<string>) => {
        setState({
            dictionaries,
            currentDictionariesKeys: dictKeys,
        });
    }, [dictionaries]);

    let page;

    if(!currentDictionariesKeys.length) {
        page = (
            <DictionaryPage
                dictionaries={dictionaries}
                onDictionaryRemove={handleCrossClick}
                onDictionaryAdd={handleAddConfirm}
                onDictionariesSelected={handleStartExercise}
            />
        );
    } else {
        let words = {};

        currentDictionariesKeys.forEach(key => {
           words = {
               ...words,
               ...dictionaries[key],
           };
        });

        page = (
            <ExercisePage
                words={words}
             />
        );
    }

    return (
        <div className={s.app}>
            {page}
        </div>
    );
}

export default App;
