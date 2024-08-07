export const setDataSimulacionState = 'SET_DATASIMULACION_STATE';

export const setDataSimulacionStateAction = (data) => {
    return {
        type: setDataSimulacionState,
        payload: data
    }
}