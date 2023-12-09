import React, {useState} from 'react';
import s from './exercise-page.module.css';

interface IProps {
    words: { [key: string]: string },
}

function ExercisePage({ words }: IProps) {
    const keys = Object.keys(words);
    const [counter, setCounter] = useState(1);
    const [currentWord, setNewWord] =
        useState(keys[Math.round(Math.random() * keys.length)]);

    return <div className={s.container}>
        <div className={s.counter}>{counter}</div>
        Total: {keys.length}
        <br/>
        {currentWord}
    </div>;
}

export default ExercisePage;