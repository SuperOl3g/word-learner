import React, {
    KeyboardEvent,
    FocusEvent,
    SyntheticEvent,
    useCallback,
    useRef,
    ReactNode,
    useMemo,
    useEffect
} from "react";
import s from './popup.module.css';
import {blockBodyScroll, restoreBodyScroll} from "../../utils/bodyScroll";

interface IProps {
    children?: ReactNode,
    opened?: boolean,

    onClose?: () => void,
}

const getInnerFocusableElems = (container: HTMLElement) =>
    container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')

const arePropsEqual = (oldProps: IProps, nextProps: IProps) => !nextProps.opened && oldProps.opened === nextProps.opened;

const Popup = React.memo(({ children, opened, onClose }:IProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const prevFocusedElem = useRef<HTMLElement | null>(null);

    useMemo(() => {
        if (opened) {
            prevFocusedElem.current = document.activeElement as HTMLElement;

            blockBodyScroll();
        } else {
            prevFocusedElem.current?.focus();
            prevFocusedElem.current = null;

            restoreBodyScroll();
        }
    }, [opened]);

    // Needs to restore scroll if the component unmounted in opened state
    useEffect(() => () => {
        if (opened) {
            restoreBodyScroll();
        }
    }, [opened]);

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
}, arePropsEqual);

export default Popup