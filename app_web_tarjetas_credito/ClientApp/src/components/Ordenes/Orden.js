import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import Table from '../Common/Table';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import { fetchGetReporteOrden } from '../../services/RestServices';
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from '../../js/utiles';
import { lstOrdenesMock } from './ObjetosMock';


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


function Orden(props) {

    useEffect(() => {
        console.log(lstOrdenesMock)
        //PETICION API   /*OBJETOS QUE SE DEVOLVERIA DESDE EL BACK*/ 
        setLstOrdenes(lstOrdenesMock);

    },[])

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenes, setLstOrdenes] = useState([]);

    const [isModalEnviarOrden, setIsModalEnviarOrden] = useState(false);
    const [isModalEnvioValija, setIsModalEnvioValija] = useState(false);
    const [isModalEliminarOrden, setIsModalEliminarOrden] = useState(false);
    const [numOrdenAccion, setNumOrdenAccion] = useState();
    const [agenciaSolicita, setAgenciaSolicita] = useState();


    const headersOrdenesActivas = [
        { nombre: "Nro. Orden", key: "orden" }, { nombre: "Estado", key: "estado" }, { nombre: "Agencia solicita", key: "oficina_solicita" }, { nombre: "Cantidad", key: "cantidad" },
        { nombre: "Creada por", key: "usuario_crea" }, { nombre: "Fecha creación", key: "fecha_creación" }, { nombre: "Fecha Solicita Encargado", key: "fecha_solicita" },
        { nombre: "Fecha Recibe Encargado", key: "fecha_recepcion" }, { nombre: "Fecha Distribución", key: "fecha_distribucion" }, { nombre: "Fecha Cierre Orden", key: "fecha_cierre_orden" },{ nombre: "Acciones", key: "acciones" }
    ]



    const ordenPageHandler = (accion, numOrden) => {

        if (accion === "editar") {
            navigate.push('/orden/editar', { numOrdenEditar: numOrden });
        }
        else if (accion === "crear") {
            navigate.push('/orden/nueva', { numOrdenEditar: -1 });
        }
    }
    
    
    const envioOrdenProvModal = (orden) => {
        navigate.push('/orden/generarArchivo', { numOrden: orden })
    }

    const verOrdenPage = (orden) => {
        navigate.push('/orden/verOrden', { numOrden: orden })
    }


    //ACCIONES PARA ABRIR MODALES
    const envioTarjetasValijaModal = (orden, agencia) => {
        setIsModalEnvioValija(true);
        setNumOrdenAccion(orden);
        setAgenciaSolicita(agencia);
    }

    const eliminarOrdenTarjetasModal = (orden) => {
        setIsModalEliminarOrden(true);
        setNumOrdenAccion(orden);
    }

    //CERRAR MODAL
    const closeModalHandler = () => {
        setIsModalEnviarOrden(false);
        setIsModalEnvioValija(false);
        setIsModalEliminarOrden(false)
    }

    //  SUBMIT Y ACCIONES CONTRARIAS DE MODALES
    const submitOrdenProveedor = () => {
        window.alert(`SE ENVIO LA ORDEN`)
        //TODO: PETICION ENVIO ORDEN
        setIsModalEnviarOrden(false);
    }


    const submitEnvioTarjetasResponsables = () => {
        window.alert(`SE ENVIO TARJETAS A RESPONSABLES`)
        //TODO: PETICION ENVIO ORDEN
        setIsModalEnvioValija(false);
    }


    const submitEliminarOrdenTarjetas = () => {
        window.alert(`ORDEN ELIMINADA`)
        //TODO: PETICION ENVIO ORDEN
        setIsModalEliminarOrden(false);
    }

    const descargarReporteOrden = (orden) => {
        fetchGetReporteOrden(orden.toString(), props.token, (data) => {
            if (/*data.str_res_codigo === "000" &&*/ verificarPdf(data.byt_reporte)) { /*TODO DESCOMENTAR CUANDO SE COMPLETE DESARROLLO*/ 
                const blob = base64ToBlob(data.byt_reporte, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `Orden${orden}_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo);
            }else {
                window.alert("ERROR AL GENERAR EL REPORTE, COMUNIQUESE CON EL ADMINISTRADOR");
            }
        }, dispatch);
    }

    const AccionesOrden = ({ numOrden, estadoOrden, agenciaSolicita }) => {   
        return (
            <div className="f-row" style={{ gap: "6px", justifyContent: "center"}}>
                {estadoOrden === 'Creada' && (
                    <>
                        <button className="btn_mg_icons custom-icon-button" onClick={() => { envioOrdenProvModal(numOrden) }} title="Enviar Orden al Proveedor">
                            <img className="img-icons-acciones" src="Imagenes/upload.svg" alt="Enviar Orden al Proveedor"></img>
                        </button>

                        <button className="btn_mg_icons custom-icon-button" onClick={() => ordenPageHandler("editar", numOrden)} title="Editar Orden">
                            <img className="img-icons-acciones" src="Imagenes/icon_orden/edit_note_24dp1.svg" alt="Editar Orden"></img>
                        </button>

                        <button className="btn_mg_icons custom-icon-button" onClick={() => { eliminarOrdenTarjetasModal(numOrden) }} title="Eliminar Orden">
                            <img className="img-icons-acciones" src="Imagenes/icon_orden/delete_forever.svg" alt="Eliminar Orden"></img>
                        </button>
                    </>
                )}

                {estadoOrden === 'Receptada' && (
                    <button className="btn_mg_icons custom-icon-button" onClick={() => envioTarjetasValijaModal(numOrden, agenciaSolicita)} title="Enviar por Valija">
                        <img className="img-icons-acciones" src="Imagenes/icon_orden/shipping_24dp.svg" alt="Enviar por Valija"></img>
                    </button>

                )}

                <button className="btn_mg_icons custom-icon-button" onClick={() => verOrdenPage(numOrden)} title="Visualizar Detalle de Orden">
                    <img className="img-icons-acciones" src="Imagenes/icon_orden/view_list_24dp.svg" alt="Visualizar Detalle de Orden"></img>
                </button>
                <button className="btn_mg_icons custom-icon-button" onClick={() => { descargarReporteOrden(numOrden) }} title="Descargar Reporte">
                    <img className="img-icons-acciones" src="Imagenes/download.svg" alt="Descargar Reporte"></img>
                </button>
            </div>
        )
    }

    const ModalAccionesOrden = ({ visibleModal, titulo, closeClick, type, nomBtnAccion, accionHandler, nomBtnAccionInv, accionInversaHandler, children   }) => {

        return (
            <ModalDinamico
                //props para Modal
                modalIsVisible={visibleModal}
                titulo={titulo}
                onCloseClick={closeClick}
                type={type}

            >
                <div className="pbmg4 ptmg4">
                    {children}
                    

                    <div className="row center_text_items pbmg4 ptmg4">
                        <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={accionHandler}>{nomBtnAccion}</button>
                        <button className="btn_mg btn_mg__secondary mt-2 " onClick={accionInversaHandler}>{nomBtnAccionInv}</button>
                    </div>

                </div>
            </ModalDinamico>

        )
    }

    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname }></Sidebar>
            <div className="container_mg">
         
                <h2 className="mt-5 mb-3">Órdenes</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px"}}>
                                <Card >
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Crear Orden de tarjetas de crédito aprobadas</h4>
                                    <h5 className="mt-2">Tipo NOMINADA</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={() => ordenPageHandler("crear",-1)}>Crear</Button>
                                </Card>
                            </div>

                            {/*<div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>*/}

                            {/*    <Card>*/}
                            {/*        <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>*/}
                            {/*        <h4 className="mt-2">Crear Orden sin información del Socio</h4>*/}
                            {/*        <h5 className="mt-2">Tipo IN-NOMINADA</h5>*/}
                            {/*        <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} >Crear</Button>*/}
                            {/*    </Card>*/}
                            {/*</div>*/}

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>

                                <Card>
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2 mb-5">Revisar listado tarjetas de una orden</h4>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Crear</Button>
                                </Card>
                            </div>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>

                                <Card>
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Generar archivo Ordenes creadas</h4>
                                    <h5 className="mt-2">Tipo Batch</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Crear</Button>
                                </Card>
                            </div>

                        </div>

                    </div>

                </div>


                <div id="listado_ordenes" className="mt-3">
                    <Table headers={headersOrdenesActivas}>
                        {/*BODY*/}
                        {lstOrdenes.map((orden, index) => {
                            return (
                                <tr key={index}>
                                    <td style={{ width: "100px" }}>{orden.orden}</td>
                                    <td>{orden.estado}</td>
                                    <td style={{ width: "125px" }}>{orden.oficina_solicita}</td>
                                    <td>{orden.cant_tarjetas}</td>
                                    <td>{orden.usuario_crea}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_creacion}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_solicita}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_recepcion}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_distribucion}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_cierre_orden}</td>
                                    <td>
                                        <AccionesOrden numOrden={orden.orden} estadoOrden={orden.estado} agenciaSolicita={orden.oficina_solicita } />
                                    </td>
                                </tr>
                            );
                        })}

                    </Table>
                </div>

                {/*MODAL PARA SOLICITUD DE ORDEN A PROVEEDOR*/}
                <ModalAccionesOrden
                    visibleModal={isModalEnviarOrden}
                    titulo={'Envio de Orden'}
                    type={"sm"}
                    closeClick={closeModalHandler }
                    nomBtnAccion={"Guardar"}
                    accionHandler={submitOrdenProveedor}
                    nomBtnAccionInv={"Cancelar"}
                    accionInversaHandler={closeModalHandler}
                >
                    <p style={{ fontSize: '20px' }}>¿Estás seguro de realizar la solicitud de tarjetas para la orden número <strong>{numOrdenAccion}</strong>?</p>
                </ModalAccionesOrden>


                {/*MODAL PARA ENVIO ORDEN TARJETAS POR VALIJA*/}
                <ModalAccionesOrden
                    visibleModal={isModalEnvioValija}
                    titulo={`Distribución de Orden de Tarjetas`}
                    type={"sm"}
                    closeClick={closeModalHandler}
                    nomBtnAccion={"SI"}
                    accionHandler={submitEnvioTarjetasResponsables}
                    nomBtnAccionInv={"NO"}
                    accionInversaHandler={closeModalHandler}
                >
                    <div>
                        <p style={{ fontSize: '16px' }}>¿Desea realizar el envío de la orden?</p> <br/>
                        <p style={{ fontSize: '15px' }}>Número de orden: <strong>{numOrdenAccion}</strong></p>
                        <p style={{ fontSize: '15px' }}>Agencia que hará el envio: <strong>{agenciaSolicita}</strong></p>
                    </div>
                </ModalAccionesOrden>

                {/*MODAL PARA ELIMINAR ORDEN EN ESTADO CREADA*/}
                <ModalAccionesOrden
                    visibleModal={isModalEliminarOrden}
                    titulo={'Eliminar Orden de Tarjetas'}
                    type={"sm"}
                    closeClick={closeModalHandler}
                    nomBtnAccion={"SI"}
                    accionHandler={submitEliminarOrdenTarjetas}
                    nomBtnAccionInv={"NO"}
                    accionInversaHandler={closeModalHandler}
                >
                    <p style={{ fontSize: '20px' }}>¿Desea eliminar la orden de tarjetas número <strong>{numOrdenAccion}</strong>?</p>
                </ModalAccionesOrden>

            </div>


        </div>
    )

}

export default connect(mapStateToProps, {})(Orden);