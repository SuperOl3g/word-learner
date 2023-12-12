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


export function mapObj<T, T2> (obj: {[k:string]: T}, fn: (val: T, key: string, i: number) => T2)  {
    const newObj: { [k:string]: T2 } = {};
    Object.keys(obj).forEach((k, i) => {
        newObj[k] = fn(obj[k], k, i);
    })

    return newObj;
}