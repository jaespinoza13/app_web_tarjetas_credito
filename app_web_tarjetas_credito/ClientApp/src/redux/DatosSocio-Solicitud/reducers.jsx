import { setDatoSocioState } from './actions';

const initialState = {
    data: [],
    error: ''
}

export const GetDatoSocio = (state = initialState, action) => {
    if (action.type === setDatoSocioState) {
        return {
            data: action.payload
        }
    }
    else {
        return state;
    }
}