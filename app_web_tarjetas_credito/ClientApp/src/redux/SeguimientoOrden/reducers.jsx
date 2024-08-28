import { setSeguimientOrden } from './actions';

const initialState = {
    data: {},
    error: ''
}

export const GetSeguimientoOrden = (state = initialState, action) => {
    if (action.type === setSeguimientOrden) {
        return {
            data: action.payload
        }
    }
    else {
        return state;
    }
}