import { setDataSimulacionState } from "./actions";

const initialSate = {
    data: []
}

export const dataSimulacionCupo = (state = initialSate, action) => {
    if (action.type === setDataSimulacionState) {
        return {
            data: action.payload
        }
    } else {
        return state;
    }
}