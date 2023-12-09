import React, {useCallback, useState} from "react";
import s from './stats.module.css';
import {IStatState} from "../app/app";

interface IProps {
    stats: IStatState
}

function Stats({ stats }: IProps) {
    const [isOpened, setOpened] = useState(false);

    const handleToggleClick = useCallback(() => {
        setOpened(!isOpened);
    }, [isOpened]);

    const content = Object.keys(stats).map(key =>
        <tr key={key}>
            <td>{(new Date(+key)).toLocaleDateString()}</td>
            <td>{Math.round(stats[key].pos / stats[key].total * 10000) / 100}%</td>
            <td>{stats[key].total}</td>
        </tr>
    );

    return <div className={s.container}>
        {isOpened ?
            <table className={s.table}>
                <thead>
                    <td>Date</td>
                    <td>Correct</td>
                    <td>Total</td>
                </thead>
                {content.length ? content : <div className={s.placeholder}>No data</div>}
            </table> : null
        }
        <button onClick={handleToggleClick}>Stats</button>
    </div>;
}

export default Stats;