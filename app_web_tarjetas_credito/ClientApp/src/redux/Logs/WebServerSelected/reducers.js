import { getWebServiceSelect } from "./actions";

const initialState = {
    data: [],
}
export const GetWebService = (state = initialState, action) => {
    switch (action.type) {
        case getWebServiceSelect:
            return {
                data: action.payload,
            }
        default:
            return state;
    }
}