export const setDatoSocioState = 'SET_DATOSOCIO_STATE';

export const getDatoSocioStateAction = (data) => {
    return {
        type: setDatoSocioState,
        payload: data
    }
}