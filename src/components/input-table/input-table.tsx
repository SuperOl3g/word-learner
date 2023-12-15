import {ChangeEvent, ClipboardEvent, FocusEvent, SyntheticEvent, useCallback, useRef} from "react";
import s from './input-table.module.css';
import Input from "../input/input";

interface IProps {
    value?: Array<[string,string]>,

    onChange?: (_: null, obj: {value?: Array<[string,string]>}) => void,
}

const wordPlaceholder = 'Word';
const translationPlaceholder = 'Translation';

const copyVal = (val?: Array<[string, string]>) => val?.map(row => [...row]) as Array<[string, string]>;

function InputTable({ value, onChange }: IProps) {
    const len = value?.length || 0;
    const focusedElemIndex = useRef<string | null>('0.0');
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newArr = copyVal(value) || [];

        const { name, value: newVal } = e.target;
        const [i,j] = name.split('.');

        if (name === `${len}.0`) {
            newArr.push([newVal, '']);
        } else if (name === `${len}.1`) {
            newArr.push(['', newVal]);
        } else {
            newArr[+i][+j] = newVal;
        }

        onChange?.(null, { value: newArr });
    }, [len, onChange, value]);

    const handleRowRemove = useCallback((e:SyntheticEvent<HTMLButtonElement>) => {
        const newArr = copyVal(value) || [];
        const { index } = e.currentTarget.dataset;
        if (index) {
            delete newArr[+index];
        }
        onChange?.(null, { value: newArr });
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

    const handlePaste = useCallback( (e: ClipboardEvent) => {
        const data = e.clipboardData.getData('text');
        const isMultiRowDate = data.indexOf('\n') !== -1;

        if (!isMultiRowDate) {
            return
        }

        e.preventDefault();
        const newArr = copyVal(value) || [];

        data.split('\n').forEach(row => {
            const i = row.indexOf('-');


            newArr.push(i === -1 ?
                [row.trim(), ''] :
                [row.slice(0,i).trim(), row.slice(i+1).trim()]
            );
        });

        onChange?.(null, { value: newArr });
    }, [onChange, value])


    return <div>
        {value?.map((row,i) =>
            <div key={i} className={s.row}>
                {row.map((cell, j) =>
                    <Input
                        inGroup={j ? 'last' : 'first'}
                        inVerticalGroup={i ? 'middle' : 'first'}
                        key={`${i}.${j}`}
                        ref={`${i}.${j}` === focusedElemIndex.current ? handleInputRef : undefined}
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
            <Input
                inGroup='first'
                inVerticalGroup={len ? 'last' : undefined}
                key={`${len}.0`}
                name={`${len}.0`}
                ref={`${len}.${0}` === focusedElemIndex.current ? handleInputRef : undefined}
                value=''
                placeholder={wordPlaceholder}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onPaste={handlePaste}
            />
            <Input
                inGroup='last'
                inVerticalGroup={len ? 'last' : undefined}
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