import {useCallback, useState} from "react";
import {LS} from "../../utils";

const LS_STAT_KEY = '__ex_stats';

export interface IStatState {
    [date: string]: { pos: number, total: number }
}


export const useStats = () => {
    const [stats, setStats] =
        useState<IStatState>(LS.get<IStatState>(LS_STAT_KEY) || {});

    const updateStats = useCallback((isPositive: boolean) => {
        const key = new Date(new Date().toDateString()).valueOf();
        const newStats = {
            ...stats,
            [key]: {
                pos: (stats[key]?.pos || 0) + (isPositive ? 1 : 0),
                total: (stats[key]?.total || 0) + 1,
            }
        };

        setStats(newStats);
        LS.set(LS_STAT_KEY, newStats);
    }, [stats]);


    return { stats, updateStats };
}