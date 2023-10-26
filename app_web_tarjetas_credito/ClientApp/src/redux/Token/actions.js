export const setTokenState = 'SET_TOKEN_STATE';  export const setTokenStateAction = (data) => {     return {         type: setTokenState,         payload: data,     };
 }  export const setStateToken = (token) => {     return (dispatch) => {
        dispatch(setTokenStateAction(token));     };
 }; 