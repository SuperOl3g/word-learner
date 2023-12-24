import {LocalStorage} from "./localStorage";
import {getFile, getFileId, createFile, updateFile} from "../api/requests";
import {initApiClients} from "../api/client";
import {once} from "./throttlers";

const LS_STATE_FILE_ID_KEY = '__state_file_id';
const STATE_FILE_NAME = 'dictionary.txt';

let fileId = LocalStorage.get(LS_STATE_FILE_ID_KEY);

let fileObj: {
    [key: string]: any
};

const init = once(async () => {
    await initApiClients();

    let isError = false;

    if (!fileId) {
        [fileId, isError] = await getFileId(STATE_FILE_NAME);
    }

    if (isError) {
        return true;
    }

    if (!fileId) {
        [fileId, isError] = await createFile(STATE_FILE_NAME);

        LocalStorage.set(LS_STATE_FILE_ID_KEY, fileId)
    }

    if (isError) {
        return true;
    }

    let fileStr;
    [fileStr, isError] = await getFile(fileId);

    if (isError) {
        return true;
    }

    fileObj = fileStr ? JSON.parse(fileStr) : {};

    return false;
});

export const FileStorage = {
    isInited: () => !!fileObj,
    init,
    get: <T>(key: string) => {
        if (!fileObj) {
            throw new Error('File storage is not inited');
        }

        return fileObj[key] as T | undefined;

    },

    set: async (key: string, val: any) => {
        fileObj[key] = val;

        await updateFile(fileId, fileObj);
    },
};