import { IsNullOrWhiteSpace } from "../../js/utiles";

export const setTextAlert = 'SET_ALERT_TEXT'; export const setAlertErrorRedirigir = 'SET_ALERT_ERROR_REDIRIGIR'; export const setCustomAction = 'SET_ALERT_CUSTOM_FUNCTION';  export const setTextAlertAction = (data) => {     return {         type: setTextAlert,         payload: data     }
 } export const setAlertErrorRedirigirAction = (error) => {     return {         type: setAlertErrorRedirigir,         payload: error     }
 } export const setAlertCustomAction = (func) => {     return {         type: setCustomAction,         payload: func     }
 }  export const setAlertText = (data, func = null) => {     return async (dispatch) => {         var flag = false;         if (!IsNullOrWhiteSpace(data.code)) {             var num = Number(data.code);             if (!isNaN(num) && num === 0) {
                flag = true;
            }
        }         dispatch(setTextAlertAction({ isError: flag, text: data.text }));
        dispatch(setAlertCustomAction(func));
    };
 };   export const setErrorRedirigir = (text) => {     return async (dispatch) => {         dispatch(setAlertErrorRedirigirAction(text));
    };
 };   export const setCustomActionBtn = (func) => {     return async (dispatch) => {         dispatch(setAlertCustomAction(func));
    };
 };