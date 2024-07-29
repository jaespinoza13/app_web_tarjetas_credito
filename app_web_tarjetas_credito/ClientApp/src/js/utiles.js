/*************************************************************/
/* Funciones que se usan de forma general en los componentes */
/*************************************************************/
import jwt_decode from "jwt-decode";
import { getUser } from 'react-session-persist';
import { desencriptar, encriptar, generate, get, set } from './crypt';
import { number } from "prop-types";

/**
 * Metodo que transforma el formato ingresado en valores que representan la fecha enviada
 * @name dateFormat
 * @namespace Utiles
 * @author jacarrion1
 * @version 1.0.0
 * @example dateFormat("yyyy-MMM-dd", new Date()) | dateFormat("yyyy-MMM-dd", "2023-02-26")
 * @param {string} format
 * @param {any} date
 * @returns {string} devuleve un string con los datos reemplazados: "2023-FEB-26"
 */
export function dateFormat(format, date) {
    var fecha = new Date(date);
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    var anio = fecha.getFullYear();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var diaS = fecha.getDay();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();
    var segundo = fecha.getSeconds();
    format = format.replaceAll("hh", hora);
    format = format.replaceAll("HH", String(hora).padStart(2, '0'));
    format = format.replaceAll("min", minuto);
    format = format.replaceAll("MIN", String(minuto).padStart(2, '0'));
    format = format.replaceAll("ss", segundo);
    format = format.replaceAll("SS", String(segundo).padStart(2, '0'));
    format = format.replaceAll("yyyy", anio);
    format = format.replaceAll("yyy", String(anio).substring(1, 10));
    format = format.replaceAll("yy", String(anio).substring(2, 10));
    format = format.replaceAll("MMMM", meses[mes - 1].toUpperCase());
    format = format.replaceAll("MMM", meses[mes - 1].substring(0, 3).toUpperCase());
    format = format.replaceAll("mmmm", meses[mes - 1].toLowerCase());
    format = format.replaceAll("Mmmm", meses[mes - 1]);
    format = format.replaceAll("mmm", meses[mes - 1].substring(0, 3).toLowerCase());
    format = format.replaceAll("Mmm", meses[mes - 1].substring(0, 3));
    format = format.replaceAll("mm", mes);
    format = format.replaceAll("MM", String(mes).padStart(2, '0'));
    format = format.replaceAll("DDDD", dias[diaS].toUpperCase());
    format = format.replaceAll("DDD", dias[diaS].substring(0, 3).toUpperCase());
    format = format.replaceAll("Dddd", dias[diaS]);
    format = format.replaceAll("dddd", dias[diaS].toLowerCase());
    format = format.replaceAll("ddd", dias[diaS].substring(0, 3).toLowerCase());
    format = format.replaceAll("Ddd", dias[diaS].substring(0, 3));
    format = format.replaceAll("dd", dia);
    format = format.replaceAll("DD", String(dia).padStart(2, '0'));
    return format;
}

/**
 * Verifica si una variable es null o contiene un texto vacio o un espacio en blanco
 * @param {any} variable
 * @returns {boolean}
 */
export function IsNullOrWhiteSpace(variable) {
    if (typeof variable === 'string' || variable instanceof String) {
        return IsNullOrEmpty(variable) || variable.trim() === "";
    } else {
        return IsNullOrEmpty(variable) || variable === " ";
    }
}

/**
 * Verifica si una variable es null o contiene un texto vacio
 * @param {any} variable
 * @returns {boolean}
 */
export function IsNullOrEmpty(variable) {
    return !variable || variable === null || variable === "";
}

/**
 * Obtener los datos del navegador actual
 * @returns {string} 
 */
export function getBrowserInfo() {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
};

/**
 * Obtener los datos del sistema operativo del cliente
 * @returns {string} 
 */
export function getOSInfo() {
    let userDetails = navigator.userAgent
    const osList = [
        { name: 'Android', value: 'Android' },
        { name: 'iPhone', value: 'iPhone' },
        { name: 'Linux', value: 'Linux' },
        { name: 'Windows', value: 'Windows' },
        { name: 'Macintosh', value: 'Macintosh' },
        { name: 'iPad', value: 'iPad' },
    ]
    for (let i in osList) {
        if (userDetails.includes(osList[i].value)) {
            return osList[i].name
        }
    }
}

/**
 * Convertir primeras las letras de cada palabra en mayusculas
 * @param {string} str
 */
