import React, {ChangeEvent, Fragment, useCallback, useState} from 'react';
import classNames from 'classnames';
import s from './new-word-list-edtior.module.css';

interface IProps {
    onConfirm?: (dict:{[key: string]: string}) => void
}

function NewWordListEditor({ onConfirm }: IProps) {
    const [value, setValue] = useState('');
    const [isInAddingState, setAddingState] = useState(false);
    const [isError, setErrorState] = useState(false);

    const handleChange = useCallback((e: ChangeEvent<{ value: string, name: string }>) => {
        setValue(e.target.value);
    }, []);

    const handleConfirmClick = useCallback(() => {
        const wordList: { [key: string]: string } = {};

        const isError = value
            .split('\n')
            .find(val => {
                const [word, meaning] = val.split('-');

                // TODO: needs better validation
                if (!meaning) {
                    return true;
                }
                wordList[word.trim()] = meaning.trim();
            });

        if (isError) {
            setErrorState(true);
        } else {
            onConfirm?.(wordList);

            setAddingState(false);
            setValue('');
            setErrorState(false);
        }
    }, [onConfirm, value]);

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

export default NewWordListEditor;
