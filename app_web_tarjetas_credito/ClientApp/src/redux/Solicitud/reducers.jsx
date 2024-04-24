import { setSolicitudState } from "./actions";

const initialSate = {
    data: []
}

export const solicitud = (state = initialSate, action) => {
    if (action.type === setSolicitudState) {
        return {
            data: action.payload
        }
    } else {
        return state;
    }
}