import {useCallback, useEffect, useState} from "react";
import {IDictionary} from "../../types";
import {FileStorage} from "../../utils/flieStorage";

const WORD_LISTS_STORAGE_KEY = '__wordLists';

export const useDictionary = () => {
    const [isLoading, setLoading] = useState(true);
    const [wordLists, setWordLists] =
        useState<{ [key: string]: IDictionary }>({});

    useEffect(() => {
        (async() => {
            let isError = false;
            if (!FileStorage.isInited()) {
                isError = await FileStorage.init();
            }
            if (!isError) {
                const list = FileStorage.get<{ [key: string]: IDictionary }>(WORD_LISTS_STORAGE_KEY);

                if (!list) {
                    return;
                }

                setWordLists(list);
                setLoading(false);
            }
        })();
    }, []);

    const addWordList = useCallback((list: IDictionary) => {
        if (!Object.keys(list)?.length) {
            return;
        }

        const newLists = {
            ...wordLists,
            [Date.now()]: list,
        };

        setWordLists(newLists);
        FileStorage.set(WORD_LISTS_STORAGE_KEY, newLists);
    }, [wordLists]);

    const removeWordList = useCallback((listKey: string)  => {
        const newLists = { ...wordLists };
        delete newLists[listKey];

        setWordLists(newLists)

        FileStorage.set(WORD_LISTS_STORAGE_KEY, newLists);
    }, [wordLists]);


    const updateWordList = useCallback((dict: IDictionary, key: string)  => {
        const newLists = { ...wordLists };

        newLists[key] = dict;
        setWordLists(newLists);
        FileStorage.set(WORD_LISTS_STORAGE_KEY, newLists);
    }, [wordLists]);

    const updateWordStat = useCallback((listKey: string, word: string, isPositive: boolean) => {
        const newLists = {
            ...wordLists,
            [listKey]: {
                ...wordLists[listKey],
                [word]: {
                    ...wordLists[listKey][word],
                    correctAnswersStreak: isPositive ? (( wordLists[listKey][word]?.correctAnswersStreak || 0) + 1) : 0,
                    lastAsked: Date.now(),
                }
            }
        }

        setWordLists(newLists)

        FileStorage.set(WORD_LISTS_STORAGE_KEY, newLists);
    }, [wordLists]);


    return {
        wordLists,
        isWordListLoading: isLoading,
        addWordList,
        removeWordList,
        updateWordList,
        updateWordStat
    };
}