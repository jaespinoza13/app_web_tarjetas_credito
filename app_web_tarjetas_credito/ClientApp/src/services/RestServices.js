import { ServicioGetExecute, getMenuPrincipal, getPreguntaUsuario, ServicioPostExecute, getValidarPreguntaUsuario, setResetPassword, getLogin, getLoginPerfil, getPreguntas, setPreguntas, setPassword, setPasswordPrimeraVez, getListaBases, getListaConexiones, setConexion, addConexion, getListaSeguimiento, getListaDocumentos, getListaColecciones, getDescargarLogsTexto, getLogsTexto, getContenidoLogsTexto, getValidaciones, getScore, getInfoSocio } from './Services';
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
            console.log(data);
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
            console.log(data);
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
            console.log(data);
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
                console.log(data);
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
            console.log(data);
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
                console.log(data.codigo);
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
export function fetchValidacionSocio(strCedula, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_documento: strCedula
    };
    ServicioPostExecute(getValidaciones, body, token, { dispatch: dispatch}).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                console.log(data);
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
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchScore(strTipoDocumento,strCedula, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {

        str_identificacion: strCedula,
        str_tipo_identificacion: strTipoDocumento,
    };
    ServicioPostExecute(getScore, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                console.log(data);
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
        str_num_documento: strCedula,
    };
    //estandarizar el campo de cedula
    ServicioPostExecute(getInfoSocio, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                console.log(data);
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