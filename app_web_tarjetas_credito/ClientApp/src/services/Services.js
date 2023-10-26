import { getListaParametrosRequest } from "../redux/Parametros/actions";
import { IsNullOrWhiteSpace, getBrowserInfo, getOSInfo, validateToken, extractToken, generateRandomIntegerInRange } from "../js/utiles"
import { getUser, removeSession, saveSession, saveUser } from 'react-session-persist';
import { desencriptar, encriptar, generate, generateToken, get, set } from "../js/crypt";
import { setStateLoad } from "../redux/Loadding/actions";
import { setTokenStateAction } from "../redux/Token/actions";

/**
 * Obtener los datos del usuario de la Cookie de Sesion
 * @author jacarrion1
 * @version 1.0
 * @returns {Promise<object>} Retorna los datos del usuario en un objeto
 */
export async function getUsuario() {
    const sender = get(localStorage.getItem('sender'));
    const remitente = get(localStorage.getItem('remitente'));
    const ts = Number(localStorage.getItem('aceptar'));
    if (getUser() && remitente && sender) {
        let key = generate(navigator.userAgent, ts, remitente, sender);
        var datosUsuario = await desencriptar(key, getUser().data);
        return datosUsuario;
    } else {
        return null;
    }
}

/**
 * Actualizar los datos del usuario de la Cookie de Sesion
 * @author jacarrion1
 * @version 1.0
 * @returns {Promise<booean>} Retorna true o false si se pudo actualizar
 */
export async function setUsuario(user) {
    const sender = get(localStorage.getItem('sender'));
    const remitente = get(localStorage.getItem('remitente'));
    const ts = Number(localStorage.getItem('aceptar'));
    if (getUser() && remitente && sender) {
        let key = generate(navigator.userAgent, ts, remitente, sender);
        saveUser({ data: await encriptar(key, JSON.stringify(user)) });
        return true;
    } else {
        return false;
    }
}

/** Operación de agregar nueva conexión */
export const addConexion = "FETCH_ADD_CONEXION";

/** Operación de editar datos de una conexión */
export const setConexion = "FETCH_SET_CONEXION";
/** Operación de actualizar las preguntas de seguridad */
export const setPreguntas = "FETCH_SET_PREGUNTAS";
/** Operación de cambiar la contraseña de acceso al sistema */
export const setPassword = "FETCH_SET_PASSWORD";
/** Operación de modificar clave temporal e ingreso de datos por los usuarios nuevos */
export const setPasswordPrimeraVez = "FETCH_SET_PASSWORD_PRIMERA_VEZ";
/** Operación de resetear contraseña */
export const setResetPassword = "FETCH_SET_RESET_PASSWORD";

/** Operación de inicio de sesión */
export const getLogin = "FETCH_GET_LOGIN";
/** Operación de cerrar sesión */
export const getLogout = "FETCH_GET_LOGOUT";
/** Operación de inicio de sesión cuando un usuario tiene mas de un perfil */
export const getLoginPerfil = "FETCH_GET_LOGIN_PERFIL";

/** Operación de obtener la lisa de preguntas de seguridad que se pueden seleccionar */
export const getPreguntas = "FETCH_GET_LISTA_PREGUNTAS";
/** Operación de obtener la lista de preguntas de seguridad registradas por el usuario */
export const getPreguntaUsuario = "FETCH_GET_PREGUNTA_USUARIO";
/** Operación de verificar las respuestas a las pregntas de seguridad*/
export const getValidarPreguntaUsuario = "FETCH_GET_VALIDAR_PREGUNTA_USUARIO";

/** Operación de obtener el menú para el perfil del usuario */
export const getMenuPrincipal = "FETCH_GET_MENU_PRINCIPAL";
/** Operación de obtener los permisos del usuario */
export const getFuncionalidadesUsuario = "FETCH_GET_FUNCIONALDADES";

/** Operación de obtener la lista de archivos de texto de Logs */
export const getLogsTexto = "FETCH_GET_LOGS_TEXTO";
/** Operación de obtener el contenido de un archivo de Logs */
export const getContenidoLogsTexto = "FETCH_GET_CONTENIDO_LOGS_TEXTO";
/** Operación de descargar el archivo de Logs */
export const getDescargarLogsTexto = "FETCH_DOWNLOAD_LOGS_TEXTO";
/** Operación de obtener la lisa de bases de datos de MongoDB */
export const getListaBases = "FETCH_GET_LISTA_BASES";
/** Operación de obtener la lista de colecciones de una base de datos de MongoDB */
export const getListaColecciones = "FETCH_GET_LISTA_COLECCIONES";
/** Operación de obtener los registros de una coleccion de una base de MongoDB */
export const getListaDocumentos = "FETCH_GET_LISTA_DOCUMENTOS";
/** Operación de obtener el resultado del seguimiento de una transacción */
export const getListaSeguimiento = "FETCH_GET_LISTA_SEGUIMIENTO";
/** Operación de obtener la lista de conexiones de MongoDB */
export const getListaConexiones = "FETCH_GET_CONEXIONES";

