import {useCallback, useState} from "react";
import {LocalStorage} from "./localStorage";

const toSpeak = new SpeechSynthesisUtterance();

const LS_SOUND_SETTING_KEY = '__sound_setting';
window.addEventListener('beforeunload',() => window.speechSynthesis.cancel());
toSpeak.rate = 1.1;

export const useSpeaker = () => {
    const [soundSetting, setSoundSetting] =
        useState(LocalStorage.get<boolean>(LS_SOUND_SETTING_KEY) ?? true);

    const speak = useCallback((text: string) => {
        if (!soundSetting) {
            return;
        }
        toSpeak.text = text;

        window.speechSynthesis.speak( toSpeak );
    }, [soundSetting]);

    const toggleSoundSetting = useCallback(() => {
        const newVal = !soundSetting

        setSoundSetting(newVal);
        LocalStorage.set(LS_SOUND_SETTING_KEY, newVal);
    }, []);

    return { soundSetting, toggleSoundSetting, speak };
}
