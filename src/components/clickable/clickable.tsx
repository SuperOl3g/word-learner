import React, {HTMLAttributes, ReactNode, useCallback, useEffect, useRef} from 'react';
import classNames from "classnames";
import s from './clickable.module.css';

interface IProps {
    children: ReactNode,

    onClick?: () => void,
    onKeyDown?: () => void,
}

function Clickable({children, className, onKeyDown, onClick, ...props}: IProps & Omit<HTMLAttributes<HTMLDivElement>, 'tabIndex' | 'onClick'>) {
    // By some reason React way of adding handler doesn't prevent page scrolling
    const handler = (e:KeyboardEvent) => {
        if (e.code === 'Space' && e.target === elRef.current && onClick) {
            e.preventDefault();
        }
    };

    const elRef = useRef<HTMLDivElement|null>(null);
    const handlerRef = useRef(handler);

    // As the handler references to old values of props, we need to update it on the prop val update
    useEffect(() => {
        elRef.current?.removeEventListener('keydown', handlerRef.current);
        handlerRef.current = handler;
        elRef.current?.addEventListener('keydown', handlerRef.current);
    }, [onClick]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRef = useCallback((el: HTMLDivElement) => {
        if (el) {
            el.addEventListener('keydown', handlerRef.current);
        } else {
            elRef.current?.removeEventListener('keydown', handlerRef.current);
        }

        elRef.current = el;
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent)=> {
        if ((e.code === 'Enter' || e.code === 'Space') && e.target === e.currentTarget) {
            onClick?.();
        }
        onKeyDown?.();
    }, [onClick, onKeyDown]);

    return <div
        {...props}
        ref={handleRef}
        className={classNames(s.container, className)}
        tabIndex={0}
        onClick={onClick}
        onKeyUp={handleKeyDown}
    >
        {children}
    </div>;
}

export default Clickable