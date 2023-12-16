import React, {KeyboardEvent, useCallback, useRef, useState} from "react";
import Input from "../../../components/input/input";
import s from './exercise-input.module.css';
import Button from "../../../components/button/button";

interface IProps {
    autoFocus?: boolean,
    checkVal: string,

    onConfirm?: (isCorrect: boolean) => void,
    onSkip?: () => void,
}

const normalize = (str?: string) => str?.trim().toLowerCase();

const ExerciseInput = ({
    autoFocus,
    checkVal,
    onConfirm,
    onSkip,
}: IProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isError, setIsErrorState] = useState(false);

    const handleConfirm = useCallback(() => {
        const isCorrect = normalize(inputRef.current?.value) === normalize(checkVal);

        if (!isCorrect) {
            setIsErrorState(true);
        }

        onConfirm?.(isCorrect);
    }, [checkVal, onConfirm]);

    const handleInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            // Dunno understand why, but somehow input enter click manage to trigger next rendered "Check" button click
            e.preventDefault();
            handleConfirm?.();
        }
    }, [handleConfirm]);

    const handleChange = useCallback(() => {
        setIsErrorState(false);
    }, []);

    return <div className={s.block}>
        <div className={s.container}>
            <Input
                autoFocus={autoFocus}
                ref={inputRef}
                onKeyDown={handleInputKeyDown}
                onChange={handleChange}
                // placeholder='Answer'
            />
            {isError ? <div className={s.tip}>
                {normalize(inputRef.current?.value)?.split('').map((letter, i) =>
                    normalize(checkVal[i]) === letter ?
                        letter :
                        <span
                            key={i}
                            className={s.wrongLetter}
                        >
                            {letter}
                        </span>
                )}
            </div> : null}
            &nbsp;
            <Button onClick={handleConfirm}>Check</Button>
            &nbsp;
            <Button onClick={onSkip}>Skip</Button>
        </div>
        <div className={s.inputError}>
            {isError ? 'This is wrong, please try again' : null}
        </div>
    </div>
};

export default ExerciseInput;