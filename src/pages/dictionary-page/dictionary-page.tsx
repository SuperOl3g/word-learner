import React, {ChangeEvent, useCallback, useState} from 'react';
import s from './dictionary-page.module.css';
import NewWordListEditor from "../../components/new-word-list-editor/new-word-list-editor";
import {formatDate, pluralize} from "../../utils";
import {IDictionary, ValueOf} from "../../types";
import {KNOWING_CORRECT_REPEATS_THRESHOLD} from "../exercise-page/useWordsPull";
import Checkbox from "../../components/checkbox/checkbox";

interface IProps {
    wordLists: {
        [key: string]: IDictionary
    },

    onListAdd: (dict: { [key: string]: string }) => void,
    onListRemove: (key: string) => void,
    onListSelected: (dictKeys: Array<string>) => void,
}

const MAX_WORD_COUNT = 10;

const checkIfIsLearned = (word: ValueOf<IDictionary>) => (word.correctAnswersStreak || 0) >= KNOWING_CORRECT_REPEATS_THRESHOLD;

function DictionaryPage({
    wordLists,
    onListAdd,
    onListRemove,
    onListSelected,
}: IProps) {
    const [isInSelectState, setSelectState] = useState(false);
    const [selectedList, setSelectedList] =
        useState<Array<string>>([]);

    const handleBlockSelectionToggle = useCallback((e: ChangeEvent<{ name: string }>) => {
        const key = e.target.name;
        const i =  selectedList.indexOf(key);
        const newSelectedKeys = [...selectedList];

        if (i  === -1) {
            newSelectedKeys.push(key);
        } else {
            newSelectedKeys.splice(i,1);
        }

        setSelectedList(newSelectedKeys);
    }, [selectedList]);

    const handleLearnBtnClick = useCallback(() => {
        setSelectState(true);
        setSelectedList(Object.keys(wordLists));
    },[wordLists]);

    const handleStartExerciseBtnClick = useCallback(() => {
        onListSelected(selectedList);
    }, [onListSelected, selectedList]);

    const handleSelectAllToggle = useCallback(() => {
        setSelectedList(selectedList.length ? [] : Object.keys(wordLists));
    }, [selectedList.length, wordLists]);

    const wordListKeys = Object.keys(wordLists);
    const wordsCount = selectedList
        .reduce((sum, k) => sum + Object.keys(wordLists[k]).length, 0);

    return (
        <div className={s.page}>
            <div className={s.learnBlock}>
                {isInSelectState ? <div className={s.selectingBlock}>
                    <div>
                        Selected {Object.keys(selectedList).length} of {Object.keys(wordLists).length} lists
                        ({wordsCount} {pluralize(wordsCount, ['word', 'words'])})
                        &nbsp;&nbsp;
                        <button onClick={handleStartExerciseBtnClick}>
                            Let's roll!
                        </button>
                    </div>
                    <label className={s.selectAllBlock}>
                        <Checkbox
                            className={s.selectAllCheckbox}
                            checked={selectedList.length === wordListKeys.length}
                            indeterminate={selectedList.length> 0 && selectedList.length !== wordListKeys.length}
                            onChange={handleSelectAllToggle}
                        />Select all
                    </label>
                </div> :
                <button
                    onClick={handleLearnBtnClick}
                >Learn!</button>}
            </div>

            <div className={s.blocksContainer}>
                {wordListKeys.map(key => {
                    const keys = Object.keys(wordLists[key]);
                    const knownCount = keys.reduce((sum, word) =>
                        (sum + ((checkIfIsLearned(wordLists[key][word]) ? 1 : 0))) ,0);

                    return (
                        <div className={s.block} key={key}>
                            {isInSelectState ? <Checkbox
                                name={key}
                                className={s.checkbox}
                                checked={selectedList.indexOf(key) !== -1}
                                onChange={handleBlockSelectionToggle}
                            /> : null}

                            <div className={s.blockTitle}>
                                {formatDate(new Date(+key))}
                                <br/>
                                {Math.round(knownCount / keys.length * 100)}% learned
                            </div>

                            <div>
                                <button
                                    className={s.crossButton}
                                    onClick={() => onListRemove(key)}
                                >x
                                </button>

                                {keys.slice(0, MAX_WORD_COUNT)
                                    .map(word => <div className={s.row}>
                                        <span className={s.learnedMark}>{checkIfIsLearned(wordLists[key][word]) ? '✔' : ''}</span>
                                        <b>{word}</b> - {wordLists[key][word].definition}
                                    </div>)}
                                {keys.length > MAX_WORD_COUNT ?
                                    <div><br/><span className={s.learnedMark} />... and {keys.length - MAX_WORD_COUNT} more</div>
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
