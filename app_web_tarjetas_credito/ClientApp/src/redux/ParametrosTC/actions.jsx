export const setParametrosTCState = 'SET_PARAMETROSTC_STATE';

export const getParametrosTCStateAction = (data) => {
    //console.log(data);
    return {
        type: setParametrosTCState,
        payload: data
    }
}