import { setLoadState } from "./actions";

const initialState = {
    loading: false,
    data: 0,
}
export const loadding = (state = initialState, action) => {
    if (action.type === setLoadState) {
        var cont = action.payload === true ? state.data + 1 : state.data - 1
        cont = cont < 0 ? 0 : cont;

        return {
            loading: cont > 0,
            data: cont,
        }
    } else {
        return state;
    }
}