import React, {ChangeEvent, useCallback, useState} from 'react';
import s from './dictionary-page.module.css';
import NewWordListEditor from "../../components/new-word-list-editor/new-word-list-editor";
import {formatDate, pluralize} from "../../utils";
import {IDictionary} from "../../types";

interface IProps {
    wordLists: {
        [key: string]: IDictionary
    },

    onListAdd: (dict: { [key: string]: string }) => void,
    onListRemove: (key: string) => void,
    onListSelected: (dictKeys: Array<string>) => void,
}

const MAX_WORD_COUNT = 10;

function DictionaryPage({
    wordLists,
    onListAdd,
    onListRemove,
    onListSelected,
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

        Object.keys(wordLists).forEach(key => {
            selectedKeys[key] = true;
        });

        setSelectState(true);
        setSelectedKeys(selectedKeys);
    },[wordLists]);

    const handleStartExerciseBtnClick = useCallback(() => {
        onListSelected(Object.keys(selectedKeys));
    }, [onListSelected, selectedKeys]);

    const wordsCount = Object.keys(selectedKeys)
        .reduce((sum, k) => sum + Object.keys(wordLists[k]).length, 0);

    return (
        <div className={s.page}>
            <div className={s.learnBlock}>
                {isInSelectState ? <div>
                    Selected lists: {Object.keys(selectedKeys).length} / {Object.keys(wordLists).length}
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
                {Object.keys(wordLists).map(key => {
                    const keys = Object.keys(wordLists[key]);

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
                                    onClick={() => onListRemove(key)}
                                >x
                                </button>

                                {keys.slice(0, MAX_WORD_COUNT)
                                    .map(word => <div className={s.row}>
                                        <b>{word}</b> - {wordLists[key][word].definition}
                                    </div>)}
                                {keys.length > MAX_WORD_COUNT ?
                                    <div><br/>... and {keys.length - MAX_WORD_COUNT} more</div>
                                    : ''}
                            </div>
                        </div>);
                })}
                <div className={s.block}>
                    <NewWordListEditor onConfirm={onListAdd}/>
                </div>
            </div>
        </div>

    );
}

export default DictionaryPage;
