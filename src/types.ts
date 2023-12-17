export type ValueOf<T> = T[keyof T];

export type CallbackHandler<T> = (_: any, obj: { value?: T  }) => void;

export interface IDictionary {
    [key: string]: {
        definition: string,
        correctAnswersStreak?: number,
        lastAsked?: number,
    }
}