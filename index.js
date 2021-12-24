// const H = require('./SHA256');
const { dec2bin, hex2bin, bin2hex } = require('./Utils');

function H(message) {
    const hash = require('crypto').createHash('sha1');
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

function HMAC_SHA256(text = '', K = '') {
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
    console.log({ K0: bin2hex(K0) });
    /** Step 4 Exclusive-Or K0 with ipad to produce a B-byte string: K0 ¯ ipad. */
    const K0_ipad = [];
    for (let i = 0; i < B; i += 8) K0_ipad.push(XOR(K0.substring(i, i + 8), ipad));
    console.log({ K0_ipad: bin2hex(K0_ipad.join('')) }, bin2hex(K0_ipad.join('')));
    /** Step 5 Append the stream of data 'text' to the string resulting from step 4: (K0 ¯ ipad) || text. */
    const K0_ipad_text = binToString(K0_ipad) + text;
    /** Step 6 Apply H to the stream generated in step 5: H((K0 ¯ ipad) || text). */
    const H_K0_ipad_text = H(K0_ipad_text);
    console.log({ H_K0_ipad_text: H_K0_ipad_text });
    /** Step 7 Exclusive-Or K0 with opad: K0 ¯ opad. */
    const K0_opad = [];
    for (let i = 0; i < B; i += 8) K0_opad.push(XOR(K0.substring(i, i + 8), opad));
    console.log({ K0_opad: bin2hex(K0_opad.join('')) }, bin2hex(K0_opad.join('')));
    /** Step 8 Append the result from step 6 to step 7: (K0 ¯ opad) || H((K0 ¯ ipad) || text). */
    const K0_opad_H_K0_ipad_text = bin2hex(K0_opad.join('')) + H_K0_ipad_text;
    console.log({ K0_opad_H_K0_ipad_text, string: hexToString(K0_opad_H_K0_ipad_text) }, hexToString(K0_opad_H_K0_ipad_text));
    /** Step 9 Apply H to the result from step 8: H((K0 ¯ opad )|| H((K0 ¯ ipad) || text)). */
    const H_K0_opad_H_K0_ipad_text = H(K0_opad_H_K0_ipad_text);
    /** Step 10 Select the leftmost t bytes of the result of step 9 as the MAC. */
    console.log({ H_K0_opad_H_K0_ipad_text: H_K0_opad_H_K0_ipad_text });
    return H_K0_opad_H_K0_ipad_text;
}

function binToString(bin = []) {
    return bin.map(_ => String.fromCharCode(parseInt(_, 2))).join('');
}

function hexToString(hex = '') {
    let l, lcode, shiftedL, r, rcode, bin, char;
    let result = '';
    for (var i = 0; i < hex.length; i += 2) {
        l = hex[i];
        if (typeof l === 'number') lcode = parseInt(l);
        else if (typeof l === 'string') lcode = parseInt(l, 16);
        shiftedL = lcode << 4;
        r = hex[i + 1];
        if (typeof r === 'number') rcode = parseInt(r);
        else if (typeof r === 'string') rcode = parseInt(r, 16);
        bin = shiftedL | rcode;
        char = String.fromCharCode(bin);
        result += char;
    }
    return result;
}

const K = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f';

const KString = hexToString(K);

const KBinary = KString.split('').map(c => dec2bin(c.charCodeAt(0))).join('');

const KHex = bin2hex(KBinary, 128);

// console.log({ K, KString, KBinary, KHex });

console.log(HMAC_SHA256('Sample #1', hexToString(K)));
// console.log(H('571fef28d92e3884b692a65f1ed79638bc041d87471fef87467cc948992aa335'));

// console.log(H('thisIsASe' + H('cretKey1234' + 'my message here')));
