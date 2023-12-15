import React, {Fragment, useCallback, useEffect, useState} from 'react';
import s from './word-list-editor.module.css';
import Popup from "../../../components/popup/popup";
import InputTable from "../../../components/input-table/input-table";
import {CallbackHandler, IDictionary} from "../../../types";
import Button from "../../../components/button/button";
interface IProps<T> {
    children?: (open: () => void) => React.ReactNode,
    value?: IDictionary,
    wordListKey?: T,

    onConfirm?: (dict: IDictionary, wordListKe: T) => void
}

const dictToArr = (dict?: IDictionary) => Object.keys(dict || {}).map(k => [k, dict?.[k].definition]) as Array<[string,string]>;

const isEqual = (a: Array<[string,string]>, b: Array<[string,string]>) =>
    a.length === b.length && !a.find((_, i) =>
        a[i][0] !== b[i][0] || a[i][0] !== b[i][0]
    );

function WordListEditor<T extends string | undefined>({ wordListKey, value: oldValue, children, onConfirm }: IProps<T>) {
    const [value, setValue] = useState<Array<[string,string]>>(dictToArr(oldValue));
    const [isOpened, setEditingState] = useState(false);
    useEffect(()=> {
        setValue(dictToArr(oldValue));
    }, [oldValue, isOpened]);
    const [isError, setErrorState] = useState(false);

    const handleChange: CallbackHandler<Array<[string,string]>> = useCallback((_,{ value }) => {
        setValue(value || []);
    }, []);

    const handleConfirmClick = useCallback(() => {
        const wordList: IDictionary = {};

        const isError = value
            .find(([word, meaning], i) => {
                const trimmedWord = word.trim();
                // TODO: needs better validation
                if (!meaning || !trimmedWord || wordList[trimmedWord]) {
                    return true;
                }

                // if it's an old word with same definition then needs to copy its as is with it's learning stat
                if (oldValue?.[trimmedWord] && oldValue[trimmedWord].definition === meaning.trim()) {
                    wordList[trimmedWord] = oldValue?.[trimmedWord];
                } else {
                    wordList[trimmedWord] = {
                        definition: meaning.trim()
                    };
                }

                return false;
            });

        if (isError) {
            setErrorState(true);
        } else {
            onConfirm?.(wordList, wordListKey as T);

            setEditingState(false);
            setValue([]);
            setErrorState(false);
        }
    }, [oldValue, onConfirm, value, wordListKey]);

    const handleAddClick = useCallback(() => {
        setEditingState( true);
    }, []);

    const handlePopupClose = useCallback(() => {
        const text = 'You have unsaved changes, do you really want to close popup?';

        if (isEqual(dictToArr(oldValue), value) || confirm(text)) { // eslint-disable-line
            setEditingState(false);
        }
    }, [oldValue, value]);

    return (
        <Fragment>
            {children?.(handleAddClick)}
            <Popup
                opened={isOpened}
                onClose={handlePopupClose}
            >
                <div className={s.inputContainer}>
                    <InputTable
                        value={value}
                        onChange={handleChange}
                    />
                    {isError ? <div>Incorrect data</div>: null}
                </div>
                <Button
                    size='m'
                    onClick={handleConfirmClick}
                >
                    Confirm
                </Button>
            </Popup>
        </Fragment>);
}

export default WordListEditor;
