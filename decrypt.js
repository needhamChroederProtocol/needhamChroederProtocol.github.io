export function decrypt(message, key) {
    let parsedKey = [];
    let decryptedMessage = [];
    let keyLength = key.length;
    let index = 0;

    for (let i = 0; i < key.length; i++) {
        parsedKey[i] = key.charCodeAt(i);
    }

    for (let i = 0; i < message.length; i++) {
        decryptedMessage[i] = message.charCodeAt(i) ^ parsedKey[i];
        if(i === keyLength ) {
            index = 0;
            continue;
        }
        index++;
    }

    for (let i = 0; i < decryptedMessage.length; i++) {
        decryptedMessage[i] = String.fromCharCode(decryptedMessage[i]);
    }

    decryptedMessage = decryptedMessage.join('');
    return decryptedMessage;
}


