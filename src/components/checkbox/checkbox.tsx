import React, {InputHTMLAttributes, useEffect, useRef} from 'react';

interface IProps {
    indeterminate?: boolean,
}

function Checkbox({ indeterminate = false, checked, ...props }: IProps & InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement | null>(null);

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
    />;
}

export default Checkbox;