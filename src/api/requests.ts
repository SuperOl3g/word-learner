import {dedounce} from "../utils/throttlers";
import {authorize} from "./client";

const UPDATE_DELAY = 3000;

const withTabClosingAlert = <A extends any[], R>(fn: (...args: A) => R) => {
    return async (...args: A) => {
        window.onbeforeunload = () => "Are you sure?";
        await fn(...args);
        window.onbeforeunload = () => null;
    }
}

const request = async <R extends { body: any }, R2>(
    originalRequest: Promise<R>,
    transformFn: (r: R['body']) => R2,
): Promise<[result: R2 | null, isError: boolean]> => {
    let response: R;
    try {
        response = await originalRequest;
    } catch (err: any) {
        console.error(JSON.stringify(err.result.error, null ,2));

        if (err.result.error.code === 401) {
            await authorize();
            return await request(originalRequest, transformFn);
        }

        return [null, true];
    }

    return [transformFn(response.body), false];
}


export const getFileId = (fileName: string) =>
    request(gapi.client.drive.files.list({
        q: `name = '${fileName}'`,
    }), r => r ? JSON.parse(r).files[0]?.id : undefined);

export const getFile = (fileId: string) =>
    request(gapi.client.drive.files.get({
        fileId,
        alt: 'media',
    }), r => r);


export const createFile = (fileName: string) =>
    request(gapi.client.drive.files.create({
        resource: {
            name: fileName
        }
    }), r => r);

export const updateFile = withTabClosingAlert(dedounce(async (fileId: string, fileObj: Object) => {
    const fileContent = JSON.stringify(fileObj, null, 2)
    const accessToken = gapi.auth.getToken().access_token;

    return fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}`, {
        method: 'PATCH',
        headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
        body: new Blob([fileContent], {type: "text/plain"}),
    }).then(res => res.json());
}, UPDATE_DELAY));