import React, {KeyboardEvent, InputHTMLAttributes, useCallback, useEffect, useRef, SyntheticEvent} from 'react';

interface IProps {
    indeterminate?: boolean,

    onClick?: (e: SyntheticEvent<HTMLInputElement>) => void,
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void,
}

function Checkbox({ indeterminate = false, checked, onClick, onKeyDown, ...props }: IProps & InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            onClick?.(e);
        }
        onKeyDown?.(e);
    }, [onClick, onKeyDown]);

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate && !checked;
        }
    }, [ref, checked, indeterminate]);

    return <input
        {...props}
        ref={ref}
        checked={checked}
        type="checkbox"
        onKeyDown={handleKeyDown}
        onClick={onClick}
    />;
}

export default Checkbox;