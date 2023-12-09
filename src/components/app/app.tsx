import React, {useState} from 'react';
import s from './app.module.css';
import NewBlockEditor from "../new-block-editor/new-block-editor";
import {formatDate} from "../../utils";
import {IDictionary} from "../../types";

interface IState {
    dictionaries: {
        [key: string]: IDictionary
    },
}

const LS_DICT_KEY = '__wordList';

// TODO: add correcy handling of possible parse errors
const LS = {
    get: <T = any>(key: string) => {
        const v= localStorage.getItem(key);

        return v  ? (JSON.parse(v) as T) : undefined;
    },
    set: (key: string, val: any) => {
        const v = JSON.stringify(val);

        localStorage.setItem(key, v);
    },
};

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

    const handleCrossClick = (key: string) => (e: React.MouseEvent) => {
        if (!confirm('Do you really want to remove this item?')) { // eslint-disable-line
            return;
        }

        const newDictionaries = { ...dictionaries };
        delete newDictionaries[key];

        setState({
            dictionaries: newDictionaries,
        })
    }

    const MAX_WORD_COUNT = 10;

  return (
      <div className={s.app}>
          {Object.keys(dictionaries).map(key =>
              <div className={s.block}>
                  <div className={s.blockTitle}>{formatDate(new Date(+key))}</div>
                  <div>
                      <button
                          className={s.crossButton}
                          onClick={handleCrossClick(key)}
                      >x</button>

                      {Object.keys(dictionaries[key]).slice(0, MAX_WORD_COUNT)
                          .map(word => <div><b>{word}</b> - {dictionaries[key][word]}</div>)}
                      {Object.keys(dictionaries[key]).length > MAX_WORD_COUNT ? <div>...</div> : ''}
                  </div>
              </div>
          )}
          <div className={s.block}>
            <NewBlockEditor onConfirm={handleAddConfirm} />
          </div>
      </div>

  );
}

export default App;
