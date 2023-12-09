import React, {useState} from 'react';
import s from './app.module.css';
import {LS} from "../../utils";
import {IDictionary} from "../../types";
import DictionaryPage from "../../pages/dictionary-page/dictionary-page";

interface IState {
    dictionaries: {
        [key: string]: IDictionary
    },
}

const LS_DICT_KEY = '__wordList';

function App() {
    const [{ dictionaries }, setState] =
        useState<IState>({
            dictionaries: LS.get(LS_DICT_KEY) || {},
        });

    const handleAddConfirm = (dict: IDictionary) => {
        const newBlock = Object.keys(dict)?.length ? { [new Date().valueOf()]: dict } : {};

        const dicts = {
            ...dictionaries,
            ...newBlock,
        };

        setState({
            dictionaries: dicts,
        });

        LS.set(LS_DICT_KEY, dicts);
    }

    const handleCrossClick = (key: string) => () => {
        if (!confirm('Do you really want to remove this item?')) { // eslint-disable-line
            return;
        }

        const newDictionaries = { ...dictionaries };
        delete newDictionaries[key];

        setState({
            dictionaries: newDictionaries,
        })
    }

  return (
      <div className={s.app}>
          <DictionaryPage
              dictionaries={dictionaries}
              onDictionaryRemove={handleCrossClick}
              onDictionaryAdd={handleAddConfirm}
          />
      </div>

  );
}

export default App;
