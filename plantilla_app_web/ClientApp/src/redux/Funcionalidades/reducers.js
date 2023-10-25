import { getListaFuncionalidadesFailure, getListaFuncionalidadesRequest, getListaFuncionalidadesSuccess } from "./actions";

const initialState = {
    loading: false,
    data: [],
    error: ''
}
export const GetListaFuncionalidades = (state = initialState, action) => {
    switch (action.type) {
        case getListaFuncionalidadesRequest:
            return {
                ...state,
                loading: true
            }
        case getListaFuncionalidadesSuccess:
            return {
                loading: false,
                data: action.payload,
                error: ''
            }
        case getListaFuncionalidadesFailure:
            return {
                loading: false,
                data: [],
                error: action.payload
            }
        default:
            return state;
    }
}