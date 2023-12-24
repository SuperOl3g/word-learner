export class Deferred<T = void>  {
    // @ts-ignore
    private _resolve: (val: T) => void;
    // @ts-ignore
    private _reject: () => void;
    public promise: Promise<T>;

     constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    resolve = (val: T) => this._resolve(val);
    reject = () => this._reject();
}