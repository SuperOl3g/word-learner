import {useCallback, useState} from "react";
import {IDictionary} from "../../types";

const ACTIVE_WORDS_PULL_SIZE = 25;
const KNOWING_CORRECT_REPEATS_THRESHOLD = 4;
const KNOWING_DURATION = 30 * 24 * 60 * 60;
const KNOWN_WORD_ADDING_PROBABILITY = 0.125 ;

const REVERSE_EX_PROBABILITY = 0.2;

const getNewWord = (words: IDictionary, pull: Array<string>) => {
    const knownWords: Array<string> = [];
    const outdatedKnownWords: Array<string> = [];
    const startedWords: Array<string> = [];
    const notStartedWords: Array<string> = [];

    Object.keys(words).forEach((word => {
        if (pull.indexOf(word) !== - 1) {
            return;
        }

        const { lastAsked, correctAnswersStreak } = words[word];
        let arr;

        if (correctAnswersStreak && correctAnswersStreak > KNOWING_CORRECT_REPEATS_THRESHOLD) {
            arr = lastAsked && (Math.floor((Date.now() - lastAsked) / 1000) < KNOWING_DURATION) ?
                knownWords : outdatedKnownWords;
        } else if (correctAnswersStreak) {
            arr = startedWords;
        } else {
            arr = notStartedWords;
        }

        arr.push(word);
    }));

    let arr;
    if (Math.random() < KNOWN_WORD_ADDING_PROBABILITY) {
        arr = outdatedKnownWords.length ? outdatedKnownWords : knownWords;
    } else {
        arr = startedWords.length ? startedWords : notStartedWords;
    }

    return arr[Math.round(Math.random() * (arr.length - 1))];
};

const createWordsPull = (words: IDictionary) => {
    const keys = Object.keys(words);

    if (keys.length <= ACTIVE_WORDS_PULL_SIZE) {
        return keys;
    }

    let newPull: Array<string> = [];

    while (newPull.length < ACTIVE_WORDS_PULL_SIZE) {
        newPull.push(getNewWord(words, newPull));
    }
    return newPull;
};

const getNewWordFromPull = (words: IDictionary, pull: Array<string>, currentWord?: string) => {
    let newWord;
    // TODO: подумать, как обойтись без цикла
    do {
        newWord = pull[Math.round(Math.random() * (pull.length - 1))];
    } while (newWord === currentWord);

    const isLast = words[newWord]?.correctAnswersStreak === KNOWING_CORRECT_REPEATS_THRESHOLD - 1;

    return {
        newWord,
        isReversedEx: isLast || Math.random() < REVERSE_EX_PROBABILITY,
        isTypingEx: isLast,
    };
}

export const useWordsPull = (words: IDictionary) => {
    const [wordPull, setWordPull] = useState(createWordsPull(words));
    const [{newWord,isReversedEx, isTypingEx}, setNewWord] =
        useState(getNewWordFromPull(words, wordPull));

    const fn = useCallback(() => setNewWord(getNewWordFromPull(words, wordPull, newWord)),
        [newWord, wordPull, words]);

    return {
        ex: {newWord, isReversedEx, isTypingEx},
        setNewWord: fn,
    };
};