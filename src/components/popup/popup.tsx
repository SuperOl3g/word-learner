import s from './popup.module.css';
import {KeyboardEvent, SyntheticEvent, useCallback} from "react";

interface IProps {
    children?: React.ReactNode,
    opened?: boolean,

    onClose?: () => void,
}

function Popup({ children, opened, onClose }:IProps) {
    const handleLayoutClick = useCallback((e: SyntheticEvent) => {
        if (e.target === e.currentTarget) {
           onClose?.();
        }
    }, [onClose]);

    const handleKeyDown = useCallback((e:KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose?.();
        }
    }, [onClose]);

    return opened ? <div
        className={s.overlay}
        onClick={handleLayoutClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
    >
        <div className={s.container}>
            <button className={s.closeButton} onClick={onClose}>x</button>
            {children}
        </div>
    </div> : null;
}

export default Popup