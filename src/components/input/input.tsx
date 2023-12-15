import {forwardRef, InputHTMLAttributes} from "react";
import s from './input.module.css';
import classNames from "classnames";

type IProps = Omit<InputHTMLAttributes<Element>, 'type' | 'className'> & {
    inGroup?: 'first' | 'middle' | 'last',
    inVerticalGroup?: 'first' | 'middle' | 'last',
};

const Input = forwardRef<HTMLInputElement, IProps>(({
    inGroup,
    inVerticalGroup,
    ...props
}: IProps, ref) =>  {
    return <input
        {...props}
        ref={ref}
        type="text"
        className={classNames({
            [s.input]: true,
            [s[`input_inGroup_${inGroup}`]]: inGroup,
            [s[`input_inVerticalGroup_${inVerticalGroup}`]]: inVerticalGroup,
        })}
        autoComplete='off'
    />
});

export default Input;