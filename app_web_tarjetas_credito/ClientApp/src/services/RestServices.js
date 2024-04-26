import { ServicioGetExecute, getMenuPrincipal, getPreguntaUsuario, ServicioPostExecute, getValidarPreguntaUsuario, setResetPassword, getLogin, getLoginPerfil, getPreguntas, setPreguntas, setPassword, setPasswordPrimeraVez, getListaBases, getListaConexiones, setConexion, addConexion, getListaSeguimiento, getListaDocumentos, getListaColecciones, getDescargarLogsTexto, getLogsTexto, getContenidoLogsTexto, getValidaciones, getScore, getInfoSocio, getInfoEco, addAutorizacion, getSolicitudes, addSolicitud, getContrato, getInfoFinan, addProspecto, getComentarios, getFlujoSolicitud, addComentarioAsesor, addComentarioSolicitud } from './Services';
import { setAlertText, setErrorRedirigir } from "../redux/Alert/actions";
import hex_md5 from '../js/md5';
import { desencriptar, generate, get, set } from '../js/crypt';
import { getUser, removeSession, saveSession } from 'react-session-persist/lib';
import { cifrarConexionesLocales, IsNullOrWhiteSpace, obtenerConexionesLocales } from '../js/utiles';
import { setListaBases } from '../redux/Logs/ListaBases/actions';

