/** Get first 32 bits of the fractional parts of the square roots */
function first32BitsFractionalPartsOfSqrt(number) {
    return dec2hex(Math.sqrt(number)).split('.')[1].substring(0, 8);
}

/** Get first 32 bits of the fractional parts of the square roots */
function first32BitsFractionalPartsOfCbrt(number) {
    return dec2hex(Math.cbrt(number)).split('.')[1].substring(0, 8);
}

/** Chunk string to a smaller one */
function chunkString(string = '', chunkSize = 1) {
    return string.match(new RegExp('.{1,' + chunkSize + '}', 'g'));
}

/** Rotate string left */
function rotateLeft(string, amount = 0) {
    const chars = Array.from(string);
    const n = amount % chars.length;
    const newArray = chars.slice(n).concat(chars.slice(0, n));
    return newArray.join('');
}

/** Rotate string right */
function rotateRight(string, amount = 0) {
    const n = amount % string.length;
    return rotateLeft(string, string.length - n);
}

/** Shift right */
function shiftRight(binaryString = '', amount = 0) {
    const integer = parseInt(binaryString, 2);
    const normalShift = integer >> amount;
    if (normalShift >= 0) {
        return normalShift;
    }
    return parseInt(binaryString.substring(0, binaryString.length - amount), 2);
}

/** Decimal To Binary */
function dec2bin(dec, paddingLength = 8) {
    return addPadding('0', paddingLength, (dec >>> 0).toString(2));
}

/** Decimal To Hexadecimal */
function dec2hex(dec = 0, paddingLength = 8) {
    return addPadding('0', paddingLength, Number(dec).toString(16));
}

/** Hexadecimal To Binary */
function hex2bin(hex = '', paddingLength = 8) {
    hex = hex.replace('0x', '').toLowerCase();
    let binaryString = '';
    for (let i = 0; i < hex.length; i++) {
        switch (hex[i]) {
            case '0': binaryString += '0000'; break;
            case '1': binaryString += '0001'; break;
            case '2': binaryString += '0010'; break;
            case '3': binaryString += '0011'; break;
            case '4': binaryString += '0100'; break;
            case '5': binaryString += '0101'; break;
            case '6': binaryString += '0110'; break;
            case '7': binaryString += '0111'; break;
            case '8': binaryString += '1000'; break;
            case '9': binaryString += '1001'; break;
            case 'a': binaryString += '1010'; break;
            case 'b': binaryString += '1011'; break;
            case 'c': binaryString += '1100'; break;
            case 'd': binaryString += '1101'; break;
            case 'e': binaryString += '1110'; break;
            case 'f': binaryString += '1111'; break;
            default: return '';
        }
    }
    return addPadding('0', paddingLength, binaryString);
}

/** Binary To Hexadecimal */
function bin2hex(bin = '', paddingLength = 8) {
    const chunks = chunkString(bin, 4);
    let hexString = '';
    for (let i = 0; i < chunks.length; i++) {
        switch (chunks[i]) {
            case '0000': hexString += '0'; break;
            case '0001': hexString += '1'; break;
            case '0010': hexString += '2'; break;
            case '0011': hexString += '3'; break;
            case '0100': hexString += '4'; break;
            case '0101': hexString += '5'; break;
            case '0110': hexString += '6'; break;
            case '0111': hexString += '7'; break;
            case '1000': hexString += '8'; break;
            case '1001': hexString += '9'; break;
            case '1010': hexString += 'a'; break;
            case '1011': hexString += 'b'; break;
            case '1100': hexString += 'c'; break;
            case '1101': hexString += 'd'; break;
            case '1110': hexString += 'e'; break;
            case '1111': hexString += 'f'; break;
            default: return '';
        }
    }
    return addPadding('0', paddingLength, hexString);
}

/** Add Padding Char To String */
function addPadding(paddingChar = '', paddingLength = 0, string = '', tail = false) {
    while (string.length < paddingLength) {
        if (tail) {
            string = string + paddingChar;
        } else {
            string = paddingChar + string;
        }
    }
    return string;
}

module.exports = {
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
};
