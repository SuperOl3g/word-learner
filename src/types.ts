export interface IDictionary {
    [key: string]: {
        definition: string,
        correctAnswersStreak?: number,
        lastAsked?: number,
    }
}