export function getSessionKey() {
    let keyLength = 32;
    let key = [];
    for (let i = 0; i < keyLength; i++) {
        key[i] = Math.floor(Math.random() * 90);
    }

    return key.map(item => {
        return String.fromCharCode(item);
    });
}

