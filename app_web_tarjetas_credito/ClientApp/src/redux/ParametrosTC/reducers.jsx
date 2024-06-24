import { setParametrosTCState } from './actions';

const initialState = {
    data: [],
    error: ''
}

export const GetParametrosTC = (state = initialState, action) => {
    if (action.type === setParametrosTCState) {
        return {
            data: action.payload
        }
    }
    else {
        return state;
    }
}