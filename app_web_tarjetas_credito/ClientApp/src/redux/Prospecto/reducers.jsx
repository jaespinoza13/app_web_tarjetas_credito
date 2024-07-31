import { setProspectoState } from "./actions";

const initialSate = {
    data: []
}

export const prospecto = (state = initialSate, action) => {
    if (action.type === setProspectoState) {
        return {
            data: action.payload
        }
    } else {
        return state;
    }
}