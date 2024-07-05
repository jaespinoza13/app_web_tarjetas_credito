import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from '../../js/utiles';
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


function Distribucion(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenesEntrada, setLstOrdenesEntrada] = useState([]);
    const [lstOrdenesSalida, setLstOrdenesSalida] = useState([]);
    const [inputBusqueda, setInputBusqueda] = useState([]);

    const headersOrdenesEntrada = [
        { nombre: "Nro. Orden", key: "orden" }, { nombre: "Estado", key: "estado" }, { nombre: "Creada por", key: "usuario_crea" },
        { nombre: "Cantidad Solicitada", key: "cant_tarjetas" },
        { nombre: "Fecha creación", key: "fecha_creación" }, { nombre: "Fecha solicita", key: "fecha_solicita" },
        { nombre: "Acciones", key: "acciones" }
    ]

    const headersOrdenesSalida = [
        { nombre: "Nro. Orden", key: "orden" }, { nombre: "Estado", key: "estado" }, { nombre: "Creada por", key: "usuario_crea" },
        { nombre: "Cantidad Enviada", key: "cant_tarjetas_enviadas" }, { nombre: "Destino", key: "destino_envio" }, { nombre: "Fecha creación", key: "fecha_creación" },
        { nombre: "Fecha de envío", key: "fecha_envio" }, { nombre: "Fecha de recepción", key: "fecha_recepcion" }, { nombre: "Acciones", key: "acciones" }
    ]

    const ordenes = [
        { orden: "1", fecha_recepcion: "01/01/2024", num_total_tarjetas: 30, num_tarjetas_error: 3, oficina: "MATRIZ" },
        { orden: "2", fecha_recepcion: "05/01/2024", num_total_tarjetas: 20, num_tarjetas_error: 1, oficina: "EL VALLE" },
        { orden: "3", fecha_recepcion: "06/01/2024", num_total_tarjetas: 15, num_tarjetas_error: 0, oficina: "ALAMOR" },
        { orden: "4", fecha_recepcion: "08/01/2024", num_total_tarjetas: 25, num_tarjetas_error: 0, oficina: "AGENCIA CUARTO CENTENARIO" },
        { orden: "5", fecha_recepcion: "07/01/2024", num_total_tarjetas: 18, num_tarjetas_error: 0, oficina: "AGENCIA NORTE" },
        { orden: "6", fecha_recepcion: "09/01/2024", num_total_tarjetas: 10, num_tarjetas_error: 0, oficina: "AGENCIA SUR" },
    ]

    const clientes = [
        { cedula: "1150214370", nombres: "DANNY VASQUEZ", tipo_tarjeta: "BLACK", tipo_producto: "Principal" },
        { cedula: "1101898147", nombres: "NICOLE ALBAN", tipo_tarjeta: "ESTANDAR", tipo_producto: "Principal" },
        { cedula: "0181568681", nombres: "SEBASTIAN RIOFRIO", tipo_tarjeta: "GOLDEN", tipo_producto: "Principal" }
    ]



    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname}></Sidebar>
            <div className="container_mg">

                <h2 className="mt-5 mb-3">Distribuir órdenes</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>
                                <Card >
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Distribuir órdenes</h4>
                                    <h5 className="mt-2"> </h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Enviar</Button>
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

                <div className="contentTableOrden mt-3 mb-3">

                    {ordenes.map(orden => {
                        let textoTitulo = (
                            <div className="w-95 f-row">
                                <div className='content-headertable' >
                                    <div style={{ width: "12%", minWidth: "120px" }} >
                                        <h4 className="item-header white">Oficina:</h4>
                                    </div>
                                    <div style={{ width: "27%", minWidth: "270px" }} >
                                        <h4 className="item-header white">{orden.oficina}</h4>
                                    </div>
                                    <div style={{ width: "18%", minWidth: "180px" }} >
                                        <h4 className="item-header white">Total de tarjetas</h4>
                                    </div>
                                    <div style={{ width: "13%", minWidth: "130px" }} >
                                        <h4 className="item-header white">{orden.num_total_tarjetas}</h4>
                                    </div>
                                    <div style={{ position: "absolute", right: "80px" }}>
                                        <input type="checkbox" name={orden.orden} />
                                    </div>
                                </div>

                            </div>
                        );


                        return (
                            <div className="mb-1">
                                <AccordionV2 title={textoTitulo} classNameTitulo={"accordionStyle2"} >
                                    <table className='table-accordion2' style={{ overflowY: "hidden" }}>
                                        <thead className='thead-accordion2'>
                                            <tr>
                                                <th className='paddingSpacing'>Identificación</th>
                                                <th className='paddingSpacing'>Nombre del titular</th>
                                                <th className='paddingSpacing'>Tipo de producto</th>
                                                <th className='paddingSpacing'>Tipo de tarjeta</th>
                                                <th className='paddingSpacing'> </th>
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
                                                        <td className='paddingSpacing'>
                                                            <input type="checkbox" name={cliente.cedula} />
                                                        </td>

                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                </AccordionV2>
                            </div>
                        )
                    })}
                </div>

                <div className='row w-100 mt-2 f-row justify-content-center'>
                    <Button className="btn_mg__primary" disabled={false}>Enviar</Button>
                </div>


            </div>
        </div>
    )

}

export default connect(mapStateToProps, {})(Distribucion);