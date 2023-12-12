import React, {useCallback, useState} from "react";
import s from './stats.module.css';
import {IStatState} from "../app/useStats";

interface IProps {
    stats: IStatState
}

function Stats({ stats }: IProps) {
    const [isOpened, setOpened] = useState(false);

    const handleToggleClick = useCallback(() => {
        setOpened(!isOpened);
    }, [isOpened]);

    const content = Object.keys(stats)
        .sort((a,b) => a < b ? 1 : -1)
        .map(key =>
        <tr key={key}>
            <td>{(new Date(+key)).toLocaleDateString()}</td>
            <td>{Math.round(stats[key].pos / stats[key].total * 10000) / 100}%</td>
            <td>{stats[key].total}</td>
            <td>{stats[key].learned}</td>
        </tr>
    );

    return <div className={s.container}>
        {isOpened ?
            <div className={s.tableContainer}>
                <table className={s.table}>
                    <thead>
                        <tr className={s.tableHeader}>
                            <td>Date</td>
                            <td>Correct</td>
                            <td>Total</td>
                            <td>Learned</td>
                        </tr>
                    </thead>
                    {content.length ? content : <div className={s.placeholder}>No data</div>}
                </table>
            </div>: null
        }
        <button onClick={handleToggleClick}>Stats</button>
    </div>;
}

export default Stats;