/**
 * Obtener la Url de un servicio de acuerdo a su nombre de Proceso Unico
 * @author jacarrion1
 * @version 1.0
 * @param {string} request Nombre de Proceso Unico
 * @param {object=} params Objeto que contiene los parametros que se envian por URL
 * @returns {string?} Retornar la URL del recurso solicitado.
 */
export function ServiceUrl(request, params = []) {
    let pathOut = null;
    switch (request) {
        case getLogin:
            pathOut = 'lgn';
            break;
        case getLogout:
            pathOut = 'lgn/logout/' + params.id_usuario;
            break;
        case getLoginPerfil:
            pathOut = (!IsNullOrWhiteSpace(params) && !IsNullOrWhiteSpace(params.id_usuario) && !IsNullOrWhiteSpace(params.id_perfil)) ? 'lgn/' + params.id_usuario + '/' + params.id_perfil : null;
            break;
        case getListaParametrosRequest:
            pathOut = 'cfn';
            break;
        case getFuncionalidadesUsuario:
            pathOut = 'cfn/obtener/funcionalidad';
            break;
        case getMenuPrincipal:
            pathOut = (!IsNullOrWhiteSpace(params) && !IsNullOrWhiteSpace(params.perfil)) ? 'cfn/obtener/menus/' + params.perfil : null;
            break;
        case getValidarPreguntaUsuario:
            pathOut = 'usr/obtener/validar/preguntas';
            break;
        case getPreguntas:
            pathOut = 'usr/obtener/preguntas';
            break;
        case getPreguntaUsuario:
            pathOut = (!IsNullOrWhiteSpace(params) && !IsNullOrWhiteSpace(params.login)) ? 'usr/obtener/preguntas/usuarios/' + params.login : null;
            break;
        case setPreguntas:
            pathOut = 'usr/actualizar/pregunta';
            break;
        case setPassword:
            pathOut = 'usr/actualizar/clave';
            break;
        case setPasswordPrimeraVez:
            pathOut = 'usr/actualizar/clave/1';
            break;
        case setResetPassword:
            pathOut = 'usr/resetear/clave';
            break;
        case getLogsTexto:
            pathOut = 'lgs/obtener/archivos';
            break;
        case getContenidoLogsTexto:
            pathOut = 'lgs/obtener/texto';
            break;
        case getDescargarLogsTexto:
            pathOut = 'lgs/descargar/archivo';
            break;
        case getListaBases:
            pathOut = 'lgs/obtener/bases';
            break;
        case getListaColecciones:
            pathOut = 'lgs/obtener/cols';
            break;
        case getListaDocumentos:
            pathOut = 'lgs/obtener/docs';
            break;
        case getListaSeguimiento:
            pathOut = 'lgs/seguimiento';
            break;
        case getListaConexiones:
            pathOut = 'lgs/obtener/con';
            break;
        case addConexion:
            pathOut = 'lgs/agregar/con';
            break;
        case setConexion:
            pathOut = 'lgs/edit/con';
            break;
        default:
            return null;
    }
    return pathRewrite(pathOut);
};

/**
 * Funcion que realiza peticiones GET
 * @author jacarrion1
 * @version 1.0
 * @param {string} request Nombre de Proceso Unico
 * @param {boolean?} encrypt La respuesta de la peticion es encriptada?
 * @param {{encrypt?: boolean|true, params?: object|null, dispatch?: Function|null, exProcess?: boolean|false}=} param2
 * @returns {Promise<{error: string, reload: boolean}> | Promise<object>}
 */
