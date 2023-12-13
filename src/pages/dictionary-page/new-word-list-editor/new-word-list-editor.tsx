import React, {ChangeEvent, Fragment, useCallback, useState} from 'react';
import s from './new-word-list-editor.module.css';
import Popup from "../../../components/popup/popup";
import InputTable from "../../../components/input-table/input-table";
import {CallbackHandler} from "../../../types";

interface IProps {
    onConfirm?: (dict:{[key: string]: string}) => void
}

function NewWordListEditor({ onConfirm }: IProps) {
    const [value, setValue] = useState<Array<[string,string]>>([]);
    const [isInEditingState, setEditingState] = useState(false);
    const [isError, setErrorState] = useState(false);

    const handleChange: CallbackHandler<Array<[string,string]>> = useCallback((_,{ value }) => {
        setValue(value || []);
    }, []);

    const handleConfirmClick = useCallback(() => {
        const wordList: { [key: string]: string } = {};

        const isError = value
            .find(([word, meaning], i) => {
                const trimmedWord = word.trim();
                // TODO: needs better validation
                if (!meaning || !trimmedWord || wordList[trimmedWord]) {
                    return true;
                }

                wordList[trimmedWord] = meaning.trim();
            });

        if (isError) {
            setErrorState(true);
        } else {
            onConfirm?.(wordList);

            setEditingState(false);
            setValue([]);
            setErrorState(false);
        }
    }, [onConfirm, value]);

    const handleAddClick = useCallback(() => {
        setEditingState( true);
    }, []);

    const handlePopupClose = useCallback(() => {
        setEditingState(false);
    }, []);

    return (
        <Fragment>
            <button
                className={s.addButton}
                onClick={handleAddClick}
            >+ Add
            </button>
            <Popup
                opened={isInEditingState}
                onClose={handlePopupClose}
            >
                <div className={s.inputContainer}>
                    <InputTable
                        value={value}
                        onChange={handleChange}
                    />
                    {isError ? <div>Incorrect data</div>: null}
                </div>
                <button
                    onClick={handleConfirmClick}
                >
                    Confirm
                </button>
            </Popup>
        </Fragment>);
}

export default NewWordListEditor;
