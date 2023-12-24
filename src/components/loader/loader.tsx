import s from './loader.module.css';
import classNames from "classnames";

interface IProps {
    overlay?: boolean,
    size?: 'xl',
}

const Loader = ({ overlay, size }: IProps) => {
    const loader = <div className={classNames({
        [s.svgWrapper]: true,
        [s[`svgWrapper_size_${size}`]]: size,
    })}>
        <svg
            viewBox='0 0 100 100'
            className={s.svg}
        >
            <circle
                fill='none'
                className={s.circle}
                stroke='currentColor'
                cx='50'
                cy='50'
                r='44'
            />
        </svg>
    </div>;

    return overlay ? <div className={s.overlay}>{loader}</div> : loader;
}

export default Loader;