/**
 * Obtener el Menu segun el perfil del usuario 
 * @author jacarrion1
 * @version 1.0
 * @param {number} idPerfil
 * @param {string} token
 * @param {(listaMenus:Array<object>, listaUrls:Array<object>)=>void} onSuccess Este metodo se ejecuta cuando la peticion resulto correcta
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function fetchMenuPrincipal(idPerfil, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));
    ServicioGetExecute(getMenuPrincipal, token, { params: { perfil: idPerfil }, dispatch: dispatch }).then(async (data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.codigo === "0000") {
                    var listaMenus = data.menus;
                    var listaUrls = [];
                    await data.menus.forEach((item) => {
                        listaUrls.push(item.url);
                        if (item.funcionesHijas && item.funcionesHijas.length > 0) {
                            item.funcionesHijas.forEach((i) => {
                                listaUrls.push(i.fun_url);
                            });
                        }
                    });
                    onSuccess(listaMenus, listaUrls);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Iniciar sesion
 * @author jacarrion1
 * @version 1.0
 * @param {string} login
 * @param {string} password
 * @param {string} token
 * @param {(data:object)=>void} onSuccess Este metodo se ejecuta cuando la peticion resulto correcta
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function handleSubmitLogin(login, password, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        login: login,
        password: hex_md5(password)
    };
    ServicioPostExecute(getLogin, body, token, { dispatch: dispatch, exProcess: true }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                onSuccess(data);
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    }).catch((e) => {
        console.error(e);
        if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la obtenci\u00f3n de los datos" }));
    });
}

/**
 * Ingresar con un perfil si el usuario tiene mas de uno
 * @author jacarrion1
 * @version 1.0
 * @param {string} token
 * @param {()=>void} onSuccess Esta funcion se ejecuta cuando la peticion resulto correca
 * @param {()=>void} onFail Esta funcion se ejecuta cuando la peticion resulto erronea
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export async function handleSubmitPerfil(token, onSuccess, onFail, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));
    const sender = localStorage.getItem('sender');
    const remitente = localStorage.getItem('remitente');
    const ts = Number(localStorage.getItem('aceptar'));
    let key = generate(navigator.userAgent, ts, get(remitente), get(sender));
    var datosUsuario = await desencriptar(key, getUser().data);

    localStorage.setItem('sender', set("Param"));
    ServicioGetExecute(getLoginPerfil, token, { params: { id_usuario: datosUsuario.id_usuario, id_perfil: datosUsuario.id_perfil }, dispatch: dispatch, exProcess: true }).then((data) => {
        localStorage.setItem('sender', set(datosUsuario.login));
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
                saveSession(false);
                removeSession();
            } else {
                onSuccess();
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la obtenci\u00f3n de los datos" }));
        }
    });
}

/**
 * Ontener las preguntas de seguridad del usuario para recuepera su clave
 * @author jacarrion1
 * @version 1.0
 * @param {string} usuario
 * @param {string} token
 * @param {(pregunta:string, idUsuario:number)=>void} onSuccess Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP, cuando el codigo es correcto
 * @param {(codigo:string, mensaje:string)=>void} onFail Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP, cuando el codigo es incorrecto
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function fetchPreguntaUsuario(usuario, token, onSuccess, onFail, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    ServicioGetExecute(getPreguntaUsuario, token, { params: { login: usuario }, dispatch: dispatch, exProcess: true }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.codigo === "0000") {
                    onSuccess(data.pregunta, data.idUsr);
                } else {
                    onFail(data.codigo, data.mensaje);
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Validar la pregunta de seguridad para permitir el cambio de clave
 * @author jacarrion1
 * @version 1.0
 * @param {number} idUsuario
 * @param {string} usuario
 * @param {string} pregunta
 * @param {string} respuesta
 * @param {string} token
 * @param {(codigo:string, mensaje:string)=>void} onSuccess Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function handlerSubmitValidarRespuesta(idUsuario, usuario, pregunta, respuesta, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        id_usuario: idUsuario,
        login: usuario,
        pregunta: pregunta,
        respuesta: hex_md5(respuesta)
    };
    ServicioPostExecute(getValidarPreguntaUsuario, body, token, { dispatch: dispatch, exProcess: true }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                onSuccess(data.codigo, data.mensaje);
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Registar nueva clave de acceso
 * @author jacarrion1
 * @version 1.0
 * @param {number} idUsuario
 * @param {string} usuario
 * @param {string} passNueva
 * @param {string} token
 * @param {(codigo:string, mensaje:string)=>void} onSuccess Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function handlerSubmitResetearClave(idUsuario, usuario, passNueva, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_id_usuario: idUsuario + "",
        login: usuario,
        password: hex_md5(passNueva)
    };
    ServicioPostExecute(setResetPassword, body, token, { dispatch: dispatch, exProcess: true }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                onSuccess(data.codigo, data.mensajes[0]);
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Cambiar clave del usuario del sistema
 * @author jacarrion1
 * @version 1.0
 * @param {string} passNueva
 * @param {string} token
 * @param {false|boolean} exProcess
 * @param {null|function(string):void} onSuccess Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP, puede ser null
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function handlerSubmitCambiarClave(passNueva, token, exProcess = false, onSuccess = null, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        password: hex_md5(passNueva)
    };
    ServicioPostExecute(setPassword, body, token, { dispatch: dispatch, exProcess: exProcess }).then((data) => {
        if (data.error) {
            if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
            if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
        } else {
            if (data) {
                if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensajes[0] }, onSuccess ? () => onSuccess(data.codigo) : null));
            } else {
                if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
            }
        }
    });
}

/**
 * Obtener la lista de preguntas de seguridad
 * @author jacarrion1
 * @version 1.0
 * @param {boolean} exProcess
 * @param {string} token
 * @param {(listaPreguntas:Array<object>)=>void} onSuccess Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function fetchListaPreguntas(exProcess, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    ServicioGetExecute(getPreguntas, token, { dispatch: dispatch, exProcess: exProcess }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.codigo === "0000") {
                    onSuccess(data.preguntas);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Registrar Preguntas de seguridad y cambiar la clave termporal, proceso que se realiza con usuarios nuevos
 * @author jacarrion1
 * @version 1.0
 * @param {Array<string>} preguntas
 * @param {Array<string>} respuestas
 * @param {string} passNueva
 * @param {string} token
 * @param {null|function(string):void} onSuccess Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP, puede ser null
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function handlerSubmitCambiarPass1raVez(preguntas, respuestas, passNueva, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let auxRespuestas = [...respuestas];
    for (let i = 0; i < respuestas.length; i++) {
        auxRespuestas[i] = hex_md5(respuestas[i]);
    }
    let body = {
        password: hex_md5(passNueva),
        preguntas: preguntas,
        respuestas: auxRespuestas
    };
    ServicioPostExecute(setPasswordPrimeraVez, body, token, { dispatch: dispatch, exProcess: true }).then((data) => {
        if (data.error) {
            if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
            if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
        } else {
            if (data) {
                if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensajes[0] }, onSuccess ? () => onSuccess(data.codigo) : null));
            } else {
                if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
            }
        }
    });
}

/**
 * Registrar las nuevas preguntas de seguridad
 * @author jacarrion1
 * @version 1.0
 * @param {Array<string>} preguntas
 * @param {Array<string>} respuestas
 * @param {string} passAnterior
 * @param {string} token
 * @param {null|function(string):void} onSuccess Funcion que se ejecuta cuando se obtiene la respuesta de la peticion HTTP, puede ser null
 * @param {Function} dispatch Despachador (useDispatch) para setear el State general
 */
export function handlerSubmitPreguntas(preguntas, respuestas, passAnterior, token, onSuccess = null, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));
    let auxRespuestas = [...respuestas];
    for (let i = 0; i < respuestas.length; i++) {
        auxRespuestas[i] = hex_md5(respuestas[i]);
    }
    let body = {
        id_usuario: 0,
        password: hex_md5(passAnterior),
        preguntas: preguntas,
        respuestas: auxRespuestas
    };
    ServicioPostExecute(setPreguntas, body, token, { dispatch: dispatch }).then((data) => {
        if (data.error) {
            if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
            if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
        } else {
            if (data) {
                if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensajes[0] }));
                if (onSuccess) {
                    onSuccess(data.codigo);
                }
            } else {
                if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
            }
        }
    });
}

