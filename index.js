// const SHA256 = require('./SHA256');
const { dec2bin, hex2bin, bin2hex } = require('./Utils');

function SHA256(message) {
    const hash = require('crypto').createHash('sha256');
    hash.update(message);
    return hash.digest('hex');
}

function XOR(input1, input2, radix = 2) {
    const output = [];
    for (let i = 0; i < input1.length; i++) {
        output.push(parseInt(input1[i], radix) ^ parseInt(input2[i], radix));
    }
    return output.map(n => n.toString(2)).join('');
}

function HMAC_SHA256(message = '', key = '') {
    let keyTemp = key.split('').map(c => dec2bin(c.charCodeAt(0))).join('');
    const BLOCK_SIZE = 512;
    const I_PAD = '00110110';
    const O_PAD = '01011100';
    if (keyTemp.length > BLOCK_SIZE) {
        keyTemp = hex2bin(SHA256(key), 512, true);
        console.log({keyTemp});
    } else {
        while (keyTemp.length < BLOCK_SIZE) {
            keyTemp += '00000000';
        }
    }
    console.log(bin2hex(keyTemp));
    const I_KEY_PAD = [];
    for (let i = 0; i < BLOCK_SIZE; i += 8) I_KEY_PAD.push(XOR(keyTemp.substring(i, i + 8), I_PAD));
    console.log({ I_KEY_PAD: nToString(I_KEY_PAD, 2) }, nToString(I_KEY_PAD, 2));
    const hashSum1 = SHA256(nToString(I_KEY_PAD, 2) + message);
    console.log({ hashSum1: nToString(hashSum1.split(''), 16) });
    const O_KEY_PAD = [];
    for (let i = 0; i < BLOCK_SIZE; i += 8) O_KEY_PAD.push(XOR(keyTemp.substring(i, i + 8), O_PAD));
    console.log({ O_KEY_PAD: nToString(O_KEY_PAD, 2) }, nToString(O_KEY_PAD, 2));
    const hashSum2 = SHA256(nToString(O_KEY_PAD, 2) + nToString(hashSum1.split(''), 16));
    console.log({ hashSum2: hashSum2 });
    return hashSum2;
}

function nToString(input = [], radix = 2) {
    return input.map(_ => String.fromCharCode(parseInt(_, radix))).join('');
}

console.log(HMAC_SHA256('a', 'a'));
// console.log(SHA256('571fef28d92e3884b692a65f1ed79638bc041d87471fef87467cc948992aa335'));

// console.log(SHA256('thisIsASe' + SHA256('cretKey1234' + 'my message here')));
