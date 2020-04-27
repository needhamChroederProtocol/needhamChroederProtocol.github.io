export function encrypt(message, key) {
    let parsedKey = [];
    let encryptedMessage = [];
    let keyLength = key.length;
    let index = 0;

     for (let i = 0; i < key.length; i++) {
         parsedKey[i] = key.charCodeAt(i);
     }

     for (let i = 0; i < message.length; i++) {
         encryptedMessage[i] = message.charCodeAt(i) ^ parsedKey[i];
         if(i === keyLength ) {
             index = 0;
             continue;
         }
         index++;
    }

     for (let i = 0; i < encryptedMessage.length; i++) {
         encryptedMessage[i] = String.fromCharCode(encryptedMessage[i]);
     }

    encryptedMessage = encryptedMessage.join('');
    return encryptedMessage;
 }





