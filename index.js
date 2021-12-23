const { ASCII, dec2bin, dec2hex, addPadding } = require('./ASCII');
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
    // console.log(plaintextBinaryString, plaintextBinaryString.length);
    /** Initialize Hash Values (h) */
    const h = primeNumbers.slice(0, 8);
    // for (let i = 0; i < h.length; i++) {
    //     console.log(first32BitsFractionalPartsOfSqrt(h[i]));
    // }
    /** Initialize Round Constants (k) */
    const k = primeNumbers.slice(0, 64);
    /** Chunk Loop */
    const chunk512 = chunkString(plaintextBinaryString, 512);
    /** Create Message Schedule (w) */
    const w = chunkString(plaintextBinaryString, 32);
    for (let i = 0; i < 48; i++) {
        w.push(addPadding('0', 32, ''));
    }
    for (let i = 16; i < 63; i++) {
        const s0 = dec2bin(parseInt(rotateRight(w[i - 15], 7), 2) ^ parseInt(rotateRight(w[i - 15], 18), 2) ^ (parseInt(w[i - 15], 2) >> 3), 32);
        const s1 = dec2bin(parseInt(rotateRight(w[i - 2], 17), 2) ^ parseInt(rotateRight(w[i - 2], 19), 2) ^ (parseInt(w[i - 2], 2) >> 10), 32);
        w[i] = dec2bin(parseInt(w[i - 16], 2) + parseInt(s0, 2) + parseInt(w[i - 7], 2) + parseInt(s1, 2), 32);
    }
    console.log(w);
}

/** Get first 32 bits of the fractional parts of the square roots */
function first32BitsFractionalPartsOfSqrt(number) {
    return dec2hex(Math.sqrt(number)).split('.')[1].substring(0, 8);
}

/** Chunk string to a smaller one */
function chunkString(string = '', chunkSize = 1) {
    return string.match(new RegExp('.{1,' + chunkSize + '}', 'g'));
}

/** Rotate string left */
function rotateLeft(string, noOfChars = 0) {
    const chars = Array.from(string);
    const n = noOfChars % chars.length;
    const newArray = chars.slice(n).concat(chars.slice(0, n));
    return newArray.join('');
}

/** Rotate string right */
function rotateRight(string, noOfChars = 0) {
    const n = noOfChars % string.length;
    return rotateLeft(string, string.length - n);
}

SHA256('hello world');
