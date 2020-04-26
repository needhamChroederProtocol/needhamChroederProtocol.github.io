 export function getTrustedKey() {
    let keyLength = 25;
    let key = [];
    for (let i = 0; i < keyLength; i++) {
        key[i] = Math.floor(Math.random()* 400);
    }

    return key.map(item => {
        return String.fromCharCode(item);
    });
  }
