export const setLoadState = 'SET_LOAD_STATE';   export const setLoadStateAction = (data) => {     return {         type: setLoadState,         payload: data,     };
 }  export const setStateLoad = (flag) => {     return (dispatch) => {
        dispatch(setLoadStateAction(flag));     };
 }; 