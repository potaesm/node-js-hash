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
    const chunk32 = chunkString(plaintextBinaryString, 32);
    console.log({ chunk512, chunk32 });
}

/** Get first 32 bits of the fractional parts of the square roots */
function first32BitsFractionalPartsOfSqrt(number) {
    return dec2hex(Math.sqrt(number)).split('.')[1].substring(0, 8);
}

/** Chunk string to a smaller one */
function chunkString(string = '', chunkSize = 1) {
    return string.match(new RegExp('.{1,' + chunkSize + '}', 'g'));
}

SHA256('hello world');
