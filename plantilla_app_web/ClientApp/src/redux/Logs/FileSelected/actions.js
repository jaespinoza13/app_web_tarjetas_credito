export const getFileSelect = 'FETCH_FILE_SELECT'  export const getFileSelectAction = (name) => {     return {         type: getFileSelect,         payload: name     };
 };  export const selectFile = (name) => {     return (dispatch) => {         if (name && name !== "") {
            dispatch(getFileSelectAction(name));         }     };
 };