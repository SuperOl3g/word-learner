import {KeyboardEvent, FocusEvent, SyntheticEvent, useCallback, useRef} from "react";
import s from './popup.module.css';

interface IProps {
    children?: React.ReactNode,
    opened?: boolean,

    onClose?: () => void,
}

const getInnerFocusableElems = (container: HTMLElement) =>
    container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')

function Popup({ children, opened, onClose }:IProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleFocusOnBeforeElement = useCallback((event: FocusEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (!containerRef.current) {
            return;
        }
        const focusable = getInnerFocusableElems(containerRef.current)
        focusable[focusable.length - 1]?.focus();
    }, []);

    const handleFocusOnAfterElement = useCallback((event: FocusEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (!containerRef.current) {
            return;
        }
        const focusable = getInnerFocusableElems(containerRef.current)
        focusable[0]?.focus();
    }, []);


    const handleLayoutClick = useCallback((e: SyntheticEvent) => {
        if (e.target === e.currentTarget) {
           onClose?.();
        }
    }, [onClose]);

    const handleKeyDown = useCallback((e:KeyboardEvent) => {
        if (e.code === 'Escape') {
            onClose?.();
        }
    }, [onClose]);

    const handleRef = useCallback((elem: HTMLDivElement | null) => {
        // Focusing on container only if there is no already focused elem inside the popup
        if (elem && !elem.querySelector('*:focus')) {
            elem.focus();
        }

        containerRef.current = elem;
    }, []);

    return opened ? <div
        className={s.overlay}
        onClick={handleLayoutClick}
        onKeyDown={handleKeyDown}
    >
        <div
            tabIndex={0}
            onFocus={handleFocusOnBeforeElement}
        />
        <div
            className={s.container}
            tabIndex={-1}
            ref={handleRef}
        >
            <button className={s.closeButton} onClick={onClose}>x</button>
            {children}
        </div>
        <div
            tabIndex={0}
            onFocus={handleFocusOnAfterElement}
        />
    </div> : null;
}

export default Popup