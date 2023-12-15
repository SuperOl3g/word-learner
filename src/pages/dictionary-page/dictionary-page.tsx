import React, {useCallback, useState, SyntheticEvent} from 'react';
import s from './dictionary-page.module.css';
import WordListEditor from "./new-word-list-editor/word-list-editor";
import {formatDate, pluralize} from "../../utils";
import {IDictionary, ValueOf} from "../../types";
import {KNOWING_CORRECT_REPEATS_THRESHOLD} from "../exercise-page/useWordsPull";
import Checkbox from "../../components/checkbox/checkbox";
import Clickable from "../../components/clickable/clickable";
import classNames from "classnames";
import Button from "../../components/button/button";

interface IProps {
    wordLists: {
        [key: string]: IDictionary
    },

    onListAdd: (dict: IDictionary) => void,
    onListUpdate: (dict: IDictionary, key: string) => void,
    onListRemove: (key: string) => void,
    onListSelected: (dictKeys: Array<string>) => void,
}

const MAX_VISIBLE_WORD_COUNT = 10;

const checkIfIsLearned = (word: ValueOf<IDictionary>) => (word.correctAnswersStreak || 0) >= KNOWING_CORRECT_REPEATS_THRESHOLD;

function DictionaryPage({
    wordLists,
    onListAdd,
    onListUpdate,
    onListRemove,
    onListSelected,
}: IProps) {
    const [isInSelectState, setSelectState] = useState(false);
    const [selectedList, setSelectedList] =
        useState<Array<string>>([]);

    const handleBlockSelectionToggle = useCallback((e: SyntheticEvent<HTMLElement>) => {
        const { key} = e.currentTarget.dataset;

        if (!key) {
            return;
        }

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
                        <Button
                            size='m'
                            autoFocus
                            onClick={handleStartExerciseBtnClick}
                        >
                            Let's roll!
                        </Button>
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
                <Button
                    size='m'
                    autoFocus
                    onClick={handleLearnBtnClick}
                >Learn!</Button>}
            </div>

            <div>
                <div className={s.blocksContainer}>
                    <div className={s.blockWrapper}>
                    <div className={classNames({
                            [s.block]: true,
                            [s.block_disabled]: isInSelectState,
                        })}>
                            <WordListEditor onConfirm={onListAdd}>
                                {(handleAddClick) => <button
                                    className={s.addButton}
                                    onClick={handleAddClick}
                                >+ Add
                                </button>}
                            </WordListEditor>
                        </div>
                    </div>

                    {wordListKeys.sort((a,b) => a < b ? 1 : -1).map(key => {
                        const keys = Object.keys(wordLists[key]);
                        const knownCount = keys.reduce((sum, word) =>
                            (sum + ((checkIfIsLearned(wordLists[key][word]) ? 1 : 0))), 0);

                        return (
                            <WordListEditor
                                key={key}
                                wordListKey={key}
                                value={wordLists[key]}
                                onConfirm={onListUpdate}
                            >
                                {(handleEditPopupOpen) => (
                                    <div className={s.blockWrapper}>
                                        <Clickable
                                            className={s.block}
                                            data-key={key}
                                            onClick={isInSelectState ? handleBlockSelectionToggle : handleEditPopupOpen}
                                        >
                                            <div className={s.blockTitle}>
                                                {formatDate(new Date(+key))}
                                                <br/>
                                                {Math.round(knownCount / keys.length * 100)}% learned
                                                ({knownCount} of {keys.length})
                                            </div>

                                            <div>
                                                {keys.slice(0, MAX_VISIBLE_WORD_COUNT).map(word =>
                                                    <div className={s.row} key={word}>
                                                        <span className={s.learnedMark}>
                                                            {checkIfIsLearned(wordLists[key][word]) ? '✔' : ''}
                                                        </span>
                                                        <b>{word}</b> - {wordLists[key][word].definition}
                                                    </div>)}
                                                {keys.length > MAX_VISIBLE_WORD_COUNT ?
                                                    <div><span className={s.learnedMark}/>...</div>
                                                    : null}
                                            </div>
                                        </Clickable>

                                        {isInSelectState ? <Checkbox
                                            data-key={key}
                                            tabIndex={-1}
                                            className={s.checkbox}
                                            checked={selectedList.indexOf(key) !== -1}
                                            onClick={handleBlockSelectionToggle}
                                        /> : null}

                                        <button
                                            className={s.crossButton}
                                            onClick={() => onListRemove(key)}
                                        >x
                                        </button>

                                    </div>
                                )}
                            </WordListEditor>
                        );
                    })}
                </div>
            </div>
        </div>

    );
}

export default DictionaryPage;
