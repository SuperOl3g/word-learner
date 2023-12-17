// TODO: add correct handling of possible parse errors
export const LocalStorage = {
    get: <T = any>(key: string) => {
        const val= localStorage.getItem(key);

        return val  ? (JSON.parse(val) as T) : undefined;
    },
    set: (key: string, val: any) => {
        const v = JSON.stringify(val);

        localStorage.setItem(key, v);
    },
    remove: (key: string) => {
        localStorage.removeItem(key);
    }
};