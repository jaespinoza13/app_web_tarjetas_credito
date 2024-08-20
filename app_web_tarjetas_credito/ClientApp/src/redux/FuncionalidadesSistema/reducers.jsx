import { setFuncionalidadesSistema } from './actions';

const initialState = {
    data: [],
    error: ''
}

export const GetFuncionalidadesSistema = (state = initialState, action) => {
    if (action.type === setFuncionalidadesSistema) {
        return {
            data: action.payload
        }
    }
    else {
        return state;
    }
}