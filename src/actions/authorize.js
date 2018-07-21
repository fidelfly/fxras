export const GRANT_TOKEN = 'GRANT_TOKEN';



export function grantToken(tokenInfo) {
    return { type: GRANT_TOKEN, tokenInfo}
}