import { setParametrosSistema } from './actions';

const initialState = {
    data: [],
    error: ''
}

export const GetParametrosSistema = (state = initialState, action) => {
    if (action.type === setParametrosSistema) {
        return {
            data: action.payload
        }
    }
    else {
        return state;
    }
}