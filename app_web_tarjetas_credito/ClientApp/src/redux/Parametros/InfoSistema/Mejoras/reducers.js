import { getListaMejorasFailure, getListaMejorasRequest, getListaMejorasSuccess } from "./actions";

const initialState = {
    loading: false,
    data: [],
    error: ''
}
export const GetListaMejoras = (state = initialState, action) => {
    switch (action.type) {
        case getListaMejorasRequest:
            return {
                ...state,
                loading: true
            }
        case getListaMejorasSuccess:
            return {
                loading: false,
                data: action.payload,
                error: ''
            }
        case getListaMejorasFailure:
            return {
                loading: false,
                data: [],
                error: action.payload
            }
        default:
            return state;
    }
}