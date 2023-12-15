import {ReactNode, useCallback, useRef, useState} from "react";
import s from './tooltip.module.css';

interface IProps {
    content: ReactNode,
    children: ReactNode,
    hoverDelay?: number,
}

function Tooltip({children, content, hoverDelay = 400}: IProps) {
    const timerRef = useRef<NodeJS.Timer>();
    const [isOpened, setOpened] = useState(false);

    const handleFocus = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setOpened(true);
        }, hoverDelay);
    }, [hoverDelay]);

    const handleBlur = useCallback(() => {
        clearTimeout(timerRef.current);
        setOpened(false);
    }, []);

    return <div className={s.container}>
        {isOpened ? <div className={s.tooltip}>{content}</div> : null}
        <div
            onMouseEnter={handleFocus}
            onMouseLeave={handleBlur}
        >
            {children}
        </div>
    </div>;
}

export default Tooltip;