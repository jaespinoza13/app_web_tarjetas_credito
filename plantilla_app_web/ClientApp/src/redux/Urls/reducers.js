import { getListaUrlsFailure, getListaUrlsRequest, getListaUrlsSuccess } from "./actions";

const initialState = {
    loading: false,
    data: [],
    error: ''
}
export const GetListaUrls = (state = initialState, action) => {
    switch (action.type) {
        case getListaUrlsRequest:
            return {
                ...state,
                loading: true
            }
        case getListaUrlsSuccess:
            return {
                loading: false,
                data: action.payload,
                error: ''
            }
        case getListaUrlsFailure:
            return {
                loading: false,
                data: [],
                error: action.payload
            }
        default:
            return state;
    }
}