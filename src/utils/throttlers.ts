export function throttle<A extends any[], R>(fn: (...args: A) => R, delay: number, trailing?: boolean) {
    let isDelayed = false;
    let lastArgs: A | null;
    let result: R;

    return function rFn(...args: A) {
        if (!isDelayed) {
            isDelayed = true;
            result = fn(...args);

            setTimeout(() => {
             isDelayed = false;
             if (trailing && lastArgs) {
                 result = rFn(...lastArgs);
                 lastArgs = null;
             }
            }, delay);
        } else {
            lastArgs = args;
        }

        return result;
    }
}

export function once<A extends any[], R>(fn: (...args: A) => R) {
    let result: R;

    return (...args: A) => {
        if (!result) {
            result = fn(...args);
        }

        return result;
    }
}

export function dedounce<A extends any[], R>(fn: (...args: A) => R, delay: number) {
    let timer: NodeJS.Timeout;

    return (...args: A) => new Promise((resolve) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            resolve(fn(...args));
        }, delay)
    });
}