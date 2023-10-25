import Base32Crypt from './base32';
import { IsNullOrWhiteSpace } from './utiles';
import CryptoJS from "crypto-js";

/**
 * Generar clave de Cifrado en base32
 * @param {string} navegador
 * @param {number} ts
 * @param {string} usr
 * @param {string} lgn
 * @returns {string} 
 */
export function generate(navegador, ts, usr, lgn) {
    var dto = {
        usr: usr,
        ts: ts,
        lgn: lgn,
        nav: navegador,
    };
    return Base32Crypt(1, JSON.stringify(dto))
}

/**
 * Extraer datos de la clave secreta enviada desde el Back
 * @param {string} secretHeader
 * @returns {{v1:string, v2:string}} retorna los datos con los que se ha creado la llave de seguridad
 */
export function extractSecret(secretHeader) {
    var secret = secretHeader.split("");
    var max = Number(secret[16] + secret[18] + secret[21]);
    var min = (secret.length - 3 - max)
    secret[16] = secret[secret.length - 1];
    secret[18] = secret[secret.length - 2];
    secret[21] = secret[secret.length - 3];
    var div = max / min
    var espacios = Math.floor(div);
    var v1 = "";
    var v2 = "";
    var e = espacios;
    for (let i = 0; i < secret.length - 3; i++) {
        if (e === i && v2.length < min) {
            v2 += secret[i];
            i++;
            e = i + espacios;
        }
        v1 += secret[i];
    }
    return { v1: v1, v2: v2 };
}

/**
 * Cifrar datos en base32
 * @param {string} txt datos en string o JSON.stringify()
 * @returns {string} texto cifrado
 */
export function set(txt) {
    return Base32Crypt(1, txt)
}

/**
 * Descifrar un texto base32 para extraer sus datos
 * @param {string} txt texto cifrado en base32
 * @returns {string} devuelve los datos contenidos en el texto cifrado en formato JSON.stringify
 */
export function get(txt) {
    try {
        if (!IsNullOrWhiteSpace(txt)) {
            return String.fromCharCode.apply(null, Base32Crypt(2, txt));
        } else {
            return "sin datos";
        }
    } catch (e) {
        console.error(e);
        return "error";
    }
}

/**
 * Encriptar datos con el algoritmo AES - CBC (PKCS7) 16bits
 * @param {string} contrasenia
 * @param {string} textoPlano
 * @returns {Promise<string|null>} null si hay algun error o string de los datos cifrados
 */
export async function encriptar(contrasenia, textoPlano) {
    if (IsNullOrWhiteSpace(contrasenia) || IsNullOrWhiteSpace(textoPlano)) {
        return null;
    }
    try {
        var salt = getSecure16Bits(CryptoJS.lib.WordArray.random(128 / 8).toString());
        var k = getSecure16Bits(contrasenia);
        var key = CryptoJS.enc.Utf8.parse(k);
        var iv = CryptoJS.enc.Utf8.parse(getSecure16Bits(set(JSON.stringify({ ts: localStorage.getItem("aceptar"), clt: get(localStorage.getItem("remitente")) }))));

        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(salt + textoPlano), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();
    } catch (error) {
        return null;
    }
}

/**
 * Desencriptar un texto cifrado con AES - CBC (PKCS7) 16bits, para extraer su contenido 
 * @param {string} contrasenia
 * @param {string} encriptadoEnBase64
 * @returns {Promise<object|null>} null si hay algun error o el objeto que se recupero del taxto cifrado
 */
