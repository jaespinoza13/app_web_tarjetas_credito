import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

import Card from '../Common/Card';
import Item from '../Common/UI/Item';
import Button from '../Common/UI/Button';

import Table from '../Common/Table';
import Chip from '../Common/UI/Chip'
import { EngineeringOutlined, InventoryOutlined, LocalShippingOutlined, ArchiveOutlined, ViewListOutlined, DownloadOutlined, EditNoteOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import Textarea from '../Common/UI/Textarea';

function Orden(props) {

    useEffect(() => {
        //PETICION API
        setLstOrdenes(lstOrdenesActivas);

    },[])

    const navigate = useHistory();
    const [lstOrdenes, setLstOrdenes] = useState([]);


    const crearOrdenInnominadaHandler = () => {
        navigate.push('/orden/innominada');
    }


    const headersOrdenesActivas = [
        { nombre: "Nro. Orden", key: "nrOrden" }, { nombre: "Estado", key: "estado" }, { nombre: "Cantidad", key: "cantidad" },
        { nombre: "Creada por", key: "usuario_crea" }, { nombre: "Fecha creación", key: "fecha_creación" }, { nombre: "Fecha Solicita Encargado", key: "fecha_solicita" },
        { nombre: "Fecha Recibe Encargado", key: "fecha_recepcion" }, { nombre: "Fecha Distribución", key: "fecha_distribucion" }, { nombre: "Fecha Cierre Orden", key: "fecha_cierre_orden" },{ nombre: "Acciones", key: "acciones" }
    ]
        
    const [lstOrdenesActivas, setLstOrdenesActivas] = useState(
        [
            { nrOrden: 126, estado: "Anulada", cantidad: 10, usuario_crea: "Ericka Rios", fecha_creación: "18/01/2024 2:10:56 PM", fecha_solicita: "", fecha_recepcion: "", fecha_distribucion: "", fecha_cierre_orden: "" },
            { nrOrden: 127, estado: "Entregada/Cerrada", cantidad: 30, usuario_crea: "Ericka Rios", fecha_creación: "18/02/2024 4:00:07 PM", fecha_solicita: "19/02/2024 8:35:07 PM", fecha_recepcion: "01/03/2024 5:05:35 AM", fecha_distribucion: "02/03/2024 8:40:00 AM" , fecha_cierre_orden: "03/03/2024 5:04:15 PM" },
            { nrOrden: 128, estado: "Enviada", cantidad: 60, usuario_crea: "Ericka Rios", fecha_creación: "25/03/2024 4:00:07 PM", fecha_solicita: "25/03/2024 5:10:07 PM", fecha_recepcion: "03/04/2024 09:30:00 AM", fecha_distribucion: "03/04/2024 11:45:00 AM", fecha_cierre_orden: "" },
            { nrOrden: 130, estado: "Receptada", cantidad: 80, usuario_crea: "Ericka Rios", fecha_creación: "18/04/2024 4:15:07 PM", fecha_solicita: "18/04/2024 4:20:40 PM", fecha_recepcion: "25/04/2024 8:50:00 PM", fecha_distribucion: "",  fecha_cierre_orden: "" },

            { nrOrden: 131, estado: "Solicitada", cantidad: 30, usuario_crea: "Ericka Rios", fecha_creación: "20/05/2024 4:45:07 PM", fecha_solicita: "21/05/2024 8:20:40 AM", fecha_recepcion: "",  fecha_distribucion: "", fecha_cierre_orden: "" },
            { nrOrden: 135, estado: "Creada", cantidad: 20, usuario_crea: "Ericka Rios", fecha_creación: "30/04/2023 4:15:07 PM", fecha_solicita: "",  fecha_recepcion: "",fecha_distribucion: "", fecha_cierre_orden: "" },
        ]
    );


    

    const [isModalEnviarOrden, setIsModalEnviarOrden] = useState(false);
    const [isModalRecepcionOrden, setIsModalRecepcionOrden] = useState(false);
    const [isModalEnvioValija, setIsModalEnvioValija] = useState(false);
    const [isModalRecepTarjValija, setIsModalRecepTarjValija] = useState(false);
    const [numOrdenAccion, setNumOrdenAccion] = useState();
    const [detalleRecepOrdenTarjetas, setDetalleRecepOrdenTarjetas] = useState();

    
    //ACCIONES PARA ABRIR MODALES
    const envioOrdenProvModal = (orden) => {
        setIsModalEnviarOrden(true);
        setNumOrdenAccion(orden);
    }

    const recepcionOrdenProvModal = (orden) => {
        setIsModalRecepcionOrden(true);
        setNumOrdenAccion(orden);
    }

    const envioTarjetasValijaModal = (orden) => {
        setIsModalEnvioValija(true);
        setNumOrdenAccion(orden);
    }

    const recepcionTarjetasValijaModal = (orden) => {
        setIsModalRecepTarjValija(true);
        setNumOrdenAccion(orden);
    }


    //CERRAR MODAL
    const closeModalHandler = () => {
        setIsModalEnviarOrden(false);
        setIsModalRecepcionOrden(false);
        setIsModalEnvioValija(false);
        setIsModalRecepTarjValija(false);
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


    //Detalle modal
    const changeDetalleModal = (e) => {
       setDetalleRecepOrdenTarjetas(e)
    } 

    const AccionesOrden = ({ numOrden }) => {
        
        return (
            <div>
                <IconButton className="custom-icon-button" title="Enviar Orden al Proveedor" onClick={() => { envioOrdenProvModal(numOrden) } }>
                    <EngineeringOutlined></EngineeringOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Recepción de Orden de Tarjetas" onClick={() => recepcionOrdenProvModal(numOrden)}>
                    <InventoryOutlined></InventoryOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Envio por Valija" onClick={() => envioTarjetasValijaModal(numOrden)}>
                    <LocalShippingOutlined></LocalShippingOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Tarjetas Receptadas(destino)" onClick={() => recepcionTarjetasValijaModal(numOrden)}>
                    <ArchiveOutlined></ArchiveOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Visualizar Detalle de Orden" onClick={() => { console.log("CLICK") }}>
                    <ViewListOutlined></ViewListOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Descargar Reporte" onClick={() => { console.log("CLICK") }}>
                    <DownloadOutlined></DownloadOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Editar Orden" onClick={() => { console.log("CLICK") }}>
                    <EditNoteOutlined></EditNoteOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Eliminar Orden" onClick={() => { console.log("CLICK") }}>
                    <DeleteOutlineOutlined></DeleteOutlineOutlined>
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
            <Sidebar></Sidebar>
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
                                    <h4 className="mt-2">Crear Orden con información del Socio</h4>
                                    <h5 className="mt-2">Tipo NOMINADA</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={crearOrdenInnominadaHandler}>Crear</Button>
                                </Card>
                            </div>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>

                                <Card>
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Crear Orden sin información del Socio</h4>
                                    <h5 className="mt-2">Tipo IN-NOMINADA</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} >Crear</Button>
                                </Card>
                            </div>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>

                                <Card>
                                    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Generar archivo Ordenes aprobadas</h4>
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
                                    <td>{orden.nrOrden}</td>
                                    <td>{orden.estado}</td>
                                    <td>{orden.cantidad}</td>
                                    <td>{orden.usuario_crea}</td>
                                    <td>{orden.fecha_creación}</td>
                                    <td>{orden.fecha_solicita}</td>
                                    <td>{orden.fecha_recepcion}</td>
                                    <td>{orden.fecha_distribucion}</td>
                                    <td>{orden.fecha_cierre_orden}</td>
                                    <td>
                                        <AccionesOrden numOrden={orden.nrOrden } />
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
                    <p style={{ fontSize: '20px' }}>¿Estás seguro de realizar la solicitud para la Orden Número <strong>{numOrdenAccion}</strong>?</p>
                </ModalAccionesOrden>


                {/*MODAL PARA RECEPCION DE ORDEN*/}

                {/*<ModalAccionesOrden*/}
                {/*    visibleModal={isModalRecepcionOrden}*/}
                {/*    titulo={'Recepción de Orden'}*/}
                {/*    type={"sm"}*/}
                {/*    closeClick={closeModalHandler}*/}
                {/*    nomBtnAccion={"Recepción Exitosa"}*/}
                {/*    accionHandler={submitRecepOrdenTarjetas }*/}
                {/*    nomBtnAccionInv={"Recepción No Completa"}*/}
                {/*    accionInversaHandler={submitConflictoRecepTarjetas}*/}
                {/*>   */}
                {/*    <div>*/}
                {/*        <p style={{ fontSize: '20px' }}>¿La recepción de la Orden Número <strong>{numOrdenAccion}</strong> fue exitosa?</p>*/}
                {/*        <br/>*/}
                {/*        <Textarea*/}
                {/*            rows={5}*/}
                {/*            cols={30}*/}
                {/*            placeholder="Ingrese un detalle"*/}
                {/*            type="textarea"*/}
                {/*            esRequerido={true}*/}
                {/*            onChange={changeDetalleModal}*/}
                {/*        ></Textarea>*/}
                {/*        <br />*/}
                {/*    </div>*/}
                {/*</ModalAccionesOrden>*/}


                <ModalDinamico
                    modalIsVisible={isModalRecepcionOrden}
                    titulo={'Recepción de Orden'}
                    onCloseClick={closeModalHandler}
                    type="sm"
                >
                    <div className="pbmg4 ptmg4">
                        <p style={{ fontSize: '20px' }}>¿La recepción de la Orden Número <strong>{numOrdenAccion}</strong> fue exitosa?</p>
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
                    titulo={'Distribución de Orden de Tarjetas'}
                    type={"sm"}
                    closeClick={closeModalHandler}
                    nomBtnAccion={"SI"}
                    accionHandler={submitEnvioTarjetasResponsables}
                    nomBtnAccionInv={"NO"}
                    accionInversaHandler={closeModalHandler}
                >
                    <p style={{ fontSize: '20px' }}>¿Enviar tarjetas a responsables encargados de Orden Número <strong>{numOrdenAccion}</strong>?</p>
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



            </div>


        </div>
    )

}

export default Orden;