const { dec2bin, hex2bin, bin2hex, hex2string, bin2string, XOR } = require('./Utils');
const { HMAC_SHA1 } = require('./HMAC');
const SHA256 = require('./SHA256');

console.log(HMAC_SHA1('Suthinan', 'Musitmani') === '0f29db6c26543789da91b6b6754659e5c8256fa4');
console.log(SHA256('SuthinanMusitmani') === 'd2a4efe0ae1f728ae51b65763f623dd824cfd709fee3e7ad99f5255e77d8b354');

// function PBKDF2(PRF = HMAC_SHA1, password = '', salt = '', c = 4096, dkLen = 256) {
//     const binaryPassword = password.split('').map(c => dec2bin(c.charCodeAt(0))).join('');
//     const binarySalt = salt.split('').map(c => dec2bin(c.charCodeAt(0))).join('');

//     const hLen = 160;
//     if (dkLen > (Math.pow(2, 32) - 1) * hLen) {
//         throw new Error('Requested key length is too long');
//     }
//     const l = Math.ceil(dkLen / hLen);
//     const r = dkLen - (l - 1) * hLen;
//     const block1 = [...binarySalt];
//     for (let i = 1; i <= l; i++) {
//         block1[S.length + 0] = (byte) (i >> 24 & 0xff);
//         block1[S.length + 1] = (byte) (i >> 16 & 0xff);
//         block1[S.length + 2] = (byte) (i >> 8  & 0xff);
//         block1[S.length + 3] = (byte) (i >> 0  & 0xff);
//     }
// }
