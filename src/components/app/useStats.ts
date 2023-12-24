import {useCallback, useEffect, useState} from "react";
import {FileStorage} from "../../utils/flieStorage";

const STAT_STORAGE_KEY = '__ex_stats';

export interface IStatState {
    [date: string]: {
        pos: number,
        learned: number,
        total: number,
    }
}


export const useStats = () => {
    const [isLoading, setLoading] = useState(true);
    const [stats, setStats] =
        useState<IStatState>({});

    useEffect(() => {
        (async() => {
            let isError = false;
            if (!FileStorage.isInited()) {
                isError = await FileStorage.init();
            }
            if (!isError) {
                const data = FileStorage.get<IStatState>(STAT_STORAGE_KEY);

                if (!data) {
                    return;
                }

                setStats(data);
                setLoading(false);
            }
        })();
    }, []);

    const updateStats = useCallback((isPositive: boolean, isLearned: boolean) => {
        const key = new Date(new Date().toDateString()).valueOf();
        const newStats = {
            ...stats,
            [key]: {
                pos: (stats[key]?.pos || 0) + (isPositive ? 1 : 0),
                learned: (stats[key]?.learned || 0) + (isLearned ? 1 : 0),
                total: (stats[key]?.total || 0) + 1,
            }
        };

        setStats(newStats);
        FileStorage.set(STAT_STORAGE_KEY, newStats);
    }, [stats]);


    return { isStatLoading: isLoading, stats, updateStats };
}