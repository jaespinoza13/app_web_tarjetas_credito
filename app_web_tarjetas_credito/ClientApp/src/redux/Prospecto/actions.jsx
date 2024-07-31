export const setProspectoState = 'SET_PROSPECTO_STATE';

export const setProspectoStateAction = (data) => {
    return {
        type: setProspectoState,
        payload: data
    }
}