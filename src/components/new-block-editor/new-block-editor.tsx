import React, {ChangeEvent, Fragment, useCallback, useState} from 'react';
import classNames from 'classnames';
import s from './new-block-edtior.module.css';
import {IDictionary} from "../../types";

interface IProps {
    onConfirm?: (dict: IDictionary) => void
}

function NewBlockEditor({ onConfirm }: IProps) {
    const [value, setValue] = useState('');
    const [isInAddingState, setAddingState] = useState(false);
    const [isError, setErrorState] = useState(false);

    const handleChange = useCallback((e: ChangeEvent<{ value: string, name: string }>) => {
        setValue(e.target.value);
    }, []);

    const handleConfirmClick = useCallback(() => {
        const dictionary: IDictionary = {};

        const isError = value
            .split('\n')
            .find(val => {
                const [word, meaning] = val.split('-');

                // TODO: needs better validation
                if (!meaning) {
                    return true;
                }
                dictionary[word] = meaning;
            });

        if (isError) {
            setErrorState(true);
        } else {
            onConfirm?.(dictionary);

            setAddingState(false);
            setValue('');
            setErrorState(false);
        }
    }, [onConfirm]);

    const handleAddClick = useCallback(() => {
        setAddingState( true);
    }, []);

    return !isInAddingState ?
        <button
            className={s.button}
            onClick={handleAddClick}
        >+ Add
        </button> :
        <Fragment>
            <textarea
                autoFocus
                className={classNames({
                    [s.textarea]: true,
                    [s.textarea_error]: isError,
                })}
                value={value}
                onChange={handleChange}
            />
            <button
                className={s.button}
                onClick={handleConfirmClick}
            >
                Confirm
            </button>
        </Fragment>
    ;
}

export default NewBlockEditor;
