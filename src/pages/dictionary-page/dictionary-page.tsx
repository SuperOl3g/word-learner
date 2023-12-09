import React, {ChangeEvent, Fragment, useState} from 'react';
import s from './dictionary-page.module.css';
import NewBlockEditor from "../../components/new-block-editor/new-block-editor";
import {formatDate} from "../../utils";

interface IProps {
    dictionaries: {
        [key: string]: {
            [key: string]: string
        }
    },

    onDictionaryAdd: (dict: {
        [key: string]: string
    }) => void,

    onDictionaryRemove: (key: string) => void,
}

const MAX_WORD_COUNT = 10;

interface IState {
    isInSelectState: boolean,
    selectedKeys: {[key: string]: boolean},
}

function DictionaryPage({
    dictionaries,
    onDictionaryAdd,
    onDictionaryRemove,
}: IProps) {
    const [{isInSelectState, selectedKeys }, setState] = useState<IState>({
        isInSelectState: false,
        selectedKeys: {},
    });

    const handleBlockSelectionToggle = (e: ChangeEvent<{ name: string }>) => {
        const key = e.target.name;
        const newSelectedKeys = { ...selectedKeys };

        newSelectedKeys[key] = !newSelectedKeys[key];

        setState({
           isInSelectState,
           selectedKeys: newSelectedKeys,
        });
    };

    const handleLearnBtnClick = () => {
        const selectedKeys: {[key: string]: boolean} = {};

        Object.keys(dictionaries).forEach(key => {
            selectedKeys[key] = true;
        });

        setState({
            isInSelectState: true,
            selectedKeys,
        });
    }

    return (
        <div>
            <div className={s.learnBlock}>
                {isInSelectState ? <Fragment>
                    {Object.keys(selectedKeys).filter(k => selectedKeys[k]).length} / {Object.keys(dictionaries).length}
                    &nbsp;&nbsp;
                    <button onClick={() => {}}>
                        Let's roll!
                    </button>
                </Fragment> :
                <button
                    className={s.learnButton}
                    onClick={handleLearnBtnClick}
                >Learn!</button>}
            </div>
            <div className={s.blocksContainer}>
                {Object.keys(dictionaries).map(key => {
                    const keys = Object.keys(dictionaries[key]);

                    return (
                        <div className={s.block} key={key}>
                            {isInSelectState ? <input
                                type='checkbox'
                                name={key}
                                className={s.checkbox}
                                checked={!!selectedKeys[key]}
                                onChange={handleBlockSelectionToggle}
                            /> : null}

                            <div className={s.blockTitle}>{formatDate(new Date(+key))}</div>

                            <div>
                                <button
                                    className={s.crossButton}
                                    onClick={() => onDictionaryRemove(key)}
                                >x
                                </button>

                                {keys.slice(0, MAX_WORD_COUNT)
                                    .map(word => <div><b>{word}</b> - {dictionaries[key][word]}</div>)}
                                {keys.length > MAX_WORD_COUNT ?
                                    <div><br/>... and {keys.length - MAX_WORD_COUNT} more</div>
                                    : ''}
                            </div>
                        </div>);
                })}
                <div className={s.block}>
                    <NewBlockEditor onConfirm={onDictionaryAdd}/>
                </div>
            </div>
        </div>

    );
}

export default DictionaryPage;
