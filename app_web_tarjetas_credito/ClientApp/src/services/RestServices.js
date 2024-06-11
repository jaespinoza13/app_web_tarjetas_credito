import { ServicioGetExecute, getMenuPrincipal, getPreguntaUsuario, ServicioPostExecute, getValidarPreguntaUsuario, setResetPassword, getLogin, getLoginPerfil, getPreguntas, setPreguntas, setPassword, setPasswordPrimeraVez, getListaBases, getListaConexiones, setConexion, addConexion, getListaSeguimiento, getListaDocumentos, getListaColecciones, getDescargarLogsTexto, getLogsTexto, getContenidoLogsTexto, getValidaciones, getScore, getInfoSocio, getInfoEco, addAutorizacion, getSolicitudes, addSolicitud, getContrato, getInfoFinan, addProspecto, getFlujoSolicitud, addComentarioAsesor, addComentarioSolicitud, updResolucion, addResolucion, getResolucion, addProcEspecifico, updSolicitud, getParametros, getReporteOrden, getOrdenes, getTarjetasCredito, getInforme, getMedioAprobacion, getSeparadores } from './Services';
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicionals[0] }, onSuccess ? () => onSuccess(data.codigo) : null));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicionals[0] }, onSuccess ? () => onSuccess(data.codigo) : null));
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
                if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicionals[0] }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                        if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                        if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                        if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
    //console.log("BODY SERVICE,", body)
    ServicioPostExecute(getValidaciones, body, token, { dispatch: dispatch }).then((data) => {
        //console.log("VALIDACION SERVICE," ,data)
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_codigo === "000" || data.str_res_codigo === "100") {
                    onSucces(data);
                }
                else {
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

    //console.log("SCORE BODY, ",body)


    ServicioPostExecute(getScore, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            console.log("SOCREE", data)
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchAddAutorizacion(strTipoIdentificacion, intRegistrarAutorizacion, strTipoAut, strNumDocumento, strNombres, strApellidoPaterno, strApellidoMaterno, archivoBase64, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_tipo_identificacion: strTipoIdentificacion,
        int_registrar_autorizacion: intRegistrarAutorizacion,
        str_tipo_autorizacion: strTipoAut,
        str_identificacion: strNumDocumento,
        str_nombres: strNombres,
        str_apellido_paterno: strApellidoPaterno,
        str_apellido_materno: strApellidoMaterno,
        /*str_tipo_identificacion: "C",
        int_registrar_autorizacion: Number(1),
        str_identificacion: "0100361450",
        str_nombres: "PRUEBA AUTORIZACION",
        str_apellido_paterno: "NUMERO",
        str_apellido_materno: "UNO",
        str_tipo_autorizacion: "F",*/
        loadfile: {
            //TODO: file: archivoBase64 ( REVISAR EL UPLOADER COMPONTE)
            file: "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MDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMTYxNzggMDAwMDAgbiAKMDAwMDAwMDQ0NiAwMDAwMCBuIAowMDAwMDAwNTIyIDAwMDAwIG4gCjAwMDAwMzUxNjIgMDAwMDAgbiAKMDAwMDA0MzAxNyAwMDAwMCBuIAowMDAwMDAwOTMwIDAwMDAwIG4gCjAwMDAwMDM5NTUgMDAwMDAgbiAKMDAwMDAwMDU1OSAwMDAwMCBuIAowMDAwMDEyNTk0IDAwMDAwIG4gCjAwMDAwMTY0MzEgMDAwMDAgbiAKMDAwMDAxNjQ4NyAwMDAwMCBuIAowMDAwMDE2NjA2IDAwMDAwIG4gCjAwMDAwMzM4NzQgMDAwMDAgbiAKMDAwMDAzNDEyMyAwMDAwMCBuIAowMDAwMDM0NzUzIDAwMDAwIG4gCjAwMDAwMzUzMDkgMDAwMDAgbiAKMDAwMDA0MTk3MiAwMDAwMCBuIAowMDAwMDQyMjI2IDAwMDAwIG4gCjAwMDAwNDI2NjUgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDIxCi9Sb290IDEyIDAgUgovSW5mbyAxIDAgUj4+CnN0YXJ0eHJlZgo0MzE2OQolJUVPRgo="
        }
    }
    ServicioPostExecute(addAutorizacion, body, token, { dispatch: dispatch }).then((data) => {

        //console.log("ADD AUTORI", body);
        if (data) {
            console.log("AUTO DATA", data);
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    let codigo = data.codigo || data.str_res_codigo;
                    let mensaje = data.mensaje || data.str_res_info_adicional;
                    if (dispatch) dispatch(setAlertText({ code: codigo, text: mensaje+" Reenvie nuevamente." }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
        //str_id_usuario: "538",
        //str_id_oficina: "1",
        //str_id_perfil: "36"
    }

    ServicioPostExecute(getSolicitudes, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchGetInforme(idSolicitud, idEstado, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_sol: idSolicitud,
        int_id_est_sol: Number(idEstado)
    }
    ServicioPostExecute(getInforme, body, token, { dispatch: dispatch }).then((data) => {
        //console.log("FLUJO,", data);
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
        //console.log("FLUJO RESULT,", data);
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    //if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
* Agregar p
* @author retorres
* @version 1.0
* @param {string} strEnte
* @param {(contenido:string, nroTotalRegistros: number) => void} onSuccess
* @param {Function} dispatch
*/
export function fetchAddComentarioAsesor(idSolicitud, comentarios, estadoSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_sol: idSolicitud,
        lst_informe: comentarios,
        int_id_est_sol: estadoSolicitud
    }
    //console.log(body);
    ServicioPostExecute(addComentarioAsesor, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchAddComentarioSolicitud(idSolicitud, comentario, estadoSolicitud, regresaSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_solicitud: idSolicitud,
        bl_regresa_estado: regresaSolicitud,
        str_comentario: comentario,
        int_estado: estadoSolicitud,
        str_decision_sol: "APROBADO"
    }
    //console.log(body);
    ServicioPostExecute(addComentarioSolicitud, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            //console.log(data)
            //if (data.str_res_codigo != "000") {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchGetResolucion(idSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_sol: idSolicitud
    }
    //console.log(body);
    ServicioPostExecute(getResolucion, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchAddResolucion(idSolicitud, comentario, estadoSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_solicitud: idSolicitud,
        bl_regresa_estado: false,
        str_comentario: comentario,
        int_estado: estadoSolicitud
    }
    //console.log(body);
    ServicioPostExecute(addResolucion, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchUpdResolucion(idSolicitud, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_solicitud: idSolicitud
    }
    //console.log(body);
    ServicioPostExecute(updResolucion, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchAddProcEspecifico(idSolicitud, cupo, estado, comentario, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_solicitud: Number(idSolicitud),
        str_comentario: comentario,
        str_estado: estado,
        dcc_cupo_aprobado: parseFloat(cupo),
    };
    //console.log("BODY,", body);
    ServicioPostExecute(addProcEspecifico, body, token, { dispatch: dispatch }).then((data) => {
        //console.log("RETORNO ", data);
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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
export function fetchGetParametrosSistema(token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    // TARJETAS DE CRÉDITO
    let body = {
        int_id_sis: Number("114")
    }
    ServicioPostExecute(getParametros, body, token, { dispatch: dispatch }).then((data) => {
        //console.log(data);

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
export function fetchUpdateCupoSolicitud(idSolicitud, idFlujoSol, estadoSol, decMonto, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        int_id_solicitud: idSolicitud,
        int_id_flujo_sol: idFlujoSol,
        int_estado: Number(estadoSol),
        dec_cupo_solicitado: parseFloat(decMonto)
    }

    //console.log(body);
    ServicioPostExecute(updSolicitud, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
                }
            }
            //console.log("RUSEL, ", data)
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

export function fetchGetReporteOrden(numOrden, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_numero_orden: numOrden
    }
    ServicioPostExecute(getReporteOrden, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}



export function fetchGetOrdenes(tipo_requerido, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_orden_tipo: tipo_requerido
    }
    //console.log(body)
    ServicioPostExecute(getOrdenes, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

export function fetchGetTarjetasCredito(nemonico_producto, tipo_tarjeta, estado_tarjeta ,token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        str_nem_prod: nemonico_producto,
        str_tipo_prod: tipo_tarjeta,
        str_estado_tc: estado_tarjeta,
    }
    ServicioPostExecute(getTarjetasCredito, body, token, { dispatch: dispatch }).then((data) => {
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}

export function fetchGetMedioAprobacion(token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
       
    }
    ServicioPostExecute(getMedioAprobacion, body, token, { dispatch: dispatch }).then((data) => {
        //console.log("MEDIO APRO,",data)
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
                }
            }
        } else {
            if (dispatch) dispatch(setAlertText({ code: "1", text: "Error en la comunicac\u00f3n con el servidor" }));
        }
    });
}


export function fetchGetSeparadores( token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
     
    }
    ServicioPostExecute(getSeparadores, body, token, { dispatch: dispatch }).then((data) => {
        //console.log("Separadores,", data);
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
                    onSucces(data);
                } else {
                    //if (dispatch) dispatch(setAlertText({ code: data.str_res_codigo, text: data.str_res_info_adicional }));
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