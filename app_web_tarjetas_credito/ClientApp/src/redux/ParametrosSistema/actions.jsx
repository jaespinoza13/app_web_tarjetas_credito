export const setParametrosSistema = 'SET_PARAMETROS_SISTEMA';

export const setParametrosSistemaAction = (data) => {
    return {
        type: setParametrosSistema,
        payload: data
    }
}