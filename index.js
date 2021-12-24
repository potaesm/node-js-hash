const SHA256 = require('./SHA256');

function HMAC_SHA256(message = '', key = '') {
    const BLOCK_SIZE = 64;
    const I_PAD = 0x36;
    const O_PAD = 0x5c;
    if (key.length > BLOCK_SIZE) {
        key = SHA256(key);
    } else {
        while (key.length < BLOCK_SIZE) {
            key += '0';
        }
    }
    const I_KEY_PAD = [];
    for (let i = 0; i < BLOCK_SIZE; i++) I_KEY_PAD[i] = key[i].charAt(0) ^ I_PAD;
    const hashSum1 = SHA256(I_KEY_PAD.map(i => String.fromCharCode(i)).join('') + message);
    const O_KEY_PAD = [];
    for (let i = 0; i < BLOCK_SIZE; i++) O_KEY_PAD[i] = key[i].charAt(0) ^ O_PAD;
    const hashSum2 = SHA256(O_KEY_PAD.map(o => String.fromCharCode(o)).join('') + hashSum1);
    return hashSum2;
}

console.log(HMAC_SHA256('Suthinan', 'thisIsASecretKey1234'));

// console.log(SHA256('571fef28d92e3884b692a65f1ed79638bc041d87471fef87467cc948992aa335'));

// console.log(SHA256('thisIsASe' + SHA256('cretKey1234' + 'my message here')));
