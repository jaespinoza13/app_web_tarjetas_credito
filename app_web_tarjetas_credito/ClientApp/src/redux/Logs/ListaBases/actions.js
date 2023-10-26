export const listaBasesMongo = 'FETCH_LISTA_BASES'  export const listaBasesMongoAction = (lista) => {     return {         type: listaBasesMongo,         payload: lista     };
 };  export const setListaBases = (lst) => {     return (dispatch) => {         if (lst && Array.isArray(lst)) {
            dispatch(listaBasesMongoAction(lst));         }     };
 };