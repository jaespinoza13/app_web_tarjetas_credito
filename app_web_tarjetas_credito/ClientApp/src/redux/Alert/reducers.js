import { setAlertErrorRedirigir, setTextAlert, setCustomAction } from "./actions";

const initialState = {
    code: false,
    text: '',
    redirect: '',
    action: null
}
export const alertText = (state = initialState, action) => {
    switch (action.type) {
        case setTextAlert:
            return {
                ...state,
                code: action.payload.isError,
                text: action.payload.text,
            }
        case setAlertErrorRedirigir:
            return {
                ...state,
                redirect: action.payload
            }
        case setCustomAction:
            return {
                ...state,
                action: action.payload
            }
        default:
            return state;
    }
}