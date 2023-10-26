import { getFileSelect } from "./actions";

const initialState = {
    data: [],
}
export const GetFile = (state = initialState, action) => {
    switch (action.type) {
        case getFileSelect:
            return {
                data: action.payload,
            }
        default:
            return state;
    }
}