export async function ServicioGetExecute(request, token, { encrypt = true, params = null, dispatch = null, exProcess = false }) {
    const sender = localStorage.getItem('sender');
    if (exProcess) localStorage.setItem("sender", set("Param"));

    if (!IsNullOrWhiteSpace(token) && validateToken(token)) {
        if (IsNullOrWhiteSpace("sender")) {
            localStorage.removeItem("sender");
        } else {
            localStorage.setItem("sender", sender);
        }

        if (dispatch) dispatch(setStateLoad(true));
        try {
            var datosUsuario = await getUsuario();
            datosUsuario = typeof datosUsuario === 'string' || datosUsuario instanceof String ? null : datosUsuario;

            const remitente = localStorage.getItem('remitente');
            const ts = encrypt ? Number(generateRandomIntegerInRange(2, 5) + "" + new Date().getTime()) : Number(localStorage.getItem('aceptar'));
            const lgn = datosUsuario ? datosUsuario.login : exProcess ? "Param" : "";
            if (!IsNullOrWhiteSpace(remitente) && ts > 0 && !IsNullOrWhiteSpace(lgn)) {
                let key = generate(navigator.userAgent, ts, get(remitente), lgn);
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        "aceptar": ts + "",
                        "remitente": remitente,
                        "sender": set(lgn),
                        "receiver": localStorage.getItem('aceptar'),
                        "Enabling-Data": token,
                        "Habilitar": datosUsuario ? generateToken(datosUsuario, ts) : set("temporal"),
                        "Proceso": exProcess
                    }
                };

                const response = await fetch(ServiceUrl(request, params), requestOptions);
                if (response.ok) {
                    localStorage.setItem("Acept", ts);
                    let grandTok = extractToken(response.headers.get("Grand-Tok"));
                    if (IsNullOrWhiteSpace(grandTok)) {
                        if (dispatch) dispatch(setTokenStateAction(""));
                        return { error: "Petición no permitida", reload: true };
                    } else {
                        let r = await response.json();
                        if (dispatch) dispatch(setTokenStateAction(grandTok));
                        var resp = encrypt ? await desencriptar(key, r.data) : r;
                        if (dispatch) dispatch(setStateLoad(false));
                        return resp;
                    }
                } else {
                    if (dispatch) dispatch(setStateLoad(false));
                    if (response.status === 401) {
                        localStorage.removeItem('sender');
                        localStorage.removeItem('remitente');
                        localStorage.removeItem('aceptar');
                        saveSession(false);
                        removeSession();
                        return { error: "Tu sesión ha caducado, por favor ingresa nuevamente al sistema", reload: true };
                    } else {
                        return { error: IsNullOrWhiteSpace(response.status) ? "Error en al obtener los datos" : response.status + " - " + response.statusText, reload: false };
                    }
                }
            }
        } catch (error) {
            console.log('Hubo un problema con la petición Fetch GET ' + request + ": ", error);
            if (dispatch) dispatch(setStateLoad(false));
            return { error: "Ocurrió un error en la petición", reload: false };
        }
    } else {
        return { error: "Se presentó un inconveniente, por favor intente nuevamente más tarde\n" + ServiceUrl(request, params), reload: false };
    }
};

/**
 * Funcion que realiza peticiones POST
 * @author jacarrion1
 * @version 1.0
 * @param {string} request Nombre de Proceso Unico
 * @param {object} body Cuerpo de la peticion que se envia por HTTP
 * @param {{encryptS?:boolean|true, encryptR?:boolean|true, params?:object|null, responseJSON?:boolean|true, responseBLOB?:boolean|false, dispatch?:Function|null, exProcess?: boolean|false, background?: boolean|false}=} param Objeto que contiene los modificadores del metodo
 * @returns {Promise<{error: string, reload: boolean}> | Promise<object>} Si la respuesta esta encriptada se desencripta y se retorna un objeto
 */
