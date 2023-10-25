import { set } from "../../js/crypt"
import { getFuncionalidadesUsuario, getUsuario, ServicioPostExecute } from "../../services/Services"
import { setAlertText, setErrorRedirigir } from "../Alert/actions"

export const getListaFuncionalidadesRequest = 'FETCH_LISTA_FUNCIONALIDADES_REQUEST' export const getListaFuncionalidadesSuccess = 'FETCH_LISTA_FUNCIONALIDADES_SUCCESS' export const getListaFuncionalidadesFailure = 'FETCH_LISTA_FUNCIONALIDADES_FAILURE'  export const getListaFuncionalidadesRequestAction = () => {     return {         type: getListaFuncionalidadesRequest     }
 } export const getListaFuncionalidadesSuccessAction = (data) => {     return {         type: getListaFuncionalidadesSuccess,         payload: data     }
 } export const getListaFuncionalidadesFailureAction = (error) => {     return {         type: getListaFuncionalidadesFailure,         payload: error     }
 }  export const fetchGetListaFuncionalidades = (flag, token) => {     return async (dispatch) => {         if (dispatch) dispatch(setErrorRedirigir("/"));         var datosUsuario = await getUsuario();         if (datosUsuario) {
            dispatch(getListaFuncionalidadesRequestAction());
            var body = { tipo: flag ? 452 : 451, id_perfil: datosUsuario.id_perfil };
            ServicioPostExecute(getFuncionalidadesUsuario, body, token, { dispatch: dispatch }).then((data) => {
                if (data) {
                    if (data.error) {
                        if (dispatch && data.reload) dispatch(setErrorRedirigir("/reload"));
                        dispatch(getListaFuncionalidadesSuccessAction([]));
                        dispatch(getListaFuncionalidadesFailureAction(data.error));
                        dispatch(setAlertText({ code: "1", text: data.error }));
                    } else {
                        if (data.codigo === "0000") {
                            if (data.fucionalidades.length > 0 && data.fucionalidades[0].nombre === '¨') {
                                dispatch(getListaFuncionalidadesSuccessAction([]));
                            } else {
                                var array = [];
                                for (let i = 0; i < data.fucionalidades.length; i++) {
                                    array.push({ fun_id: set(String(data.fucionalidades[i].fun_id)), nombre: set(data.fucionalidades[i].nombre), url: set(data.fucionalidades[i].url) });
                                }
                                dispatch(getListaFuncionalidadesSuccessAction(array));
                            }
                        } else {
                            console.log(data);
                            dispatch(getListaFuncionalidadesSuccessAction([]));
                            dispatch(getListaFuncionalidadesFailureAction(data.codigo + " - " + data.mensaje));
                            dispatch(setAlertText({ code: data.codigo, text: data.mensaje }));
                        }
                    }
                } else {
                    dispatch(getListaFuncionalidadesSuccessAction([]));
                    dispatch(getListaFuncionalidadesFailureAction("Error en la comunicación con el servidor"));
                    dispatch(setAlertText({ code: "1", text: "Error en la comunicación con el servidor" }));
                }
            }).catch((error) => {
                console.log('Hubo un problema con la petición Fetch: ' + error.message);
                dispatch(getListaFuncionalidadesFailureAction(error));
                dispatch(setAlertText({ code: "1", text: error }));
            });
        }
    }
 }