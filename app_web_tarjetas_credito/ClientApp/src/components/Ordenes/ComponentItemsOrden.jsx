import { Fragment, useEffect, useState } from "react";
import Input from "../Common/UI/Input";
import AccordionV2 from '../Common/UI/AccordionV2';
import Chip from "../Common/UI/Chip";

const ComponentItemsOrden = (props) => {

    const [checkSeleccionPadre, setCheckSeleccionPadre] = useState(false);
    const [checkSeleccionHijo, setCheckSeleccionHijo] = useState(false);
    const [totalItemOrdenCheck, setTotalItemOrdenCheck] = useState([]);

    const setStatusCheckHandler = (valor) => {
        setCheckSeleccionHijo(valor);
    }

    const itemsOrdenCkeckTotal = (array, oficinaSolicita) => {
        setTotalItemOrdenCheck(array)
        props.returnItems(array, oficinaSolicita);
    }


    useEffect(() => {
        if (props.orden.lst_socios.length > 0) {
            setCheckSeleccionPadre(totalItemOrdenCheck.length === props.orden.lst_socios.length && totalItemOrdenCheck.length !== 0)
        }
    }, [totalItemOrdenCheck])


    return (
        <Fragment key={props.index}>
            <ComponentHeaderAccordion
                index={props.index}
                header={props.orden}
                inicialStateCheck={checkSeleccionPadre}
                checkStatusChange={(e) => { setStatusCheckHandler(e) }}
                pantallaTituloExponer={props.pantallaTituloExponer}
                opcionHeader={props.opcionHeader}
            >
                <ComponentOrdenItems
                    ordenItem={props.orden}
                    checkStatusSeleccion={checkSeleccionHijo}
                    returnItemOrden={(tarj) => itemsOrdenCkeckTotal(tarj, props.orden.oficina)}
                    opcionItemDisable={props.opcionItemDisable }
                ></ComponentOrdenItems>
            </ComponentHeaderAccordion>

        </Fragment>

    )

}


const ComponentHeaderAccordion = (props) => {


    const [checkSeleccionAll, setCheckSeleccionAll] = useState(false);

    useEffect(() => {
        props.checkStatusChange(checkSeleccionAll);
    }, [props, checkSeleccionAll])

    let titulo = (
        <div className="w-95 f-row">
            {props.pantallaTituloExponer === "EnvioRececepcionPersonalizacion" &&

                <div className='content-headertable' >
                    <div className="content-block" style={{ width: "9%", minWidth: "50px" }} >
                        <h4 className="item-header white">Oficina</h4>
                    </div>
                    <div className="content-block" style={{ width: "21%", minWidth: "270px" }} >
                        <h4 className="item-header white">{props.header.oficina}</h4>
                    </div>
                    <div className="content-block" style={{ width: "14%", minWidth: "130px" }} >
                        <h4 className="item-header white">Total de tarjetas</h4>
                    </div>
                    <div className="content-block" style={{ width: "7%", minWidth: "50px" }} >
                        <h4 className="item-header white">{props.header.num_total_tarjetas}</h4>
                    </div>
                    <div className="content-block" style={{ width: "5%", minWidth: "130px" }} >
                        <h4 className="item-header white">Fecha procesado</h4>
                    </div>
                    <div className="content-block" style={{ width: "12%", minWidth: "120px" }} >
                        <h4 className="item-header white">{props.header.fecha_rel}</h4>
                    </div>
                    {props.opcionHeader === true  &&
                        <div className="" style={{ position: "absolute", right: "80px" }}>
                            <input type="checkbox" name={props.header.orden} checked={props.inicialStateCheck}
                                onChange={(e) => setCheckSeleccionAll(!checkSeleccionAll)}
                            />
                        </div>
                    }
                </div>
            }

            {/* {props.pantallaTituloExponer === "RececepcionTarjetasProveedor" &&*/}
            {props.pantallaTituloExponer === "Seguimiento" &&

                <div className='content-headertable' >
                    <div className="content-block" style={{ width: "9%", minWidth: "50px" }} >
                        <h4 className="item-header white">Oficina</h4>
                    </div>
                    <div className="content-block" style={{ width: "21%", minWidth: "270px" }} >
                        <h4 className="item-header white">{props.header.oficina}</h4>
                    </div>
                    <div className="content-block" style={{ width: "16%", minWidth: "210px" }} >
                        <h4 className="item-header white">Total de tarjetas</h4>
                    </div>
                    <div className="content-block" style={{ width: "7%", minWidth: "50px" }} >
                        <h4 className="item-header white">{props.header.num_total_tarjetas}</h4>
                    </div>                   
                    {props.opcionHeader === true &&
                        <div className="" style={{ position: "absolute", right: "80px" }}>
                        <input type="checkbox"
                            name={props.header.orden}
                            checked={props.inicialStateCheck}
                            onChange={(e) => setCheckSeleccionAll(!checkSeleccionAll)}
                            />
                        </div>
                    }
                </div>
            }

            {props.pantallaTituloExponer === "RecepcionTarjetasOficina" &&
                <div className='content-headertable' >
                    <div className="content-block" style={{ width: "9%", minWidth: "50px" }} >
                        <h4 className="item-header white">Oficina</h4>
                    </div>
                    <div className="content-block" style={{ width: "21%", minWidth: "270px" }} >
                        <h4 className="item-header white">{props.header.oficina}</h4>
                    </div>
                    <div className="content-block" style={{ width: "14%", minWidth: "150px" }} >
                        <h4 className="item-header white">Fecha de envio</h4>
                    </div>
                    <div className="content-block" style={{ width: "16%", minWidth: "150px" }} >
                        <h4 className="item-header white">{props.header.fecha_envio}</h4>
                    </div>
                    <div className="content-block" style={{ width: "16%", minWidth: "220px" }} >
                        <h4 className="item-header white">Total de tarjetas</h4>
                    </div>
                    <div className="content-block" style={{ width: "7%", minWidth: "50px" }} >
                        <h4 className="item-header white">{props.header.num_total_tarjetas}</h4>
                    </div>
                    {props.opcionHeader === true &&
                        <div className="" style={{ position: "absolute", right: "80px" }}>
                            <input type="checkbox" name={props.header.orden} checked={props.inicialStateCheck}
                                onChange={(e) => setCheckSeleccionAll(!checkSeleccionAll)}
                            />
                        </div>
                    }
                </div>
            }
        </div>
    )

    return (
        <Fragment key={props.index}>
            <div className="mb-1">
                <AccordionV2 title={titulo} classNameTitulo={"accordionStyle2"} >
                    {props.children}
                </AccordionV2>
            </div>
        </Fragment>

    )
}


