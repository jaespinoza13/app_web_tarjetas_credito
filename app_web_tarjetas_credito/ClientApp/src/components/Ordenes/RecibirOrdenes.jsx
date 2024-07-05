import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace } from '../../js/utiles';
import "../../css/Components/Reprocesar.css";
import AccordionV2 from '../Common/UI/AccordionV2';
import Input from '../Common/UI/Input';


const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
    };
};


function RecibirOrdenes(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenesEntrada, setLstOrdenesEntrada] = useState([]);
    const [lstOrdenesSalida, setLstOrdenesSalida] = useState([]);
    const [inputBusqueda, setInputBusqueda] = useState([]);

  

    const ordenes = [
        { orden: "Orden 1", fecha_generacion: "01/01/2024", num_total_tarjetas: 30},
        { orden: "Orden 2", fecha_generacion: "05/01/2024", num_total_tarjetas: 20},
        { orden: "Orden 3", fecha_generacion: "06/01/2024", num_total_tarjetas: 15},
    ]

    const clientes = [
        { cedula: "1150214370", nombres: "DANNY VASQUEZ", tipo_producto: "Principal", tipo_tarjeta: "BLACK", oficina: "MATRIZ" },
        { cedula: "1101898147", nombres: "NICOLE ALBAN", tipo_producto: "Principal", tipo_tarjeta: "ESTANDAR", oficina: "MATRIZ" },
        { cedula: "0181568681", nombres: "SEBASTIAN RIOFRIO", tipo_producto: "Principal", tipo_tarjeta: "GOLDEN", oficina: "MATRIZ" }
    ]

    const [valueOrdenesCkeck, setValueOrdenesCkeck] = useState(false);

    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname }></Sidebar>
            <div className="container_mg">
         
                <h2 className="mt-5 mb-3">Recibir órdenes</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px"}}>
                                <Card >
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    
                                    <h4 className="mt-2">Recibir órdenes</h4>
                                     <h5 className="mt-2"> </h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Extraer órdenes</Button>
                                </Card>
                            </div>                           

                        </div>

                    </div>

                </div>

                <div className="f-row w-100" style={{ display: "flex", justifyContent: "right", paddingRight: "30px" }}>
                    <div className="input-wrapper">
                        <Input className="w-20 ml-1 inputBusqueda" id="buscarOrden" type="text" disabled={false} value={inputBusqueda} setValueHandler={(e) => setInputBusqueda(e)} placeholder={"Buscar"}></Input>
                        <img className="input-icon icon" src="Imagenes/search.svg" alt="Buscar"></img>
                    </div>

                    <div className="input-fitro">
                        <img className="input-icon icon" src="Imagenes/filter.svg" alt="Filtrar"></img>
                    </div>
                </div>

                <div className="contentTableOrden mt-3">
                    <table className='table-accordion'>
                        <thead className='thead-accordion'>
                            <tr>
                                <th className='paddingSpacing'>
                                    <div className="w-95 f-row">
                                        <div className='content-headertable' >
                                            <div style={{ width: "40px" }} >

                                            </div>
                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">NÚMERO DE ORDEN</h4>
                                            </div>
                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">FECHA DE RECEPCIÓN</h4>
                                            </div>

                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">TOTAL DE TARJETAS</h4>
                                            </div>
                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">RECEPTAR</h4>
                                            </div>

                                        </div>

                                    </div>

                                </th>
                            </tr>
                        </thead>

                        <tbody className="scroll-body">

                            {ordenes.map(orden => {

                                let textoTitulo = (
                                    <div className="w-95 f-row">
                                        <div className='content-headertable' >
                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">{orden.orden}</h4>
                                            </div>
                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">{orden.fecha_generacion}</h4>
                                            </div>

                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">{orden.num_total_tarjetas}</h4>
                                            </div>

                                            <div style={{ width: "25%" }} >
                                                <input type="checkbox" name={orden.orden} />
                                            </div>
                                        </div>

                                    </div>
                                );


                                return (
                                    <tr key={orden.orden}>
                                        <td className='paddingSpacing'>
                                            <AccordionV2 title={textoTitulo}>
                                                <table className='table-accordion2' style={{ overflowY: "hidden" }}>
                                                    <thead className='thead-accordion2'>
                                                        <tr>
                                                            <th className='paddingSpacing colorHeaderTable2'>Identificación</th>
                                                            <th className='paddingSpacing colorHeaderTable2'>Nombre del titular</th>
                                                            <th className='paddingSpacing colorHeaderTable2'>Tipo de tarjeta</th>
                                                            <th className='paddingSpacing colorHeaderTable2'>Tipo de producto</th>
                                                            <th className='paddingSpacing colorHeaderTable2'>Oficina</th>
                                                            <th className='paddingSpacing colorHeaderTable2'> </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ overflowY: "hidden" }}>
                                                        {clientes.map(cliente => {
                                                            return (
                                                                <tr key={cliente.cedula}>
                                                                    <td className='paddingSpacing'>{cliente.cedula}</td>
                                                                    <td className='paddingSpacing'>{cliente.nombres}</td>
                                                                    <td className='paddingSpacing'>{cliente.tipo_producto}</td>
                                                                    <td className='paddingSpacing'>{cliente.tipo_tarjeta}</td>
                                                                    <td className='paddingSpacing'>{cliente.oficina}</td>
                                                                    <td className='paddingSpacing'>
                                                                        <input type="checkbox" name={cliente.cedula} />
                                                                    </td>

                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>

                                            </AccordionV2>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='row w-100 mt-2 f-row justify-content-center'>
                    <Button className="btn_mg__primary" disabled={false}>Recibir</Button>
                </div>

            </div>
        </div>
    )

}

export default connect(mapStateToProps, {})(RecibirOrdenes);