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

const initState: IState = {
    dictionaries: {},
}

function App() {
    const [{ dictionaries }, setState] =
        useState<IState>(initState);

    const handleAddConfirm = (dict: IDictionary) => {
        const newBlock = Object.keys(dict)?.length ? { [new Date().valueOf()]: dict } : {};

        setState({
            dictionaries: {
                ...dictionaries,
                ...newBlock,
            },
        })
    }

    const handleCrossClick = (key: string) => (e: React.MouseEvent) => {
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
