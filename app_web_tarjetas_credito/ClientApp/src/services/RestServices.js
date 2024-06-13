import { ServicioGetExecute, getMenuPrincipal, getPreguntaUsuario, ServicioPostExecute, getValidarPreguntaUsuario, setResetPassword, getLogin, getLoginPerfil, getPreguntas, setPreguntas, setPassword, setPasswordPrimeraVez, getListaBases, getListaConexiones, setConexion, addConexion, getListaSeguimiento, getListaDocumentos, getListaColecciones, getDescargarLogsTexto, getLogsTexto, getContenidoLogsTexto, getValidaciones, getScore, getInfoSocio, getInfoEco, addAutorizacion, getSolicitudes, addSolicitud, getContrato, getInfoFinan, addProspecto, getFlujoSolicitud, addComentarioAsesor, addComentarioSolicitud, updResolucion, addResolucion, getResolucion, addProcEspecifico, updSolicitud, getParametros, getReporteOrden, getOrdenes, getTarjetasCredito, getInforme, getMedioAprobacion, getSeparadores, addDocumentosAxentria, getDocumentosAxentria, crearSeparadores } from './Services';
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
        str_cargo: strCargo,
        str_identificacion: strCedula,
        str_tipo_identificacion: strTipoDocumento,
        str_nombres: strNombres,
        str_lugar: strLugar,
        str_oficial: strOficial
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
        loadfile: {
            file: archivoBase64
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
        console.log("DATA",  data)
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

export function fetchAddDocumentosAxentria(requiereSeparar, rutaArchivo, nombreArchivo, identificacionSocio, usuCarga, nombreSocio, nombreGrupo, referencia, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        bln_separar: requiereSeparar,
        bln_publicar: true,
        str_ruta_arc: rutaArchivo,
        str_nombre_arc: nombreArchivo,
        str_identificacion: identificacionSocio,
        str_login_carga: usuCarga,
        str_nombre_socio: nombreSocio,
        str_nombre_grupo: nombreGrupo,
        str_referencia: referencia
    }

    ServicioPostExecute(addDocumentosAxentria, body, token, { dispatch: dispatch }).then((data) => {
        console.log("Add Doc Axe,", data);
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
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

export function fetchGetDocumentosAxentria(intIdDocumento, intIdSolicitud, intIdFlujo, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        id_documento: intIdDocumento,
        id_solicitud: intIdSolicitud,
        id_flujo: intIdFlujo
    }
    ServicioPostExecute(getDocumentosAxentria, body, token, { dispatch: dispatch }).then((data) => {
        console.log("Get Doc Axe,", data);
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
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


export function fetchCrearSeparadoresAxentria(separadores, token, onSucces, dispatch) {
    if (dispatch) dispatch(setErrorRedirigir(""));

    let body = {
        lst_separadores_gen: separadores
        //lst_separadores_gen: ["1_SOLICITUD_DE_CREDITO"]
    }
    //console.log("LISTT", body)
    ServicioPostExecute(crearSeparadores, body, token, { dispatch: dispatch }).then((data) => {
        console.log("Crear Sep,", data);
        if (data) {
            if (data.error) {
                if (dispatch) dispatch(setAlertText({ code: "1", text: data.error }));
            } else {
                if (data.str_res_estado_transaccion === "OK") {
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