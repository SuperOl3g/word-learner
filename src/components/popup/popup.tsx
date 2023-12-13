import s from './popup.module.css';
import {SyntheticEvent, useCallback} from "react";

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

    return opened ? <div className={s.overlay} onClick={handleLayoutClick}>
        <div className={s.container}>
            <button className={s.closeButton} onClick={onClose}>x</button>
            {children}
        </div>
    </div> : null;
}

export default Popup