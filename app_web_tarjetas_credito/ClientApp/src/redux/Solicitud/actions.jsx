export const setSolicitudState = 'SET_SOLICITUD_STATE';

export const setSolicitudStateAction = (data) => {
    return {
        type: setSolicitudState,
        payload: data
    }
}