/** REF: https://en.wikipedia.org/wiki/PBKDF2 */

const { HMAC_SHA1 } = require('./HMAC');

const { hex2string, XOR, dec2hex } = require('./Utils');

function PBKDF2(PRF = HMAC_SHA1, password = '', salt = '', c = 4096, dkLen = 256) {
    const hLen = 160; // HMAC-SHA1 produces hex char * 4 bin = 160 bin
    if (dkLen > (Math.pow(2, 32) - 1) * hLen) {
        throw new Error('The desired bit-length of the derived key is too long');
    }
    const numberOfBlocks = Math.ceil(dkLen / hLen);
    let T = '';
    for (let i = 0; i < numberOfBlocks; i++) {
        let U = PRF(password, salt + dec2hex(i + 1, 8));
        for (j = 1; j < c; j++) {
            U = XOR(U, PRF(password, hex2string(U)), 16);
        }
        T = T + U;
    }
    return T.slice(0, Math.floor(dkLen / 4));
}

module.exports = PBKDF2;
