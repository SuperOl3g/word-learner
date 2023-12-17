export function formatDate (date: Date): string {
    return date.toLocaleString();
}

export const pluralize = (count: number, forms: [string, string]) =>
    count !== 1 ? forms[1] : forms[0];


export function mapObj<T, T2> (obj: {[k:string]: T}, fn: (val: T, key: string, i: number) => T2)  {
    const newObj: { [k:string]: T2 } = {};
    Object.keys(obj).forEach((k, i) => {
        newObj[k] = fn(obj[k], k, i);
    })

    return newObj;
}