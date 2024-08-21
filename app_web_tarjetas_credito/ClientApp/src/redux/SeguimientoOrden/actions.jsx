export const setSeguimientOrden = 'SET_SEGUIMIENTO_ORDEN';

export const setSeguimientOrdenAction = (data) => {
    return {
        type: setSeguimientOrden,
        payload: data
    }
}