/**
 * Obtener la lista de conexiones a MongoDB
 * @author jacarrion1
 * @version 1.0
 * @param {string} token
 * @param {(ListaConexiones: Array<string>) => void} onSuccess
 * @param {Function} dispatch
 * @param {string | null} usr
 * @param {string | null} srv
 */
export function fetchConexiones(token, onSuccess, dispatch, usr = null, srv = null) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    ServicioPostExecute(getListaConexiones, {}, token, { dispatch: dispatch }).then((data) => {
        if (data.error) {
            if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
            if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
        } else {
            if (data) {
                if (data.codigo === "000") {
                    onSuccess(data.lst_conexiones);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            } else {
                if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
            }
        }
    });
}

/**
 * Guardar o Editar una conexion en MongoDB
 * @author jacarrion1
 * @version 1.0
 * @param {string} token
 * @param {Function} dispatch
 * @param {string} serverBd
 * @param {string} userBd
 * @param {string} passBd
 * @param {boolean} isEdit
 * @param {string | null} nombreEdit
 */
export function handlerConexion(token, dispatch, serverBd, userBd, passBd, isEdit, nombreEdit = null) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_server: serverBd,
        str_usuario: userBd,
        str_clave: passBd,
        dtt_ceacion: new Date().toISOString(),
        dtt_ult_con: new Date().toISOString()
    };

    var service = addConexion;
    if (isEdit) {
        service = setConexion;
        body.str_nombre_buscar = nombreEdit;
    }

    ServicioPostExecute(service, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.codigo !== "000") {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                } else {
                    fetchConexiones(body.str_usuario, body.str_server);
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Obtener el seguimiento de unatransaccion
 * @author jacarrion1
 * @version 1.0
 * @param {string} transaccionBuscar
 * @param {string} token
 * @param {(seguimiento: Array<object>) => void} onSuccess
 * @param {Function} dispatch
 */
export async function handlerGetSeguimiento(transaccionBuscar, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    var url = await obtenerConexionesLocales(sessionStorage.getItem("COEXIONSELECTED"));
    let body = {
        str_user: url.str_usuario,
        str_password: url.str_clave,
        str_protcol: !IsNullOrWhiteSpace(url.str_protocolo) ? url.str_protocolo : "",
        str_server: url.str_servidor,
        str_id_transacccion_search: transaccionBuscar
    };
    ServicioPostExecute(getListaSeguimiento, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.codigo === "000") {
                    var lst = [...data.lst_seguimiento];
                    lst.sort(function (a, b) {
                        if (new Date(a.dt_fecha_operacion) > new Date(b.dt_fecha_operacion)) {
                            return 1;
                        }
                        if (new Date(a.dt_fecha_operacion) < new Date(b.dt_fecha_operacion)) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                    var lstWs = [];
                    var lstFinal = [];
                    for (let i = 0; i < lst.length; i++) {
                        if (!lstWs.includes(lst[i].str_web_service)) {
                            lstWs.push(lst[i].str_web_service);
                            lstFinal.push(lst.filter((it) => it.str_web_service === lst[i].str_web_service));
                        }
                    }
                    onSuccess(lstFinal);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Obtener las bases de datos de MongoDB
 * @author jacarrion1
 * @version 1.0
 * @param {boolean} consultar
 * @param {{str_usuario:string, str_clave: string, str_protocolo: string, str_servidor: string}} url
 * @param {string} token
 * @param {(listaBases:Array<string>) => void} onSuccess
 * @param {Function} dispatch
 */
export async function fetchBds(consultar, url, token, onSuccess, dispatch) {
    if (consultar) {
        if (dispatch) dispatch(setErrorRedirigir(""));
        sessionStorage.setItem("COEXIONSELECTED", await cifrarConexionesLocales(url));
        if (document.getElementById('/seguimientotran')) {
            if (!IsNullOrWhiteSpace(url)) {
                document.getElementById('/seguimientotran').style.display = '';
            } else {
                document.getElementById('/seguimientotran').style.display = 'none';
            }
        }

        let body = {
            str_user: url.str_usuario,
            str_password: url.str_clave,
            str_protcol: !IsNullOrWhiteSpace(url.str_protocolo) ? url.str_protocolo : "",
            str_server: url.str_servidor,
        };
        ServicioPostExecute(getListaBases, body, token, { dispatch: dispatch }).then((data) => {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data) {
                    if (data.codigo === "000") {
                        dispatch(setListaBases(data.lst_bds));
                        onSuccess(data.lst_bds);
                    } else {
                        if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                    }
                } else {
                    if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
                }
            }

        });
    } else {
        onSuccess([]);
    }
}

/**
 * Obtener la lista de colecciones de una base de datos de Mongo
 * @author jacarrion1
 * @version 1.0
 * @param {string} ws
 * @param {string} token
 * @param {(lstColecciones: Array<string>, token: string) => void} onSuccess
 * @param {Function} dispatch
 * @param {boolean | false} background
 */
export function fetchColecciones(ws, token, onSuccess, dispatch, background = false) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_bd: ws
    };
    ServicioPostExecute(getListaColecciones, body, token, { dispatch: dispatch, background: background }).then((data) => {
        if (data) {
            if (data.error) {
                if (!background) {
                    if (dispatch) dispatch(setErrorRedirigir(data.reload ? "/reload" : "/logs"));
                    if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
                }
            } else {
                if (data.codigo === "000") {
                    onSuccess(data.lst_coleccones, data.solToken);
                } else {
                    if (!background) {
                        if (dispatch) dispatch(setErrorRedirigir("/logs"));
                        if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                    } else {
                        onSuccess([], data.solToken);
                    }
                }
            }
        } else if (!background) {
            if (dispatch) dispatch(setErrorRedirigir("/logs"));
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Obtener la lista de Registros de Mongo (Documentos)
 * @author jacarrion1
 * @version 1.0
 * @param {string} ws
 * @param {string} coleccion
 * @param {number} nro_regitros
 * @param {number} ultimoRegistro
 * @param {boolean} cargarMas
 * @param {string} filtro
 * @param {string} token
 * @param {(data: object) => void} onSuccess
 * @param {Function} dispatch
 * @param {boolean | false} background
 */
export function fetchDocumentos(ws, coleccion, nro_regitros, ultimoRegistro, cargarMas, filtro = "", token, onSuccess, dispatch, background = false) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_bd: ws,
        str_coleccion: coleccion,
        int_registros: nro_regitros,
        str_referencia: cargarMas ? ultimoRegistro : "",
        str_filtro_buscar: filtro
    };
    ServicioPostExecute(getListaDocumentos, body, token, { dispatch: dispatch, background: background }).then((data) => {
        if (data) {
            if (data.error) {
                if (!background) {
                    if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                    if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
                }
            } else {
                if (data.codigo === "000") {
                    onSuccess(data);
                } else {
                    if (!background) {
                        if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                    } else {
                        onSuccess(data);
                    }
                }
            }
        } else if (!background) {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Descargar el archivo de Logs
 * @author jacarrion1
 * @version 1.0
 * @param {string} ws
 * @param {string} archivo
 * @param {string} token
 * @param {Function} dispatch
 */
export function downloadArchivoLogs(ws, archivo, token, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_ws: ws,
        str_file: archivo,
        int_desde: 0,
        int_hasta: 50,
        blob: true
    };
    ServicioPostExecute(getDescargarLogsTexto, body, token, { responseBLOB: true, dispatch: dispatch }).then(async (data) => {
        if (data) {
            if (data.error) {
                if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (IsNullOrWhiteSpace(data.codigo)) {
                    var file = window.URL.createObjectURL(await data.file);
                    var a = document.createElement('a');
                    a.href = file;
                    a.download = data.fileName;
                    document.body.appendChild(a); // agregar el elemento "a" al documento para que funcione el click
                    a.click();
                    a.remove();  //se elimina el elemento creado para que no genere cambios en el DOM y no se puede usar de forma manual 
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Obtener la lista de archivos de Logs
 * @author jacarrion1
 * @version 1.0
 * @param {string} ws
 * @param {string} token
 * @param {(lstArchivos: Array<{int_id: number, str_nombre: string, dtt_actualizacion: Date}>) => void} onSuccess
 * @param {Function} dispatch
 */
export function fetchArchivosLogs(ws, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_ws: ws
    };
    ServicioPostExecute(getLogsTexto, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setErrorRedirigir(data.reload ? "/reload" : "/logs"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.codigo === "000") {
                    onSuccess(data.lst_logs);
                } else {
                    if (dispatch) dispatch(setErrorRedirigir("/logs"));
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setErrorRedirigir("/logs"));
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Obtener el contenido de un archivo de Log
 * @author jacarrion1
 * @version 1.0
 * @param {string} ws
 * @param {string} archivo
 * @param {string} desde
 * @param {string} hasta
 * @param {string} token
 * @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
 * @param {Function} dispatch
 */
export function fetchContenidoArchivoLogs(ws, archivo, desde, hasta, token, onSuccess, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_ws: ws,
        str_file: archivo,
        int_desde: desde === 0 ? desde : desde - 1,
        int_hasta: hasta - 1
    };
    ServicioPostExecute(getContenidoLogsTexto, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setErrorRedirigir(data.reload ? "/reload" : "/logsTexto"));
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.codigo === "000") {
                    onSuccess(data.str_body, data.int_total_registros);
                } else {
                    if (dispatch) dispatch(setErrorRedirigir("/logsTexto"));
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setErrorRedirigir("/logsTexto"));
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
 * Obtener las validaciones del socio/cliente
 * @author retorres
 * @version 1.0
 * @param {string} strCedula
 * @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
 * @param {Function} dispatch
 */
export function fetchValidacionSocio(strCedula, strTipoValidacion, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_identificacion: strCedula,
        str_nemonico_alerta: strTipoValidacion
    };
    ServicioPostExecute(getValidaciones, body, token, { dispatch: dispatch}).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_codigo === "000") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}


/**
* Obtener los datos del buró
* @author retorres
* @version 1.0
* @param {string} strCedula
* @param {string} strTipoDocumento
* @param {string} strLugar
* @param {string} strNombres
* @param {string} strOficial
* @param {string} strCargo
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchScore(strTipoDocumento, strCedula, strNombres, strLugar, strOficial, strCargo, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {

        str_identificacion: strCedula,
        str_tipo_identificacion: strTipoDocumento,
        str_nombres: strNombres,
        str_lugar: strLugar,
        str_oficial: strOficial,
        str_cargo: strCargo
    };
    ServicioPostExecute(getScore, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_codigo === "000" || data.str_res_codigo === "010") {
                    onSucces(data);
                } else {
                    let codigo = data.codigo || data.str_res_codigo;
                    let mensaje = data.mensaje || data.str_res_info_adicional;
                    if (dispatch) dispatch(setAlertText({ code: codigo, text: mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Obtener la información del socio
* @author retorres
* @version 1.0
* @param {string} strCedula
* @param {string} strTipoDocumento
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchInfoSocio(strCedula, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_identificacion: strCedula,
    };
    //estandarizar el campo de cedula
    ServicioPostExecute(getInfoSocio, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Obtener la información del socio
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchInfoEconomica(strEnte, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_ente: strEnte.toString()
    }

    ServicioPostExecute(getInfoEco, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Agregar la autorizacion de consulta al buró
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchAddAutorizacion(strTipoIdentificacion, intRegistrarAutorizacion, strTipoAut, strNumDocumento, strNombres, strApellidoPaterno, strApellidoMaterno, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_tipo_identificacion: strTipoIdentificacion,
        int_registrar_autorizacion: intRegistrarAutorizacion,
        str_tipo_autorizacion: strTipoAut,
        str_identificacion: strNumDocumento,
        str_nombres: strNombres,
        str_apellido_paterno: strApellidoPaterno,
        str_apellido_materno: strApellidoMaterno,
        loadfile: {
            file: "PGh0bWw+DQoNCjxoZWFkPg0KICAgIDxtZXRhIGh0dHAtZXF1aXY9IkNvbnRlbnQtVHlwZSIgY29udGVudD0idGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04IiAvPg0KICAgIDx0aXRsZT5VbnRpdGxlZCBEb2N1bWVudDwvdGl0bGU+DQogICAgPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCiAgICAgICAgPCEtLQ0KICAgICAgICB0YWJsZS5NYWluIHsNCiAgICAgICAgICAgIGJvcmRlcjogMHB0Ow0KICAgICAgICAgICAgd2lkdGg6IDEwMDBwdDsNCiAgICAgICAgfQ0KDQogICAgICAgIHRhYmxlLkNhYmVjZXJhIHsNCiAgICAgICAgICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7DQogICAgICAgICAgICB3aWR0aDogMTAwJTsNCiAgICAgICAgICAgIGJvcmRlcjogMHB0Ow0KICAgICAgICB9DQoNCiAgICAgICAgdGFibGUuQm9keSB7DQogICAgICAgICAgICBib3JkZXI6IDEuNXB4IHNvbGlkICMwNDVjYmM7DQogICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7DQogICAgICAgICAgICBib3JkZXItc3BhY2luZzogMHB4Ow0KICAgICAgICAgICAgd2lkdGg6IDEwMCU7DQogICAgICAgIH0NCg0KICAgICAgICB0ZC5QcmltZXJhRmlsYSB7DQogICAgICAgICAgICBmb250LXNpemU6IDE0cHQ7DQogICAgICAgICAgICBmb250LWZhbWlseToga2FyYm9uOw0KICAgICAgICAgICAgY29sb3I6ICMwNDVjYmM7DQogICAgICAgIH0NCg0KICAgICAgICB0ZC50ZXJjZXJhRmlsYSB7DQogICAgICAgICAgICBmb250LXNpemU6IDE0cHQ7DQogICAgICAgICAgICBmb250LWZhbWlseToga2FyYm9uOw0KICAgICAgICAgICAgY29sb3I6ICMwNDVjYmM7DQogICAgICAgICAgICBib3JkZXItdG9wOiAxLjVweCBzb2xpZCAjMDQ1Y2JjOw0KICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMS41cHggc29saWQgIzA0NWNiYzsNCiAgICAgICAgICAgIHBhZGRpbmc6IDElOw0KICAgICAgICAgICAgd2lkdGg6IDI5Ni4wNXB0Ow0KICAgICAgICB9DQoNCiAgICAgICAgcC5Nc29Ob3JtYWwgew0KICAgICAgICAgICAgbWFyZ2luOiAwY207DQogICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAuMDAwMXB0Ow0KICAgICAgICAgICAgZm9udC1zaXplOiAxMS4wcHQ7DQogICAgICAgICAgICBjb2xvcjogIzA0NWNiYzsNCiAgICAgICAgfQ0KDQogICAgICAgIHAuQ3VlcnBvIHsNCiAgICAgICAgICAgIHRleHQtYWxpZ246IGp1c3RpZnk7DQogICAgICAgICAgICBwYWRkaW5nOiAxJTsNCiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBrYXJib247DQogICAgICAgICAgICBmb250LXNpemU6IDE1LjI1cHQ7DQogICAgICAgICAgICBjb2xvcjogIzA0NWNiYzsNCiAgICAgICAgfQ0KDQogICAgICAgIHAuVGl0dWxvIHsNCiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDAuMDAwMXB0Ow0KICAgICAgICAgICAgY29sb3I6ICMwNDVjYmM7DQogICAgICAgICAgICB0ZXh0LWFsaWduOiBlbmQ7DQogICAgICAgICAgICBsaW5lLWhlaWdodDogbm9ybWFsOw0KICAgICAgICAgICAgZm9udC1mYW1pbHk6IEthcmJvbjsNCiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjVwdDsNCiAgICAgICAgfQ0KDQogICAgICAgIHAuTXNvQm9keVRleHQzIHsNCiAgICAgICAgICAgIG1hcmdpbjogMGNtOw0KICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogLjAwMDFwdDsNCiAgICAgICAgICAgIHRleHQtYWxpZ246IGp1c3RpZnk7DQogICAgICAgICAgICBmb250LXNpemU6IDExLjBwdDsNCiAgICAgICAgICAgIGNvbG9yOiAjMDQ1Y2JjOw0KICAgICAgICAgICAgZm9udC1mYW1pbHk6ICJBcmlhbCIsICJzYW5zLXNlcmlmIiwgIkthcmJvbi1Cb2xkIjsNCiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOw0KICAgICAgICB9DQoNCiAgICAgICAgdGFibGUuTXNvTm9ybWFsVGFibGUgew0KICAgICAgICAgICAgZm9udC1zaXplOiAxMS4wcHQ7DQogICAgICAgICAgICBjb2xvcjogIzA0NWNiYzsNCiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAiQ2FsaWJyaSIsICJzYW5zLXNlcmlmIiwgIkthcmJvbi1Cb2xkIjsNCiAgICAgICAgfQ0KDQogICAgICAgIC51bmRlcmxpbmUtY29udGFpbmVyIHsNCiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBibGFjazsNCiAgICAgICAgICAgIHdpZHRoOiAxMDAlOw0KICAgICAgICAgICAgcGFkZGluZy1ib3R0b206IDFweDsNCiAgICAgICAgfQ0KICAgICAgICAtLT4NCiAgICA8L3N0eWxlPg0KPC9oZWFkPg0KDQo8Ym9keSBzdHlsZT0ibWFyZ2luLWxlZnQ6IDEuNWNtOyI+DQogICAgPHRhYmxlIGNsYXNzPSJNYWluIj4NCiAgICAgICAgPHRib2R5Pg0KICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgIDx0ZD4NCiAgICAgICAgICAgICAgICAgICAgPHA+Jm5ic3A7PC9wPg0KICAgICAgICAgICAgICAgICAgICA8cD4NCiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+Jm5ic3A7PC9zcGFuPg0KICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+DQogICAgICAgICAgICAgICAgICAgIDwvcD4NCiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPSJDYWJlY2VyYSI+DQogICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj0iMSI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBpdGVtLWFsaWduOiBzdGFydDsiPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPSIuLi9pbWFnZW5lcy9sb2dvXzAyLnBuZyI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPSIxIj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPSJUaXR1bG8iPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQVVUT1JJWkFDScOTTiBQQVJBIEFDQ0VTTyBBPGJyPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSU5GT1JNQUNJw5NOIERFIEJVUsOTUyBERSBDUsOJRElUTw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4NCiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+DQogICAgICAgICAgICAgICAgICAgIDwvdGFibGU+DQogICAgICAgICAgICAgICAgICAgIDxiciAvPg0KICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9IkJvZHkiPg0KICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5Pg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPSJQcmltZXJhRmlsYSIgc3R5bGU9ImJvcmRlci1ib3R0b206IDEuNXB4IHNvbGlkICAjMDQ1Y2JjOyBwYWRkaW5nOiAxJTsgd29yZC13cmFwOiBicmVhay13b3JkOyIgY29sc3Bhbj0iMSI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZbzogPHNwYW4gc3R5bGU9ImNvbG9yOiBibGFjazsiPjwvc3Bhbj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPSJQcmltZXJhRmlsYSINCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPSJib3JkZXItbGVmdDogMS41cHggc29saWQgICMwNDVjYmM7IGJvcmRlci1ib3R0b206IDEuNXB4IHNvbGlkICAjMDQ1Y2JjOyBwYWRkaW5nOiAxJTsiDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xzcGFuPSIyIj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEMuQy9DLkkgIyBDLlJlZiBvIFBhczogPHNwYW4gc3R5bGU9ImNvbG9yOiBibGFjazsiPjExMDU3OTQ0MTQ8L3NwYW4+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPSI0Ij4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPSJDdWVycG8iPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdXRvcml6byBkZSBmb3JtYSBleHByZXNhLCB2b2x1bnRhcmlhLCBpcnJldm9jYWJsZSBlIGluZGVmaW5pZGEsIGENCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29vcGVyYXRpdmEgZGUgQWhvcnJvIHkgQ3LDqWRpdG8gVmljZW50aW5hIOKAnU1hbnVlbCBFc3RlYmFuIEdvZG95DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9ydGVnYeKAnSBMdGRhLiwgbyBhIGN1YWxxdWllciBjZXNpb25hcmlvIG8gZW5kb3NhdGFyaW8gZGUgw6lzdGEsIHBhcmEgcXVlDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9idGVuZ2EsIGRlIGN1YWxxdWllciBmdWVudGUgZGUgaW5mb3JtYWNpw7NuIHkgZW4gdG9kbyBtb21lbnRvLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2lhcyByZWxhdGl2YXMgYSBtaSBjb21wb3J0YW1pZW50byBjcmVkaXRpY2lvLCBhbCBjdW1wbGltaWVudG8gZGUgbWlzDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ibGlnYWNpb25lczsgeSwgZW4gZ2VuZXJhbCBkZSBsYSBxdWUgw6lzdGEgY29uc2lkZXJlIHJlbGV2YW50ZQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhIGNvbm9jZXIgbWkgZGVzZW1wZcOxbyBjb21vIGNvZGV1ZG9yL2RldWRvciwgc29saWRhcmlvIG8gZ2FyYW50ZS4gQXNpDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pc21vLCBhdXRvcml6byBhIGxhIHByZW5vbWJyYWRhIENvb3BlcmF0aXZhIHBhcmEgcXVlDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc2UsIHJlcG9ydGUgeSBzdW1pbmlzdHJlIGEgY3VhbHF1aWVyIGNlbnRyYWwgbyBmdWVudGUgZGUgaW5mb3JtYWNpw7NuDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYmlkYW1lbnRlIGNvbnN0aXR1aWRhIG1pIGluZm9ybWFjacOzbiBkZSBjYXLDqWN0ZXIgZmluYW5jaWVybw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IGNvbWVyY2lhbCwgZXNwZWNpYWxtZW50ZSBkZSBsYSByZWxhY2lvbmFkYSBjb24gbWlzIG9ibGlnYWNpb25lcyBjb21vDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldWRvciwgZGV1ZG9yIHNvbGlkYXJpby9jb2RldWRvciwgbyBnYXJhbnRlLiBFc3RhIGF1dG9yaXphY2nDs24NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vyw6Egc3VmaWNpZW50ZSBwYXJhIHF1ZSBsYSBDb29wZXJhdGl2YSBkZSBBaG9ycm8geSBDcsOpZGl0byBWaWNlbnRpbmENCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4oCdTWFudWVsIEVzdGViYW4gR29kb3kgT3J0ZWdhIiBMdGRhLiwgc3UgY2VzaW9uYXJpbyBvIGVuZG9zYXRhcmlvLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaSBsbyBodWJpZXJlLCBsYSBwcmVzZW50ZSwgb2J0ZW5nYSB5L28gcmVwb3J0ZSBsYSBpbmZvcm1hY2nDs24gcXVlIHJlcXVpZXJhDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlIG8gaGFjaWEgY3VhbHF1aWVyIGJ1csOzIGRlIGNyw6lkaXRvIG8gY3VhbHF1aWVyIGVudGlkYWQNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b3JpemFkYSBxdWUgbGEgbWFudGVuZ2EuDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9InRlcmNlcmFGaWxhIj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZlY2hhOiA8c3BhbiBzdHlsZT0iY29sb3I6IGJsYWNrOyI+MjkgZGUgRW5lcm8gZGVsIDIwMjQ8L3NwYW4+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz0idGVyY2VyYUZpbGEiIHN0eWxlPSJib3JkZXItbGVmdDogMS41cHggc29saWQgICMwNDVjYmM7Ij4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhvcmE6IDxzcGFuIHN0eWxlPSJjb2xvcjogYmxhY2s7Ij4xNjozMDoyMDwvc3Bhbj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPSJ0ZXJjZXJhRmlsYSIgc3R5bGU9ImJvcmRlci1sZWZ0OiAxLjVweCBzb2xpZCAgIzA0NWNiYzsiPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTHVnYXI6IDxzcGFuIHN0eWxlPSJjb2xvcjogYmxhY2s7Ij48L3NwYW4+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz0iUHJpbWVyYUZpbGEiIHN0eWxlPSIgdGV4dC1hbGlnbjogY2VudGVyOyB3aWR0aDogNTk2LjA1cHQ7Ij4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBvciBtaXMgcG9ycGlvcyBkZXJlY2hvcw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyIC8+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgc3R5bGU9InBhZGRpbmctdG9wOiAxMCU7Ij4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz0iUHJpbWVyYUZpbGEiIHN0eWxlPSJib3JkZXItc3R5bGU6IG5vbmUgbm9uZSBzb2xpZDsgYm9yZGVyLWNvbG9yOiAjMDQ1Y2JjOyBib3JkZXItd2lkdGg6IG1lZGl1bSBtZWRpdW0gMXB0OyB3aWR0aDogNDUwcHQ7IHBhZGRpbmctbGVmdDogMSU7Ig0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlnbj0idG9wIj5GaXJtYSBkZWwgc29jaW8vY2xpZW50ZQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPSJQcmltZXJhRmlsYSIgc3R5bGU9IiBwYWRkaW5nLWxlZnQ6IDElOyI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQy5JLiA8c3BhbiBzdHlsZT0iY29sb3I6IGJsYWNrOyI+MTEwNTc5NDQxNDwvc3Bhbj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz0iUHJpbWVyYUZpbGEiIHN0eWxlPSJib3JkZXItbGVmdDogMS41cHggc29saWQgICMwNDVjYmM7IHBhZGRpbmctbGVmdDogMSU7IiBjb2xzcGFuPSIyIj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZpcm1hIHkgc2VsbG86DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBzdHlsZT0icGFkZGluZy10b3A6IDEwJTsiPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSJib3JkZXItc3R5bGU6IG5vbmUgbm9uZSBzb2xpZDsgYm9yZGVyLWNvbG9yOiAjMDQ1Y2JjOyBib3JkZXItd2lkdGg6IG1lZGl1bSBtZWRpdW0gMXB0OyB3aWR0aDogNDUwcHQ7IHBhZGRpbmctbGVmdDogMSU7Ig0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlnbj0idG9wIj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz0iUHJpbWVyYUZpbGEiIHN0eWxlPSIgcGFkZGluZy1sZWZ0OiAxJTsiPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vbWJyZTogPHNwYW4gc3R5bGU9ImNvbG9yOiBibGFjazsiPjwvc3Bhbj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIgLz4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYXJnbzogPHNwYW4gc3R5bGU9ImNvbG9yOiBibGFjazsiPjwvc3Bhbj4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4NCiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+DQogICAgICAgICAgICAgICAgICAgIDwvdGFibGU+DQogICAgICAgICAgICAgICAgPC90ZD4NCiAgICAgICAgPC90Ym9keT4NCiAgICA8L3RhYmxlPg0KPC9ib2R5Pg0KDQo8L2h0bWw+"
        }
    }
    ServicioPostExecute(addAutorizacion, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Agregar la autorizacion de consulta al buró
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchGetContrato(token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        
    }
    ServicioPostExecute(getContrato, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

export function fetchGetSolicitudes(token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_id_usuario: "538",
        str_id_oficina: "1",
        str_id_perfil: "36"
    }

    ServicioPostExecute(getSolicitudes, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

export function fetchAddSolicitud(body,token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    ServicioPostExecute(addSolicitud, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Obtener la información financiera del socio
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchGetInfoFinan(ente, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_ente: ente
    }
    ServicioPostExecute(getInfoFinan, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Agregar p
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchAddProspecto(str_num_documento, ente, nombres, apellidos, celular, correo, cupoSoli, comentario, comentarioAdic, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_num_documento,
        int_ente: ente || 0,
        str_nombres: nombres,
        str_apellidos: apellidos,
        str_celular: celular,
        str_correo: correo,
        dec_cupo_solicitado: cupoSoli,
        str_id_autoriza_cons_buro: "",
        str_id_autoriza_datos_per: "",
        str_comentario: comentario,
        str_comentario_adicional: comentarioAdic
    }
    ServicioPostExecute(addProspecto, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Agregar p
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchGetComentarios(idSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_sol: idSolicitud,
        str_nem_par_inf: "TINFOTC_GESTOR_NEGOCIOS"
    }
    ServicioPostExecute(getComentarios, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Agregar p
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchGetFlujoSolicitud(idSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_solicitud: idSolicitud,
    }
    ServicioPostExecute(getFlujoSolicitud, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Agregar p
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchAddComentarioAsesor(idSolicitud, comentarios, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_sol: idSolicitud,
        lst_cmnt_ase_cre: comentarios
    }
    console.log(body);
    ServicioPostExecute(addComentarioAsesor, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

/**
* Agregar p
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchAddComentarioSolicitud(idSolicitud, comentario, estadoSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_solicitud: idSolicitud,
        bl_regresa_estado: false,
        str_comentario: comentario,
        int_estado: estadoSolicitud
    }
    ServicioPostExecute(addComentarioSolicitud, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}