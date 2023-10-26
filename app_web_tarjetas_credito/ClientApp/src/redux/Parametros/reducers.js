import { getListaParametrosFailure, getListaParametrosRequest, getListaParametrosSuccess } from "./actions";

const initialState = {
    loading: false,
    data: [],
    error: ''
}
export const GetParametros = (state = initialState, action) => {
    switch (action.type) {
        case getListaParametrosRequest:
            return {
                ...state,
                loading: true
            }
        case getListaParametrosSuccess:
            return {
                loading: false,
                data: action.payload,
                error: ''
            }
        case getListaParametrosFailure:
            return {
                loading: false,
                data: [],
                error: action.payload
            }
        default:
            return state;
    }
}