export async function ServicioPostExecute(request, body, token, { encryptS = true, encryptR = true, params = null, responseJSON = true, responseBLOB = false, dispatch = null, exProcess = false, background = false } = {}) {
    if (dispatch && !background) dispatch(setStateLoad(true));

    const sender = localStorage.getItem('sender');
    if (exProcess) localStorage.setItem("sender", set("Param"));

    if (!IsNullOrWhiteSpace(token) && validateToken(token)) {
        if (IsNullOrWhiteSpace("sender")) {
            localStorage.removeItem("sender");
        } else {
            localStorage.setItem("sender", sender);
        }

        try {
            var datosUsuario = await getUsuario();
            datosUsuario = typeof datosUsuario === 'string' || datosUsuario instanceof String ? null : datosUsuario;

            body.str_login = datosUsuario ? datosUsuario.login : exProcess ? "Param" : "";
            const remitente = localStorage.getItem('remitente');
            const ts = encryptS && encryptR ? Number(generateRandomIntegerInRange(2, 5) + "" + new Date().getTime()) : Number(localStorage.getItem('aceptar'));
            const lgn = IsNullOrWhiteSpace(body.str_login) ? body.login : body.str_login;

            body.str_mac_dispositivo = getBrowserInfo() + " - " + getOSInfo();
            let key = generate(navigator.userAgent, ts, get(remitente), lgn);
            body.str_sesion = datosUsuario ? datosUsuario.str_sesion : "";
            if (!body.str_id_usuario) {
                body.str_id_usuario = datosUsuario ? datosUsuario.id_usuario + "" : "0";
            }
            body.str_id_oficina = datosUsuario ? datosUsuario.id_oficina + "" : "";
            body.str_id_perfil = datosUsuario ? datosUsuario.id_perfil + "" : "";
            var strBody = JSON.stringify(body);
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "aceptar": ts + "",
                    "remitente": remitente,
                    "sender": set(lgn),
                    "receiver": localStorage.getItem('aceptar'),
                    "Enabling-Data": token,
                    "Habilitar": datosUsuario ? generateToken(datosUsuario, ts) : set("habilitar temporal"),
                    "Proceso": exProcess
                },
                body: encryptS ? JSON.stringify({ data: await encriptar(key, strBody) }) : strBody
            };

            const response = await fetch(ServiceUrl(request, params), requestOptions);
            if (response.ok) {
                localStorage.setItem("Acept", ts);
                let grandTok = extractToken(response.headers.get("Grand-Tok"));
                if (IsNullOrWhiteSpace(grandTok)) {
                    if (dispatch) dispatch(setTokenStateAction(""));
                    return { error: "Petición no permitida", reload: true };
                } else {
                    if (responseBLOB) {
                        if (response.status === 220) {
                            responseJSON = true;
                        } else {
                            let str = response.headers.get("Content-Disposition").split(";")[1].split("=")[1];
                            if (dispatch) dispatch(setStateLoad(false));
                            return {
                                fileName: str.substr(1, str.length - 2),
                                file: response.blob()
                            };
                        }
                    }
                    var re = response.body;
                    if (responseJSON) {
                        let r = await response.json();
                        re = encryptR ? await desencriptar(key, r.data) : r;
                        re.solToken = grandTok;
                        if (re.codigo === "") {
                            re.codigo = "0001";
                            re.mensaje = "No se ha podido obtener los datos";
                        }
                    }
                    if (dispatch) dispatch(setTokenStateAction(grandTok));
                    if (dispatch) dispatch(setStateLoad(false));
                    return re;
                }
            } else {
                if (dispatch) dispatch(setStateLoad(false));
                if (response.status === 401) {
                    localStorage.removeItem('sender');
                    localStorage.removeItem('remitente');
                    localStorage.removeItem('aceptar');
                    saveSession(false);
                    removeSession();
                    return { error: "Tu sesión ha caducado, por favor ingresa nuevamente al sistema", reload: true };
                } else {
                    return { error: IsNullOrWhiteSpace(response.status) ? "Error en al obtener los datos" : response.status + " - " + response.statusText, reload: false };
                }
            }
        } catch (error) {
            console.log('Hubo un problema con la petición Fetch POST ' + request + ": ", error);
            if (dispatch) dispatch(setStateLoad(false));
            return { error: "Ocurrió un error en la petición", reload: false };
        }
    } else {
        if (dispatch) dispatch(setStateLoad(false));
        return { error: "Se presentó un inconveniente, por favor intente nuevamente más tarde\n" + ServiceUrl(request, params), reload: false };
    }
};

/**
 * Convertir las URL en las urls reales de acceso al backend
 * @author jacarrion1
 * @version 1.0
 * @param {string} path URL enmascarada, generada por el metodo ServiceUrl
 * @returns {string?} Devuleve la url real para poder hacer la peticion http
 */
function pathRewrite(path) {
    const context = {
        "lgn": "login",
        "cfn": "config",
        "cfn/obtener/menus": "config/get/menu",
        "cfn/obtener/funcionalidad": "config/get/funcionalidades",
        "usr/obtener/preguntas/usuarios": "usuario/get/pregunta/usuario",
        "usr/obtener/validar/preguntas": "usuario/get/validar/pregunta",
        "usr/obtener/preguntas": "usuario/get/preguntas",
        "usr/actualizar/pregunta": "usuario/set/preguntas",
        "usr/actualizar/clave": "usuario/set/password",
        "usr/actualizar/clave/1": "usuario/set/password/primera",
        "usr/resetear/clave": "usuario/reset/password",
        "lgs/obtener/archivos": '/logs/get/archivos',
        "lgs/obtener/texto": '/logs/get/contenido',
        "lgs/descargar/archivo": '/logs/download/contenido',
        "lgs/obtener/bases": '/logs/get/bds',
        "lgs/obtener/cols": '/logs/get/colecciones',
        "lgs/obtener/docs": '/logs/get/documentos',
        "lgs/seguimiento": '/logs/get/seguimiento',
        "lgs/obtener/con": '/logs/get/conexiones',
        "lgs/agregar/con": '/logs/add/conexion',
        "lgs/edit/con": '/logs/set/conexion',
    };
    if (path) {
        var p = context[path];
        if (p) {
            return path.replace(path, p);
        } else {
            /// Hacer esto con las rutas que envian parametros en la url
            var contextUrl = ["lgn", "cfn/obtener/menus", "usr/obtener/preguntas/usuarios", "dsp/bloqueo/lstar"];
            for (let i = 0; i < contextUrl.length; i++) {
                if (path.startsWith(contextUrl[i])) {
                    return path.replace(contextUrl[i], context[contextUrl[i]]);
                }
            }
            return path.replace(path, '/intento');
        }
    } else {
        return null;
    }
};