export async function desencriptar(contrasenia, encriptadoEnBase64) {
    if (IsNullOrWhiteSpace(contrasenia) || IsNullOrWhiteSpace(encriptadoEnBase64)) {
        return null;
    }
    try {

        var key = CryptoJS.enc.Utf8.parse(getSecure16Bits(contrasenia));
        var iv = CryptoJS.enc.Utf8.parse(getSecure16Bits(set(JSON.stringify({ ts: localStorage.getItem("aceptar"), clt: get(localStorage.getItem("remitente")) }))));

        var decrypted = CryptoJS.AES.decrypt(encriptadoEnBase64, key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        var res = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(res.substr(16));
    } catch (error) {
        return null;
    }
}

/**
 * Obtener 16bits seguros, extraidos de la clave generada con la funcion generate()
 * @param {string} str clave generada
 * @returns {string} 16bits extraidos de forma segura a partir de la clave proporcionada
 */
function getSecure16Bits(str) {
    var salida = "";
    var chars = str.split("");
    if (chars.length > 16) {
        var mid = Math.floor(chars.length / 2);
        var ini = mid - (16 / 2);
        var fin = mid + (16 / 2);
        for (let i = ini; i < fin; i++) {
            salida += chars[i];
        }
    }
    return salida;
}

/**
 * Descifrar los datos de las listas de estados enviadas desde el back 
 * @param {Array<{int_id:string, str_nombre:string, str_descripcion:string}>} arrayData
 * @returns {Array<{int_id:number, str_nombre:string, str_descripcion:string}>}
 */
export function _criptData(arrayData) {
    var array = [];
    for (let i = 0; i < arrayData.length; i++) {
        array.push({
            int_id: arrayData[i].int_id ? Number(get(arrayData[i].int_id)) : 0,
            str_nombre: arrayData[i].str_nombre ? get(arrayData[i].str_nombre) : "",
            str_descripcion: arrayData[i].str_descripcion ? get(arrayData[i].str_descripcion) : ""
        });
    }
    return array;
};

/**
 * Generar una lista de parametros descifrada
 * @param {Array<{int_id:int,str_nombre:string,str_nemonico:string,str_valor_ini:string,str_valor_fin:string,str_descripcion:string}>} lstParamsCrypt lista de parametros encriptada
 * @param {string} nameParams filtrar parametros por nombre
 * @returns {Array<{int_id:int,str_nombre:string,str_nemonico:string,str_valor_ini:string,str_valor_fin:string,str_descripcion:string}>} lista de parametros desencriptada
 */
export function decriptParams(lstParamsCrypt, nameParams) {
    var lst_tipos_tran = [];
    if (lstParamsCrypt && lstParamsCrypt.length > 0) {
        for (let i = 0; i < lstParamsCrypt.length; i++) {
            let nombre = get(lstParamsCrypt[i].str_nombre);
            if (nombre === nameParams) {
                lst_tipos_tran.push({
                    int_id: get(lstParamsCrypt[i].int_id),
                    str_nombre: nombre,
                    str_nemonico: get(lstParamsCrypt[i].str_nemonico),
                    str_valor_ini: get(lstParamsCrypt[i].str_valor_ini),
                    str_valor_fin: get(lstParamsCrypt[i].str_valor_fin),
                    str_descripcion: get(lstParamsCrypt[i].str_descripcion),
                });
            }
        }
    }
    return lst_tipos_tran;
}

export function generateToken(dato, ts) {
    const HMACSHA256 = (stringToSign, secret) => CryptoJS.HmacSHA256(stringToSign, secret).toString(CryptoJS.enc.Hex);

    // The header typically consists of two parts: 
    // the type of the token, which is JWT, and the signing algorithm being used, 
    // such as HMAC SHA256 or RSA.
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };
    const encodedHeaders = btoa(JSON.stringify(header));


    // The second part of the token is the payload, which contains the claims.
    // Claims are statements about an entity (typically, the user) and 
    // additional data. There are three types of claims: 
    // registered, public, and private claims.
    const claims = {
        "iss": "CoopMego",
        "aud": window.location.host,
        "jti": dato.str_sesion
    };
    const encodedPlayload = btoa(JSON.stringify(claims));


    // create the signature part you have to take the encoded header, 
    // the encoded payload, a secret, the algorithm specified in the header, 
    // and sign that.
    const key = set(JSON.stringify({ ts: ts, sender: dato.login }));
    const signature = HMACSHA256(`${encodedHeaders}.${encodedPlayload}`, key);
    const encodedSignature = btoa(signature);

    const jwt = `${encodedHeaders}.${encodedPlayload}.${encodedSignature}`
    return jwt;
}