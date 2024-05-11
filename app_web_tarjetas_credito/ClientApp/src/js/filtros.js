/**
 * Filtrado para Ordenes
 * @param {any} filtroOpcion --> Opcíón referente al tipo de filtrado que se quiere realizar
 * @param {any} filtradoInputValor --> Valor del Input a buscar 
 * @param {any} lstOrdenesResponse --> Es una copia de la variable (arreglo) donde guarda lo que retorno la petición
 * @returns
*/
export function filtrarOrdenes(filtroOpcion, filtradoInputValor, lstOrdenesResponse) {

    if (filtroOpcion !== "filtroTodos" && (filtradoInputValor === "" || filtradoInputValor === undefined)) {
        return window.alert("Ingrese un texto en el campo");
    }

    let ordenFiltradasTotal = lstOrdenesResponse;
    var ordenFiltradasResult = [];

    switch (filtroOpcion) {
        case 'filtroOrden':
            ordenFiltradasResult = ordenFiltradasTotal.filter(orden => orden.orden.includes(filtradoInputValor));
            break;
        case 'filtroIdentificacion':
            ordenFiltradasResult = ordenFiltradasTotal.map(orden_item => {
                const tarjetasReceptadasFiltradas = orden_item.orden_tarjetaDet.filter(receptada => receptada.identificacion === filtradoInputValor);
                return {
                    orden: orden_item.orden,
                    prefijo_tarjeta: orden_item.prefijo_tarjeta,
                    cost_emision: orden_item.cost_emision,
                    descripcion: orden_item.descripcion,
                    oficina_envia: orden_item.oficina_envia,
                    oficina_recepta: orden_item.oficina_recepta,
                    orden_tarjetaDet: tarjetasReceptadasFiltradas
                };
            }).filter(orden_item => orden_item.orden_tarjetaDet.length > 0);
            break;

        case 'filtroNombre':
            ordenFiltradasResult = ordenFiltradasTotal.map(orden_item => {
                const tarjetasReceptadasFiltradas = orden_item.orden_tarjetaDet.filter(receptada => receptada.nombre.toLowerCase().includes(filtradoInputValor.toLowerCase()));
                return {
                    orden: orden_item.orden,
                    prefijo_tarjeta: orden_item.prefijo_tarjeta,
                    cost_emision: orden_item.cost_emision,
                    descripcion: orden_item.descripcion,
                    oficina_envia: orden_item.oficina_envia,
                    oficina_recepta: orden_item.oficina_recepta,
                    orden_tarjetaDet: tarjetasReceptadasFiltradas
                };
            }).filter(orden_item => orden_item.orden_tarjetaDet.length > 0);
            break;

        case 'filtroTarjeta':
            ordenFiltradasResult = ordenFiltradasTotal.map(orden_item => {
                const tarjetasReceptadasFiltradas = orden_item.orden_tarjetaDet.filter(receptada => receptada.numero_tarjeta.includes(filtradoInputValor));
                return {
                    orden: orden_item.orden,
                    prefijo_tarjeta: orden_item.prefijo_tarjeta,
                    cost_emision: orden_item.cost_emision,
                    descripcion: orden_item.descripcion,
                    oficina_envia: orden_item.oficina_envia,
                    oficina_recepta: orden_item.oficina_recepta,
                    orden_tarjetaDet: tarjetasReceptadasFiltradas
                };
            }).filter(orden_item => orden_item.orden_tarjetaDet.length > 0);
            break;
        case 'filtroTodos':
            ordenFiltradasResult = ordenFiltradasTotal;
            break;

        default:
    }
    return ordenFiltradasResult;
}
