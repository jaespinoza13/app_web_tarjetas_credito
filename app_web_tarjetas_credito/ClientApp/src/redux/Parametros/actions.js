import jwt_decode from "jwt-decode";

import { ServiceUrl } from "../../services/Services"
import { desencriptar, extractSecret, get, set } from "../../js/crypt"
import { getAuthenticated } from "react-session-persist/lib"
import { EpochToDate, IsNullOrWhiteSpace } from "../../js/utiles"
import { setAlertText } from "../Alert/actions"

/*
 * Actions Info Sistema
 */
import { getListaMejorasSuccessAction, getListaMejorasFailureAction, getListaMejorasRequestAction } from "./InfoSistema/Mejoras/actions"
/*
 * Actions de Urls
 */
import { getListaUrlsSuccessAction, getListaUrlsFailureAction, getListaUrlsRequestAction } from "../Urls/actions"
/**
 * Token
 */
import { setTokenStateAction } from "../Token/actions"
import { setStateLoad } from "../Loadding/actions";

export const getListaParametrosRequest = 'FETCH_LISTA_PARAMETROS_REQUEST'
export const getListaParametrosSuccess = 'FETCH_LISTA_PARAMETROS_SUCCESS'
export const getListaParametrosFailure = 'FETCH_LISTA_PARAMETROS_FAILURE'

export const getListaParametrosRequestAction = () => {
    return {
        type: getListaParametrosRequest
    }
}
export const getListaParametrosSuccessAction = (data) => {
    return {
        type: getListaParametrosSuccess,
        payload: data
    }
}
export const getListaParametrosFailureAction = (error) => {
    return {
        type: getListaParametrosFailure,
        payload: error
    }
}

export const fetchGetListaParametros = () => {
    return (dispatch) => {

        dispatch(setStateLoad(true));

        dispatch(getListaParametrosRequestAction());

        dispatch(getListaMejorasRequestAction());

        dispatch(getListaUrlsRequestAction());

        var remitente = localStorage.getItem('remitente');
        var aceptar = localStorage.getItem('aceptar');
        var requestOptions = null;
        if (!getAuthenticated() || IsNullOrWhiteSpace(remitente) || IsNullOrWhiteSpace(aceptar)) {
            requestOptions = {
                method: 'GET',
                headers: {}
            };
        } else {
            requestOptions = {
                method: 'GET',
                headers: {
                    "aceptar": localStorage.getItem('aceptar'),
                    "remitente": localStorage.getItem('remitente'),
                    "sender": localStorage.getItem('sender'),
                    "receiver": localStorage.getItem('aceptar'),
                }
            };
        }

        fetch(ServiceUrl(getListaParametrosRequest), requestOptions)
            .then(async (response) => {
                try {
                    console.log(response);
                    var secret = extractSecret(response.headers.get("secret"));
                    if (response.ok) {
                        var token = response.headers.get("Grand-Tok");
                        var json = await response.json();
                        var res = await desencriptar(set(JSON.stringify({ v1: get(secret.v1), v2: get(secret.v2) })), json.data);
                        var str_aceptar = String(res.t_aceptar);
                        var iteraciones = Number(str_aceptar.substr(0, 1));
                        if (iteraciones < 2) {
                            iteraciones = 2
                        }
                        for (let i = 0; i < iteraciones; i++) {
                            token = atob(token);
                        }
                        var decoded = jwt_decode(token);
                        if (!decoded ||
                            new Date(EpochToDate(decoded.exp)) <= new Date(EpochToDate(decoded.nbf)) ||
                            new Date(EpochToDate(decoded.exp)) < new Date() ||
                            new Date(EpochToDate(decoded.nbf)) > new Date()
                        ) {
                            dispatch(setTokenStateAction(""));
                            throw new Error("Token Invalido");
                        } else {
                            dispatch(setTokenStateAction(token));
                            return res;
                        }
                    }
                } catch (e) {
                    console.error("error para ", e);
                    dispatch(setTokenStateAction(""));
                    throw new Error(e);
                }
                dispatch(setTokenStateAction(""));
                throw new Error(response.status + " - " + response.statusText);
            })
            .then(data => {
                dispatch(setStateLoad(false));
                if (data.codigo === "0000") {
                    console.log(data);
                    remitente = localStorage.getItem('remitente');
                    aceptar = localStorage.getItem('aceptar');
                    if (!getAuthenticated() || IsNullOrWhiteSpace(remitente) || IsNullOrWhiteSpace(aceptar)) {
                        localStorage.setItem('remitente', data.remitente);
                        localStorage.setItem('aceptar', data.t_aceptar);
                    }
                    localStorage.setItem("Acept", data.t_aceptar);

                    var parametros = [];
                    parametros["sistema"] = set(data.nombre_sistema);
                    parametros["version"] = set(data.version);
                    parametros["fActual"] = set(data.f_actualizacion);
                    parametros["tInacti"] = set(data.t_inactividad + "");
                    parametros["nroCara"] = set(data.nro_caracteres_pass + "");
                    parametros["nroPreg"] = set(data.nro_preguntas + "");
                    parametros["parametros"] = [];

                    if (data.parametros && data.parametros.length > 0) {
                        for (let i = 0; i < data.parametros.length; i++) {
                            parametros["parametros"].push({
                                int_id: set(String(data.parametros[i].int_id)),
                                str_nombre: set(data.parametros[i].str_nombre),
                                str_nemonico: set(data.parametros[i].str_nemonico),
                                str_valor_ini: set(data.parametros[i].str_valor_ini),
                                str_valor_fin: set(data.parametros[i].str_valor_fin),
                                str_descripcion: set(data.parametros[i].str_descripcion),
                            });
                        }
                    }

                    dispatch(getListaParametrosSuccessAction(parametros));

                    var array = [...data.mejoras];
                    for (let i = 0; i < array.length; i++) {
                        array[i] = set(array[i]);
                    }
                    dispatch(getListaMejorasSuccessAction(array));

                    dispatch(getListaUrlsSuccessAction(data.urls));
                } else {
                    dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));

                    dispatch(getListaParametrosSuccessAction([]));
                    dispatch(getListaParametrosFailureAction(data.codigo + " - " + data.mensaje));

                    dispatch(getListaMejorasSuccessAction([]));
                    dispatch(getListaUrlsSuccessAction([]));
                }
            })
            .catch(error => {
                dispatch(setStateLoad(false));
                console.log('Hubo un problema con la petición Fetch: ' + error.message);
                dispatch(getListaParametrosFailureAction(error));

                dispatch(getListaMejorasFailureAction(error));
                dispatch(getListaUrlsFailureAction(error));

                dispatch(setAlertText({ code: "1", text: "Ocurrió un error al obtener los parámetros" }));
            });
    }
}