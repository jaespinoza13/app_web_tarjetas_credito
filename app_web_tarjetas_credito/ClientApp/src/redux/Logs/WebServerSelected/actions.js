export const getWebServiceSelect = 'FETCH_WEB_SERVICE_SELECT'  export const getWebServiceSelectAction = (name) => {     return {         type: getWebServiceSelect,         payload: name     };
 };    export const selectWebService = (name) => {     return (dispatch) => {         if (name && name !== "") {             dispatch(getWebServiceSelectAction(name));         }     };
 };