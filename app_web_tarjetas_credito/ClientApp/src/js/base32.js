import { IsNullOrWhiteSpace } from "./utiles";
const Buffer = require('buffer/').Buffer

var DIGITS = [];
var MASK;
var SHIFT;
var CHAR_MAP = {};
var SEPARATOR = "-";

/**
 * Metodo que llama a la clase Base32 para cifrar (type = 1) o descifrar (type = 2) la data enviada
 * @param {number} type
 * @param {string} data
 * @returns {string|Uint8Array} retorna un string de los datos encriptados o un Uint8Array de los datos desencriptados
 */
export default function Base32Crypt(type, data) {
    if (!IsNullOrWhiteSpace(data)) {
        DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("");
        MASK = DIGITS.length - 1;
        SHIFT = numberOfTrailingZeros(DIGITS.length);
        for (let i = 0; i < DIGITS.length; i++) {
            CHAR_MAP[DIGITS[i]] = i;
        }
        try {
            if (type === 1) {
                return Encode(data);
            } else {
                return Decode(data);
            }
        } catch (e) {
            console.error(e);
            return "";
        }
    } else {
        return "";
        //console.error("no se ha enviado datos " + data);
    }
}

function numberOfTrailingZeros(i) {
    // HD, Figure 5-14
    let y;
    if (i === 0)
        return 32;
    let n = 31;
    y = i << 16;
    if (y !== 0) { n = n - 16; i = y; }
    y = i << 8;
    if (y !== 0) { n = n - 8; i = y; }
    y = i << 4;
    if (y !== 0) { n = n - 4; i = y; }
    y = i << 2;
    if (y !== 0) { n = n - 2; i = y; }
    let ui = Math.abs((i << 1) >> 31);
    return n - ui;
}

/**
 * Decodificar de Base32 a arreglo de bits
 * @param {string} encoded
 * @returns {Uint8Array} arreglo de bits de los datos desencriptados
 */
function Decode(encoded) {
    // Remove whitespace and separators
    encoded = encoded.trim().replaceAll(SEPARATOR, "");

    // Remove padding. Note: the padding is used as hint to determine how many
    // bits to decode from the last incomplete chunk (which is commented out
    // below, so this may have been wrong to start with).
    encoded = encoded.trim().replaceAll(/[=]*$"/g, "");

    // Canonicalize to all upper case
    encoded = encoded.toUpperCase();
    if (encoded.length === 0) {
        return new Uint8Array(0);
    }
    var encodedLength = encoded.length;
    var outLength = encodedLength * SHIFT / 8;
    var result = new Uint8Array(outLength);
    var buffer = 0;
    var next = 0;
    var bitsLeft = 0;
    var arrAux = encoded.split("");
    for (let i = 0; i < arrAux.length; i++) {
        let c = arrAux[i];
        if (CHAR_MAP[c] === null || CHAR_MAP[c] === undefined) {
            return;
        }
        buffer <<= SHIFT;
        buffer |= CHAR_MAP[c] & MASK;
        bitsLeft += SHIFT;
        if (bitsLeft >= 8) {
            result[next++] = buffer >> (bitsLeft - 8);
            bitsLeft -= 8;
        }
    }
    // We'll ignore leftover bits for now.
    //
    // if (next != outLength || bitsLeft >= SHIFT) {
    //  throw new DecodingException("Bits left: " + bitsLeft);
    // }
    return result;
}

/**
 * Codificar a Base32 desde string
 * @param {string} string
 * @param {boolean} padOutput
 * @returns {string} String en formato base32
 */
function Encode(string, padOutput = false) {
    var data = new Buffer(string, "ascii");
    if (data.length === 0) {
        return "";
    }
    // SHIFT is the number of bits per output character, so the length of the
    // output is the length of the input multiplied by 8/SHIFT, rounded up.
    if (data.length >= (1 << 28)) {
        // The computation below will fail, so don't do it.
        //console.error("fuera de rango");
        return "";
    }
    //var outputLength = (data.length * 8 + SHIFT - 1) / SHIFT;
    var result = "";

    var buffer = data[0];
    var next = 1;
    var bitsLeft = 8;
    while (bitsLeft > 0 || next < data.length) {
        if (bitsLeft < SHIFT) {
            if (next < data.length) {
                buffer <<= 8;
                buffer |= (data[next++] & 0xff);
                bitsLeft += 8;
            } else {
                let pad = SHIFT - bitsLeft;
                buffer <<= pad;
                bitsLeft += pad;
            }
        }
        var index = MASK & (buffer >> (bitsLeft - SHIFT));
        bitsLeft -= SHIFT;
        result += DIGITS[index];
    }
    if (padOutput) {
        var padding = 8 - (result.length % 8);
        if (padding > 0) {
            result += result.padEnd(padding === 8 ? 0 : padding, "=");
        }
    }
    return result;
}