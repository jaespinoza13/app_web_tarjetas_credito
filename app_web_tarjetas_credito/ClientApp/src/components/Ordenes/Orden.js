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

function Orden(props) {

    useEffect(() => {
        //PETICION API
        setLstOrdenes(lstOrdenesActivas);

    })

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
    const [numOrdenAccion, setNumOrdenAccion] = useState();
    

    const envioOrdenProveedor = (orden) => {
        setIsModalEnviarOrden(!isModalEnviarOrden);
        setNumOrdenAccion(orden);
        //console.log("LLEGO ORDEN ", orden)
    }


    const closeModalHandler = () => {
        setIsModalEnviarOrden(false);
        setIsModalRecepcionOrden(false);
    }

    const submitOrdenProveedor = () => {
        window.alert("SE ENVIO LA ORDEN")
        //TODO: PETICION ENVIO ORDEN
        setIsModalEnviarOrden(!isModalEnviarOrden);
    }



    const AccionesOrden = ({ numOrden }) => {
        return (
            <div>
                <IconButton className="custom-icon-button" title="Enviar Orden al Proveedor" onClick={() => { envioOrdenProveedor(numOrden) } }>
                    <EngineeringOutlined></EngineeringOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Recepción de Orden de Tarjetas" onClick={() => { console.log("CLICK") }}>
                    <InventoryOutlined></InventoryOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Envio por Valija" onClick={() => { console.log("CLICK") }}>
                    <LocalShippingOutlined></LocalShippingOutlined>
                </IconButton>
                <IconButton className="custom-icon-button" title="Tarjetas Receptadas(destino)" onClick={() => { console.log("CLICK") }}>
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

    const ModalAccionesOrden = ({ visibleModal, titulo, closeClick, type, accionHandler, nombreBtnAccion, children   }) => {

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
                        <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={accionHandler}>{nombreBtnAccion}</button>
                        <button className="btn_mg btn_mg__secondary mt-2 " onClick={closeModalHandler}>Cancelar</button>
                        {/* TODO: canmbiar boton opcion contrario*/}
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
                    closeClick={closeModalHandler}
                    type={"sm"}
                    accionHandler={submitOrdenProveedor}
                    nombreBtnAccion={"Guardar"}
                >
                    <p style={{ fontSize: '20px' }}>¿Estás seguro de realizar la solicitud para la Orden Número <strong>{numOrdenAccion}</strong>?</p>
                </ModalAccionesOrden>


                {/*MODAL PARA RECEPCION DE ORDEN*/}
                {/*<ModalAccionesOrden*/}
                {/*    visibleModal={isModalRecepcionOrden}*/}
                {/*    titulo={'Recepción de Orden'}*/}
                {/*    closeClick={closeModalHandler}*/}
                {/*    type={"sm"}*/}
                {/*    accionHandler={submitOrdenProveedor}*/}
                {/*    nombreBtnAccion={ "Si"}*/}
                {/*>*/}
                {/*    <p style={{ fontSize: '20px' }}>¿La recepción de la Orden Número <strong>{numOrdenAccion}</strong> fue exitosa?</p>*/}
                {/*</ModalAccionesOrden>*/}

                {/*<ModalDinamico*/}
                {/*    //props para Modal*/}
                {/*    modalIsVisible={isModalEnviarOrden}*/}
                {/*    titulo={'Envio de Orden'}*/}
                {/*    onCloseClick={closeModalHandler}*/}
                {/*    type="sm"*/}
                {/*>*/}
                {/*    <div className="pbmg4 ptmg4">*/}
                {/*        <p style={{fontSize: '20px' }}>¿Estás seguro de realizar la solicitud para la Orden Número <strong>{numOrdenAccion}</strong>?</p>*/}

                {/*        <div className="row center_text_items pbmg4 ptmg4">*/}
                {/*            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={submitOrdenProveedor}>Guardar</button>*/}
                {/*            <button className="btn_mg btn_mg__secondary mt-2 " onClick={closeModalHandler}>"Cancelar"</button>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*</ModalDinamico>*/}
            </div>


        </div>
    )

}

export default Orden;