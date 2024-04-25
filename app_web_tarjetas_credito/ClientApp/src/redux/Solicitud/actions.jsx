export const setSolicitudState = 'SET_SOLICITUD_STATE';

export const setSolicitudStateAction = (data) => {
    console.log(data);
    return {
        type: setSolicitudState,
        payload: data
    }
}