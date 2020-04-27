
export function crypt(sessionKey) {
    let ciphertextBob, ciphertextAlice;
    let iv;


    function getMessageEncoding() {
        const messageBox = document.querySelector(".alice-message");
        let message = messageBox.value;
        let enc = new TextEncoder();
        return enc.encode(message);
    }

    function getBobMessageEncoding() {
        const messageBox = document.querySelector(".bob-message-input");
        let message = messageBox.value;
        let enc = new TextEncoder();
        return enc.encode(message);
    }



    async function encryptBobMessage(key) {
        let encoded = getBobMessageEncoding();

        iv = window.crypto.getRandomValues(new Uint8Array(16));
        ciphertextAlice = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv
            },
            key,
            encoded
        );

        let buffer = new Uint8Array(ciphertextAlice, 0, 5);
        const ciphertextAliceValue = document.querySelector(".alice-get-message");
        ciphertextAliceValue.textContent = `${buffer}...[${ciphertextAlice.byteLength} bytes total]`;
    }

    async function decryptAliceMessage(key) {
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv
            },
            key,
            ciphertextAlice
        );

        let dec = new TextDecoder();
        const decryptedValue = document.querySelector(".alice-get-decrypted-message");
        decryptedValue.textContent = dec.decode(decrypted);
    }

    async function encryptAliceMessage(key) {
        let encoded = getMessageEncoding();
        // The iv must never be reused with a given key.
        iv = window.crypto.getRandomValues(new Uint8Array(16));
        ciphertextBob = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv
            },
            key,
            encoded
        );

        let buffer = new Uint8Array(ciphertextBob, 0, 5);
        const ciphertextBobValue = document.querySelector(".bob-get-message");
        ciphertextBobValue.textContent = `${buffer}...[${ciphertextBob.byteLength} bytes total]`;
    }


    async function decryptBobMessage(key) {
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv
            },
            key,
            ciphertextBob
        );

        let dec = new TextDecoder();
        const decryptedValue = document.querySelector(".bob-get-decrypted-message");
        decryptedValue.textContent = dec.decode(decrypted);
    }

    const password = sessionKey;
    const enc = new TextEncoder();
    console.log(enc.encode(password));
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        {name: "AES-CBC", length: 256 },
        true,
        ["encrypt", "decrypt"]
    ).then((key) => {
        console.log(key);
        const aliceButton = document.querySelector(".alice-verify");
        aliceButton.addEventListener("click", () => {
            encryptAliceMessage(key);
        });

        const bobDecrButton = document.querySelector(".bob-decr");
        bobDecrButton.addEventListener("click", () => {
            decryptBobMessage(key);
        });


        const bobButton = document.querySelector(".bob-verify");
        bobButton.addEventListener("click", () => {
            encryptBobMessage(key);
        });

        const aliceDecrButton = document.querySelector(".alice-decr");
        aliceDecrButton.addEventListener("click", () => {
            decryptAliceMessage(key);
        });

    });

}
