import {ButtonHTMLAttributes, ReactNode} from "react";
import s from './button.module.css';
import classNames from "classnames";

interface IProps {
    children: ReactNode,
    size?: string,
}

function Button({ children, size, ...props }: IProps & Omit<ButtonHTMLAttributes<Element>, 'className'>) {
    return <button
        {...props}
        className={classNames({
            [s.button]: true,
            [s[`button_size_${size}`]]: size,
        })}
    >
        {children}
    </button>;
}

export default Button;