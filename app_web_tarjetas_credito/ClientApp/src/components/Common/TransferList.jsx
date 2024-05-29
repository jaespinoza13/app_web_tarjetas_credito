import { useEffect, useState } from 'react';
import '../../css/Components/TransferList.css';
import Table from './Table';

/**
 * 
 * @param {*} headersTableN1
 * @param {*} headersTableN2
 * @param {*} datos
 * @param {*} isActiveBtnCambiarTodos
 * @returns 
 * @param {*} setResultadoArray
 */
const TransferList = ({ headersTableN1, headersTableN2, datos, isActiveBtnCambiarTodos, setResultadoArray }) => {

    var [lstDatos, setLstDatos] = useState([]);
    var [lstDatosRespaldo, setLstDatosRespaldo] = useState([]);

    // Estado para las filas seleccionadas en cada tabla
    const [lstItemsTabla1, setLstItemsTabla1] = useState([]);
    const [lstItemsTabla2, setLstItemsTabla2] = useState([]);

    // Función para manejar el clic en las filas de la tabla
    const handleRowClick = (rowId, table) => {
        if (table === 'table1') {
            if (lstItemsTabla1.includes(rowId)) {
                //Si lo incluye lo elimina                
                setLstItemsTabla1(lstItemsTabla1.filter(id => id !== rowId));
            } else {
                //Lo agrega
                setLstItemsTabla1([...lstItemsTabla1, rowId]);
            }
        } else {
            //Regresar item a la Tabla N1
            if (lstItemsTabla2.includes(rowId)) {
                const cambiarItemTablaN1 = [...lstDatos, rowId]
                setLstItemsTabla2(lstItemsTabla2.filter(id => id !== rowId));
                setLstDatos(cambiarItemTablaN1);
            }
        }
    };


    const moveAllSelectedRows = () => {
        if (lstDatos.length > 0) {
            setLstItemsTabla1([]);
            setLstDatos([]);
            setLstItemsTabla2([...lstItemsTabla2, ...lstDatos]);
        }
    };

    // Función para pasar las filas seleccionadas de la primera tabla a la segunda tabla
    const moveSelectedRows = () => {

        //OPCIONAL: Si se desea mantener los datos en la primera linea, quitar las lineas a continuacion hasta "setLstDatos(ItemsResultantes);"
        var ItemsResultantes = lstDatos;
        lstItemsTabla1.forEach(item => {
            ItemsResultantes = ItemsResultantes.filter(func => func.id !== item.id)
        });
        setLstDatos(ItemsResultantes);

        //Agrega los items a la segunda tabla
        const objetosEnviar = new Set([...lstItemsTabla2, ...lstItemsTabla1]);
        setLstItemsTabla2([...objetosEnviar]);
        setLstItemsTabla1([]);
    };

    const limpiarHandler = () => {
        setLstItemsTabla1([]);
        setLstItemsTabla2([]);
        setLstDatos(lstDatosRespaldo);
    }

    useEffect(() => {
        setLstDatos(datos)
        setLstDatosRespaldo(datos);
    }, [datos])

    //Actualiza el arreglo resultante    
    useEffect(() => {
        setResultadoArray(lstItemsTabla2);
    }, [lstItemsTabla2])

    return (
        <div className='center_text_items'>
            <div style={{ width: "900px" }}>

                <section className="elements_three_column_transfLst">
                    <div>
                        <Table headers={headersTableN1} className={lstDatos.length <= 3 ? "scroll alt" : "scroll"}>
                            {lstDatos.map((data, index) => (
                                <tr key={data.id}
                                    onClick={() => handleRowClick(data, 'table1')}>
                                    <td style={{ backgroundColor: lstItemsTabla1.includes(data) ? '#D4E6F1' : 'white' }}>
                                        {data.nombre}
                                    </td>


                                </tr>
                            ))}
                        </Table>
                    </div>
                    <div className='center_text_items'>
                        <div>
                            {isActiveBtnCambiarTodos &&
                                <button className="btn_mg btn_mg__secondary mt-2" onClick={moveAllSelectedRows} type="button">Cambiar todos</button>
                            }
                            <button className="btn_mg btn_mg__secondary mt-2" onClick={moveSelectedRows} type="button">Cambiar seleccionados</button>
                            <button className="btn_mg btn_mg__secondary mt-2" onClick={limpiarHandler} type="button">Limpiar</button>
                        </div>
                    </div>

                    <div>
                        <Table headers={headersTableN2} className={lstItemsTabla2.length <= 3 ? "scroll alt" : "scroll"}>
                            {lstItemsTabla2.map((data, index) => (
                                <tr key={data.id}
                                    onClick={() => handleRowClick(data, 'table2')}>

                                    <td style={{ backgroundColor: lstItemsTabla2.includes(data) ? '#D4E6F1' : 'white' }}>
                                        {data.nombre}
                                    </td>

                                </tr>
                            ))}
                        </Table>
                    </div>

                </section>
            </div>
        </div>
    )
}


export default TransferList;