const ComponentOrdenItems = ({ ordenItem, checkStatusSeleccion, returnItemOrden, opcionItemDisable }) => {

    const [tarjetasCheckBox, setTarjetaCheckBox] = useState([]);

    useEffect(() => {
        seleccionMultiple();
    }, [checkStatusSeleccion])

    useEffect(() => {
        returnItemOrden(tarjetasCheckBox);
    }, [tarjetasCheckBox])

    const seleccionMultiple = (e) => {
        toggleSelectAll(checkStatusSeleccion);
    }

    const toggleSelectAll = (checkStatus) => {
        if (checkStatus) {
            const resultado = ordenItem.lst_socios.map(itemOrden => itemOrden).flat();
            setTarjetaCheckBox(resultado);
        } else {
            setTarjetaCheckBox([]);
        }
    };

    const checkTarjeta = (ordenCheck) => {
        if (tarjetasCheckBox.includes(ordenCheck)) {
           /* const indexOrden = tarjetasCheckBox.findIndex(ordenItem => ordenItem === ordenCheck);
            console.log("INDEX ", indexOrden);
            console.log(" tarjetasCheckBox[indexOrden] ", tarjetasCheckBox[indexOrden]);
            tarjetasCheckBox[indexOrden].realizar_accion = false;*/
            setTarjetaCheckBox(tarjetasCheckBox.filter(ordenItem => ordenItem !== ordenCheck));
        } else {
            //ordenCheck.realizar_accion = true;
            setTarjetaCheckBox([...tarjetasCheckBox, ordenCheck]);
        }
    }

    return (
        <Fragment key={ordenItem.cedula}>
            <table className='table-accordion2' style={{ overflowY: "hidden" }}>
                <thead className='thead-accordion2'>
                    <tr>
                        <th className='paddingSpacing'>Identificación</th>
                        <th className='paddingSpacing'>Nombre del titular</th>
                        <th className='paddingSpacing'>Fecha proceso</th>
                        <th className='paddingSpacing'>Tipo de tarjeta</th>
                        <th className='paddingSpacing'>Tipo de producto</th>
                        <th className='paddingSpacing'> </th>
                    </tr>
                </thead>
                <tbody style={{ overflowY: "hidden" }}>
                    {ordenItem.lst_socios.map(cliente => {
                        return (
                            <tr key={cliente.cedula}>
                                <td className='paddingSpacing'>{cliente.cedula}</td>
                                <td className='paddingSpacing'>{cliente.nombres}</td>
                                <td className='paddingSpacing'>{cliente.fecha_proceso}</td>
                                <td className='paddingSpacing'>{cliente.tipo_tarjeta}</td>
                                <td className='paddingSpacing'> <Chip type={cliente.tipo_producto}>{cliente.tipo_producto}</Chip></td>
                                <td className='paddingSpacing'>
                                    <Input key={cliente.cedula}
                                        disabled={opcionItemDisable}
                                        type="checkbox"
                                        checked={tarjetasCheckBox.includes(cliente)}
                                        setValueHandler={() => checkTarjeta(cliente)}
                                    ></Input>
                                </td>

                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Fragment>
    )
}


export default ComponentItemsOrden;