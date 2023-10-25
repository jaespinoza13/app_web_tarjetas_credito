import { setTokenState } from "./actions";

const initialState = {
    data: "",
}
export const tokenActive = (state = initialState, action) => {
    if (action.type === setTokenState) {
        return { data: action.payload};
    }
    return state;
}