import { Fragment, useEffect, useState } from "react";
import Input from "../Common/UI/Input";
import AccordionV2 from '../Common/UI/AccordionV2';

const ComponenteTarjetasEntrega = (props) => {

    const [checkSeleccionPadre, setCheckSeleccionPadre] = useState(false);
    const [checkSeleccionHijo, setCheckSeleccionHijo] = useState(false);
    const [totalItemOrdenCheck, setTotalItemOrdenCheck] = useState([]);

    const setStatusCheckHandler = (valor) => {
        setCheckSeleccionHijo(valor);
    }

    const itemsOrdenCkeckTotal = (array) => {
        setTotalItemOrdenCheck(array)
        props.returnItems(array);
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
            >
                <ComponentOrdenItems ordenItem={props.orden} checkStatusSeleccion={checkSeleccionHijo} returnItemOrden={itemsOrdenCkeckTotal} ></ComponentOrdenItems>
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
                    <div className="" style={{ position: "absolute", right: "80px" }}>
                        <input type="checkbox" name={props.header.orden} checked={props.inicialStateCheck}
                            onChange={(e) => setCheckSeleccionAll(!checkSeleccionAll)}
                        />
                    </div>
            </div>
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


const ComponentOrdenItems = ({ ordenItem, checkStatusSeleccion, returnItemOrden }) => {

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
            setTarjetaCheckBox(tarjetasCheckBox.filter(ordenItem => ordenItem !== ordenCheck));
        } else {
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
                                <td className='paddingSpacing'>{cliente.tipo_tarjeta}</td>
                                <td className='paddingSpacing'>{cliente.tipo_producto}</td>
                                <td className='paddingSpacing'>
                                    <Input key={cliente.cedula} disabled={false} type="checkbox" checked={tarjetasCheckBox.includes(cliente)} setValueHandler={() => checkTarjeta(cliente)}></Input>
                                </td>

                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Fragment>
    )
}


export default ComponenteTarjetasEntrega;