import React, {ChangeEvent, useState} from 'react';
import classNames from 'classnames';
import s from './new-block-edtior.module.css';
import {IDictionary} from "../../types";

interface IProps {
    onConfirm?: (dict: IDictionary) => void
}

interface IState {
    value: string,
    isInAddingState: boolean,
    isError: boolean,
}

const initialState: IState = {value: '', isInAddingState: false, isError: false };

function NewBlockEditor({ onConfirm }: IProps) {
    const [state, setState] =
        useState<IState>(initialState);

    const handleChange = (e: ChangeEvent<{ value: string, name: string }>) => {
        setState({
            ...state,
            value: e.target.value,
        });
    }

    const handleConfirmClick = () => {
        const dictionary: IDictionary = {};

        const isError = state.value
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
            setState({
                ...state,
                isError: true,
            });
        } else {
            onConfirm?.(dictionary);

            setState(initialState);
        }
    }

    const handleAddClick = () => {
        setState({
            ...state,
            isInAddingState: true
        });
    }

    return !state.isInAddingState ?
        <button onClick={handleAddClick}>+ Add</button> :
        <div>
            <textarea
                autoFocus
                className={classNames({
                    [s.textarea]: true,
                    [s.textarea_error]: state.isError,
                })}
                value={state.value}
                onChange={handleChange}
            />
            <button onClick={handleConfirmClick}>Confirm</button>
        </div>
    ;
}

export default NewBlockEditor;
