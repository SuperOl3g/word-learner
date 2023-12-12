import {useCallback, useState} from "react";
import {IDictionary} from "../../types";
import {LS, mapObj} from "../../utils";

const LS_WORD_LISTS_KEY = '__wordLists';

export const useDictionary = () => {
    const [wordLists, setWordLists] =
        useState<{ [key: string]: IDictionary }>(LS.get(LS_WORD_LISTS_KEY) || {});


    const addWordList = useCallback((list: { [key: string]: string }) => {
        if (!Object.keys(list)?.length) {
            return;
        }

        const newLists = {
            ...wordLists,
            [Date.now()]: mapObj(list, (val) => ({
                definition: val
            })),
        };

        setWordLists(newLists);
        LS.set(LS_WORD_LISTS_KEY, newLists);
    }, [wordLists]);

    const removeWordList = useCallback((listKey: string)  => {
        const newLists = { ...wordLists };
        delete newLists[listKey];

        setWordLists(newLists)

        LS.set(LS_WORD_LISTS_KEY, newLists);
    }, [wordLists]);


    return { wordLists, addWordList, removeWordList};
}