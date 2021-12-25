const Rusha = require('rusha');
const { dec2bin, hex2bin, bin2hex, hex2string, bin2string, XOR } = require('./Utils');

function H(message) {
    return Rusha.createHash().update(message).digest('hex');
}

function HMAC_SHA1(text = '', K = '') {
    let K0 = '';
    const B = 512;
    const ipad = '00110110';
    const opad = '01011100';
    /** Step 1 If the length of K = B: set K0 = K. Go to step 4. */
    if (K.length === B) {
        K0 = K.split('').map(c => dec2bin(c.charCodeAt(0))).join('');
    }
    /** Step 2 If the length of K > B: hash K to obtain an L byte string,
     * then append (B-L) zeros to create a B-byte string K0 (i.e., K0 = H(K) || 00...00). Go to step 4. */
    if (K.length > B) {
        K0 = hex2bin(H(K), B, true);
    }
    /** Step 3 If the length of K < B: append zeros to the end of K to create a B-byte string K0
     * (e.g., if K is 20 bytes in length and B = 64, then K will be appended with 44 zero bytes 0x00). */
    if (K.length < B) {
        K0 = K.split('').map(c => dec2bin(c.charCodeAt(0))).join('');
        while (K0.length < B) {
            K0 += '00000000';
        }
    }
    // console.log({ K0: bin2hex(K0) });
    /** Step 4 Exclusive-Or K0 with ipad to produce a B-byte string: K0 ¯ ipad. */
    const K0_ipad = [];
    for (let i = 0; i < B; i += 8) K0_ipad.push(XOR(K0.substring(i, i + 8), ipad));
    // console.log({ K0_ipad: bin2hex(K0_ipad.join('')) });
    /** Step 5 Append the stream of data 'text' to the string resulting from step 4: (K0 ¯ ipad) || text. */
    const K0_ipad_text = bin2string(K0_ipad) + text;
    // console.log({ K0_ipad_text }, K0_ipad_text);
    /** Step 6 Apply H to the stream generated in step 5: H((K0 ¯ ipad) || text). */
    const H_K0_ipad_text = H(K0_ipad_text);
    // console.log({ H_K0_ipad_text: H_K0_ipad_text });
    /** Step 7 Exclusive-Or K0 with opad: K0 ¯ opad. */
    const K0_opad = [];
    for (let i = 0; i < B; i += 8) K0_opad.push(XOR(K0.substring(i, i + 8), opad));
    // console.log({ K0_opad: bin2hex(K0_opad.join('')) });
    /** Step 8 Append the result from step 6 to step 7: (K0 ¯ opad) || H((K0 ¯ ipad) || text). */
    const K0_opad_H_K0_ipad_text = bin2hex(K0_opad.join('')) + H_K0_ipad_text;
    // console.log({ K0_opad_H_K0_ipad_text, string: hex2string(K0_opad_H_K0_ipad_text) }, hex2string(K0_opad_H_K0_ipad_text));
    /** Step 9 Apply H to the result from step 8: H((K0 ¯ opad )|| H((K0 ¯ ipad) || text)). */
    const H_K0_opad_H_K0_ipad_text = H(hex2string(K0_opad_H_K0_ipad_text));
    /** Step 10 Select the leftmost t bytes of the result of step 9 as the MAC. */
    // console.log({ H_K0_opad_H_K0_ipad_text: H_K0_opad_H_K0_ipad_text });
    return H_K0_opad_H_K0_ipad_text;
}

module.exports = { HMAC_SHA1 };

/** Test */
// const key = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f';
// const keyString = hex2string(key);
// const keyBinary = keyString.split('').map(c => dec2bin(c.charCodeAt(0))).join('');
// const keyHex = bin2hex(keyBinary, 128);

// console.log({ key, keyString, keyBinary, keyHex });

// const hmac = HMAC_SHA1('Sample #1', keyString);
// console.log(hmac, hmac === '4f4ca3d5d68ba7cc0a1208c9c61e9c5da0403c0a');