export function toCapitalize(str) {
    str = str.toLowerCase();
    if (str.includes(" ")) {
        const arr = str.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        const str2 = arr.join(" ");
        return str2;
    } else {
        var str2 = str.charAt(0).toUpperCase() + str.slice(1);
        return str2;
    }
}

/**
 * Reducir el tamaño de un string 
 * @param {string} str
 * @param {number} size
 */
export function reduceString(str, size) {
    if (size > 0 && size < str.length) {
        let str2 = "";
        for (let i = 0; i < size - 3; i++) {
            str2 += str.charAt(i);
        }
        str = str2 + "...";
    }
    return str;
}

/**
 * Valida que un campo (Input) contenga solo numeros 
 * @param {InputEvent} evt
 * @returns {boolean} 
 */
export function validarSoloNumeros(evt) {
    var code = (evt.which) ? evt.which : evt.keyCode;
    if (code === 8 || code === 46) { // backspace / delete.
        return true;
    } else if (code >= 48 && code <= 57) {
        return true;
    } else {
        return false;
    }
}

/**
 * Vaidar si un texto contiene caracteres especiales
 * @param {string} text
 * @returns {{ bln:boolean, text:string }}
 */
export function validarContieneEspecial(text) {
    if (IsNullOrWhiteSpace(text)) {
        return { bln: true, text: "campo vacio" };
    }
    var validadores = "~!@#$%^&*()_+=-[]{};':\"./>?,<";
    for (var i = 0; i < text.length; i++) {
        if (validadores.indexOf(text.charAt(i), 0) !== -1) {
            return { bln: true, text: "caracteres especiales" };
        }
    }
    return { bln: false, text: "caracteres especiales" };
}

/**
 * Vaidar si un texto contiene letras
 * @param {string} text
 * @returns {{ bln:boolean, text:string }}
 */
export function validarContieneLetras(text) {
    return { bln: validarContieneMinusculas(text).bln || validarContieneMayusculas(text).bln, text: "letras" };
}

/**
 * Vaidar si un texto contiene caracteres alfanumericos
 * @param {string} text
 * @returns {{ bln:boolean, text:string }}
 */
export function validarContieneAlfanumerico(text) {
    return { bln: validarContieneMinusculas(text).bln || validarContieneMayusculas(text).bln || validarContieneNumeros(text).bln, text: "letras y números" };
}

/**
 * Vaidar si un texto contiene letras minusculas
 * @param {string} text
 * @returns {{ bln:boolean, text:string }}
 */
export function validarContieneMinusculas(text) {
    if (IsNullOrWhiteSpace(text)) {
        return { bln: true, text: "campo vacio" };
    }
    var validadores = "abcdefghyjklmnñopqrstuvwxyz";
    for (var i = 0; i < text.length; i++) {
        if (validadores.indexOf(text.charAt(i), 0) !== -1) {
            return { bln: true, text: "letras" };
        }
    }
    return { bln: false, text: "letras" };
}

/**
 * Vaidar si un texto contiene letras mayusculas
 * @param {string} text
 * @returns {{ bln:boolean, text:string }}
 */
export function validarContieneMayusculas(text) {
    if (IsNullOrWhiteSpace(text)) {
        return { bln: true, text: "campo vacio" };
    }
    var validadores = "ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";
    for (var i = 0; i < text.length; i++) {
        if (validadores.indexOf(text.charAt(i), 0) !== -1) {
            return { bln: true, text: "letras" };
        }
    }
    return { bln: false, text: "letras" };
}

/**
 * Vaidar si un texto contiene numeros
 * @param {string} text
 * @returns {{ bln:boolean, text:string }}
 */
export function validarContieneNumeros(text) {
    if (IsNullOrWhiteSpace(text)) {
        return { bln: true, text: "campo vacio" };
    }
    var validadores = "0123456789";
    for (var i = 0; i < text.length; i++) {
        if (validadores.indexOf(text.charAt(i), 0) !== -1) {
            return { bln: true, text: "números" };
        }
    }
    return { bln: false, text: "números" };
}

/**
 * Se verifica si la clave respeta la estructura de clave segura, 
 * numero de caracteres, si contiene caracteres especiales
 * si contiene numeros, y combinacion de mayusculas y minusculas
 * @param {string} text
 * @param {number} nro_caracteres
 * @returns {{ bln:boolean, text:string }}
 */
