// const sha256 = require('./SHA256');
function sha256(message) {
    const hash = require('crypto').createHash('sha256');
    hash.update(message);
    return hash.digest('hex');
}

function byteLength(str) {  // counts characters only 1byte in length, of a string. Very similar to oneByteChar()
    // For clarity I made 2 functions.
    var len = str.length;
    var i = 0;
    var byteLen = 0;
    for (i; i < len; i++) {
        var code = str.charCodeAt(i);
        if (code >= 0x0 && code <= 0xff) byteLen++;
        else {
            throw new Error("More the 1 byte code detected, byteLength functon aborted.");
            return;
        }

    }

    return byteLen;

}

function oneByteCharAt(str, idx) {
    var code = str.codePointAt(idx);
    if (code >= 0x00 && code <= 0xff) { // we are interested at reading only one byte
        return str.charAt(idx); // return char.

    }
    else {
        throw new Error("More then 1byte character detected, |oneByteCharAt()| function  is aborted.")
    }

}

function hexToString(sha1Output) { // converts every pair of hex CHARS to their character conterparts
    // example1: "4e" is converted to char "N" 
    // example2: "34" is converted to char "4"

    var l;        // char at "i" place, left
    var lcode;    // code parsed from left char
    var shiftedL; // left character shifted to the left

    var r;     // char at "i+1" place, right
    var rcode; // code parsed from right char

    var bin;   // code from bitwise OR operation
    var char;  // one character
    var result = ""; // result string 

    for (var i = 0; i < sha1Output.length; i += 2) { // in steps by 2
        l = sha1Output[i]; // take "left" char

        if (typeof l === "number") lcode = parseInt(l); // parse the number
        else if (typeof l === "string") lcode = parseInt(l, 16);  // take the code if char letter is hex number (a-f)

        shiftedL = lcode << 4; // shift it to left 4 places, gets filled in with 4 zeroes from the right
        r = sha1Output[i + 1];    // take next char

        if (typeof r === "number") rcode = parseInt(r); // parse the number
        else if (typeof r === "string") rcode = parseInt(r, 16);

        bin = shiftedL | rcode; // concatenate left and right hex char, by applying bitwise OR
        char = String.fromCharCode(bin); // convert back code to char
        result += char;


    }
    // console.log("|"+result+"|", result.length); // prints info, line can be deleted

    return result;
}

function hmacSha256(key, baseString) {   // the actual HMAC_SHA1 function


    var blocksize = 64; // 64 when using these hash functions: SHA-1, MD5, RIPEMD-128/160 .
    var kLen = byteLength(key); // length of key in bytes;
    var opad = 0x5c; // outer padding  constant = (0x5c) . And 0x5c is just hexadecimal for backward slash "\" 
    var ipad = 0x36; // inner padding contant = (0x36). And 0x36 is hexadecimal for char "6".




    if (kLen < blocksize) {
        var diff = blocksize - kLen; // diff is how mush  blocksize is bigger then the key
    }

    if (kLen > blocksize) {
        key = hexToString(sha256(key)); // The hash of 40 hex chars(40bytes) convert to exact char mappings, from 0x00 to 0xff,
        // Produces string of 20 bytes.

        var hashedKeyLen = byteLength(key); // take the length of key
    }

    var opad_key = ""; // outer padded key
    var ipad_key = ""; // inner padded key

    (function applyXor() {  // reads one char, at the time, from key and applies XOR constants on it acording to byteLength of the key
        var o_zeroPaddedCode;  // result from opading the zero byte
        var i_zeroPaddedCode;  // res from ipading the zero byte
        var o_paddedCode;      // res from opading the char from key
        var i_paddedCode;      // res from ipading the char from key

        var char;
        var charCode;

        for (var j = 0; j < blocksize; j++) {

            if (diff && (j + diff) >= blocksize || j >= hashedKeyLen) { // if diff exists (key is shorter then blocksize) and if we are at boundry 
                // where we should be, XOR 0x00 byte with constants. Or the key was 
                // too long and was hashed, then also we need to do the same.
                o_zeroPaddedCode = 0x00 ^ opad; // XOR zero byte with opad constant  
                opad_key += String.fromCharCode(o_zeroPaddedCode); // convert result back to string 

                i_zeroPaddedCode = 0x00 ^ ipad;
                ipad_key += String.fromCharCode(i_zeroPaddedCode);
            }
            else {

                char = oneByteCharAt(key, j);     // take char from key, only one byte char
                charCode = char.codePointAt(0);  // convert that char to number

                o_paddedCode = charCode ^ opad; // XOR the char code with outer padding constant (opad)
                opad_key += String.fromCharCode(o_paddedCode); // convert back code result to string

                i_paddedCode = charCode ^ ipad;  // XOR with the inner padding constant (ipad)
                ipad_key += String.fromCharCode(i_paddedCode);

            }



        }
        //  console.log("opad_key: ", "|"+opad_key+"|", "\nipad_key: ", "|"+ipad_key+"|"); // prints opad and ipad key, line can be deleted
    })()
    console.log({ opad_key, ipad_key, baseString }, hexToString(sha256(ipad_key + baseString)));
    return sha256(opad_key + hexToString(sha256(ipad_key + baseString)));

}


var baseStr = "Suthinan";

var key = "thisIsASecretKey1234";
console.log(hmacSha256(key, baseStr)); // b679c0af18f4e9c587ab8e200acd4e48a93f8cb6