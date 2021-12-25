const { dec2bin, hex2bin, bin2hex, hex2string, bin2string, XOR, dec2hex } = require('./Utils');
const { HMAC_SHA1 } = require('./HMAC');
const SHA256 = require('./SHA256');

// console.log(HMAC_SHA1('Suthinan', 'Musitmani') === '0f29db6c26543789da91b6b6754659e5c8256fa4');
// console.log(SHA256('SuthinanMusitmani') === 'd2a4efe0ae1f728ae51b65763f623dd824cfd709fee3e7ad99f5255e77d8b354');

function PBKDF2(PRF = HMAC_SHA1, password = '', salt = '', c = 4096, dkLen = 256) {
    const hLen = 160;
    if (dkLen > (Math.pow(2, 32) - 1) * hLen) {
        throw new Error('Requested key length is too long');
    }
    const numberOfBlocks = Math.ceil(dkLen / hLen);
    let T = '';
    for (let i = 0; i < numberOfBlocks; i++) {
        let U = PRF(password, salt + String.fromCharCode(i));
        for (j = 1; j < c; j++) {
            U = XOR(U, PRF(password, hex2string(U)), 16);
        }
        T = T + U;
    }
    return T;
}

console.log(PBKDF2(HMAC_SHA1, 'Suthinan', salt = 'Musitmani', 4096, 256));
