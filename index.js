const {
    first32BitsFractionalPartsOfSqrt,
    first32BitsFractionalPartsOfCbrt,
    chunkString,
    rotateLeft,
    rotateRight,
    shiftRight,
    dec2bin,
    dec2hex,
    hex2bin,
    bin2hex,
    addPadding
} = require('./Utils');
const ASCII = require('./ASCII');
const primeNumbers = require('./PrimeNumbers');

function SHA256(plaintext = '') {
    if (!plaintext) '';
    const plaintextBinaryArray = [];
    for (const char of plaintext) {
        plaintextBinaryArray.push(dec2bin(ASCII[char]));
    }
    plaintextBinaryArray.push('1');
    let plaintextBinaryString = plaintextBinaryArray.join('');
    const originalBinaryInputLength = plaintextBinaryString.length - 1;
    const bigEndianLengthOfOriginalBinaryInput = addPadding('0', 64, dec2bin(originalBinaryInputLength));
    const zeroPaddingLength = ((Math.floor(originalBinaryInputLength / 512) + 1) * 512) - bigEndianLengthOfOriginalBinaryInput.length;
    plaintextBinaryString = addPadding('0', zeroPaddingLength, plaintextBinaryString, true) + bigEndianLengthOfOriginalBinaryInput;
    /** Chunk Loop */
    const chunk512 = chunkString(plaintextBinaryString, 512);
    /** Create Message Schedule */
    const w = chunkString(plaintextBinaryString, 32);
    for (let i = 0; i < 48; i++) {
        w.push(addPadding('0', 32, ''));
    }
    for (let i = 16; i < 64; i++) {
        const s0 = parseInt(rotateRight(w[i - 15], 7), 2) ^ parseInt(rotateRight(w[i - 15], 18), 2) ^ shiftRight(w[i - 15], 3);
        const s1 = parseInt(rotateRight(w[i - 2], 17), 2) ^ parseInt(rotateRight(w[i - 2], 19), 2) ^ shiftRight(w[i - 2], 10);
        w[i] = dec2bin(parseInt(w[i - 16], 2) + s0 + parseInt(w[i - 7], 2) + s1, 32);
    }
    /** Initialize Hash Values */
    const hashes = primeNumbers.slice(0, 8).map(number => first32BitsFractionalPartsOfSqrt(number));
    /** Initialize Round Constants */
    const k = primeNumbers.slice(0, 64).map(number => parseInt(first32BitsFractionalPartsOfCbrt(number), 16));
    /** Compression */
    let [a, b, c, d, e, f, g, h] = hashes.map(hash => parseInt(hash, 16));
    for (let i = 0; i < 64; i++) {
        const eBinary = dec2bin(e, 32);
        const S1 = parseInt(rotateRight(eBinary, 6), 2) ^ parseInt(rotateRight(eBinary, 11), 2) ^ parseInt(rotateRight(eBinary, 25), 2);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = h + S1 + ch + k[i] + parseInt(w[i], 2);
        const aBinary = dec2bin(a, 32);
        const S0 = parseInt(rotateRight(aBinary, 2), 2) ^ parseInt(rotateRight(aBinary, 13), 2) ^ parseInt(rotateRight(aBinary, 22), 2);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = S0 + maj;
        h = g;
        g = f;
        f = e;
        e = d + temp1;
        d = c;
        c = b;
        b = a;
        a = temp1 + temp2;
    }
    /** Modify Final Values */
    const abcdefgh = [a, b, c, d, e, f, g, h].map(dec => {
        const hex = dec2hex(dec, 8);
        return parseInt(hex.substring(hex.length - 8), 16);
    });
    const finalHashes = [];
    for (let i = 0; i < hashes.length; i++) {
        finalHashes.push(dec2bin(parseInt(hashes[i], 16) + abcdefgh[i], 32));
    }
    /** Concatenate Final Hash */
    return bin2hex(finalHashes.join(''));
}

console.log(SHA256('hello world'));