export function validarFormatoPassword(text, nro_caracteres) {
    var flag = false;
    if (text.length >= nro_caracteres &&
        validarContieneEspecial(text).bln &&
        validarContieneNumeros(text).bln &&
        validarContieneMinusculas(text).bln &&
        validarContieneMayusculas(text).bln) {
        flag = true;
    }
    return { bln: flag, text: "La estructura de la clave segura es: mínimo " + nro_caracteres + " caracteres, utilice combinación de mayúsculas, minúsculas, números y caracteres especiales" };
}

/**
 * Validar que la clave ingresada es correcta
 * @param {string} pass string md5
 * @returns {Promise<{ bln:boolean, text:string }>}
 */
export async function validarPassAnterior(pass) {
    var flag = false;
    if (!IsNullOrWhiteSpace(pass)) {
        const sender = localStorage.getItem('sender');
        const remitente = localStorage.getItem('remitente');
        const ts = Number(localStorage.getItem('aceptar'));
        let key = generate(navigator.userAgent, ts, get(remitente), get(sender));
        var data = await desencriptar(key, getUser().data);
        if (!IsNullOrWhiteSpace(pass) && data && pass === data.password) {
            flag = true;
        }
    }
    return { bln: flag, text: "La clave anterior no es correcta" };
}

/**
 * Verificar que la clave y su confirmacion sean iguales
 * @param {string} pass
 * @param {string} confirm
 * @returns {{ bln:boolean, text:string }}
 */
export function validarIgualdadPassword(pass, confirm) {
    var flag = false;
    if (!IsNullOrWhiteSpace(pass) && !IsNullOrWhiteSpace(confirm) && pass === confirm) {
        flag = true;
    }
    return { bln: flag, text: "La confirmación de clave no es correcta" };
}

/**
 * Validar que el celular cumpla con la estructura estandar
 * @param {strng} phone
 * @returns {{ bln:boolean, text:string }}
 */
export function validarCelular(phone) {
    var flag = false;
    if (!IsNullOrWhiteSpace(phone) && phone.length === 10 && phone.startsWith("09") && !validarContieneEspecial(phone).bln && !validarContieneLetras(phone).bln) {
        flag = true;
    }
    return { bln: flag, text: "El celular ingresado es incorrecto" };
}

/**
 * Validar que el email cumpla con la estructura estandar
 * @param {string} email
 * @returns {{ bln:boolean, text:string }}
 */
export function validarEmail(email) {
    var flag = false;
    var regEx = /\w+[.-\w]*@\w+\.\w+[.\w]*/;
    if (!IsNullOrWhiteSpace(email) && email.length > 4 && regEx.test(email)) {
        flag = true;
    }
    return { bln: flag, text: "El e-mail ingresado es incorrecto" };
}

/**
 * Extraer el tken del base64
 * @param {string} token
 */
export function extractToken(token) {
    var iteraciones = Number(localStorage.getItem("Acept").substr(0, 1));
    if (iteraciones < 2) {
        iteraciones = 2
    }
    for (let i = 0; i < iteraciones; i++) {
        try {
            token = atob(token);
        } catch (e) {
        }
    }
    return token;
}

/**
 * Validar datos del token y validez del mismo
 * @param {string} token
 */
export function validateToken(token) {
    try {
        var decoded = jwt_decode(token);
        if (decoded.data !== set(localStorage.getItem("sender") + localStorage.getItem("remitente")) ||
            new Date(EpochToDate(decoded.exp)) <= new Date(EpochToDate(decoded.nbf)) ||
            new Date(EpochToDate(decoded.exp)) < new Date() ||
            new Date(EpochToDate(decoded.nbf)) > new Date()) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        return false;
    }
}

/**
 * Generar un int random en un rango 
 * @param {number} min
 * @param {number} max
 */
export function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Obtener el Date de un timestamp Epoch
 * @param {any} timestamp
 */
export function EpochToDate(timestamp) {
    var inputtext = cleanTimestamp(timestamp);
    if ((inputtext.length === 0) || isNaN(inputtext)) {
        if (isHex(inputtext)) {
            inputtext = '0x' + inputtext;
        } else {
            return;
        }
    }
    inputtext = inputtext * 1;
    if ((inputtext >= 1E16) || (inputtext <= -1E16)) {
        inputtext = Math.floor(inputtext / 1000000);
    } else if ((inputtext >= 1E14) || (inputtext <= -1E14)) {
        inputtext = Math.floor(inputtext / 1000);
    } else if ((inputtext >= 1E11) || (inputtext <= -3E10)) {
    } else {
        inputtext = (inputtext * 1000);
    }
    return new Date(inputtext);
}

/**
 * Limpiar el timestamp para extraer el Date
 * @param {any} ts
 */
