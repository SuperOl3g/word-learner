export function formatDate (date: Date): string {
    return date.toLocaleString();
}

// TODO: add correct handling of possible parse errors
export const LS = {
    get: <T = any>(key: string) => {
        const v= localStorage.getItem(key);

        return v  ? (JSON.parse(v) as T) : undefined;
    },
    set: (key: string, val: any) => {
        const v = JSON.stringify(val);

        localStorage.setItem(key, v);
    },
    remove: (key: string) => {
        localStorage.removeItem(key);
    }
};

export const pluralize = (count: number, forms: [string, string]) =>
    count !== 1 ? forms[1] : forms[0];