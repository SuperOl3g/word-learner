import {useCallback, useState} from "react";
import {IDictionary} from "../../types";

const ACTIVE_WORDS_PULL_SIZE = 25;
export const KNOWING_CORRECT_REPEATS_THRESHOLD = 4;
const KNOWING_DURATION = 30 * 24 * 60 * 60;
const KNOWN_WORD_ADDING_PROBABILITY = 0.125 ;

const REVERSE_EX_PROBABILITY = 0.2;

const getNewWords = (wordsCount: number, wordLists: { [key: string]: IDictionary }, curListKeys: Array<string>, pull: Array<string>) => {
    const knownWords: Array<string> = [];
    const outdatedKnownWords: Array<string> = [];
    const startedWords: Array<string> = [];
    const notStartedWords: Array<string> = [];
    let sumLen = 0;

    curListKeys.forEach(listKey => {
        Object.keys(wordLists[listKey]).forEach((word => {
            if (pull.indexOf(word) !== - 1) {
                return;
            }

            const { lastAsked, correctAnswersStreak } = wordLists[listKey][word];
            let arr;

            if (correctAnswersStreak && correctAnswersStreak > KNOWING_CORRECT_REPEATS_THRESHOLD) {
                arr = lastAsked && (Math.floor((Date.now() - lastAsked) / 1000) < KNOWING_DURATION) ?
                    knownWords : outdatedKnownWords;
            } else if (correctAnswersStreak) {
                arr = startedWords;
            } else {
                arr = notStartedWords;
            }

            arr.push(`${listKey}.${word}`);
            sumLen++;
        }));
    })

    const result: Array<string> = [];

    while (result.length < Math.min(wordsCount, sumLen)) {
        let arr;
        if (Math.random() < KNOWN_WORD_ADDING_PROBABILITY && (outdatedKnownWords.length || knownWords.length)) {
            arr = outdatedKnownWords.length ? outdatedKnownWords : knownWords;
        } else {
            arr = startedWords.length ? startedWords : notStartedWords;
        }

        const i = Math.round(Math.random() * (arr.length - 1));
        result.push(arr[i]);
        arr.splice(i, 1);
    }

    return result;
};

const getNewWordFromPull = (wordLists: { [key: string]: IDictionary }, pull: Array<string>, curWord?: string) => {
    let newWord, newList;
    // TODO: подумать, как обойтись без цикла

    do {
        const key = pull[Math.round(Math.random() * (pull.length - 1))];
        const dotIndex = key.indexOf('.');
        newList = key.slice(0, dotIndex);
        newWord = key.slice(dotIndex + 1);
    } while (newWord === curWord && pull.length !== 1);

    const isLast = wordLists[newList][newWord]?.correctAnswersStreak === KNOWING_CORRECT_REPEATS_THRESHOLD - 1;

    return {
        newList,
        newWord,
        isReversedEx: isLast || Math.random() < REVERSE_EX_PROBABILITY,
        isTypingEx: isLast,
    };
}

export const useWordsPull = (wordLists: { [key: string]: IDictionary }, curListKeys: Array<string>) => {
    const [wordPull, setWordPull] = useState(getNewWords(ACTIVE_WORDS_PULL_SIZE, wordLists, curListKeys, []));
    const [{newWord, newList, isReversedEx, isTypingEx}, setNewWord] =
        useState(getNewWordFromPull(wordLists, wordPull));

    const fn = useCallback(() => setNewWord(getNewWordFromPull(wordLists, wordPull, newWord)),
        [newWord, wordPull, wordLists]);

    return {
        ex: {
            curList: newList,
            curWord: newWord,
            isReversedEx,
            isTypingEx
        },
        setNewWord: fn,
    };
};