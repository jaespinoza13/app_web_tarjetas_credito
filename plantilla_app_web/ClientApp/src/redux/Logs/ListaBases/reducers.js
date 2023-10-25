import { listaBasesMongo } from "./actions";

const initialState = {
    data: [],
}
export const ListaBasesMongoDb = (state = initialState, action) => {
    switch (action.type) {
        case listaBasesMongo:
            return {
                data: action.payload,
            }
        default:
            return state;
    }
}