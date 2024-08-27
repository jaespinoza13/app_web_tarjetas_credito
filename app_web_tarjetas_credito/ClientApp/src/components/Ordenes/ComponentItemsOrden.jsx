import { Fragment, useEffect, useState } from "react";
import Input from "../Common/UI/Input";
import AccordionV2 from '../Common/UI/AccordionV2';
import Chip from "../Common/UI/Chip";
import { connect, useDispatch } from "react-redux";
import { setSeguimientOrdenAction } from "../../redux/SeguimientoOrden/actions";
import { convertFecha } from "../../js/utiles";

const mapStateToProps = (state) => {
    return {
        seguimientoOrden:state.GetSeguimientoOrden.data,
    };
};


const ComponentItemsOrden = (props) => {
    const [checkSeleccionPadre, setCheckSeleccionPadre] = useState(false);
    const [checkSeleccionHijo, setCheckSeleccionHijo] = useState(false);
    const [totalItemOrdenCheck, setTotalItemOrdenCheck] = useState([]);
    const [infoSeguimiento, setInfoSeguimiento] = useState();

    const setStatusCheckHandler = (valor) => {
        setCheckSeleccionHijo(valor);
    }

    const itemsOrdenCkeckTotal = (array, oficinaSolicita) => {
        setTotalItemOrdenCheck(array)
        props.returnItems(array, oficinaSolicita);
    }


    useEffect(() => {
        if (props.orden.lst_ord_ofi.length > 0) {
            setCheckSeleccionPadre(totalItemOrdenCheck.length === props.orden.lst_ord_ofi.length && totalItemOrdenCheck.length !== 0)
        }
    }, [totalItemOrdenCheck])


    useEffect(() => {  
        console.log("PROPS seguimientoOrden ", props.seguimientoOrden)
        if (props.seguimientoOrden) {
            setInfoSeguimiento(props.seguimientoOrden)
        }
    }, [props.seguimientoOrden])

    /*
    useEffect(() => {
        return () => {
            setCheckSeleccionPadre(false)
            setCheckSeleccionHijo(false)
            setTotalItemOrdenCheck([])
            setInfoSeguimiento()
        }
    }, [])*/


    return (
        <ComponentHeaderAccordion
            header={props.orden}
            inicialStateCheck={checkSeleccionPadre}
            checkStatusChange={(e) => { setStatusCheckHandler(e) }}
            pantallaTituloExponer={props.pantallaTituloExponer}
            opcionHeader={props.opcionHeader}
        >
            <ComponentOrdenItems
                ordenItem={props.orden}
                checkStatusSeleccion={checkSeleccionHijo}
                returnItemOrden={(tarj) => itemsOrdenCkeckTotal(tarj, props.orden.str_oficina_entrega)}
                opcionItemDisable={props.opcionItemDisable}
                seguimientoRedux={infoSeguimiento }
            ></ComponentOrdenItems>
        </ComponentHeaderAccordion>

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
                        <h4 className="item-header white">{props.header.str_oficina_entrega}</h4>
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


const ComponentOrdenItems = ({ ordenItem, checkStatusSeleccion, returnItemOrden, opcionItemDisable, seguimientoRedux }) => {

    const dispatch = useDispatch();

    const [tarjetasCheckBox, setTarjetaCheckBox] = useState([]);
    const [isActivarOpciones, setIsActivarOpciones] = useState();
    const [controlActualizoRedux, setControlActualizoRedux] = useState(false);

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
            const resultado = ordenItem.lst_ord_ofi.map(itemOrden => itemOrden.int_seg_id).flat();
            setTarjetaCheckBox(resultado);
        } else {
            setTarjetaCheckBox([]);
        }
    };

    const checkTarjeta = (int_seg_id) => {
        if (tarjetasCheckBox.includes(int_seg_id)) {
           /* const indexOrden = tarjetasCheckBox.findIndex(ordenItem => ordenItem === ordenCheck);
            console.log("INDEX ", indexOrden);
            console.log(" tarjetasCheckBox[indexOrden] ", tarjetasCheckBox[indexOrden]);
            tarjetasCheckBox[indexOrden].realizar_accion = false;*/
            setTarjetaCheckBox(tarjetasCheckBox.filter(ordenItem => ordenItem !== int_seg_id));
        } else {
            //ordenCheck.realizar_accion = true;
            setTarjetaCheckBox([...tarjetasCheckBox, int_seg_id]);
        }
    }

    const clickHandler = (str_identificacion) => {
        //console.log("PROPS seguimientoOrden ", seguimientoRedux)
        if (seguimientoRedux.seguimientoAccionClick) {
            dispatch(setSeguimientOrdenAction({
                seguimientoAccionClick: seguimientoRedux.seguimientoAccionClick,
                seguimientoCedula: str_identificacion
            }))
        }
    }

    useEffect(() => {
        //console.log("PROPS seguimientoOrden ", seguimientoRedux)
        if (seguimientoRedux !== undefined && Object.entries(seguimientoRedux).length !== 0) {
            setIsActivarOpciones(seguimientoRedux.seguimientoAccionClick)
            setControlActualizoRedux(true)
        }
    }, [seguimientoRedux])

    return (        
        <Fragment>
            {controlActualizoRedux &&
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
                        {ordenItem.lst_ord_ofi.map(cliente => {
                        return (
                            <tr key={cliente.int_seg_id}>
                                <td className='paddingSpacing' onClick={() => clickHandler(cliente.int_seg_id)}>
                                    {isActivarOpciones &&
                                        <div style={{ fontSize: "1.07rem", color: "#004CAC", fontFamily: "Karbon-Bold", textDecoration: "underline", cursor: "pointer" }}>
                                            {cliente.str_identificacion}
                                        </div>
                                    }
                                    {!isActivarOpciones && cliente.str_identificacion}
                                </td>
                                <td className='paddingSpacing'>{cliente.str_denominacion_socio}</td>
                                <td className='paddingSpacing'>{convertFecha(cliente.dtt_fecha_entrega)}</td>
                                <td className='paddingSpacing'>{cliente.str_tipo_propietario}</td>
                                <td className='paddingSpacing'> <Chip type={cliente.str_tipo_tarjeta}>{cliente.str_tipo_tarjeta}</Chip></td>
                                <td className='paddingSpacing'>
                                    <Input key={cliente.str_identificacion}
                                        disabled={opcionItemDisable}
                                        type="checkbox"
                                        checked={tarjetasCheckBox.includes(cliente.int_seg_id)}
                                        setValueHandler={() => checkTarjeta(cliente.int_seg_id)}
                                    ></Input>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                </table>
            }
        </Fragment>
        
    )
}

export default connect(mapStateToProps, {})(ComponentItemsOrden);