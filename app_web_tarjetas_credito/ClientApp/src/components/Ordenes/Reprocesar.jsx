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


function Reprocesar(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenesEntrada, setLstOrdenesEntrada] = useState([]);
    const [lstOrdenesSalida, setLstOrdenesSalida] = useState([]);

    const headersOrdenesEntrada = [
        { nombre: "Nro. Orden", key: "orden" }, { nombre: "Estado", key: "estado" }, { nombre: "Creada por", key: "usuario_crea" },
        { nombre: "Cantidad Solicitada", key: "cant_tarjetas" }, 
        { nombre: "Fecha creación", key: "fecha_creación" },{ nombre: "Fecha solicita", key: "fecha_solicita" }, 
        { nombre: "Acciones", key: "acciones" }
    ]

    const headersOrdenesSalida = [
        { nombre: "Nro. Orden", key: "orden" }, { nombre: "Estado", key: "estado" }, { nombre: "Creada por", key: "usuario_crea" },
        { nombre: "Cantidad Enviada", key: "cant_tarjetas_enviadas" }, { nombre: "Destino", key: "destino_envio" }, { nombre: "Fecha creación", key: "fecha_creación" },
        { nombre: "Fecha de envío", key: "fecha_envio" }, { nombre: "Fecha de recepción", key: "fecha_recepcion" }, { nombre: "Acciones", key: "acciones" }
    ]

    const ordenes = [
        { orden: "1", fecha_recepcion: "01/01/2024", num_total_tarjetas: 30, num_tarjetas_error: 3  },
        { orden: "2", fecha_recepcion: "05/01/2024", num_total_tarjetas: 20, num_tarjetas_error: 1 },
        { orden: "3", fecha_recepcion: "06/01/2024", num_total_tarjetas: 15, num_tarjetas_error: 0 },
    ]

    const clientes = [
        { cedula: "1150214370", nombres: "DANNY VASQUEZ", residencia: "LOJA" },
        { cedula: "1101898147", nombres: "NICOLE ALBAN", residencia: "GUAYAQUIL" },
        { cedula: "0181568681", nombres: "SEBASTIAN RIOFRIO", residencia: "CUENCA" }
    ]



    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname }></Sidebar>
            <div className="container_mg">
         
                <h2 className="mt-5 mb-3">Reprocesar</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px"}}>
                                <Card >
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Órdenes</h4>
                                    <h5 className="mt-2">Generar las órdenes</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Extraer órdenes</Button>
                                </Card>
                            </div>                           

                        </div>

                    </div>

                </div>
{/*                style={{ color: "white", display: "flex", justifyContent: "space-between" }} */}
                {/*style={{ marginRight: "15%" }}*/}
                <div className="mt-3">
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
                                                <h4 className="item-header">TOTAL DE ERRORES</h4>
                                            </div>                
                                        </div>

                                    </div>
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {ordenes.map(orden => {
                                //let textoTitulo = (
                                //    <div className='f-row' style={{ color: "black", display: "flex", justifyContent: "space-between" }} >
                                //    <h4 style={{ marginLeft: "7%" }}>{orden.orden} </h4>
                                //    <h4 style={{ marginLeft: "-3%" }}>{orden.fecha_recepcion}</h4>
                                //    <h4 style={{ marginRight: "13%" }}>{orden.num_total_tarjetas}</h4>
                                //        <h4 style={{ marginRight: "13%" }}>{orden.num_tarjetas_error}</h4>
                                //    </div>);

                                let textoTitulo = (
                                    <div className="w-95 f-row">
                                        <div className='content-headertable' >
                                            <div style={{ width: "25%" }} > 
                                                <h4 className="item-header">{orden.orden}</h4>
                                            </div>
                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">{orden.fecha_recepcion}</h4>
                                            </div>                                           

                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">{orden.num_total_tarjetas}</h4>
                                            </div>                                           

                                            <div style={{ width: "25%" }} >
                                                <h4 className="item-header">{orden.num_tarjetas_error}</h4>
                                            </div>                
                                        </div>

                                    </div>

                                    //<div className='f-row' style={{ color: "black", display: "flex", justifyContent: "space-between" }} >
                                    //    <h4 style={{ marginLeft: "7%" }}>{orden.orden} </h4>
                                    //    <h4 style={{ marginLeft: "-3%" }}>{orden.fecha_recepcion}</h4>
                                    //    <h4 style={{ marginRight: "13%" }}>{orden.num_total_tarjetas}</h4>
                                    //    <h4 style={{ marginRight: "13%" }}>{orden.num_tarjetas_error}</h4>
                                    //</div>

                                );
    

                                return (
                                    <tr key={orden.orden}>
                                        <td className='paddingSpacing'>
                                            <AccordionV2 title={textoTitulo}>
                                                <table className='table-accordion'>
                                                    <thead className='thead-accordion'>
                                                        <tr>
                                                            <th className='paddingSpacing colorHeaderTable2'>IDENTIFICACION</th>
                                                            <th className='paddingSpacing colorHeaderTable2'>CLIENTE</th>
                                                            <th className='paddingSpacing colorHeaderTable2'>RESIDENCIA</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {clientes.map(cliente => {
                                                            return (
                                                                <tr key={cliente.cedula}>
                                                                    <td className='paddingSpacing'>{cliente.cedula}</td>
                                                                    <td className='paddingSpacing'>{cliente.nombres}</td>
                                                                    <td className='paddingSpacing'>{cliente.residencia}</td>
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


            </div>
        </div>
    )

}

export default connect(mapStateToProps, {})(Reprocesar);