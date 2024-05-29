import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from "../../js/utiles";
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import { fetchGetInforme, fetchGetFlujoSolicitud, fetchAddComentarioAsesor, fetchAddComentarioSolicitud, fetchGetResolucion, fetchAddProcEspecifico, fetchUpdateCupoSolicitud, fetchGetMedioAprobacion } from "../../services/RestServices";
import Sidebar from "../Common/Navs/Sidebar";
import Card from "../Common/Card";
import Table from "../Common/Table";
import Textarea from "../Common/UI/Textarea";
import Item from "../Common/UI/Item";
import Button from "../Common/UI/Button";
import Modal from "../Common/Modal/Modal";
import Input from "../Common/UI/Input";
import Toggler from "../Common/UI/Toggler";

const mapStateToProps = (state) => {
    //console.log(state);
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
    const [modalVisible, setModalVisible] = useState("");
    const [modalVisibleOk, setModalVisibleOk] = useState(false);
    const [modalMonto, setModalMonto] = useState(false);
    const [modalRechazo, setModalRechazo] = useState(false);
    const [modalCambioBandeja, setModalCambioBandeja] = useState(false);
    const [modalRegresa, setModalRegresa] = useState(false);
    const [faltaComentariosAsesor, setFaltaComentariosAsesor] = useState(false);
    const [isBtnComentariosActivo, setIsBtnComentariosActivo] = useState(false)
    const [textoModal, setTextoModal] = useState("");
    const [isDesicionHanilitada, setIsDesicionHanilitada] = useState(false);
    const [isMontoDiferente, setIsMontodiferente] = useState(false);
    const [accionesSolicitud, setAccionesSolicitud] = useState([{ image: "", textPrincipal: "Información de solicitud", textSecundario: "", key: 1 },
        { image: "", textPrincipal: "Documentos", textSecundario: "", key: 2 }]);
    const [accionSeleccionada, setAccionSeleccionada] = useState(1);
    const [nuevoMonto, setNuevoMonto] = useState(0);
    const [cambioEstadoSol, setCambioEstadoSol] = useState("-1");
    const [flujoSolId, setFlujoSolId] = useState(0);
    const [nuevoMontoAprobado, setNuevoMontoAprobado] = useState(0);

    const [comentarioCambioEstado, setComentarioCambioEstado] = useState("");
    const [valorDecisionSelect, setValorDecisionSelect] = useState("-1");
    const [isActivoBtnDecision, setIsActivoBtnDecision] = useState(true);
    const [isBtnDisableCambioBandeja, setIsBtnDisableCambioBandeja] = useState(true);

    //Se debe implementar con parametros
    const [imprimeMedio, setImprimeMedio] = useState([]);
    const [regresaSolicitud, setRegresaSolicitud] = useState([]);
    const [estadosSiguientes, setEstadosSiguientes] = useState([]);
    const [estadosSiguientesAll, setEstadosSiguientesAll] = useState([]);
    const [archivoMostrado, setArchivoMostrado] = useState("FRMSYS-020.pdf")
    const estadosSol = [
        {
            prm_id: "11035", prm_valor_ini: "SOLICITUD CREADA"
        },
        {
            prm_id: "11036", prm_valor_ini: "ANALISIS UAC"
        },
        {
            prm_id: "11037", prm_valor_ini: "ANALISIS JEFE UAC"
        },
        {
            prm_id: "11038", prm_valor_ini: "ANALISIS COMITE"
        },
        {
            prm_id: "11039", prm_valor_ini: "APROBADA COMITE"
        },
        {
            prm_id: "11040", prm_valor_ini: "NEGADA"
        },
        {
            prm_id: "11042", prm_valor_ini: "ENTREGADA"
        },
    ];
    const parametros = [
        { prm_id: "11134", prm_valor_ini: "SOLICITUD CREADA" },
        { prm_id: "11135", prm_valor_ini: "ANALISIS UAC" },
        { prm_id: "11136", prm_valor_ini: "ANALISIS JEFE UAC" },
        { prm_id: "11137", prm_valor_ini: "ANALISIS COMITE" },
        { prm_id: "11138", prm_valor_ini: "APROBADA COMITE" },
        { prm_id: "11140", prm_valor_ini: "NEGADA" },
        { prm_id: "11139", prm_valor_ini: "ANULADA COMITE" },
        { prm_id: "11042", prm_valor_ini: "ENTREGADA" }
    ];
    const seleccionAccionSolicitud = (value) => {
        const accionSelecciona = accionesSolicitud.find((element) => { return element.key === value });
        //console.log(accionSelecciona);
        setAccionSeleccionada(accionSelecciona.key);
    }

    const headerTableComentarios = [
        { nombre: 'Tipo', key: 1 }, { nombre: 'Comentario', key: 2 }
    ];

    const headerTableResoluciones = [
        { nombre: 'Usuario', key: 3 }, {nombre: 'Fecha actualización', key: 4}, { nombre: "Comentario", key: 6}
    ];
    
    useEffect(() => {
        fetchGetInforme(props.solicitud.solicitud, props.solicitud.idSolicitud, props.token, (data) => {
            setComentariosAsesor(data.lst_informe);
            existeComentariosVacios(data.lst_informe);  
            //console.log("INFORME",data.lst_informe);

        }, dispatch);
        fetchGetResolucion(props.solicitud.solicitud, props.token, (data) => {
            setResoluciones(data.lst_resoluciones);
        }, dispatch);
        fetchGetFlujoSolicitud(props.solicitud.solicitud, props.token, (data) => {
            const arrayDeValores = data.flujo_solicitudes.map(objeto => objeto.slw_id);
            const valorMaximo = Math.max(...arrayDeValores);
            const datosSolicitud = data.flujo_solicitudes.find(solFlujo => solFlujo.slw_id === valorMaximo);
            setFlujoSolId(datosSolicitud.slw_id);
            setSolicitudTarjeta(...[datosSolicitud])


        }, dispatch);
        setImprimeMedio([
            {
                prm_id: "11135"
            }, {
                prm_id: "11136"
            }, {
                prm_id: "11137"
            }
        ]);
        setRegresaSolicitud([
            {
                prm_id: "11189" //NO SE SABE A CUAL CORRESPONDE
            }, {
                prm_id: "11136"
            }, {
                prm_id: "11137"
            }
        ]);
        setEstadosSiguientesAll([
            {
                prm_id: "11137", estados: "11138|11140"
            }
        ]);

        //console.log("PROPS INFO", props)

    }, []);


    const validaNombreParam = (id) => {        
        if (estadosSiguientesAll.length > 0) {
            const parametro = parametros.find(param => param.prm_id === id);
            return parametro;
        }      
    }

    const setArchivo = (event) => {
        setArchivoMostrado(event.target.value);
    }

    useEffect(() => {        
        const arrEstados = estadosSiguientesAll?.find((values) => values.prm_id === props.solicitud.idSolicitud);
        if (arrEstados) {
            const estadosSiguientes = arrEstados.estados.split('|');
            //console.log(estadosSiguientes)
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

    const downloadArchivo = (archivo) => {
        window.open(archivo, "_blank")
    }
    const getComentarioSolicitudHandler = (data) => {
        setComentarioSolicitud(data);
    }

    const modalHandler = () => {
        console.log("clicked!!")
        setModalVisible(true);
    }

    const siguientePasoHandler = () => {
        if (!existeComentariosVacios(comentariosAsesor)) {
            //console.log(comentariosAsesor);
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

    const descargarMedio = (numSolicitud) => {
        //console.log("Num Sol,", numSolicitud)
        fetchGetMedioAprobacion(props.token, (data) => {
            if (data.str_res_codigo === "000" && verificarPdf(data.str_med_apro_bas_64)) {
                const blob = base64ToBlob(data.str_med_apro_bas_64, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `MedioAprobacionTC_Sol${numSolicitud}_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo, 'pdf');
            } else {
                window.alert("ERROR AL GENERAR EL REPORTE, COMUNIQUESE CON EL ADMINISTRADOR");
            }
        }, dispatch);
    }

    const retornarSolicitud = () => {
        navigate.push('/solicitud');
    }
    

    const closeModalHandlerOk = () => {
        setModalVisibleOk(false);

    }
    const getDesicion = (event) => {
        setValorDecisionSelect(event.target.value);
        if (event.target.value === "11138") { //APROBADO
            setIsMontodiferente(true);
        }
        else {
            setIsMontodiferente(false);
        }
    }

    const abrirTodos = () => {
        downloadArchivo("/Imagenes/FRMSYS-020.pdf");
        downloadArchivo("/Imagenes/archivo.pdf");
    }

    const updateMonto = () => {
        setModalMonto(true);
    }

    const closeModalMonto = () => {
        setModalMonto(false);
    }

    const actualizarMonto = () => {
        // Solo se realiza el cambio para solicitud con estado Analista de Crédito
        fetchUpdateCupoSolicitud(props.solicitud.solicitud, flujoSolId, props.solicitud.idSolicitud, nuevoMonto, props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setModalMonto(false);
            }
        }, dispatch);
    }

    const nuevoMontoHandler = (value) => {
        setNuevoMonto(value);
    }


    const guardarRechazo = () => {
        rechazaTarjeta();
    }


    const cambiarEstadoSolHandler = (e) => {
        setCambioEstadoSol(e.target.value);
    }

    const cambioEstadoBandeja = () => {

        if(props.solicitud.idSolicitud === '11137') {
            fetchAddProcEspecifico(props.solicitud.solicitud, 0, cambioEstadoSol, comentarioCambioEstado, props.token, (data) => {
                if (data.str_res_codigo === "000") {
                    //Ir a pagina anterior
                    setModalCambioBandeja(false);
                    console.log("SE GUARDA AL NUEVO ESTADO");
                    navigate.push('/solicitud');
                }
                else {
                    console.log("No cuenta con permisos ", data);
                }

            }, dispatch)

        } else {
            fetchAddComentarioSolicitud(props.solicitud.solicitud, comentarioCambioEstado, props.solicitud.idSolicitud, true, props.token, (data) => {
                if (data.str_res_codigo === "000") {
                    setModalCambioBandeja(false);
                    console.log("SE GUARDA AL NUEVO ESTADO");
                    navigate.push('/solicitud');
                }
                else {
                    console.log("No cuenta con permisos ", data);
                }
            }, dispatch);
        }
        
    }

    const openModalRechazo = () => {
        setModalRechazo(true);
    }

    const closeModalRegresa = () => {

    }


    const rechazaTarjeta = () => {
        fetchAddProcEspecifico(props.solicitud.idSolicitud, 0, "EST_RECHAZADA_SOCIO", "", props.token, (data) => {
            if (data.str_res_codigo === "000") {
                //Ir a pagina anterior
                setModalRechazo(false);
                navigate.push('/solicitud');
            }
        }, dispatch)
    }

    const closeModalRechazo = () => {
        setModalRechazo(false);
    }

    const closeModalambioBandeja = () => {
        setModalCambioBandeja(false);
    } 
    const openModalCambiarBandeja = () => {
        setModalCambioBandeja(true);
    }

    const [trimed, setTrimed] = useState(false);

    const verMas = (index) => {
        // const newElemente = event.target.parentElement;
        // newElemente.parentElement;
        setTrimed(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    }


    useEffect(() => {
        if (comentarioCambioEstado !== "") {
            setIsBtnDisableCambioBandeja(false);
        } else {
            setIsBtnDisableCambioBandeja(true);
        }
    }, [comentarioCambioEstado])


    useEffect(() => {
        if (comentarioSolicitud !== "") {
            setFaltaComentariosAsesor(false);
        } else {
            setFaltaComentariosAsesor(true);
        }
    }, [comentarioSolicitud])


    const guardarDecisionComiteHandler = () => {
        if (valorDecisionSelect === "11138") { //APROBADO
            fetchAddProcEspecifico(props.solicitud.solicitud, nuevoMontoAprobado, "EST_APROBADA_COMITE", comentarioSolicitud, props.token, (data) => { //APROBADO 11138
                if (data.str_res_codigo === "000") {
                    console.log("SE APROBO SOLICITUD");
                    navigate.push('/solicitud');
                }
                else {
                    console.log("No cuenta con permisos ", data);
                }
            }, dispatch)

        } else if (valorDecisionSelect === "11140") { // ANULADA
            fetchAddProcEspecifico(props.solicitud.solicitud, 0, "EST_ANULADA_COMITE", "", props.token, (data) => { //ANULADA 11139
                if (data.str_res_codigo === "000") {
                    console.log("SE NEGO SOLICITUD");
                    navigate.push('/solicitud');
                }
                else {
                    console.log("No cuenta con permisos ", data);
                }
            }, dispatch)
        }        
    }


    useEffect(() => {

        if (valorDecisionSelect === "11140") {
            setIsActivoBtnDecision(false);
        }
        else if (valorDecisionSelect !== "-1" && nuevoMontoAprobado !== 0 && comentarioSolicitud !== "") {
            setIsActivoBtnDecision(false);
        }
        else {
            setIsActivoBtnDecision(true);
        }


    }, [valorDecisionSelect, nuevoMontoAprobado, comentarioSolicitud])

    return <div className="f-row">
        <Sidebar enlace={props.location.pathname}></Sidebar>
        <Card className={["w-100"] }>
            <Toggler
                selectedToggle={seleccionAccionSolicitud}
                toggles={accionesSolicitud}>
            </Toggler>
            {modalVisible.toString() }
            {
                accionSeleccionada === 1 &&                 
                <>
                    {props.solicitud.idSolicitud === "11138"
                    ?
                            <Card className={["w-100 justify-content-space-between align-content-center"]}>
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
                                            {props.solicitud.idSolicitud === "11134" 
                                                ? 
                                                <>
                                                    <div className="values  mb-3">
                                                        <Button className={["btn_mg btn_mg__primary"]} disabled={false} onClick={descargarReporte}>Descargar reporte</Button>
                                                    </div>
                                                    <div className="values  mb-3">
                                                        <Button className="btn_mg__primary" type="" onClick={modalHandler}>Agregar comentarios</Button>
                                                    </div>
                                                </>
                                                :
                                                <div className="values  mb-3">
                                                    <Button className={["btn_mg btn_mg__primary"]} disabled={false} onClick={openModalRechazo}>Rechaza tarjeta</Button>
                                                </div>
                                            }
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
                                        <h5 className="strong f-row">
                                                    {`$ ${Number(solicitudTarjeta?.dec_cupo_solicitado).toLocaleString("en-US") || Number('1000.00').toLocaleString("en-US")}`}
                                                    {props.solicitud.idSolicitud === "11134" &&
                                                        <Button className="btn_mg__auto ml-2" onClick={updateMonto}>
                                                            <img src="/Imagenes/edit.svg"></img>
                                                        </Button>
                                                    }
                                                </h5>
                                    </div>
                                    <div className="values  mb-3">
                                        <h5>Cupo sugerido:</h5>
                                        <h5 className="strong">
                                                    {`$ ${Number(solicitudTarjeta?.dec_cupo_sugerido).toLocaleString("en-US") || Number('10000.00').toLocaleString("en-US")}`}
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
                        </div>
                        {/*<div className="f-row justify-content-center">*/}
                        {/*    <Button className="btn_mg__primary" disabled={faltaComentariosAsesor} onClick={guardarComentarioSiguiente}>Guardar</Button>*/}
                        {/*</div>*/}


                    </Card>
                    :
                    <Card className={["w-100 justify-content-space-between align-content-center"]}>
                        <div>
                                    <h3 className="mb-3 strong">Análisis y aprobación de crédito</h3>
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
                                                <h5 className="strong f-row">
                                                   {/* {`$ ${solicitudTarjeta?.dec_cupo_solicitado.toLocaleString("en-US") || Number('10000.00').toLocaleString("en-US")}`}*/}
                                                    {`$ ${solicitudTarjeta?.dec_cupo_solicitado || Number('10000.00').toLocaleString("en-US")}`}

                                                    {props.solicitud.idSolicitud === "11134" &&

                                                        <Button className="btn_mg__auto ml-2" onClick={updateMonto}>
                                                            <img src="/Imagenes/edit.svg"></img>
                                                        </Button>
                                                    }
                                                </h5>
                                            </div>
                                            <div className="values  mb-3">
                                                <h5>Cupo sugerido:</h5>
                                                <h5 className="strong">
                                                    {/*{`$ ${solicitudTarjeta?.dec_cupo_sugerido.toLocaleString("en-US") || Number('10000.00').toLocaleString("en-US")}`}*/}
                                                    {`$ ${solicitudTarjeta?.dec_cupo_sugerido|| Number('10000.00').toLocaleString("en-US")}`}
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
                            <Card className={["f-col"]}>
                                <div className={["f-row"]}>
                                    <Button className="btn_mg__primary" onClick={modalHandler}>Agregar comentario</Button>
                                    {/*{regresaSolicitud?.find((id) => { return id.prm_id === props.solicitud.idSolicitud }) &&*/}
                                    {/*    <Button className="btn_mg__primary ml-2" onClick={guardarComentarioAtras}>Regresar solicitud</Button>*/}
                                    {/*}*/}
                                    {/*{imprimeMedio?.find((id) => { return id.prm_id === props.solicitud.idSolicitud }) &&*/}
                                    {/*    <Button className="btn_mg__primary ml-2">Imprimir formulario</Button>*/}
                                    {/*        }*/}
                                            {(props.solicitud.idSolicitud === "11135" || props.solicitud.idSolicitud === "11136") &&
                                                <Button className="btn_mg__primary ml-2" onClick={() => descargarMedio(props.solicitud.solicitud)}>Imprimir medio aprobación</Button>
                                    }

                                    {props.solicitud.idSolicitud >= "11135" && props.solicitud.idSolicitud <= "11137" &&
                                        <Button className="btn_mg__primary ml-2" onClick={openModalCambiarBandeja}>Retornar Solicitud</Button>
                                    }

                                </div>
                                <Table headers={headerTableResoluciones}>
                                    {
                                        resoluciones.map((resolucion, index) => {
                                            return (
                                                <tr key={resolucion.int_rss_id}>
                                                    <td>{resolucion.str_usuario_proc}</td>
                                                    <td> {resolucion.dtt_fecha_actualizacion}</td>

                                                    <td style={{ width: "60%", justifyContent: "left" }} id={index}>
                                                        <div style={{ display: "ruby" }}>
                                                            {trimed[index] ?
                                                                <div>
                                                                    {`${resolucion?.str_comentario_proceso}`}
                                                                </div>
                                                                :
                                                                <div>
                                                                    {`${resolucion?.str_comentario_proceso.substring(0, 40)}`}
                                                                </div>
                                                            }
                                                            {resolucion?.str_comentario_proceso.length > 36 && <a className='see-more' onClick={() => { verMas(index) }}>{trimed[index] ? " Ver menos..." : " Ver mas..."}</a>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </Table>
                                        {
                                            props.solicitud.idSolicitud === "11137" &&
                                            <Card>
                                                    <h3>Decisión</h3>
                                                    <select disabled={isDesicionHanilitada} onChange={getDesicion} defaultValue={"-1"} value={valorDecisionSelect}>
                                                        {estadosSiguientes?.map((estados, index) => {
                                                            const resultado = validaNombreParam(estados);
                                                            if (index === 0) {
                                                                return (
                                                                    <>
                                                                        <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                                                        <option value={resultado.prm_id}> {resultado.prm_valor_ini}</option>
                                                                    </>
                                                                )
                                                            }
                                                            else {
                                                                return (
                                                                    <option value={resultado.prm_id}> {resultado.prm_valor_ini}</option>
                                                                )
                                                            }                                                        
                                                    })}
                                                    </select>
                                                    <br/>                                                     
                                            </Card>
                                        }
                                {isMontoDiferente &&
                                    <>
                                        <Card className={["mt-2"]}>
                                            <h3>Ingrese nuevo monto de aprobado</h3>
                                            <Input type="number" placeholder="Ej. 1000" setValueHandler={(e) => setNuevoMontoAprobado(e)} value={nuevoMontoAprobado}></Input>
                                        </Card>

                                        <Card className={["mt-2"]}>
                                            <h3>Comentario</h3>
                                            <Textarea placeholder="Ingrese su comentario" onChange={getComentarioSolicitudHandler} esRequerido={true}></Textarea>
                                        </Card>                                   
                                    </>
                                    
                                    


                                }
                                    </Card>

                                {props.solicitud.idSolicitud !== "11137" &&
                                    <div className="mt-4">
                                        <h3 className="mb-3 strong">Comentario de la Solicitud</h3>
                                        <Textarea placeholder="Ingrese su comentario" onChange={getComentarioSolicitudHandler} esRequerido={true}></Textarea>
                                    </div>
                                }


                            
                        </div>

                                <div className="mt-2 f-row justify-content-center">
                                    {/*APROBADA O NEGADA*/}
                                    {(props.solicitud.idSolicitud === "11137") && 
                                        <Button className="btn_mg__primary" disabled={isActivoBtnDecision} onClick={guardarDecisionComiteHandler}>Guardar</Button>
                                    }
                                    {props.solicitud.idSolicitud !== "11137" &&
                                        <Button className="btn_mg__primary" disabled={faltaComentariosAsesor} onClick={guardarComentarioSiguiente}>Guardar</Button>
                                }
                                    
                        </div>


                    </Card>
                    }
                </>

            }

            {accionSeleccionada !== 1 && accionSeleccionada === 2 &&
                <Card className={["w-100 justify-content-space-between align-content-center"]}>
                <h3 className="mb-3 strong">Documentos digitalizados</h3>
                <Button className="mt-3 mb-3 btn_mg__primary" onClick={abrirTodos}>Abrir archivos</Button>
                <div className="select-item">
                    <a onClick={() => { downloadArchivo("/Imagenes/FRMSYS-020.pdf") }}>Cédula de ciudadania</a>
                </div>
                <div className="select-item">
                    <Input type="checkbox"></Input>
                    <a onClick={() => { downloadArchivo("/Imagenes/archivo.pdf") }}>Autorizacion de consulta al buró</a>
                </div>
                </Card>
            }




        </Card>



        <Modal
            modalIsVisible={modalVisible}
            titulo={`Ingrese los comentarios`}
            onNextClick={siguientePasoHandler}
            onCloseClick={closeModalHandler}
            isBtnDisabled={isBtnComentariosActivo}
            type="lg"
            mainText="Enviar y guardar"
        >
            {modalVisible && <div>
                <Table headers={headerTableComentarios}>
                    {
                        comentariosAsesor.map((comentario, index) => {
                            return (
                                <tr key={comentario.int_id_parametro}>
                                    <td style={{ width: "40%", justifyContent: "left" }}>
                                        <div className='f-row' style={{ paddingLeft: "1rem" }}>
                                            <div className='tooltip'>
                                                <img className='tooltip-icon' src='/Imagenes/info.svg'></img>
                                                <span className='tooltip-info'>{comentario.str_descripcion}</span>
                                            </div>
                                            {comentario.str_tipo}
                                        </div>
                                    </td>
                                    <td style={{ width: "40%" }}><Textarea placeholder="Ej. Texto de ejemplo" type="textarea" onChange={(event, key = comentario.int_id_parametro) => { comentarioAdicionalHanlder(event, key) }} esRequerido={false} value={comentario.str_detalle}></Textarea></td>
                                </tr>
                            );
                        })
                    }
                </Table>
                {/*<div className="mt-4">*/}
                {/*    <h3 className="mb-3 strong">Comentario del Asesor</h3>*/}
                {/*    <Textarea placeholder="Ingrese su comentario" onChange={getComentarioSolicitudHandler} esRequerido={true}></Textarea>*/}
                {/*</div>*/}
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
        <Modal
            modalIsVisible={modalMonto}
            titulo={`Actualizar monto solicitado`}
            onNextClick={actualizarMonto}
            onCloseClick={closeModalMonto}
            isBtnDisabled={false}
            type="sm"
            mainText="Guardar"
        >
            {modalMonto && <div>
                <h3 className="mt-4 mb-3">Ingrese el nuevo monto:</h3>
                <Input className="mb-3 width-100" type="number" value={ solicitudTarjeta?.dec_cupo_solicitado} placeholder="Ingrese el nuevo monto" setValueHandler={nuevoMontoHandler}></Input>
            </div>}
        </Modal>

        <Modal
            modalIsVisible={modalRegresa}
            titulo={`Actualizar monto solicitado`}
            onNextClick={guardarComentarioAtras}
            onCloseClick={closeModalRegresa}
            isBtnDisabled={false}
            type="sm"
            mainText="Regresar solicitud"
        >
            {modalRegresa && <div>
                <h3 className="mt-4 mb-1">Seleccione a qué estado desea regresar la solicitud:</h3>

            </div>}
        </Modal>

        <Modal
            modalIsVisible={modalRechazo}
            titulo={`Aviso!!!`}
            onNextClick={guardarRechazo}
            onCloseClick={closeModalRechazo}
            isBtnDisabled={false}
            type="sm"
            mainText="Rechazar tarjeta"
        >
            {modalRechazo && <div>
                <h3 className="mt-4 mb-3">¿Seguro que desea rechazar la tarjeta?</h3>

            </div>}
        </Modal>

        <Modal
            modalIsVisible={modalCambioBandeja}
            titulo={`Cambiar bandeja`}
            onNextClick={cambioEstadoBandeja}
            onCloseClick={closeModalambioBandeja}
            isBtnDisabled={isBtnDisableCambioBandeja}
            type="md"
            mainText="Guardar"
        >
            {modalCambioBandeja && <div>


                {props.solicitud.idSolicitud === "11137" &&
                    <>
                        <h3 className="mt-4 mb-1">Seleccione a qué estado desea regresar la solicitud:</h3>

                        <select className='width-100' defaultValue={"-1"} onChange={cambiarEstadoSolHandler} value={cambioEstadoSol}>
                            <option disabled={true} value="-1">Seleccione algún estado</option>

                            {solicitudTarjeta?.str_estado === "ANALISIS COMITE" &&
                                <>
                                    <option value="EST_SOL_CREADA">SOLICITUD CREADA</option>
                                    <option value="EST_ANALISIS_UAC">ANALISIS UAC</option>
                                    <option value="EST_ANALISIS_JEFE_UAC">ANALISIS JEFE UAC</option>
                                </>
                            }
                        </select>
                    </>
                }
                <br />

                <div>
                    <h3 className="mt-2 mb-2">Comentario:</h3>
                    <Input className="width-100" type="text" value={comentarioCambioEstado} placeholder="Ingrese comentario" setValueHandler={setComentarioCambioEstado}></Input>
                </div>

                <br/>

            </div>}
        </Modal>


    </div>
}

export default connect(mapStateToProps, {})(VerSolicitud);