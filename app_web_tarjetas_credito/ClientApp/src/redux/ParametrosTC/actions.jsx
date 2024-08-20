export const setParametrosTCState = 'SET_PARAMETROSTC_STATE';

export const setParametrosTCStateAction = (data) => {
    return {
        type: setParametrosTCState,
        payload: data
    }
}