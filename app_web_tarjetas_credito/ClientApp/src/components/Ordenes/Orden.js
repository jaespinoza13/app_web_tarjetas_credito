import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';

import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import { EngineeringOutlined, InventoryOutlined, LocalShippingOutlined, ArchiveOutlined, ViewListOutlined, DownloadOutlined, EditNoteOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import Textarea from '../Common/UI/Textarea';
import { fetchGetReporteOrden } from '../../services/RestServices';
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from '../../js/utiles';


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
        //PETICION API
        setLstOrdenes(lstOrdenesActivas);

    },[])

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenes, setLstOrdenes] = useState([]);


    const ordenPageHandler = (accion, numOrden) => {

        if (accion === "editar") {
            navigate.push('/orden/editar', { numOrdenEditar: numOrden });
            console.log("editar ", numOrden)
        }
        else if (accion === "crear"){
            navigate.push('/orden/nueva', { numOrdenEditar: -1 }); 
            //console.log("crear ", numOrden)
        }
    }


    const headersOrdenesActivas = [
        { nombre: "Nro. Orden", key: "nrOrden" }, { nombre: "Estado", key: "estado" }, { nombre: "Agencia solicita", key: "agencia_solicita" }, { nombre: "Cantidad", key: "cantidad" },
        { nombre: "Creada por", key: "usuario_crea" }, { nombre: "Fecha creación", key: "fecha_creación" }, { nombre: "Fecha Solicita Encargado", key: "fecha_solicita" },
        { nombre: "Fecha Recibe Encargado", key: "fecha_recepcion" }, { nombre: "Fecha Distribución", key: "fecha_distribucion" }, { nombre: "Fecha Cierre Orden", key: "fecha_cierre_orden" },{ nombre: "Acciones", key: "acciones" }
    ]

    /*OBJETOS QUE SE DEVOLVERIA DESDE EL BACK*/ 
    const lstOrdenesActivas =
        [
            { nrOrden: 126, estado: "Anulada", cantidad: 10, usuario_crea: "Ericka Rios", fecha_creación: "18/01/2024 2:10:56 PM", fecha_solicita: "", fecha_recepcion: "", fecha_distribucion: "", fecha_cierre_orden: "", agencia_solicita: "MATRIZ" },
            { nrOrden: 127, estado: "Entregada/Cerrada", cantidad: 30, usuario_crea: "Ericka Rios", fecha_creación: "18/02/2024 4:00:07 PM", fecha_solicita: "19/02/2024 8:35:07 PM", fecha_recepcion: "01/03/2024 5:05:35 AM", fecha_distribucion: "02/03/2024 8:40:00 AM", fecha_cierre_orden: "03/03/2024 5:04:15 PM", agencia_solicita: "CATAMAYO" },
            { nrOrden: 128, estado: "Enviada", cantidad: 60, usuario_crea: "Ericka Rios", fecha_creación: "25/03/2024 4:00:07 PM", fecha_solicita: "25/03/2024 5:10:07 PM", fecha_recepcion: "03/04/2024 09:30:00 AM", fecha_distribucion: "03/04/2024 11:45:00 AM", fecha_cierre_orden: "", agencia_solicita: "SANTO DOMINGO" },
            { nrOrden: 130, estado: "Receptada", cantidad: 80, usuario_crea: "Ericka Rios", fecha_creación: "18/04/2024 4:15:07 PM", fecha_solicita: "18/04/2024 4:20:40 PM", fecha_recepcion: "25/04/2024 8:50:00 PM", fecha_distribucion: "", fecha_cierre_orden: "", agencia_solicita: "SARAGURO" },

            { nrOrden: 131, estado: "Solicitada", cantidad: 30, usuario_crea: "Ericka Rios", fecha_creación: "20/05/2024 4:45:07 PM", fecha_solicita: "21/05/2024 8:20:40 AM", fecha_recepcion: "", fecha_distribucion: "", fecha_cierre_orden: "", agencia_solicita: "MATRIZ" },
            { nrOrden: 134, estado: "Creada", cantidad: 10, usuario_crea: "Ericka Rios", fecha_creación: "30/04/2023 2:40:07 PM", fecha_solicita: "", fecha_recepcion: "", fecha_distribucion: "", fecha_cierre_orden: "", agencia_solicita: "CATAMAYO" },
            { nrOrden: 135, estado: "Creada", cantidad: 20, usuario_crea: "Ericka Rios", fecha_creación: "30/04/2023 4:15:07 PM", fecha_solicita: "", fecha_recepcion: "", fecha_distribucion: "", fecha_cierre_orden: "", agencia_solicita: "MATRIZ" }
        ];
    


    

    const [isModalEnviarOrden, setIsModalEnviarOrden] = useState(false);
    const [isModalRecepcionOrden, setIsModalRecepcionOrden] = useState(false);
    const [isModalEnvioValija, setIsModalEnvioValija] = useState(false);
    const [isModalRecepTarjValija, setIsModalRecepTarjValija] = useState(false);
    const [isModalEliminarOrden, setIsModalEliminarOrden] = useState(false);
    const [numOrdenAccion, setNumOrdenAccion] = useState();
    const [agenciaSolicita, setAgenciaSolicita] = useState();
    const [detalleRecepOrdenTarjetas, setDetalleRecepOrdenTarjetas] = useState();

    
    
    const envioOrdenProvModal = (orden) => {
        //setIsModalEnviarOrden(true);
        //setNumOrdenAccion(orden);
        navigate.push('/orden/generarArchivo', { numOrden: orden })
    }

    const verOrdenPage = (orden) => {
        navigate.push('/orden/verOrden', { numOrden: orden })
    }


    //ACCIONES PARA ABRIR MODALES
    const recepcionOrdenProvModal = (orden) => {
        setIsModalRecepcionOrden(true);
        setNumOrdenAccion(orden);
    }

    const envioTarjetasValijaModal = (orden, agencia) => {
        setIsModalEnvioValija(true);
        setNumOrdenAccion(orden);
        setAgenciaSolicita(agencia);
    }

    const recepcionTarjetasValijaModal = (orden) => {
        setIsModalRecepTarjValija(true);
        setNumOrdenAccion(orden);
    }

    const eliminarOrdenTarjetasModal = (orden) => {
        setIsModalEliminarOrden(true);
        setNumOrdenAccion(orden);
    }

    //CERRAR MODAL
    const closeModalHandler = () => {
        setIsModalEnviarOrden(false);
        setIsModalRecepcionOrden(false);
        setIsModalEnvioValija(false);
        setIsModalRecepTarjValija(false);
        setIsModalEliminarOrden(false)
    }

    //  SUBMIT Y ACCIONES CONTRARIAS DE MODALES
    const submitOrdenProveedor = () => {
        window.alert(`SE ENVIO LA ORDEN`)
        //TODO: PETICION ENVIO ORDEN
        setIsModalEnviarOrden(false);
    }

    const submitRecepOrdenTarjetas = () => {
        window.alert(`Se recepta orden ${numOrdenAccion}`)
        //TODO: PETICION -> RECEPCION EXITOSA DE TARJETAS
        setIsModalRecepcionOrden(false)
    }

    const submitConflictoRecepTarjetas = () => {
        window.alert(`Recepción No Completada`)
        //TODO: PETICION -> RECEPCION NO EXITOSA DE TARJETAS
        setIsModalRecepcionOrden(false)
    }

    const submitEnvioTarjetasResponsables = () => {
        window.alert(`SE ENVIO TARJETAS A RESPONSABLES`)
        //TODO: PETICION ENVIO ORDEN
        setIsModalEnvioValija(false);
    }

    const submitRecepcionTarjetasResponsables = () => {
        window.alert(`RESPONSABLES RECEPTARON LA ORDEN`)
        //TODO: PETICION ENVIO ORDEN
        setIsModalRecepTarjValija(false);
    }

    const submitEliminarOrdenTarjetas = () => {
        window.alert(`ORDEN ELIMINADA`)
        //TODO: PETICION ENVIO ORDEN
        setIsModalEliminarOrden(false);
    }

    const descargarReporteOrden = (orden) => {
        fetchGetReporteOrden(orden.toString(), props.token, (data) => {
            if (data.str_res_codigo === "000" && verificarPdf(data.byt_reporte)) {
                const blob = base64ToBlob(data.byt_reporte, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `Orden${orden}_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo);
            }else {
                window.alert("ERROR AL GENERAR EL REPORTE, COMUNIQUESE CON EL ADMINISTRADOR");
            }
        }, dispatch);
    }


    //Detalle modal
    const changeDetalleModal = (e) => {
       setDetalleRecepOrdenTarjetas(e)
    } 

    const AccionesOrden = ({ numOrden, estadoOrden, agenciaSolicita }) => {   
        return (
            <div>
                {estadoOrden === 'Creada' && (
                    <>
                        <IconButton className="custom-icon-button" title="Enviar Orden al Proveedor" onClick={() => { envioOrdenProvModal(numOrden) }}>
                            <EngineeringOutlined></EngineeringOutlined>
                        </IconButton>  
                        <IconButton className="custom-icon-button" title="Editar Orden" onClick={() => ordenPageHandler("editar", numOrden)}>
                            <EditNoteOutlined></EditNoteOutlined>
                        </IconButton>
                        <IconButton className="custom-icon-button" title="Eliminar Orden" onClick={() => { eliminarOrdenTarjetasModal(numOrden) }}>
                            <DeleteOutlineOutlined></DeleteOutlineOutlined>
                            </IconButton>
                    </>
                )}

                {estadoOrden === 'Solicitada' && ( 
                    <IconButton className="custom-icon-button" title="Recepción de Orden de Tarjetas" onClick={() => recepcionOrdenProvModal(numOrden)}>
                        <InventoryOutlined></InventoryOutlined>
                    </IconButton>
                )}
                {estadoOrden === 'Receptada' && (
                    <IconButton className="custom-icon-button" title="Envio por Valija" onClick={() => envioTarjetasValijaModal(numOrden, agenciaSolicita)}>
                        <LocalShippingOutlined></LocalShippingOutlined>
                    </IconButton>
                )}
                {estadoOrden === 'Enviada' && (
                    <IconButton className="custom-icon-button" title="Tarjetas Receptadas(destino)" onClick={() => recepcionTarjetasValijaModal(numOrden)}>
                        <ArchiveOutlined></ArchiveOutlined>
                    </IconButton>
                )}                
                <IconButton className="custom-icon-button" title="Visualizar Detalle de Orden" onClick={() => verOrdenPage(numOrden)}>
                    <ViewListOutlined></ViewListOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Descargar Reporte" onClick={() => { descargarReporteOrden(numOrden) }}>
                    <DownloadOutlined></DownloadOutlined>
                </IconButton>
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
                <br />
                <h2 className="">Órdenes</h2>
                <br />

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
                                    <td style={{ width: "100px" }}>{orden.nrOrden}</td>
                                    <td>{orden.estado}</td>
                                    <td style={{ width: "125px" }}>{orden.agencia_solicita}</td>
                                    <td>{orden.cantidad}</td>
                                    <td>{orden.usuario_crea}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_creación}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_solicita}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_recepcion}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_distribucion}</td>
                                    <td style={{ width: "143px" }}>{orden.fecha_cierre_orden}</td>
                                    <td>
                                        <AccionesOrden numOrden={orden.nrOrden} estadoOrden={orden.estado} agenciaSolicita={orden.agencia_solicita } />
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


                {/*MODAL PARA RECEPCION DE ORDEN*/}
                <ModalDinamico
                    modalIsVisible={isModalRecepcionOrden}
                    titulo={'Recepción de Orden'}
                    onCloseClick={closeModalHandler}
                    type="sm"
                >
                    <div className="pbmg4 ptmg4">
                        <p style={{ fontSize: '20px' }}>¿La recepción de la orden número <strong>{numOrdenAccion}</strong> fue exitosa?</p>
                        <br />
                        <Textarea
                            rows={5}
                            cols={30}
                            placeholder="Ingrese un detalle"
                            type="textarea"
                            esRequerido={true}
                            onChange={changeDetalleModal}
                        ></Textarea>
                        <br />

                        <div className="row center_text_items pbmg4 ptmg4">
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={submitRecepOrdenTarjetas}>Recepción Exitosa</button>
                            <button className="btn_mg btn_mg__secondary mt-2 " onClick={submitConflictoRecepTarjetas}>Recepción No Completa</button>
                        </div>
                    </div>
                </ModalDinamico>


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

                {/*MODAL PARA RECEPCION ORDEN TARJETAS POR VALIJA*/}
                <ModalAccionesOrden
                    visibleModal={isModalRecepTarjValija}
                    titulo={'Recepción distribución de Orden de Tarjetas'}
                    type={"sm"}
                    closeClick={closeModalHandler}
                    nomBtnAccion={"SI"}
                    accionHandler={submitRecepcionTarjetasResponsables}
                    nomBtnAccionInv={"PENDIENTE"}
                    accionInversaHandler={closeModalHandler}
                >
                    <p style={{ fontSize: '20px' }}>¿Encargados receptaron la orden de tarjetas número <strong>{numOrdenAccion}</strong>?</p>
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