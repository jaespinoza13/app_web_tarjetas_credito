import { IsNullOrWhiteSpace } from "../../js/utiles";
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import { fetchGetComentarios, fetchGetFlujoSolicitud, fetchAddComentarioAsesor, fetchAddComentarioSolicitud, fetchGetResolucion } from "../../services/RestServices";
import Sidebar from "../Common/Navs/Sidebar";
import Card from "../Common/Card";
import Table from "../Common/Table";
import Textarea from "../Common/UI/Textarea";
import Item from "../Common/UI/Item";
import Button from "../Common/UI/Button";
import Modal from "../Common/Modal/Modal";
import Input from "../Common/UI/Input";

const mapStateToProps = (state) => {
    console.log(state);
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
        solicitud: state.solicitud.data
    };
};

const VerSolicitud = (props) => {
    const dispatch = useDispatch();
    const navigate = useHistory();
    const [comentariosAsesor, setComentariosAsesor] = useState([]);
    const [solicitudTarjeta, setSolicitudTarjeta] = useState([]);
    const [resoluciones, setResoluciones] = useState([]);
    const [comentarioSolicitud, setComentarioSolicitud] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleOk, setModalVisibleOk] = useState(false);
    const [modalArchivos, setModalArchivos] = useState(false);
    const [faltaComentariosAsesor, setFaltaComentariosAsesor] = useState(true);
    const [isBtnComentariosActivo, setIsBtnComentariosActivo] = useState(false)
    const [textoModal, setTextoModal] = useState("");
    const [isDesicionHanilitada, setIsDesicionHanilitada] = useState(false);
    const [isMontoDiferente, setIsMontodiferente] = useState(false);

    //Se debe implementar con parametros
    const [imprimeMedio, setImprimeMedio] = useState([]);
    const [regresaSolicitud, setRegresaSolicitud] = useState([]);
    const [estadosSiguientes, setEstadosSiguientes] = useState([]);
    const [estadosSiguientesAll, setEstadosSiguientesAll] = useState([]);
    const [archivoMostrado, setArchivoMostrado] = useState("FRMSYS-020.pdf")
    const estadosSol = [
        {
            prm_id: "11188", prm_valor_ini: "SOLICITUD CREADA"
        },
        {
            prm_id: "11189", prm_valor_ini: "ANALISIS UAC"
        },
        {
            prm_id: "11190", prm_valor_ini: "ANALISIS JEFE UAC"
        },
        {
            prm_id: "11191", prm_valor_ini: "ANALISIS COMITE"
        },
        {
            prm_id: "11192", prm_valor_ini: "APROBADA COMITE"
        },
        {
            prm_id: "11193", prm_valor_ini: "Solicitud anulada"
        },
        {
            prm_id: "11194", prm_valor_ini: "Solicitud entregada"
        },
    ]

    const headerTableComentarios = [
        { nombre: 'Tipo', key: 1 }, { nombre: 'Descripción', key: 2 }, { nombre: 'Comentario', key: 3 }
    ];

    const headerTableResoluciones = [
        { nombre: 'Cupo solic.', key: 1 }, { nombre: 'Cupo sugerido', key: 2 }, { nombre: 'Usuario', key: 3 }, {nombre: 'Fecha actualización', key: 4}, { nombre: 'Decisión', key: 5 }, { nombre: "Comentario", key: 6}
    ];
    
    useEffect(() => {
        fetchGetComentarios(props.solicitud.solicitud, props.solicitud.idSolicitud, props.token, (data) => {
            setComentariosAsesor(data.lst_informe);
            existeComentariosVacios(data.lst_informe);
        }, dispatch);
        fetchGetResolucion(props.solicitud.solicitud, props.token, (data) => {
            setResoluciones(data.lst_resoluciones);
        }, dispatch);
        fetchGetFlujoSolicitud(props.solicitud.solicitud, props.token, (data) => {
            const maxSolicitudes = data.flujo_solicitudes.length - 1;
            const datosSolicitud = data.flujo_solicitudes[maxSolicitudes];
            setSolicitudTarjeta(...[datosSolicitud]);
        }, dispatch);
        setImprimeMedio([
            {
                prm_id: "11190"
            }, {
                prm_id: "11191"
            }
        ]);
        setRegresaSolicitud([
            {
                prm_id: "11189"
            }, {
                prm_id: "11190"
            }, {
                prm_id: "11191"
            }
        ]);
        setEstadosSiguientesAll([
            {
                prm_id: "11188", estados: "11195"
            },
            {
                prm_id: "11189", estados: "11195"
            },
            {
                prm_id: "11190", estados: "11198|11196|11197"
            },
            {
                prm_id: "11191", estados: "11192|11196|11197"
            }
        ]);
    }, []);

    const parametros = [
        { prm_id: "11198", prm_valor_ini: "EVALUADO" },
        { prm_id: "11195", prm_valor_ini: "APROBADO" },
        { prm_id: "11192", prm_valor_ini: "APROBADA COMITE" },
        { prm_id: "11196", prm_valor_ini: "RECHAZADA" },
        { prm_id: "11197", prm_valor_ini: "APROBADA MONTO MENOR" }
    ]

    const validaNombreParam = (id) => {
        const parametro = parametros.find((param) => { return param.prm_id === id });
        return parametro.prm_valor_ini;
    }

    const setArchivo = (event) => {
        setArchivoMostrado(event.target.value);
    }

    useEffect(() => {        
        const arrEstados = estadosSiguientesAll?.find((values) => values.prm_id === props.solicitud.idSolicitud);
        if (arrEstados) {
            const estadosSiguientes = arrEstados.estados.split('|');
            setEstadosSiguientes(estadosSiguientes);
        } else {
            // Handle the case when arrEstados is not found
        }

    }, [estadosSiguientesAll]);

    useEffect(() => {
        if (estadosSiguientes.length === 1) {
            setIsDesicionHanilitada(true);
        }
    }, [estadosSiguientes]);

    const comentarioAdicionalHanlder = (data, event) => {
        const id = comentariosAsesor.findIndex((comentario) => { return comentario.int_id_parametro === event });
        const comentarioActualizado = [...comentariosAsesor]
        comentarioActualizado[id].str_detalle = data;
        setComentariosAsesor(comentarioActualizado) 

        existeComentariosVacios(comentarioActualizado);
        
    }
    const getComentarioSolicitudHandler = (data) => {
        setComentarioSolicitud(data);
    }

    const modalHandler = () => {
        setModalVisible(true);
    }

    const modalArchivosHandler = () => {
        setModalArchivos(true);
    }

    const closeModalArchivosHandler = () => {
        setModalArchivos(false);
    }

    const siguientePasoHandler = () => {
        if (!existeComentariosVacios(comentariosAsesor)) {
            console.log(comentariosAsesor);
            fetchAddComentarioAsesor(props.solicitud.solicitud, comentariosAsesor, props.solicitud.idSolicitud, props.token, (data) => {
                if (data.str_res_codigo === "000") {
                    setFaltaComentariosAsesor(false);
                    setModalVisible(false);
                }
            }, dispatch);
        } else {
            setIsBtnComentariosActivo(false);
        }
    }

    const closeModalHandler = () => {
        setModalVisible(false);
    }

    const guardarComentarioSiguiente = () => {
        fetchAddComentarioSolicitud(props.solicitud.solicitud, comentarioSolicitud, props.solicitud.idSolicitud, false, props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setModalVisibleOk(true);
                setTextoModal("Su comentario se ha guardado correctamente");
            }
        }, dispatch);
    }

    const guardarComentarioAtras = () => {
        if (comentarioSolicitud) {
            fetchAddComentarioSolicitud(props.solicitud.solicitud, comentarioSolicitud, props.solicitud.idSolicitud, true, props.token, (data) => {
                if (data.str_res_codigo === "000") {
                    setModalVisibleOk(true);
                    setTextoModal("Su comentario se ha guardado correctamente");
                }
            }, dispatch);
        }
        else {
            setModalVisibleOk(true);
            setTextoModal("Debe ingresar un comentario para poder regresar la solicitud");
        }
    }

    function existeComentariosVacios(arregloComentarios) {
        if (arregloComentarios.find(comentario => comentario.str_detalle === "")) {
            setIsBtnComentariosActivo(true) //Comentarios faltan rellenar
            return true;
        } else {
            setIsBtnComentariosActivo(false) //Comentarios completos
            return false;
        }

    }

    const descargarReporte = () => {
        const pdfUrl = "Imagenes/reporteavalhtml.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const descargarMedio = () => {
        const pdfUrl = "Imagenes/Medio de aprobación-Tarjeta de crédito.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const retornarSolicitud = () => {
        navigate.push('/solicitud');
    }

    const closeModalHandlerOk = () => {
        setModalVisibleOk(false);

    }
    const getDesicion = (event) => {
        if (event.target.value === "11197") {
            setIsMontodiferente(true);
        }
        else {
            setIsMontodiferente(false);
        }
    }

    return <div className="f-row">
        <Sidebar enlace={props.location.pathname}></Sidebar>
        {props.solicitud.idSolicitud === "11188"
            ?
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div>
                    <h3 className="mb-3 strong">Información de la solicitud</h3>
                    <Card className={["f-row"]}>
                        <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <div className="values  mb-3">
                                <h5>Socio:</h5>
                                <h5 className="strong">
                                    {`$ ${props.montoSugerido || Number('10000.00').toLocaleString("en-US")}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Tipo Documento:</h5>
                                <h5 className="strong">
                                    {`Cédula`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Oficina:</h5>
                                <h5 className="strong">
                                    {`EL VALLE`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Oficial:</h5>
                                <h5 className="strong">
                                    {`${solicitudTarjeta?.str_usuario_proc}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <Button className={["btn_mg btn_mg__primary"]} disabled={false} onClick={descargarReporte}>Descargar reporte</Button>
                            </div>
                            <div className="values  mb-3">
                                <Button className="btn_mg__primary" type="" onClick={modalHandler}>Agregar comentarios</Button>
                            </div>
                        </Item>

                        <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <div className="values  mb-3">
                                <h5>Estado de la solicitud:</h5>
                                <h5 className="strong">
                                    {`${solicitudTarjeta?.str_estado}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Cupo solicitado:</h5>
                                <h5 className="strong">
                                    {`$ ${Number(solicitudTarjeta?.str_cupo_solicitado).toLocaleString("en-US") || Number('10000.00').toLocaleString("en-US")}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Cupo sugerido:</h5>
                                <h5 className="strong">
                                    {`$ ${Number(solicitudTarjeta?.str_cupo_sugerido).toLocaleString("en-US") || Number('10000.00').toLocaleString("en-US")}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Solicitud Nro:</h5>
                                <h5 className="strong">
                                    {`${props.solicitud.solicitud || Number('10000.00').toLocaleString("en-US")}`}
                                </h5>
                            </div>
                        </Item>
                    </Card>
                    <div className="mt-4">
                        <h3 className="mb-3 strong">Comentario del Asesor</h3>
                        <Textarea placeholder="Ingrese su comentario" onChange={getComentarioSolicitudHandler}  esRequerido={true}></Textarea>
                    </div>
                </div>
                <div className="f-row justify-content-center">
                    <Button className="btn_mg__primary" disabled={faltaComentariosAsesor} onClick={guardarComentarioSiguiente}>Guardar</Button>
                </div>


            </Card>
            :
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div>
                    <h3 className="mb-3 strong">Análisis y aprobación de crédito</h3>
                    <Card className={["f-col"]}>
                        <div className={["f-row"] }>
                            <Button className="btn_mg__primary" onClick={modalHandler}>Agregar comentario</Button>
                            <Button className="btn_mg__primary" onClick={modalArchivosHandler}>Ver documentos</Button>
                            {regresaSolicitud?.find((id) => { return id.prm_id === props.solicitud.idSolicitud }) &&
                                <Button className="btn_mg__primary ml-2" onClick={guardarComentarioAtras}>Regresar solicitud</Button>
                            }
                            {imprimeMedio?.find((id) => { return id.prm_id === props.solicitud.idSolicitud }) &&
                                <Button className="btn_mg__primary ml-2">Imprimir formulario</Button>
                            }
                        </div>
                        <Table headers={headerTableResoluciones}>
                            {
                                resoluciones.map((resolucion) => {
                                    return (
                                        <tr key={resolucion.int_rss_id}>
                                            <td>{resolucion.dec_cupo_solicitado}</td>
                                            <td>{resolucion.dec_cupo_sugerido}</td>
                                            <td>{resolucion.str_usuario_proc}</td>
                                            <td> {resolucion.dtt_fecha_actualizacion}</td>
                                            <td> {resolucion.str_decision_solicitud}</td>
                                            <td> {resolucion.str_comentario_proceso}</td>
                                        </tr>
                                    );
                                })
                            }
                        </Table>
                        <Card>
                            <h3>Decisión</h3>
                            <select disabled={isDesicionHanilitada} onChange={getDesicion}>
                                {estadosSiguientes?.map((estados) => {
                                    return <option value={estados}>
                                        {validaNombreParam(estados)}
                                    </option>
                                })}
                            </select>
                        </Card>
                        {isMontoDiferente &&
                            <Card className={["mt-2"] }>
                                <h3>Ingrese nuevo monto de aprobado</h3>
                                <Input type="number" placeholder="Ej. 1000">
                                </Input>
                            </Card>
                        }
                    </Card>
                    <div className="mt-4">
                        <h3 className="mb-3 strong">Comentario del Asesor</h3>
                        <Textarea placeholder="Ingrese su comentario" onChange={getComentarioSolicitudHandler} esRequerido={true}></Textarea>
                    </div>
                </div>
                <div className="f-row justify-content-center">
                    <Button className="btn_mg__primary" disabled={faltaComentariosAsesor} onClick={guardarComentarioSiguiente}>Guardar</Button>
                </div>


            </Card>
        }
        <Modal
            modalIsVisible={modalArchivos}
            titulo={`Visualización de archivos`}
            onNextClick={closeModalArchivosHandler}
            onCloseClick={closeModalArchivosHandler}
            isBtnDisabled={isBtnComentariosActivo}
            type="lg"
        >
            {modalArchivos && <div>
                <select className="mt-2 mb-2" onChange={setArchivo}>
                    <option value={"FRMSYS-020.pdf"}>Cédula de ciudadania</option>
                    <option value={"archivo.pdf"}>Autorizacion de consulta al buró</option>
                </select>
                <div>
                    <embed src={`/Imagenes/${archivoMostrado}`} type="application/pdf" width="100%" height="600px" />
                </div>
            </div>}
        </Modal>


        <Modal
            modalIsVisible={modalVisible}
            titulo={`Ingrese los comentarios`}
            onNextClick={siguientePasoHandler}
            onCloseClick={closeModalHandler}
            isBtnDisabled={isBtnComentariosActivo}
            type="lg"
        >
            {modalVisible && <div>
                <Table headers={headerTableComentarios}>
                    {
                        comentariosAsesor.map((comentario) => {
                            return (
                                <tr key={comentario.int_id_parametro}>
                                    <td style={{ width: "20%" }}>{comentario.str_tipo}</td>
                                    <td style={{ width: "40%" }}>{comentario.str_descripcion}</td>
                                    <td style={{ width: "40%" }}><Textarea placeholder="Ej. Texto de ejemplo" type="textarea" onChange={(event, key = comentario.int_id_parametro) => { comentarioAdicionalHanlder(event, key) }} esRequerido={false} value={comentario.str_detalle}></Textarea></td>
                                </tr>
                            );
                        })
                    }
                </Table>
            </div>}
        </Modal>
        <Modal
            modalIsVisible={modalVisibleOk}
            titulo={`Aviso!`}
            onNextClick={retornarSolicitud}
            onCloseClick={closeModalHandlerOk}
            isBtnDisabled={false}
            type="sm"
        >
            {modalVisibleOk && <div>
                <p>{textoModal}</p>
            </div>}
        </Modal>
    </div>
}

export default connect(mapStateToProps, {})(VerSolicitud);