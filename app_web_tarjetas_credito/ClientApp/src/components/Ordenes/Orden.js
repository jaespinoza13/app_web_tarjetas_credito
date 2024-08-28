import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import Table from '../Common/Table';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import { fetchGetOrdenes } from '../../services/RestServices';
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from '../../js/utiles';
import { lstOrdenesMock } from './ObjetosMock';
import Toggler from '../Common/UI/Toggler';


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

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenesEntrada, setLstOrdenesEntrada] = useState([]);
    const [lstOrdenesSalida, setLstOrdenesSalida] = useState([]);

    const [isActiveOrdenesEntrada, setIsActiveOrdenesEntrada] = useState(true);
    const [isActiveOrdenesSalida, setIsActiveOrdenesSalida] = useState(false);


    const [isModalEnviarOrden, setIsModalEnviarOrden] = useState(false);
    const [isModalEnvioValija, setIsModalEnvioValija] = useState(false);
    const [isModalEliminarOrden, setIsModalEliminarOrden] = useState(false);
    const [numOrdenAccion, setNumOrdenAccion] = useState();
   // const [agenciaSolicita, setAgenciaSolicita] = useState();



    useEffect(() => {
        //console.log(lstOrdenesMock)
        //PETICION API   /*OBJETOS QUE SE DEVOLVERIA DESDE EL BACK*/ 
       // setLstOrdenesEntrada(lstOrdenesMock);
        setLstOrdenesSalida(lstOrdenesMock);


        // TODO:TEMPORAL
        const ordenesStorage = localStorage.getItem('ordenesStorage');
        //console.log(ordenesStorage)
        if (!ordenesStorage) {
            fetchGetOrdenes('PEDIDO', props.token, (data) => {
                //console.log(data.lst_ordenes)
                setLstOrdenesEntrada(data.lst_ordenes)


                const ordens = JSON.stringify(data.lst_ordenes);
                //console.log(data.lst_ordenes);
                //console.log(ordens.toString());

                localStorage.setItem('ordenesStorage', ordens.toString());
            }, dispatch)
        } else {
            const ordenesStorage = localStorage.getItem('ordenesStorage');
            //console.log("DATOS GUARDADO LOCALSTORAGE, ", ordenesStorage)
            setLstOrdenesEntrada(JSON.parse(ordenesStorage));
        }
//localStorage.removeItem('sender');


        

    }, [])


    const headersOrdenesEntrada = [
        { nombre: "Nro. Orden", key: "orden" }, { nombre: "Estado", key: "estado" }, { nombre: "Creada por", key: "usuario_crea" },
        { nombre: "Cantidad Solicitada", key: "cant_tarjetas" }, 
        { nombre: "Fecha creación", key: "fecha_creación" },{ nombre: "Fecha solicita", key: "fecha_solicita" }, 
        { nombre: "Acciones", key: "acciones" }
    ]

    const headersOrdenesSalida = [
        { nombre: "Nro. Orden", key: "orden" }, { nombre: "Estado", key: "estado" }, { nombre: "Creada por", key: "usuario_crea" },
        { nombre: "Cantidad Enviada", key: "cant_tarjetas_enviadas" }, { nombre: "Destino", key: "destino_envio" }, { nombre: "Fecha creación", key: "fecha_creación" },
        { nombre: "Fecha de envío", key: "fecha_envio" }, { nombre: "Fecha de recepción", key: "fecha_proceso" }, { nombre: "Acciones", key: "acciones" }
    ]



    const ordenPageHandler = (accion, numOrden) => {

        if (accion === "editar") {
            navigate.push('/orden/editar', { numOrdenEditar: numOrden });
        }
        else if (accion === "crear") {
            navigate.push('/orden/nueva', { numOrdenEditar: -1 });
        }
        else if (accion === "crearOrdenPedido") {
            navigate.push('/ordenPedido/nueva');
        }
    }
    
    
    const envioOrdenProvModal = (orden) => {
        navigate.push('/orden/generarArchivo')
    }

    const verOrdenPage = (orden) => {
        navigate.push('/orden/verOrden', { numOrden: orden })
    }


    //ACCIONES PARA ABRIR MODALES
    const envioTarjetasValijaModal = (orden) => {
        //setIsModalEnvioValija(true);
        setNumOrdenAccion(orden);
        //setAgenciaSolicita(agencia);



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
        /*fetchGetReporteOrden(orden.toString(), props.token, (data) => {
            if (/*data.str_res_codigo === "000" && verificarPdf(data.byt_reporte)) { /*TODO DESCOMENTAR CUANDO SE COMPLETE DESARROLLO
                const blob = base64ToBlob(data.byt_reporte, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `Orden${orden}_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo,'pdf', false);
            }else {
                window.alert("ERROR AL GENERAR EL REPORTE, COMUNIQUESE CON EL ADMINISTRADOR");
            }
        }, dispatch);*/
    }

    const AccionesOrden = ({ numOrden, estadoOrden }) => {   
        return (
            <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>
                


                {estadoOrden === 'CREADA' && (
                    <>
                        <button className="btn_mg_icons custom-icon-button" onClick={() => { envioOrdenProvModal(numOrden) }} title="Enviar Orden a CardTech">
                            <img className="img-icons-acciones" src="Imagenes/upload.svg" alt="Enviar Orden a CardTech"></img>
                        </button>

                        <button className="btn_mg_icons custom-icon-button" onClick={() => ordenPageHandler("editar", numOrden)} title="Editar Orden">
                            <img className="img-icons-acciones" src="Imagenes/icon_orden/edit_note_24dp1.svg" alt="Editar Orden"></img>
                        </button>

                        <button className="btn_mg_icons custom-icon-button" onClick={() => { eliminarOrdenTarjetasModal(numOrden) }} title="Eliminar Orden">
                            <img className="img-icons-acciones" src="Imagenes/icon_orden/delete_forever.svg" alt="Eliminar Orden"></img>
                        </button>
                    </>
                )}

                {/*{estadoOrden === 'Pendiente Distribución' && (*/}
                {/*    <button className="btn_mg_icons custom-icon-button" onClick={() => ordenPageHandler("crear_suborden", numOrden)} title="Enviar por Valija">*/}
                {/*        <img className="img-icons-acciones" src="Imagenes/icon_orden/shipping_24dp.svg" alt="Enviar por Valija"></img>*/}
                {/*    </button>*/}

                {/*)}*/}

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


    const [togglesRegistros, setTogglesRegistros] = useState(
        [
            { image: "", textPrincipal: `Ordenes de Entrada`, textSecundario: "", key: 1 },
            { image: "", textPrincipal: `Ordenes de Salida`, textSecundario: "", key: 2 }
        ]);

    const handleSelectedToggle = (index) => {
        const lstSeleccionada = togglesRegistros.find((acciones) => acciones.key === index);
        if (lstSeleccionada.textPrincipal === "Ordenes de Entrada") {
            setIsActiveOrdenesEntrada(true);
            setIsActiveOrdenesSalida(false);
        } else {
            setIsActiveOrdenesEntrada(false);
            setIsActiveOrdenesSalida(true);
        }
    }

    return (
        <div className="f-row w-100" >
            {/*<Sidebar enlace={props.location.pathname}></Sidebar>*/}
            <div className="container_mg">
         
                <h2 className="mt-5 mb-3">Órdenes</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px"}}>
                                <Card >
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Crear Orden de tarjetas de crédito</h4>
                                    <h5 className="mt-2">NOMINADAS</h5>
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

                                {/*<Card>*/}
                                {/*    <img style={{ width: "15%" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>*/}
                                {/*    <h4 className="mt-2 mb-5">Revisar listado tarjetas de una orden</h4>*/}
                                {/*    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Crear</Button>*/}
                                {/*</Card>*/}
                                <Card>
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Crear Orden de Entrega de tarjetas de crédito</h4>
                                    <h5 className="mt-2">Para entrega a Oficinas</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={() => ordenPageHandler("crearOrdenPedido", "")}>Crear</Button>
                                </Card>
                            </div>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>

                                <Card>
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    <h4 className="mt-2">Generar archivo para solicitudes aprobadas</h4>
                                    <h5 className="mt-2">Envío a Credencial</h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={envioOrdenProvModal }>Crear</Button>
                                </Card>
                            </div>

                        </div>

                    </div>

                </div>


                <Toggler className="mt-2" toggles={togglesRegistros}
                    selectedToggle={handleSelectedToggle}>
                </Toggler>


                {isActiveOrdenesEntrada && 
                    <div id="listado_ordenes" className="mt-3">
                        <Table headers={headersOrdenesEntrada}>
                            {/*BODY*/}
                            {lstOrdenesEntrada.map((orden, index) => {
                                return (
                                    <tr key={orden.int_num_orden}>
                                        <td style={{ width: "100px" }}>{orden.int_num_orden}</td>
                                        {/*<td>{orden.str_estado}</td>*/}
                                        <td>{'ENVIADO A PROVEEDOR'}</td>
                                        <td>{'Ericka Rios'}</td>
                                        <td>{orden.int_cantidad}</td>
                                        <td>{orden.dtt_fecha_creacion}</td>
                                        <td>{orden.dtt_fecha_proceso}</td>
                                        {/*<td style={{ width: "143px" }}>{orden.fecha_creacion}</td>*/}
                                        {/*<td style={{ width: "143px" }}>{orden.fecha_solicita}</td>*/}
                                        {/*<td style={{ width: "143px" }}>{orden.fecha_proceso}</td>*/}
                                        {/*<td style={{ width: "143px" }}>{orden.fecha_cierre_orden}</td>*/}
                                        <td>
                                            <AccionesOrden numOrden={orden.int_num_orden} estadoOrden={'ENVIADO A PROVEEDOR'} />
                                        </td>
                                    </tr>
                                );
                            })}

                        </Table>
                    </div>
                }


                {isActiveOrdenesSalida && 
                    <div id="listado_ordenes" className="mt-3">
                        <Table headers={headersOrdenesSalida}>
                            {/*BODY*/}
                            {lstOrdenesSalida.map((ordenSalida, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ width: "100px" }}>{ordenSalida.orden}</td>
                                        <td>{ordenSalida.estado}</td>
                                        <td>{ordenSalida.usuario_crea}</td>
                                        <td>{ordenSalida.cant_tarjetas}</td>
                                        <td>OFICINA MATRIZ</td>
                                        <td style={{ width: "143px" }}>{ordenSalida.fecha_creacion}</td>
                                        <td style={{ width: "143px" }}>{ordenSalida.fecha_creacion}</td>
                                        <td style={{ width: "143px" }}>{ordenSalida.fecha_proceso}</td>
                                        <td>
                                            <AccionesOrden numOrden={ordenSalida.orden} estadoOrden={ordenSalida.estado} />
                                        </td>
                                    </tr>
                                );
                            })}

                        </Table>
                    </div>
                
                } 
                

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
                {/*<ModalAccionesOrden*/}
                {/*    visibleModal={isModalEnvioValija}*/}
                {/*    titulo={`Distribución de Orden de Tarjetas`}*/}
                {/*    type={"sm"}*/}
                {/*    closeClick={closeModalHandler}*/}
                {/*    nomBtnAccion={"SI"}*/}
                {/*    accionHandler={submitEnvioTarjetasResponsables}*/}
                {/*    nomBtnAccionInv={"NO"}*/}
                {/*    accionInversaHandler={closeModalHandler}*/}
                {/*>*/}
                {/*    <div>*/}
                {/*        <p style={{ fontSize: '16px' }}>¿Desea realizar el envío de la orden?</p> <br/>*/}
                {/*        <p style={{ fontSize: '15px' }}>Número de orden: <strong>{numOrdenAccion}</strong></p>*/}
                {/*        <p style={{ fontSize: '15px' }}>Agencia que hará el envio: <strong>{agenciaSolicita}</strong></p>*/}
                {/*    </div>*/}
                {/*</ModalAccionesOrden>*/}

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