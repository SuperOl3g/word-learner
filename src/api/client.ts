import {LocalStorage} from "../utils/localStorage";
import {Deferred} from "../utils/deferred";

const clientId = process.env.REACT_APP_API_CLIENT_ID as string;
const apiKey = process.env.REACT_APP_API_KEY as string;


const LS_ACCESS_TOKEN_KEY = '__access_token';

let tokenClient: any;
let authDeferred = new Deferred();

export const initApiClients = async () => {
    if (!tokenClient) {
        if (!google?.accounts) {
            const gsiDefer = new Deferred();
            (window as any).gisLoaded = () => gsiDefer.resolve();
            await gsiDefer.promise;
        }

        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file',
            callback: (resp) => {
                if (resp.error !== undefined) {
                    throw resp;
                }

                LocalStorage.set(LS_ACCESS_TOKEN_KEY, gapi.client.getToken());

                authDeferred?.resolve();

            }
        });

        if(!gapi) {
            const gapiDefer = new Deferred();
            (window as any).gapiLoaded = () => gapiDefer.resolve();
            await gapiDefer.promise;
        }

        await new Promise<void>((resolve) => {
            gapi.load('client', async () =>{
                await gapi.client.init({
                    apiKey: apiKey,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                });

                resolve();
            } );
        });

        const token = LocalStorage.get<ReturnType<typeof gapi.client.getToken> | undefined>(LS_ACCESS_TOKEN_KEY);

        if (token) {
            gapi.client.setToken(token);
            authDeferred.resolve();

        } else {
            await authorize();
        }
    }
}

export const authorize = async () => {
    gapi.client.setToken(null);
    LocalStorage.set(LS_ACCESS_TOKEN_KEY, null);
    authDeferred = new Deferred();
    tokenClient.requestAccessToken();
    await authDeferred.promise;

    // just in case if auth wasn't applying too long at the Google side
    await new Promise(resolve => setTimeout(resolve, 2000));
}


