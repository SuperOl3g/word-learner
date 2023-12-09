import React, {ChangeEvent, Fragment, useCallback, useState} from 'react';
import s from './dictionary-page.module.css';
import NewBlockEditor from "../../components/new-block-editor/new-block-editor";
import {formatDate, pluralize} from "../../utils";

interface IProps {
    dictionaries: {
        [key: string]: {
            [key: string]: string
        }
    },

    onDictionaryAdd: (dict: { [key: string]: string }) => void,
    onDictionaryRemove: (key: string) => void,
    onDictionariesSelected: (dictKeys: Array<string>) => void,
}

const MAX_WORD_COUNT = 10;

function DictionaryPage({
    dictionaries,
    onDictionaryAdd,
    onDictionaryRemove,
    onDictionariesSelected,
}: IProps) {
    const [isInSelectState, setSelectState] = useState(false);
    const [selectedKeys, setSelectedKeys] =
        useState<{[key: string]: boolean}>({});

    const handleBlockSelectionToggle = useCallback((e: ChangeEvent<{ name: string }>) => {
        const key = e.target.name;
        const newSelectedKeys = { ...selectedKeys };

        if (newSelectedKeys[key]) {
            delete newSelectedKeys[key];
        } else {
            newSelectedKeys[key] = true;
        }

        setSelectedKeys(newSelectedKeys);
    }, [selectedKeys]);

    const handleLearnBtnClick = useCallback(() => {
        const selectedKeys: {[key: string]: boolean} = {};

        Object.keys(dictionaries).forEach(key => {
            selectedKeys[key] = true;
        });

        setSelectState(true);
        setSelectedKeys(selectedKeys);
    },[dictionaries]);

    const handleStartExerciseBtnClick = useCallback(() => {
        onDictionariesSelected(Object.keys(selectedKeys));
    }, [onDictionariesSelected, selectedKeys]);

    const wordsCount = Object.keys(selectedKeys)
        .reduce((sum, k) => sum + Object.keys(dictionaries[k]).length, 0);

    return (
        <div>
            <div className={s.learnBlock}>
                {isInSelectState ? <div>
                    Selected lists: {Object.keys(selectedKeys).length} / {Object.keys(dictionaries).length}
                    &nbsp;
                    ({wordsCount} {pluralize(wordsCount, ['word', 'words'])})
                    &nbsp;&nbsp;
                    <button onClick={handleStartExerciseBtnClick}>
                        Let's roll!
                    </button>
                </div> :
                <button
                    className={s.learnButton}
                    onClick={handleLearnBtnClick}
                >Learn!</button>}
            </div>

            <div className={s.blocksContainer}>
                {Object.keys(dictionaries).map(key => {
                    const keys = Object.keys(dictionaries[key]);

                    return (
                        <div className={s.block} key={key}>
                            {isInSelectState ? <input
                                type='checkbox'
                                name={key}
                                className={s.checkbox}
                                checked={!!selectedKeys[key]}
                                onChange={handleBlockSelectionToggle}
                            /> : null}

                            <div className={s.blockTitle}>{formatDate(new Date(+key))}</div>

                            <div>
                                <button
                                    className={s.crossButton}
                                    onClick={() => onDictionaryRemove(key)}
                                >x
                                </button>

                                {keys.slice(0, MAX_WORD_COUNT)
                                    .map(word => <div className={s.row}>
                                        <b>{word}</b> - {dictionaries[key][word]}
                                    </div>)}
                                {keys.length > MAX_WORD_COUNT ?
                                    <div><br/>... and {keys.length - MAX_WORD_COUNT} more</div>
                                    : ''}
                            </div>
                        </div>);
                })}
                <div className={s.block}>
                    <NewBlockEditor onConfirm={onDictionaryAdd}/>
                </div>
            </div>
        </div>

    );
}

export default DictionaryPage;
