const {
    first32BitsFractionalPartsOfSqrt,
    first32BitsFractionalPartsOfCbrt,
    chunkString,
    rotateRight,
    shiftRight,
    dec2bin,
    dec2hex,
    bin2hex,
    addPadding
} = require('./Utils');
const primeNumbers = require('./PrimeNumbers');

function SHA256(plaintext = '') {
    /** Pre-Processing */
    if (!plaintext) '';
    let plaintextBinaryString = '';
    for (let i = 0; i < plaintext.length; i++) {
        plaintextBinaryString += dec2bin(plaintext.charCodeAt(i));
    }
    let chunks = [plaintextBinaryString];
    if (plaintextBinaryString.length > 448) {
        chunks = chunkString(plaintextBinaryString, 512);
    }
    chunks[chunks.length - 1] = chunks[chunks.length - 1] + '1';
    if (chunks[chunks.length - 1].length > 448) {
        if (chunks[chunks.length - 1].length - 1 === 512) {
            chunks[chunks.length - 1] = chunks[chunks.length - 1].slice(0, -1);
            chunks.push(addPadding('0', 448, '1', true));
        } else {
            chunks[chunks.length - 1] = addPadding('0', 512, chunks[chunks.length - 1], true);
            chunks.push(addPadding('0', 448, '', true));
        }
    }
    chunks[chunks.length - 1] = addPadding('0', 448, chunks[chunks.length - 1], true) + addPadding('0', 64, dec2bin(plaintextBinaryString.length));
    /** Initialize Hash Values */
    const hashes = primeNumbers.slice(0, 8).map(number => first32BitsFractionalPartsOfSqrt(number));
    /** Initialize Round Constants */
    const k = primeNumbers.slice(0, 64).map(number => parseInt(first32BitsFractionalPartsOfCbrt(number), 16));
    let [a, b, c, d, e, f, g, h] = hashes.map(hash => parseInt(hash, 16));
    /** Chunk Loop */
    for (let i = 0; i < chunks.length; i++) {
        const binaryStringChunk = chunks[i];
        /** Create Message Schedule */
        const w = chunkString(binaryStringChunk, 32);
        for (let i = 0; i < 48; i++) {
            w.push(addPadding('0', 32, ''));
        }
        for (let i = 16; i < 64; i++) {
            const s0 = parseInt(rotateRight(w[i - 15], 7), 2) ^ parseInt(rotateRight(w[i - 15], 18), 2) ^ shiftRight(w[i - 15], 3);
            const s1 = parseInt(rotateRight(w[i - 2], 17), 2) ^ parseInt(rotateRight(w[i - 2], 19), 2) ^ shiftRight(w[i - 2], 10);
            w[i] = dec2bin(parseInt(w[i - 16], 2) + s0 + parseInt(w[i - 7], 2) + s1, 32);
        }
        /** Compression */
        [a, b, c, d, e, f, g, h] = hashes.map(hash => parseInt(hash, 16));
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
        for (let i = 0; i < hashes.length; i++) {
            hashes[i] = bin2hex(dec2bin(parseInt(hashes[i], 16) + abcdefgh[i], 32), 6);
        }
    }
    /** Concatenate Final Hash */
    return hashes.join('');
}

module.exports = SHA256;
