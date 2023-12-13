import {ChangeEvent, FocusEvent, SyntheticEvent, useCallback, useEffect, useRef} from "react";
import s from './input-table.module.css';

interface IProps {
    value?: Array<[string,string]>,

    onChange?: (_: null, obj: {value?: Array<[string,string]>}) => void,
}

const wordPlaceholder = 'Word';
const translationPlaceholder = 'Translation';

function InputTable({ value, onChange }: IProps) {
    const len = value?.length || 0;
    const focusedElemIndex = useRef<string | null>(null);
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const arr = (value?.map(row => [...row]) as Array<[string, string]>) || [];

        const { name, value: newVal } = e.target;
        const [i,j] = name.split('.');

        if (name === `${len}.0`) {
            arr.push([newVal, '']);
        } else if (name === `${len}.1`) {
            arr.push(['', newVal]);
        } else {
            arr[+i][+j] = newVal;
        }

        onChange?.(null, { value: arr });
    }, [len, onChange, value]);

    const handleRowRemove = useCallback((e:SyntheticEvent<HTMLButtonElement>) => {
        const arr = (value?.map(row => [...row]) as Array<[string, string]>) || [];
        const { index } = e.currentTarget.dataset;
        if (index) {
            delete arr[+index];
        }
        onChange?.(null, { value: arr });
    }, [value, onChange]);

    const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
        focusedElemIndex.current = e.currentTarget.name;
    },[]);

    const handleBlur = useCallback((e: FocusEvent) => {
        focusedElemIndex.current = null;
    },[]);

    // Allows to save focus after adding new row
    const handleInputRef = useCallback((elem: HTMLInputElement | null) => {
        elem?.focus();
    }, []);


    return <div>
        {value?.map((row,i) =>
            <div key={i} className={s.row}>
                {row.map((cell, j) =>
                    <input
                        ref={`${i}.${j}` === focusedElemIndex.current ? handleInputRef : undefined}
                        className={s.input}
                        type="text"
                        key={`${i}.${j}`}
                        name={`${i}.${j}`}
                        value={cell}
                        placeholder={j === 0 ? wordPlaceholder : translationPlaceholder}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                )}
                <button
                    data-index={i}
                    className={s.removeButton}
                    onClick={handleRowRemove}
                >x
                </button>
            </div>
        )}
        <div key={len} className={s.row}>
            <input
                className={s.input}
                type="text"
                key={`${len}.0`}
                name={`${len}.0`}
                placeholder={wordPlaceholder}
                value=''
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <input
                className={s.input}
                type="text"
                key={`${len}.1`}
                name={`${len}.1`}
                value=''
                placeholder={translationPlaceholder}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    </div>;
}

export default InputTable;