function cleanTimestamp(ts) {
    let strTs = String(ts);
    if (!strTs) {
        return "";
    }
    strTs = strTs.replace(/[`'"\s,]+/g, '');
    if (strTs.charAt(strTs.length - 1) === "L") {
        strTs = strTs.slice(0, -1);
    }
    return strTs;
}

/**
 * Saber si un texto es hexadecimal
 * @param {any} h
 */
function isHex(h) {
    var a = parseInt(h, 16);
    return (a.toString(16) === h.toLowerCase())
}

/**
 * Blanquear el texto de un campo sencible, sin perder el dato original
 * @param {string} txt_old
 * @param {string} txt_new
 */
function offTextPass(txt_old, txt_new) {
    var textAux = txt_new;
    if (txt_new.substring(txt_new.length - 1) === "*") {
        textAux = txt_old.substring(0, txt_new.length);
    } else {
        if (IsNullOrWhiteSpace(txt_new)) {
            textAux = "";
        } else {
            if (txt_new.length > 0) {
                textAux = txt_old + txt_new.substring(txt_new.length - 1);
            } else {
                textAux = txt_new;
            }
        }
    }
    return textAux;
}

/**
 * Blanquear el texto de los campos password sin perder el texto de la password
 * @param {string} passAnterior
 * @param {string} passAnteriorNew
 * @param {(password: string, passwordOff: string)=>void} onFinish
 */
export function setPasswordWithOff(passAnterior, passAnteriorNew, onFinish) {
    var passAux = offTextPass(passAnterior, passAnteriorNew);
    var off = "";
    for (let i = 0; i < passAnteriorNew.length; i++) {
        off += "*";
    }
    onFinish(passAux, off);
}

/**
 * Blanquear un texto sin perder el original
 * @param {string} pass
 * @param {(text: string, textOff: string)=>void} onFinish
 */
export function offText(pass, onFinish) {
    var off = "";
    for (let i = 0; i < pass.length; i++) {
        off += "*";
    }
    onFinish(pass, off);
}

/**
 * Descifrar el storage con las conexiones locales del usuario 
 * @param {string} str texto cifrado
 * @returns {Promise<object> | null}
 */
export async function obtenerConexionesLocales(str) {
    if (!IsNullOrWhiteSpace(str)) {
        const sender = localStorage.getItem('sender');
        const remitente = localStorage.getItem('remitente');
        const ts = Number(localStorage.getItem('aceptar'));
        let key = generate(navigator.userAgent, ts, get(remitente), get(sender));
        var data = await desencriptar(key, str);
        return data;
    }
    return null;
}

/**
 * Cifrar en el storage las conexiones locales del usuario 
 * @param {object} obj objeto a cifrar
 * @returns {Promise<string> | null}
 */
export async function cifrarConexionesLocales(obj) {
    if (!IsNullOrWhiteSpace(obj)) {
        const sender = localStorage.getItem('sender');
        const remitente = localStorage.getItem('remitente');
        const ts = Number(localStorage.getItem('aceptar'));
        let key = generate(navigator.userAgent, ts, get(remitente), get(sender));
        var data = await encriptar(key, JSON.stringify(obj));
        return data;
    }
    return null;
}

/**
 * Obtener la lista de conexionde desuario desde el LocalStorage
 * @param {string} loginUser
 * @param {number} idUser
 * @returns {Promise<[]> | Promise<Array<{ id:number, usr:string, usr_id:number, clv:string, srv:string }>>}
 */
export async function obtenerConecxionesStorage(loginUser, idUser) {
    var conecionesLocales = localStorage.getItem("COEXIONES_LOCALES");
    if (!IsNullOrWhiteSpace(conecionesLocales)) {
        var localesIni = JSON.parse(conecionesLocales);
        if (localesIni && localesIni[set(loginUser + String(idUser))]) {
            var locales = await obtenerConexionesLocales(localesIni[set(loginUser + String(idUser))]);
            if (locales.length > 0) {
                locales = locales.filter((el) => el.usr_id === idUser);
                return locales;
            }
            return [];
        }
        return [];
    }
    return [];
}

/**
 * Guardar en el LocalStorage las conexiones locales cifradas por usuario
 * @param {string} loginUser
 * @param {number} idUser
 * @param {Array<{ id:number, usr:string, usr_id:number, clv:string, srv:string }>} locales
 */
export async function persistirConexionesStorage(loginUser, idUser, locales) {
    var conecionesLocales = localStorage.getItem("COEXIONES_LOCALES");
    var localesIni = {};
    if (!IsNullOrWhiteSpace(conecionesLocales)) {
        localesIni = JSON.parse(conecionesLocales);
    }
    localStorage.removeItem("COEXIONES_LOCALES");
    localesIni[set(loginUser + idUser)] = await cifrarConexionesLocales(locales);
    localStorage.setItem("COEXIONES_LOCALES", JSON.stringify(localesIni));
}

export function validaCedula (strCedula) {
    let suma = 0;
    let resultado = false;

    // Validar longitud de la cédula o RUC
    if (strCedula.length !== 10) {
        // Si la longitud no es igual a 10, retorna falso
        return false;
    }

    // Iterar sobre los primeros 9 dígitos de la cédula o RUC
    for (let i = 0; i < 9; i++) {
        // Obtener el i-ésimo dígito como número
        const j = parseInt(strCedula.charAt(i), 10);

        // Determinar el factor multiplicador (1 o 2)
        let x = (i % 2 === 0) ? j * 2 : j;

        // Si el resultado de la multiplicación es mayor a 9, ajustar
        if (x > 9) {
            x = x - 9;
        }

        // Sumar el resultado al acumulador
        suma += x;
    }

    // Calcular el dígito verificador
    const verificador = (10 - (suma % 10)) % 10;

    // Comparar el dígito verificador calculado con el último dígito de la cédula o RUC
    if (verificador === parseInt(strCedula.charAt(9), 10)) {
        resultado = true;
    }

    return resultado;
}

/**
 * Obtener la lista de conexionde desuario desde el LocalStorage
 * @param {string} enlace
 * @returns {Promise<object> | null}
 */
export function extraerFuncionalPadre(enlace) {
    var funcionalidad = enlace.split('/',2)[1];
    return funcionalidad;

}


/**
 * FUNCIONES PARA VALIDAR CADENA DE BYTES PARA GENERAR REPORTE
 */
export function verificarPdf(pdf) {
    if (pdf === null || pdf === undefined || pdf === '') {
        return false;
    }
    return true;
}

/**
 * 
 * @param {any} base64 es el arreglo de bytes a trasformar
 * @param {any} type es e tipo de formato
 * @returns
 */
export function base64ToBlob(base64, type = 'application/octet-stream') {
    const binStr = atob(base64);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], { type: type });
}

export function descargarArchivo(blob, nombreArchivo = "document", extensionArchivo, visualizar) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${nombreArchivo}.${extensionArchivo}`;
    if (visualizar) {
        link.target = "_blank";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export function generarFechaHoy(){
        let fechaHoy = new Date();
        let day = fechaHoy.getDate();
        let month = fechaHoy.getMonth() + 1;
        let year = fechaHoy.getFullYear();


        if (day < 10 && month < 10) {
            fechaHoy = `0${month}0${day}${year}`;
        }
        else if (day < 10) {
            fechaHoy = `${ month }0${day}${ year }`;
        }
        else if (month < 10) {
            fechaHoy = `0${month}${day}${year}`;
        }
        else {
            fechaHoy = `${month}${day}${year}`;
        }
        return fechaHoy;
}


export function conversionTipoTC (tipo){
    let chipType = '';
    switch (tipo) {
        case 'BLACK':
            chipType = 'black'
            break;
        case 'GOLDEN':
            chipType = 'gold'
            break;
        case 'ESTÁNDAR':
            chipType = 'standar'
            break;
        default:
            break;
    }
    return chipType;
}

export function conversionBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        }

        fileReader.onerror = (error) => {
            reject(error);
        }
    })
}



export function validarCorreo(correo) {
    // Expresión regular para validar el formato del correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valida = regex.test(correo);
    return valida;
}


export function numberFormatMoney(numero) {
    let IsNaNNumero = isNaN(numero);
    let valor = "$ 0,00";
    if (IsNaNNumero) {
        return valor;
    } else {
        valor = (numero).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        valor = valor.replace('.', '#'); // Reemplaza todos los puntos con un marcador temporal '#'
        // Luego, reemplazamos las comas decimales por puntos
        valor = valor.replace(',', '.'); // Reemplaza todas las comas con puntos
        // Finalmente, reemplazamos el marcador temporal '#' con comas
        valor = valor.replace('#', ','); // Reemplaza el marcador temporal '#' con comas
        valor = valor.replace('$', '$ '); 

    }    
    return valor;
}



/*
export function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error al convertir a base64: ', error);
    };
}*/