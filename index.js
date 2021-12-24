const { ascii2dec, dec2ascii } = require('./ASCII');
const SHA256 = require('./SHA256');

function HMAC_SHA256(data = '', key = '') {
    let hashContext = key;
    /** SHA256 Block Size */
    const B = 64;
    const I_PAD = parseInt('0x36', 16);
    const O_PAD = parseInt('0x5c', 16);
    /**
     * If the key length is bigger than the buffer size B, apply the hash
     * function to it first and use the result instead.
     */
    let keyLength = key.length;
    if (keyLength > B) {
        key = SHA256(key);
        hashContext = key;
        keyLength = key.length;
    }
    /**
     * (1) append zeros to the end of K to create a B byte string
     *     (e.g., if K is of length 20 bytes and B=64, then K will be
     *     appended with 44 zero bytes 0x00)
     * (2) XOR (bitwise exclusive-OR) the B byte string computed in step
     *     (1) with ipad
     */
    const kx = [];
    for (let i = 0; i < keyLength; i++) kx[i] = I_PAD ^ ascii2dec[key[i]];
    for (let i = keyLength; i < B; i++) kx[i] = I_PAD ^ 0;
    /**
     * (3) append the stream of data 'text' to the B byte string resulting
     *     from step (2)
     * (4) apply H to the stream generated in step (3)
     */
    for (let i = 0; i < kx.length; i++) {
        hashContext += dec2ascii[kx[i]];
    }
    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        hashContext += data[i];
    }
    /**
     * (5) XOR (bitwise exclusive-OR) the B byte string computed in
     *     step (1) with opad
     *
     * NOTE: The "kx" variable is reused.
     */
    for (let i = 0; i < keyLength; i++) kx[i] = O_PAD ^ ascii2dec[key[i]];
    for (let i = keyLength; i < B; i++) kx[i] = O_PAD ^ 0;
    /**
     * (6) append the H result from step (4) to the B byte string
     *     resulting from step (5)
     * (7) apply H to the stream generated in step (6) and output
     *     the result
     */
    for (let i = 0; i < kx.length; i++) {
        hashContext += dec2ascii[kx[i]];
    }
    return SHA256(hashContext);
}

// console.log(HMAC_SHA256('Suthinan', 'Musitmani'));

console.log(SHA256('Suthinan'));
