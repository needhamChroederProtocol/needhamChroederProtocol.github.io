import { getTrustedKey } from './keyDistributorCenter.js';
import { getSessionKey} from "./sessionKey.js";
import { encrypt} from "./encrypt.js";
import { decrypt} from "./decrypt.js";
import { crypt } from "./aes.js";


let getRandomNumber = function () {
    return Math.ceil(Math.random() * 1000);
};


let getElement = (elementClass) => {
    return document.querySelector(`.${elementClass}`);
};

let aliceRandomNumber, bobRandomNumber,aliceTrustedKey,bobTrustedKey,aliceSessionKey,bobSessionKey;
//
const numberContainerForAlice = getElement('random-number-alice');
const numberContainerForBob = getElement('random-number-bob');
const aliceRandomHandler = getElement('random-button-alice');
const bobRandomHandler = getElement('random-button-bob');


const aliceKeyContainer = getElement('alice-key');
const bobKeyContainer = getElement('bob-key');
const aliceKeyHandler = getElement('alice-key-btn');
const bobKeyHandler = getElement('bob-key-btn');

const aliceKeyCenterContainer = getElement('alice-center-key');
const bobKeyCenterContainer = getElement('bob-center-key');


aliceRandomHandler.addEventListener('click', () => {
    aliceRandomNumber = getRandomNumber();
    numberContainerForAlice.textContent = aliceRandomNumber;
});

bobRandomHandler.addEventListener('click', () => {
    bobRandomNumber = getRandomNumber();
    numberContainerForBob.textContent = bobRandomNumber;
});


aliceKeyHandler.addEventListener('click', () => {
    getElement('keyA').classList.remove('hidden');
    aliceTrustedKey = getTrustedKey().join('');
    aliceKeyContainer.textContent = aliceTrustedKey;
    aliceKeyCenterContainer.textContent = aliceTrustedKey;
});

bobKeyHandler.addEventListener('click', () => {
    getElement('keyB').classList.remove('hidden');
    bobTrustedKey = getTrustedKey().join('');;
    bobKeyContainer.textContent = bobTrustedKey;
    bobKeyCenterContainer.textContent = bobTrustedKey;
});



let aliceHandler = function () {
    if(aliceMessage.value === '') {
        alert('Будь ласка введіть повідомлення Аліси!');
        return;
    }

    if(!aliceRandomNumber) {
        alert('Згенеруйте випадкове число для Alice!');
        return;
    }

    if(!bobRandomNumber) {
        alert('Згенеруйте випадкове число для Bob!');
        return;
    }

    if((aliceMessage.value.split(',')[2]) !== aliceRandomNumber.toString()) {
        alert('Будь ласка введіть правильне знегероване число!');
        return;
    }

    if(!aliceRandomNumber || !bobRandomNumber || !aliceTrustedKey || !bobTrustedKey) {
        alert('Будь ласка отримайте довірений ключ та випадкове число для кожної сторони!');
        return;
    }

    if(aliceMessage.value.split(',').length < 3) {
        alert('Будь ласка введіть повідoмлення в форматі першого повідомлення! (Імена участників та згенероване число)');
        return;
    }
    const encryptedMessageToServer = encrypt(aliceMessage.value, aliceTrustedKey);
    aliceMessage.value = '';
    let aliceAnswer = server(encryptedMessageToServer);
    aliceSessionKey = (aliceAnswer.split(',')[2]);



    let encryptedMessageToBob = (aliceAnswer.split(',')[3]);
    let bobAnswer = bobMessageHandler(encryptedMessageToBob);
    bobAnswer = decrypt(bobAnswer, aliceSessionKey);
    console.log(bobAnswer);
    bobAnswer -= 1;
    console.log(bobAnswer);
    isConnectionEstablished(bobAnswer);
};








const aliceSend = getElement('alice-verify');
const aliceMessage = getElement('alice-message');

aliceSend.addEventListener('click', aliceHandler);

let server = function(encryptedMessage) {
    let decryptedMessage = decrypt(encryptedMessage, aliceTrustedKey);
    let aliceRandomNumber = (decryptedMessage.split(',')[2]);
    let aliceName = (decryptedMessage.split(',')[0]);
    let bobName = (decryptedMessage.split(',')[1]);
    let sessionKey = getSessionKey();
    sessionKey = sessionKey.join('');



    let messageToBob = encrypt(`${sessionKey},${aliceName}`,bobTrustedKey);
    let answer = `${aliceRandomNumber},${bobName},${sessionKey},${messageToBob}`;
    return answer;
};

let bobMessageHandler = function(encryptedMessage) {
    let decryptedMessageToBob = decrypt(encryptedMessage,bobTrustedKey);
    bobSessionKey = (decryptedMessageToBob.split(',')[0]);
    let nameOfTrustedPerson = (decryptedMessageToBob.split(',')[1]);
    // bobRandomNumber = bobRandomNumber.toString();
    let messageToTrustedPerson = encrypt(bobRandomNumber.toString(), bobSessionKey);
    return  messageToTrustedPerson;
};

let isConnectionEstablished = function(id) {
    bobRandomNumber = bobRandomNumber -1;
    if(id.toString() === (bobRandomNumber.toString())) {
        alert(`З'єднання між сторонами встановлено!`);

        console.log(`З'єднання між сторонами встановлено!`);
        aliceSend.removeEventListener('click', aliceHandler);
        getElement('connectionB').classList.remove('hidden');
        getElement('connectionA').classList.remove('hidden');
        getElement('get-decrypted-messageA').classList.remove('hidden');
        getElement('get-messageA').classList.remove('hidden');
        getElement('get-messageB').classList.remove('hidden');
        getElement('get-decrypted-messageB').classList.remove('hidden');
        getElement('bob-decr').classList.remove('hidden');
        getElement('alice-decr').classList.remove('hidden');


        getElement('alice-session-key').textContent = aliceSessionKey;
        getElement('bob-session-key').textContent = bobSessionKey;
        let bobMessageInput = getElement('bob-message-input');
        bobMessageInput.disabled = false;
        let bobSendButton = getElement('bob-verify');
        bobSendButton.disabled = false;
        aliceRandomHandler.disabled = true;
        bobRandomHandler.disabled = true;
        aliceKeyHandler.disabled = true;
        bobKeyHandler.disabled = true;
        getElement('keyA').classList.add('hidden');
        getElement('keyB').classList.add('hidden');
        crypt(aliceSessionKey);
    }

};
