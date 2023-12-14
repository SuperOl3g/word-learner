import React, {HTMLAttributes, MouseEvent, ReactNode, SyntheticEvent, useCallback, useEffect, useRef} from 'react';
import classNames from "classnames";
import s from './clickable.module.css';

interface IProps {
    children: ReactNode,

    onClick?: (e: SyntheticEvent<HTMLElement>) => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void,
}

function Clickable({
    children,
    className,
    onKeyDown,
    onClick,
    onMouseDown,
    ...props
}: IProps & Omit<HTMLAttributes<HTMLElement>, 'tabIndex' | 'onClick'>) {
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

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>)=> {
        if ((e.code === 'Enter' || e.code === 'Space') && e.target === e.currentTarget) {
            onClick?.(e);
        }
        onKeyDown?.(e);
    }, [onClick, onKeyDown]);

    const handleMouseDown = useCallback((e: MouseEvent<HTMLElement>) => {
        // Prevents text selection after double clicking
        if (e.detail === 2) {
           e.preventDefault();
        }

        onMouseDown?.(e);
    }, [onMouseDown]);

    return <div
        {...props}
        ref={handleRef}
        className={classNames(s.container, className)}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
    >
        {children}
    </div>;
}

export default Clickable