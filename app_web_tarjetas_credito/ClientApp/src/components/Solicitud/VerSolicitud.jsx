/* eslint-disable react-hooks/exhaustive-deps */
import { IsNullOrEmpty, IsNullOrWhiteSpace, base64ToBlob, conversionTipoTC, descargarArchivo, generarFechaHoy, numberFormatMoney, verificarPdf } from "../../js/utiles";
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import { fetchGetInforme, fetchGetFlujoSolicitud, fetchAddComentarioAsesor, fetchAddComentarioSolicitud, fetchGetResolucion, fetchAddProcEspecifico, fetchUpdateCupoSolicitud, fetchGetMedioAprobacion, fetchGetSeparadores, fetchInfoSocio, fetchGetMotivos, fetchAddResolucion, fetchGetFuncionalidadesTC } from "../../services/RestServices";
import Card from "../Common/Card";
import Table from "../Common/Table";
import Textarea from "../Common/UI/Textarea";
import Item from "../Common/UI/Item";
import Button from "../Common/UI/Button";
import Modal from "../Common/Modal/Modal";
import Input from "../Common/UI/Input";
import Toggler from "../Common/UI/Toggler";
import UploadDocumentos from "../Common/UploaderDocuments";
import { get } from "../../js/crypt";
import { useRef } from "react";
import { Fragment } from "react";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Switch from "../Common/UI/Switch";

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
        solicitud: state.solicitud.data,
        parametrosTC: state.GetParametrosTC.data
    };
};

const VerSolicitud = (props) => {
    const dispatch = useDispatch();
    const navigate = useHistory();
    const [informe, setInforme] = useState([]);
    const [lstSeguimientoTC, setLstSeguimientoTC] = useState([]);
    const [solicitudTarjeta, setSolicitudTarjeta] = useState([]);
    const [resoluciones, setResoluciones] = useState([]);
    const [comentarioSolicitud, setComentarioSolicitud] = useState("");
    const [observacionComite, setObservacionComite] = useState("");
    const [modalVisible, setModalVisible] = useState("");
    const [modalVisibleOk, setModalVisibleOk] = useState(false);
    const [modalMonto, setModalMonto] = useState(false);
    const [modalRechazo, setModalRechazo] = useState(false);
    const [modalAvisoGenerico, setModalAvisoGenerico] = useState(false);
    const [textoAvisoGenerico, setTextoAvisoGenerico] = useState(false);

    const [modalCambioBandeja, setModalCambioBandeja] = useState(false);
    const [modalResolucionSocio, setModalResolucionSocio] = useState(false);
    const [modalSeguimientoTC, setModalSeguimientoTC] = useState(false);
    const [faltaComentariosAsesor, setFaltaComentariosAsesor] = useState(false);
    const [isBtnComentariosActivo, setIsBtnComentariosActivo] = useState(false)
    const [textoModal, setTextoModal] = useState("");
    const [isDecisionHabilitada, setIsDecisionHabilitada] = useState(false);
    const [isMontoAprobarse, setIsMontoAprobarse] = useState(false);
    const [isRechazaComite, setIsRechazaComite] = useState(false);
    const [accionesSolicitud, setAccionesSolicitud] = useState([{ image: "", textPrincipal: "Información de solicitud", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Documentos", textSecundario: "", key: 2 }]);
    const [accionSeleccionada, setAccionSeleccionada] = useState(1);
    const [nuevoMonto, setNuevoMonto] = useState(0);
    const [selectCambioEstadoSol, setSelectCambioEstadoSol] = useState("-1");
    const [selectMotivoRetornoBanj, setSelectMotivoRetornoBanj] = useState("-1");
    const [selectMotivoNiegaSolComite, setSelectMotivoNiegaSolComite] = useState("-1");
    const [selectMotivoNiegaSocio, setSelectMotivoNiegaSocio] = useState("-1");

    const [selectResolucionSocio, setSelectResolucionSocio] = useState("-1");
    const [flujoSolId, setFlujoSolId] = useState(0);
    const [montoAprobado, setMontoAprobado] = useState(0);

    const [comentarioCambioEstado, setComentarioCambioEstado] = useState("");
    const [comentarioResolucionSocio, setComentarioResolucionSocio] = useState("");
    const [valorDecisionSelect, setValorDecisionSelect] = useState("-1");
    const [isActivoBtnDecision, setIsActivoBtnDecision] = useState(true);
    const [isBtnDisableCambioBandeja, setIsBtnDisableCambioBandeja] = useState(true);
    const [isBtnResolucionSocio, setIsBtnResolucionSocio] = useState(true);
    const [isDisableBtnGuardarNuevoCupo, setIsDisableBtnGuardarNuevoCupo] = useState(true);

    const [swithcEsMicrocredito, setSwithcEsMicrocredito] = useState(false);
    const [estadoAccordionSeguimiento, setEstadoAccordionSeguimiento] = useState(false);
    const [estadoLoadingSeguimiento, setEstadoLoadingSeguimiento] = useState(false);

    //DATOS DEL USUARIO
    const [datosUsuario, setDatosUsuario] = useState([]);

    //Datos del socio
    const [datosSocio, setDatosSocio] = useState();



    //Axentria
    const [separadores, setSeparadores] = useState([]);


    //PARAMETROS REQUERIDOS
    const [parametrosTC, setParametrosTC] = useState([]);

    const [estadosDecisionComite, setEstadosDecisionComite] = useState([]);
    const [estadosDecBanjComiteAll, setEstadosDecBanjComiteAll] = useState([]);
    const [estadosRetornaBandejaComite, setEstadosRetornaBandejaComite] = useState([]);
    const [estadosRetornaComiteAll, setEstadosRetornaComiteAll] = useState([]);
    const [estadosRetornaBandejaJefUac, setEstadosRetornaBandejaJefUac] = useState([]);
    const [estadosRetornaJefeUacAll, setEstadosRetornaJefeUacAll] = useState([]);
    const [estadosSigConfirmPorMontoMenor, setEstadosSigConfirmPorMontoMenor] = useState([]);
    const [estadosSigConfirmPorMontoMenorAll, setEstadosSigConfirmPorMontoMenorAll] = useState([]);

    const [permisoAccionAnalisis3CsAll, setPermisoAccionAnalisis3CsAll] = useState([]);
    const [permisoAccionAnalisis3Cs, setPermisoAccionAnalisis3Cs] = useState([]);
    const [permisoImprimirMedio, setPermisoImprimirMedio] = useState([]);
    const [permisoImprimirMedioAll, setPermisoImprimirMedioAll] = useState([]);

    const [estadosPuedenRegresarBandejaAll, setEstadosPuedenRegresarBandejaAll] = useState([]);
    const [estadosPuedenRegresarBandeja, setEstadosPuedenRegresarBandeja] = useState([]);


    const [motivosNegacionComite, setMotivosNegacionComite] = useState([]);
    const [motivosRegresaAntBandeja, setMotivosRegresaAntBandeja] = useState([]);
    const [motivosNegacionSocio, setMotivosNegacionSocio] = useState([]);

    const [toggleResetIndex, setToggleResetIndex] = useState(1);

    const [controlMontoMinimoParametro, setControlMontoMinimoParametro] = useState(0);

    const seleccionAccionSolicitud = (value) => {
        const accionSelecciona = accionesSolicitud.find((element) => { return element.key === value });
        //console.log(accionSelecciona);
        setToggleResetIndex(value)
        setAccionSeleccionada(accionSelecciona.key);
    }


    const headerTableResoluciones = [
        { nombre: 'Usuario', key: 0 }, { nombre: 'Fecha actualización', key: 1 }, { nombre: "Decisión", key: 2 }, { nombre: "Observación", key: 3 }
    ];

    const estadoSolicitud = useRef('');


    useEffect(() => {

        //Obtener datos del cliente
        fetchInfoSocio(props.solicitud.cedulaPersona, props.token, (data) => {

            //console.log("BUSQ SOCI AXEN ", props.solicitud.cedulaPersona)
            //console.log("Infor USUARIO ", data)
            setDatosSocio(data.datos_cliente[0]);
        }, dispatch);


        fetchGetFlujoSolicitud(props.solicitud.solicitud, props.token, (data) => {
            if (data.flujo_solicitudes.length > 0) {
                setLstSeguimientoTC(data.flujo_solicitudes);
                const arrayDeValores = data.flujo_solicitudes.map(objeto => objeto.int_flujo_id);
                const valorMaximo = Math.max(...arrayDeValores);
                const datosSolicitud = data.flujo_solicitudes.find(solFlujo => solFlujo.int_flujo_id === valorMaximo);
                setFlujoSolId(datosSolicitud.int_flujo_id);
                setSolicitudTarjeta(...[datosSolicitud]);
                setMontoAprobado(datosSolicitud.str_cupo_solicitado);
                estadoSolicitud.current = datosSolicitud.str_estado_actual;
                if (datosSolicitud?.int_microcredito === 0 || datosSolicitud?.int_microcredito === 1) {
                    let esMicroCredito = datosSolicitud.int_microcredito === 0 ? false : true;
                    setSwithcEsMicrocredito(esMicroCredito)
                }
                

                //console.log(datosSolicitud.str_cupo_sugerido_coopmego)
                //console.log(Number(datosSolicitud?.str_cupo_sugerido_coopmego))

                //(datosSolicitud?.str_cupo_sugerido_aval))
                //console.log(datosSolicitud.str_cupo_sugerido_coopmego) 
            }
        }, dispatch);

        fetchGetInforme(props.solicitud.solicitud, props.solicitud.idSolicitud, props.token, (data) => {
            setInforme(data.lst_informe);
            //existeComentariosVacios(data.lst_informe);
            //console.log("INFORME",data.lst_informe);

        }, dispatch);
        fetchGetResolucion(props.solicitud.solicitud, props.token, (data) => {
            setResoluciones(data.lst_resoluciones);
            //console.log("Resoluciones", data);
        }, dispatch);
        fetchGetSeparadores(props.token, (data) => {
            //console.log("RES, ", data.lst_separadores)
            setSeparadores(data.lst_separadores);
        }, dispatch);


        //OBTENER DATOS DEL USUARIO
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));
        const userOficial = get(localStorage.getItem('sender'));
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial }]);


        //console.log("PROPS parametrosTC", props.parametrosTC.lst_parametros)
        if (props.parametrosTC.lst_parametros?.length > 0) {
            let ParametrosTC = props.parametrosTC.lst_parametros;
            setParametrosTC(ParametrosTC
                .filter(param => param.str_nombre === 'ESTADOS_SOLICITUD_TC')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_nombre: estado.str_nombre,
                    prm_nemonico: estado.str_nemonico,
                    prm_valor_ini: estado.str_valor_ini,
                    prm_valor_fin: estado.str_valor_fin
                })));

            /*PARAMETRO PARA CONTROL DE CUPO MINIMO A SOLICITAR EN TARJETA DE CRÉDITO*/
            setControlMontoMinimoParametro(Number(ParametrosTC.filter(param => param.str_nemonico === 'PRM_WS_TC_CUPO_MINIMO_SOL_TC')[0]?.str_valor_ini));

            /* ESTADOS PARA DECISION FINAL DEL COMITE */
            setEstadosDecBanjComiteAll(ParametrosTC
                .filter(param => param.str_nombre === 'HABILITA_DECISION_APRUEBA_SOLICITUD')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini,
                    estados: estado.str_valor_fin
                })));

            /* ESTADOS PARA RETORNAR BANDEJA PARA EL COMITE */
            setEstadosRetornaComiteAll(ParametrosTC //RETORNO_ESTADO_BANDEJA_TC
                .filter(param => param.str_nemonico === 'RET_EST_BAN_TC_COM') //RET_EST_BAN_TC_COM  RET_EST_BAN_TC_JEF_UAC  RET_EST_BAN_TC_RIE
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini,
                    estados: estado.str_valor_fin
                })));

            /* ESTADOS PARA RETORNAR BANDEJA PARA EL JEFE UAC */
            setEstadosRetornaJefeUacAll(ParametrosTC 
                .filter(param => param.str_nemonico === 'RET_EST_BAN_TC_JEF_UAC') 
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini,
                    estados: estado.str_valor_fin
                })));

            /* PERMISOS EN ESTADOS PARA IMPRIMIR MEDIO DE APROBACION */
            setPermisoImprimirMedioAll(ParametrosTC
                .filter(param => param.str_nombre === 'IMPRIMIR_MEDIO_APROBACION_TC')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini
                })));

            /* ESTADOS SIGUIENTES CUANDO SOLICITUD ESTA EN VERIFICAR SOCIO POR MONTO MENOR APROBADO */
            setEstadosSigConfirmPorMontoMenorAll(ParametrosTC
                .filter(param => param.str_nombre === 'APROBACION_SOLICITUD_MONTO_MENOR')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini,
                    estados: estado.str_valor_fin
                })));


            setPermisoAccionAnalisis3CsAll(ParametrosTC
                .filter(param => param.str_nombre === 'HABILITA_ANALISIS_3Cs')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini
                })));

            setEstadosPuedenRegresarBandejaAll(ParametrosTC
                .filter(param => param.str_nombre === 'ESTADO_AUTORIZADOS_REGRESAR_BANDEJA')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini
                })));

            //Obtener motivos 
            fetchGetMotivos(props.token, (data) => {
                setMotivosNegacionComite(data?.lst_motivos?.filter(motivos => motivos.str_nombre === "MOTIVOS_NEGACION_COMITE_TC"));
                setMotivosRegresaAntBandeja(data?.lst_motivos?.filter(motivosReg => motivosReg.str_nombre === "MOTIVOS_REGRESA_TC"));
                setMotivosNegacionSocio(data?.lst_motivos?.filter(motivosReg => motivosReg.str_nombre === "MOTIVOS_NEGACION_SOCIO_TC"));

            }, dispatch);
        }

        fetchGetFuncionalidadesTC(props.token, (data) => {
            console.log("lst_funcSettings ", data.lst_funcSettings)
        }, dispatch)

    }, []);


    const actualizaInformaFlujoSol = () => {
        fetchGetFlujoSolicitud(props.solicitud.solicitud, props.token, (data) => {
            if (data.flujo_solicitudes.length > 0) {
                const arrayDeValores = data.flujo_solicitudes.map(objeto => objeto.int_flujo_id);
                const valorMaximo = Math.max(...arrayDeValores);
                const datosSolicitud = data.flujo_solicitudes.find(solFlujo => solFlujo.int_flujo_id === valorMaximo);
                setFlujoSolId(datosSolicitud.int_flujo_id);
                setSolicitudTarjeta(...[datosSolicitud]);
                //console.log(" SOL, ", datosSolicitud)
                setMontoAprobado(datosSolicitud.str_cupo_solicitado);
            }

        }, dispatch);
    }


    const validaNombreParam = (estadoNombre) => {

        //console.log("ESTADO ENTRA ", estadoNombre)
        if (parametrosTC.length > 0) {
            //const parametro = parametros.find(param => Number(param.prm_id) === Number(id));
            let parametro = parametrosTC.find(param => param.prm_valor_ini === estadoNombre);
            return parametro;
        } else {
            window.alert("ERROR EN CARGA DE PARAMETROS, COMUNICATE CON EL ADMINISTRADOR");
        }
    }


    /** SECCION OBTENER LOS PARAMETROS DEL STORAGE */
    useEffect(() => {
        if (estadosDecBanjComiteAll.length > 0) {
            //console.log(estadosDecBanjComiteAll)
            let arrEstados = estadosDecBanjComiteAll.find((parametr) => (parametr.prm_valor_ini) === props.solicitud.estado)
            //console.log("ARR_EST ", arrEstados)
            if (arrEstados) {
                const estadosSiguientes = arrEstados.estados.split('|');
                setEstadosDecisionComite(estadosSiguientes);
                //console.log("RESP ", estadosSiguientes)
            } else {
                // Handle the case when arrEstados is not found
                setEstadosDecisionComite([]);
                setIsDecisionHabilitada(true);
            }
        }
    }, [estadosDecBanjComiteAll])


    useEffect(() => {
        if (estadosRetornaComiteAll.length > 0) {
            //console.log(estadosRetornaComiteAll)
            let arrEstados = estadosRetornaComiteAll.find((parametr) => (parametr.prm_valor_ini) === props.solicitud.estado)
            //console.log("ARR_EST ", arrEstados)
            if (arrEstados) {
                const estadosSiguientes = arrEstados.estados.split('|');
                setEstadosRetornaBandejaComite(estadosSiguientes);
                //  console.log("RESP ", estadosSiguientes)
            } else {
                setEstadosRetornaBandejaComite([]);
            }
        }
    }, [estadosRetornaComiteAll])


    useEffect(() => {
        if (estadosRetornaJefeUacAll.length > 0) {
            let arrEstados = estadosRetornaJefeUacAll.find((parametr) => (parametr.prm_valor_ini) === props.solicitud.estado)
            if (arrEstados) {
                const estadosSiguientes = arrEstados.estados.split('|');
                setEstadosRetornaBandejaJefUac(estadosSiguientes);
                //  console.log("RESP ", estadosSiguientes)
            } else {
                setEstadosRetornaBandejaJefUac([]);
            }
        }
    }, [estadosRetornaJefeUacAll])


    useEffect(() => {
        if (permisoImprimirMedioAll.length > 0) {
            //console.log(permisoImprimirMedioAll)
            const estadosImprimirMedio = permisoImprimirMedioAll[0].prm_valor_ini.split('|');
            setPermisoImprimirMedio(estadosImprimirMedio);
        }
    }, [permisoImprimirMedioAll])


    useEffect(() => {
        if (estadosSigConfirmPorMontoMenorAll.length > 0) {
            console.log(estadosSigConfirmPorMontoMenorAll)
            let arrEstados = estadosSigConfirmPorMontoMenorAll.find((parametr) => (parametr.prm_valor_ini) === props.solicitud.estado)
            //console.log("ARR_EST ", arrEstados)
            if (arrEstados) {
                const estadosSiguientes = arrEstados.estados.split('|');
                setEstadosSigConfirmPorMontoMenor(estadosSiguientes);
                //console.log("RESP ", estadosSiguientes)
            } else {
                setEstadosSigConfirmPorMontoMenor([]);
            }
        }
    }, [estadosSigConfirmPorMontoMenorAll])


    useEffect(() => {
        if (permisoAccionAnalisis3CsAll.length > 0) {
            const permisosVerAnalisis3Cs = permisoAccionAnalisis3CsAll[0].prm_valor_ini.split('|');
            setPermisoAccionAnalisis3Cs(permisosVerAnalisis3Cs);
        }
    }, [permisoAccionAnalisis3CsAll])

    useEffect(() => {
        if (estadosPuedenRegresarBandejaAll.length > 0) {
            //console.log(permisoImprimirMedioAll)
            const estadosRegresanBandeja = estadosPuedenRegresarBandejaAll[0].prm_valor_ini.split('|');
            setEstadosPuedenRegresarBandeja(estadosRegresanBandeja);
        }
    }, [estadosPuedenRegresarBandejaAll])

    /** FIN SECCION OBTENER LOS PARAMETROS DEL STORAGE */

    const comentarioAdicionalHanlder = (data, event) => {
        const id = informe.findIndex((comentario) => { return comentario.int_id_parametro === event });
        const comentarioActualizado = [...informe]
        comentarioActualizado[id].str_detalle = data;
        setInforme(comentarioActualizado)

        //existeComentariosVacios(comentarioActualizado);

    }

    const setComentarioSolicitudHandler = (data) => {
        setComentarioSolicitud(data);
    }
    const setObservacionComiteHandler = (data) => {
        setObservacionComite(data);
    }

    const modalHandler = () => {
        //console.log("clicked!!")
        setModalVisible(true);
    }

    const siguientePasoHandler = () => {
       
        fetchAddComentarioAsesor(props.solicitud.solicitud, informe, props.solicitud.idSolicitud, props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setFaltaComentariosAsesor(false);
                setModalVisible(false);
            }
        }, dispatch);
        /*
        if (!existeComentariosVacios(informe)) {
            //console.log(comentariosAsesor);
            fetchAddComentarioAsesor(props.solicitud.solicitud, informe, props.solicitud.idSolicitud, props.token, (data) => {
                if (data.str_res_codigo === "000") {
                    setFaltaComentariosAsesor(false);
                    setModalVisible(false);
                }
            }, dispatch);

        } else {
            setIsBtnComentariosActivo(false);
        }*/
    }

    const closeModalHandler = () => {
        setModalVisible(false);
    }


    const validarInforme = async () => {
        let tieneCamposIncompletos = false;


        //  VALIDACION PARA QUE EL INFORME ESTE LLENO ANTES DE PASO DE BANDEJA
        if (solicitudTarjeta?.str_estado_actual === "CREADA" ||  solicitudTarjeta?.str_estado_actual === "POR ANALIZAR" || solicitudTarjeta?.str_estado_actual === "POR REVISAR JEFE UAC") {
            
            await fetchGetInforme(props.solicitud.solicitud, props.solicitud.idSolicitud, props.token, (data) => {
                let arrayInforme = data.lst_informe;
                arrayInforme.forEach(comentario => {
                    if (tieneCamposIncompletos === true) {
                        return tieneCamposIncompletos;
                    }
                    if (comentario.str_detalle.trim() === "") {
                        tieneCamposIncompletos = true;
                    }
                })
            }, dispatch);
        } else {
            tieneCamposIncompletos = false;
        }        
        return tieneCamposIncompletos;        
    }

    const guardarComentarioSiguiente = async () => {
        let nemonico = parametrosTC.find(param => param.prm_valor_ini === props.solicitud.estado)
        let validacionInforme = await validarInforme();

        if (nemonico && validacionInforme === false) {
            fetchAddComentarioSolicitud(props.solicitud.solicitud, comentarioSolicitud, props.solicitud.idSolicitud, false, swithcEsMicrocredito, props.token, (data) => {
                if (data.str_res_codigo === "000") {
                    fetchAddResolucion(props.solicitud.solicitud, solicitudTarjeta?.str_cupo_solicitado, datosUsuario[0].strOficial, '', comentarioSolicitud, nemonico.prm_nemonico, props.token, (data) => {
                        setModalVisibleOk(true);
                        setTextoModal("Su comentario se guardo con éxito.");
                        //navigate.push('/solicitud');
                    }, dispatch)
                }
            }, dispatch);
        }
        else {
            //window.alert("Error en el proceso de cambio de bandeja, por favor comuniquese con el administrador");
            setTextoAvisoGenerico("Se requiere que previamente se complete el información de las C's y se guarde.");
            setModalAvisoGenerico(true);
        }
    }

    /*
    function existeComentariosVacios(arregloComentarios) {
        if (arregloComentarios.find(comentario => comentario.str_detalle.trim() === "")) {
            //setIsBtnComentariosActivo(true) //Comentarios faltan rellenar
            return true;
        } else {
            //setIsBtnComentariosActivo(false) //Comentarios completos
            return false;
        }

    }*/


    const descargarMedio = (numSolicitud) => {
        //console.log("Num Sol,", numSolicitud)

        fetchGetMedioAprobacion(solicitudTarjeta?.str_estado_actual, props.solicitud.solicitud, props.solicitud.cedulaPersona, props.token, (data) => {
            //console.log("RESP MEDIO", data)
            if (data.str_res_codigo === "000" && verificarPdf(data.str_med_apro_bas_64)) {
                const blob = base64ToBlob(data.str_med_apro_bas_64, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `MedioAprobacionTC_Sol${numSolicitud}_${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo, 'pdf', false);
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
        retornarSolicitud();

    }
    const getDecision = (event) => {
        setObservacionComite("");
        setValorDecisionSelect(event.target.value);
        if (event.target.value === "EST_APROBADA") {// || Number(event.target.value) === 11278) { //APROBADO o VERIFICAR SOCIO
            setIsMontoAprobarse(true);
            setIsRechazaComite(false);
        }
        else if (event.target.value === "EST_RECHAZADA") {
            setIsRechazaComite(true);
            setIsMontoAprobarse(false);
        } else {
            setIsMontoAprobarse(false);
            setIsRechazaComite(false);
        }
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
                actualizaInformaFlujoSol();
            }
        }, dispatch);
    }

    const nuevoMontoHandler = (value) => {
        setNuevoMonto(value);
    }

    /*CONTROLAR QUE PUEDA ACTUALIZA EL CUPO POR MENOS MONTO DEL SOLICITADO POR EL SOCIO*/ 
    useEffect(() => {
        if (Number(nuevoMonto) >= Number(controlMontoMinimoParametro) && Number(nuevoMonto) <= Number(solicitudTarjeta.str_cupo_solicitado)) {
            setIsDisableBtnGuardarNuevoCupo(false);
        } else {
            setIsDisableBtnGuardarNuevoCupo(true);
        }

    }, [nuevoMonto])


    const cambioMotivoRetornoBandeja = (e) => {
        setSelectMotivoRetornoBanj(e.target.value);
    }

    const cambioMotivoNiegaComite = (e) => {
        setSelectMotivoNiegaSolComite(e.target.value);
    }
    const cambioMotivoNiegaSocio = (e) => {
        setSelectMotivoNiegaSocio(e.target.value);
    }



    const cambiarEstadoSolHandler = (e) => {
        setSelectCambioEstadoSol(e.target.value);
    }

    const cambioEstadoBandeja = () => {

        //let descripcionMotivoRetorno = motivosRegresaAntBandeja.find(motivo => motivo.str_nemonico === selectMotivoRetornoBanj);
        let nemonico = parametrosTC.find(param => param.prm_valor_ini === props.solicitud.estado)
        if (selectMotivoRetornoBanj !== undefined && nemonico !== undefined) {
          //  descripcionMotivoRetorno = descripcionMotivoRetorno.str_descripcion

            //Comite retorna a un estado de bandeja especifica para POR APROBAR SOLICITUD
            if (solicitudTarjeta?.str_estado_actual === "POR APROBAR SOLICITUD" || solicitudTarjeta?.str_estado_actual === "POR REVISAR JEFE UAC") {
                console.log("PRUEBA POR REVISAR JEFE UA")
                //let comentario = solicitudTarjeta?.str_estado_actual === "POR REVISAR JEFE UAC" ? observacionComite : '';
                fetchAddProcEspecifico(props.solicitud.solicitud, 0, selectCambioEstadoSol, comentarioCambioEstado, props.token, (data) => {
                    if (data.str_res_codigo === "000") {
                        setModalCambioBandeja(false);
                        setModalVisibleOk(true);
                        setTextoModal("Su comentario se guardo con éxito.");
                        //navigate.push('/solicitud');               
                    }
                }, dispatch)

            } else { //Otros perfiles solo retornan a bandeja anterior
                //Variable true para retornar bandeja anterior
                fetchAddComentarioSolicitud(props.solicitud.solicitud, comentarioCambioEstado, props.solicitud.idSolicitud, true, swithcEsMicrocredito, props.token, (data) => {
                    //navigate.push('/solicitud');
                    setModalCambioBandeja(false);
                    setModalVisibleOk(true);
                    setTextoModal("Su comentario se guardo con éxito.");
                }, dispatch);
            }
        } else {
            window.alert("Error en el proceso de cambio de bandeja, por favor comuniquese con el administrador");
        }

    }

    const closeModalResolucionSocio = () => {
        setModalResolucionSocio(false);
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

    const closeModalAvisoGenerico = () => {
        setTextoAvisoGenerico("");
        setModalAvisoGenerico(false);
    }

    const [trimed, setTrimed] = useState(false);

    const verMas = (index) => {
        setTrimed(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    }

    useEffect(() => {
        if (selectResolucionSocio !== "" && selectResolucionSocio !== "-1" && comentarioResolucionSocio !== "") {
            if (selectResolucionSocio === "EST_RECHAZADA" && selectMotivoNiegaSocio !== "" && selectMotivoNiegaSocio !== "-1") {
                setIsBtnResolucionSocio(false);
            } else if (selectResolucionSocio !== "EST_RECHAZADA") {
                setIsBtnResolucionSocio(false);
            }
            else {
                setIsBtnResolucionSocio(true);
            }
        } else {
            setIsBtnResolucionSocio(true);
        }
    }, [selectResolucionSocio, selectMotivoNiegaSocio, comentarioResolucionSocio])


    useEffect(() => {

        if (selectMotivoRetornoBanj !== "" && selectMotivoRetornoBanj !== "-1" && comentarioCambioEstado !== "") {
            if ((solicitudTarjeta?.str_estado_actual === "POR APROBAR SOLICITUD" || solicitudTarjeta?.str_estado_actual === "POR REVISAR JEFE UAC" )&& selectCambioEstadoSol !== "" && selectCambioEstadoSol !== "-1") {
                setIsBtnDisableCambioBandeja(false);
            } else if (solicitudTarjeta?.str_estado_actual !== "POR APROBAR SOLICITUD" && solicitudTarjeta?.str_estado_actual !== "POR REVISAR JEFE UAC") {
                setIsBtnDisableCambioBandeja(false);
            } else {
                setIsBtnDisableCambioBandeja(true);
            }

        } else {
            setIsBtnDisableCambioBandeja(true);
        }
    }, [selectMotivoRetornoBanj, selectCambioEstadoSol, comentarioCambioEstado])


    useEffect(() => {
        if (comentarioSolicitud !== "") {
            setFaltaComentariosAsesor(false);
        } else {
            setFaltaComentariosAsesor(true);
        }
    }, [comentarioSolicitud])



    const rechazarSolicitudHandler = () => {
        //let descripcionMotivoRechazoComite = motivosNegacionComite.find(motivo => motivo.str_nemonico === selectMotivoNiegaSolComite);
        //if (descripcionMotivoRechazoComite !== undefined) {
        //    descripcionMotivoRechazoComite = descripcionMotivoRechazoComite.str_descripcion
        fetchAddProcEspecifico(props.solicitud.solicitud, 0, "EST_RECHAZADA", observacionComite, props.token, (data) => { //EST_RECHAZADA 11277
                if (data.str_res_codigo === "000") {
                    setModalRechazo(false);

                    let decision = parametrosTC.find(param => param.prm_nemonico === "EST_RECHAZADA")
                    let parametroDecNec = parametrosTC.find(param => param.prm_valor_ini === props.solicitud.estado)
                    fetchAddResolucion(props.solicitud.solicitud, solicitudTarjeta?.str_cupo_solicitado, datosUsuario[0].strOficial, decision.prm_valor_ini, observacionComite, parametroDecNec.prm_nemonico, props.token, (data) => {
                        setModalRechazo(false);
                        setModalVisibleOk(true);
                        setTextoModal("Su comentario se guardo con éxito.");
                    }, dispatch)
                }
            }, dispatch)
        ///}

    }
    const guardarDecisionComiteHandler = () => {
        let validaCupo = controlMontoAprobado();

        if (valorDecisionSelect === "EST_RECHAZADA") { // EST_RECHAZADA
            setModalRechazo(true);
            return;
        }

        /*VALIDACIONES PARA CUANDO ES APROBADA*/
        //Si cupo que se va aprobar es el mismo que el socio solicito
        if (valorDecisionSelect === "EST_APROBADA" && validaCupo.estadoSig === "EST_APROBADA") { //APROBADO

            fetchAddProcEspecifico(props.solicitud.solicitud, solicitudTarjeta.str_cupo_solicitado, "EST_APROBADA", observacionComite, props.token, (data) => { //APROBADO 11276
                if (data.str_res_codigo === "000") {
                    let decision = parametrosTC.find(param => param.prm_nemonico === valorDecisionSelect)
                    let parametroDecNec = parametrosTC.find(param => param.prm_valor_ini === props.solicitud.estado)
                    fetchAddResolucion(props.solicitud.solicitud, solicitudTarjeta?.str_cupo_solicitado, datosUsuario[0].strOficial, decision.prm_valor_ini, observacionComite, parametroDecNec.prm_nemonico, props.token, (data) => {
                        setModalVisibleOk(true);
                        setTextoModal("Su comentario se guardo con éxito.");
                    }, dispatch)


                }
            }, dispatch)
        }
        //Si cupo que se va aprobar es menor al que solicita el socio
        else if (valorDecisionSelect === "EST_APROBADA" && validaCupo.estadoSig === "EST_VERIFICAR_SOCIO") { //VERIFICAR SOCIO
            fetchAddProcEspecifico(props.solicitud.solicitud, Number.parseFloat(montoAprobado).toFixed(2), "EST_VERIFICAR_SOCIO", observacionComite, props.token, (data) => { //VERIFICAR SOCIO 11278
                if (data.str_res_codigo === "000") {
                    let decision = parametrosTC.find(param => param.prm_nemonico === valorDecisionSelect)
                    let parametroDecNec = parametrosTC.find(param => param.prm_valor_ini === props.solicitud.estado)
                    fetchAddResolucion(props.solicitud.solicitud, solicitudTarjeta?.str_cupo_solicitado, datosUsuario[0].strOficial, decision.prm_valor_ini, observacionComite, parametroDecNec.prm_nemonico, props.token, (data) => {
                        setModalVisibleOk(true);
                        setTextoModal("Su comentario se guardo con éxito.");
                    }, dispatch)

                    navigate.push('/solicitud');
                }
            }, dispatch)
        }
    }


    const controlMontoAprobado = () => {
        let controlBool = {
            validador: false,
            estadoSig: "0"
        }

        if ((Number.parseFloat(solicitudTarjeta?.str_cupo_solicitado) === Number.parseFloat(montoAprobado)) && valorDecisionSelect === "EST_APROBADA") {
            controlBool.validador = true;
            controlBool.estadoSig = "EST_APROBADA" // EST_APROBADA (COMITE)
        } else if (Number.parseFloat(montoAprobado) > 0 && (Number.parseFloat(montoAprobado) < Number.parseFloat(solicitudTarjeta?.str_cupo_solicitado)) && valorDecisionSelect === "EST_APROBADA") {
            controlBool.validador = true;
            controlBool.estadoSig = "EST_VERIFICAR_SOCIO" // EST_VERIFICAR_SOCIO (SE VA HACIA ASESOR CREDITO NUEVAMENTE)
        } else if (Number.parseFloat(montoAprobado) > Number.parseFloat(solicitudTarjeta?.str_cupo_solicitado)) {
            controlBool.validador = false;
            controlBool.estadoSig = "0" // NO ES POSIBLE PASAR BANDEJA
        }
        return controlBool;
    }


    useEffect(() => {
        /* VALIDACION  OBSERVACION*/
        if (observacionComite?.trim() !== "" && valorDecisionSelect === "EST_RECHAZADA") {
            setIsActivoBtnDecision(false);
        } else if (valorDecisionSelect === "EST_APROBADA" && montoAprobado !== null && Number(montoAprobado) >= Number(controlMontoMinimoParametro)) {
            setIsActivoBtnDecision(false);
        } else {
            setIsActivoBtnDecision(true);
            return;
        }
        /* VALIDACION  PARA NEGAR SOLICITU COMITE
        if (valorDecisionSelect === "EST_RECHAZADA") { //EST_RECHAZADA
            if (selectMotivoNiegaSolComite !== "-1" && selectMotivoNiegaSolComite !== "" && observacionComite !== "") {
                setIsActivoBtnDecision(false);
            }
            else {
                setIsActivoBtnDecision(true);
            }
            return
        }*/

        /* VALIDACION  PARA APROBACION COMITE*/
        let validaCupo = controlMontoAprobado();

        if (Number.parseFloat(montoAprobado) > Number.parseFloat(solicitudTarjeta?.str_cupo_solicitado) || montoAprobado.length > 9) {
            setIsActivoBtnDecision(true);
            return
        }

        else if (valorDecisionSelect !== "-1" && montoAprobado > 0 && validaCupo.validador) {//observacionComite !== "" && 
            if (valorDecisionSelect === "EST_APROBADA" && validaCupo.estadoSig === "EST_APROBADA") {// EST_APROBADA 11276
                setIsActivoBtnDecision(false);
            } else if (valorDecisionSelect === "EST_APROBADA" && validaCupo.estadoSig === "EST_VERIFICAR_SOCIO") { //EST_VERIFICAR_SOCIO 11278 por cupo inferior 
                setIsActivoBtnDecision(false);
            } 
        }
    }, [valorDecisionSelect, montoAprobado, observacionComite, controlMontoAprobado])





    const openModalResolucionSocio = () => {
        setModalResolucionSocio(!modalResolucionSocio);
    }

    const selectResolucionSociolHandler = (e) => {
        setSelectResolucionSocio(e.target.value);
    } 

    const guardarResolucionSocio = () => {
        if (selectResolucionSocio === "EST_APROBADA_CLIENTE") {
            fetchAddProcEspecifico(props.solicitud.solicitud, solicitudTarjeta.str_cupo_aprobado, "EST_APROBADA_CLIENTE", comentarioResolucionSocio, props.token, (data) => {
                if (data.str_res_codigo === "000") {

                    let decision = parametrosTC.find(param => param.prm_nemonico === selectResolucionSocio)
                    let parametroDecNec = parametrosTC.find(param => param.prm_valor_ini === props.solicitud.estado)
                    fetchAddResolucion(props.solicitud.solicitud, solicitudTarjeta?.str_cupo_aprobado, datosUsuario[0].strOficial, decision.prm_valor_ini, comentarioResolucionSocio, parametroDecNec.prm_nemonico, props.token, (data) => {
                        setModalResolucionSocio(false);
                        setModalVisibleOk(true);
                        setTextoModal("Su comentario se guardo con éxito.");
                    }, dispatch)


                }
            }, dispatch)

        } else if (selectResolucionSocio === "EST_RECHAZADA") {
            let descripcionMotivoRechazaSocio = motivosNegacionSocio.find(motivo => motivo.str_nemonico === selectMotivoNiegaSocio);
            if (selectMotivoNiegaSocio !== undefined) {
                descripcionMotivoRechazaSocio = descripcionMotivoRechazaSocio.str_descripcion
                fetchAddProcEspecifico(props.solicitud.solicitud, solicitudTarjeta.str_cupo_aprobado, "EST_RECHAZADA", descripcionMotivoRechazaSocio, props.token, (data) => { 
                    if (data.str_res_codigo === "000") {
                        let decision = parametrosTC.find(param => param.prm_nemonico === selectResolucionSocio)
                        let parametroDecNec = parametrosTC.find(param => param.prm_valor_ini === props.solicitud.estado)
                        fetchAddResolucion(props.solicitud.solicitud, solicitudTarjeta?.str_cupo_aprobado, datosUsuario[0].strOficial, decision.prm_valor_ini, comentarioResolucionSocio, parametroDecNec.prm_nemonico, props.token, (data) => {
                            setModalResolucionSocio(false);
                            setModalVisibleOk(true);
                            setTextoModal("Su comentario se guardo con éxito.");
                        }, dispatch)

                    }
                }, dispatch)
            }
        }
    }

    const changeEstadoModalSeguimiento = () => {
        setModalSeguimientoTC(!modalSeguimientoTC);
    }


    /*
    //Control para el numero de filas del text area
    useEffect(() => {
        let filasActuales = comentarioSolicitud.split('\n');
        if (filasActuales.length >= 3) setFilasTextAreaComentarioSol(filasActuales.length + 1);
        else if (filasActuales.length < 3) setFilasTextAreaComentarioSol(3);
    }, [comentarioSolicitud])*/

    return <div className="f-row w-100" >
        {/*<Sidebar enlace={props.location.pathname}></Sidebar>*/}
        <Card className={["w-100"]}>
            <Toggler
                selectedToggle={seleccionAccionSolicitud}
                toggles={accionesSolicitud}
                toggleReset={toggleResetIndex}
            >
            </Toggler>

            {
                accionSeleccionada === 1 &&
                <>

                    {
                        (solicitudTarjeta?.str_estado_actual === "APROBADA" || solicitudTarjeta?.str_estado_actual === "APROBADA SOCIO")
                            ?
                            <Card className={["w-100 justify-content-space-between align-content-center"]}>
                                <div>
                                    <Card className={["f-row"]}>
                                        <Item xs={5} sm={5} md={5} lg={5} xl={5}>
                                            <div className="values  mb-3">
                                                <h4>Socio:</h4>
                                                <h4 className="strong">
                                                    {datosSocio?.str_nombres} {datosSocio?.str_apellido_paterno} {datosSocio?.str_apellido_materno}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Cédula:</h4>
                                                <h4 className="strong">
                                                    {props.solicitud.cedulaPersona}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Oficina:</h4>
                                                <h4 className="strong">
                                                    {props.solicitud.oficinaSolicitud}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Oficial:</h4>
                                                <h4 className="strong">
                                                    {`${solicitudTarjeta?.str_usuario_proc}`}
                                                </h4>
                                            </div>

                                            <div className="values  mb-3">
                                                <h4>Estado de la solicitud:</h4>
                                                <h4 className="strong">
                                                    {`${solicitudTarjeta?.str_estado_actual}`}
                                                </h4>
                                            </div>

                                        </Item>
                                        <Item xs={2} sm={2} md={2} lg={2} xl={2}></Item>
                                        <Item xs={5} sm={5} md={5} lg={5} xl={5}>
                                            <div className="values  mb-3">
                                                <h4>Solicitud Nro:</h4>
                                                <h4 className="strong">
                                                    {`${props.solicitud.solicitud} `}
                                                </h4>
                                            </div>

                                            <div className="values  mb-3">
                                                <h4>Cupo solicitado:</h4>
                                                <h4 className="strong f-row">
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_solicitado)}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Cupo sugerido Buró:</h4>
                                                <h4 className="strong">
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_sugerido_aval)}
                                                </h4>
                                            </div>

                                            <div className="values  mb-3">
                                                <h4>Cupo sugerido CoopMego:</h4>
                                                <h4 className="strong">
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_sugerido_coopmego)}
                                                </h4>
                                            </div>

                                            <div className="values  mb-3">
                                                <h4>Cupo aprobado:</h4>
                                                <h4 className="strong">
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_aprobado)}
                                                </h4>
                                            </div>
                                        </Item>
                                    </Card>
                                                                        <Card className={["f-col"]}>
                                        <div className={["f-row"]}>
                                            <Table headers={headerTableResoluciones}>
                                                {
                                                    resoluciones.length > 0 ?

                                                        resoluciones.map((resolucion, index) => {
                                                            const fecha = new Date(resolucion?.dtt_fecha_actualizacion);
                                                            const opciones = {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit"
                                                            };
                                                            return (
                                                                <tr key={resolucion.int_rss_id}>
                                                                    <td>{resolucion.str_usuario_proc}</td>
                                                                    <td> {(fecha.toLocaleDateString('en-US', opciones))}</td>
                                                                    <td> {resolucion.str_decision_solicitud}</td>
                                                                    <td style={{ width: "50%", justifyContent: "left" }} id={index}>
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
                                                        }) :
                                                        <tr>
                                                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                                                Sin datos para mostrar
                                                            </td>
                                                        </tr>


                                                }
                                            </Table>
                                        </div>
                                        </Card>
                                </div>
                            </Card>
                            :
                            <Card className={["w-100 justify-content-space-between align-content-center"]}>
                                <div>
                                    <Card className={["f-row"]}>
                                        <Item xs={5} sm={5} md={5} lg={5} xl={5}>
                                            <div className="values  mb-3">
                                                <h4>Socio:</h4>
                                                <h4 className="strong">
                                                    {datosSocio?.str_nombres} {datosSocio?.str_apellido_paterno} {datosSocio?.str_apellido_materno}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Cédula:</h4>
                                                <h4 className="strong">
                                                    {props.solicitud.cedulaPersona}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Oficina:</h4>
                                                <h4 className="strong">
                                                    {props.solicitud.oficinaSolicitud}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Oficial:</h4>
                                                <h4 className="strong">
                                                    {`${solicitudTarjeta?.str_usuario_proc}`}
                                                </h4>
                                            </div>

                                            <div className="values  mb-3">
                                                <h4>Estado de la solicitud:</h4>
                                                <h4 className="strong">
                                                    {`${solicitudTarjeta?.str_estado_actual}`}
                                                </h4>
                                            </div>
                                        </Item>
                                        <Item xs={2} sm={2} md={2} lg={2} xl={2}></Item>
                                        <Item xs={5} sm={5} md={5} lg={5} xl={5}>

                                            <div className="values  mb-3">
                                                <h4>Solicitud Nro:</h4>
                                                <h4 className="strong">
                                                    {`${props.solicitud.solicitud}`}
                                                </h4>
                                            </div>


                                            <div className="values  mb-3">

                                                <h4>Cupo solicitado:</h4>
                                                <h4 className="strong f-row">
                                                    {solicitudTarjeta?.str_estado_actual === "CREADA" &&
                                                        <div style={{ transform: "translateY(-2px)" }}>
                                                            <Button className="btn_mg__auto mr-2" onClick={updateMonto}>
                                                                <img src="/Imagenes/edit.svg" alt="Editar cupo" style={{ width: "22px" }}></img>
                                                            </Button>
                                                        </div>
                                                        
                                                    }
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_solicitado)}
                                                </h4>
                                            </div>
                                            <div className="values  mb-3">
                                                <h4>Cupo sugerido Buró:</h4>
                                                <h4 className="strong">
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_sugerido_aval)}
                                                </h4>
                                            </div>

                                            <div className="values  mb-3">
                                                <h4>Cupo sugerido CoopMego:</h4>
                                                <h4 className="strong">
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_sugerido_coopmego)}
                                                </h4>
                                            </div>

                                            <div className="values  mb-3">
                                                <h4>Cupo aprobado:</h4>
                                                <h4 className="strong">
                                                    {numberFormatMoney(solicitudTarjeta?.str_cupo_aprobado)}
                                                </h4>
                                            </div>
                                        </Item>
                                    </Card>

                                    {/*SECCION DE BOTONES DE ACCIONES POR PERFIL*/}
                                    <Card className={["f-col"]}>
                                        {solicitudTarjeta?.str_estado_actual === "CREADA" &&
                                            <div className="mb-1 f-row justify-content-start align-content-center" style={{ minWidth: "300px" }}>
                                                <h3 className="strong mr-1">¿Es MICROCRÉDITO?</h3>
                                                <div className="f-col justify-content-center">
                                                    <Switch onChange={(valor) => setSwithcEsMicrocredito(valor)} value={swithcEsMicrocredito}></Switch>
                                                </div>
                                    
                                            </div>
                                        }
                                        <div className="f-row">

                                            {permisoAccionAnalisis3Cs.includes(solicitudTarjeta?.str_estado_actual) &&
                                                <Button className="btn_mg__primary" onClick={modalHandler}>Análisis C's</Button>
                                            }

                                            {permisoImprimirMedio.includes(solicitudTarjeta?.str_estado_actual) &&
                                                <Button className="btn_mg__primary ml-2" onClick={() => descargarMedio(props.solicitud.solicitud)}>Medio de aprobación</Button>
                                            }

                                            {estadosPuedenRegresarBandeja.includes(solicitudTarjeta?.str_estado_actual) &&
                                                <Button className="btn_mg__primary ml-2" onClick={openModalCambiarBandeja}>Devolver</Button>
                                            }

                                            {/*<>*/}
                                            {/*    <div className="values ml-1 mb-3">*/}
                                            {/*        <Button className={["btn_mg btn_mg__primary"]} onClick={openModalResolucionSocio}>Resolución socio </Button>*/}
                                            {/*    </div>*/}
                                            {/*</>*/}


                                            {/*VERIFICAR SOCIO*/}
                                            {solicitudTarjeta?.str_estado_actual === estadosSigConfirmPorMontoMenorAll[0]?.prm_valor_ini &&                                               
                                                <Button className={["btn_mg btn_mg__primary ml-2"]} onClick={openModalResolucionSocio}>Resolución socio </Button> 
                                            }
                                            <Button className={["btn_mg btn_mg__primary ml-2"]} onClick={changeEstadoModalSeguimiento}>Seguimiento </Button>
                                     

                                        </div>
                                        
                                        <Table headers={headerTableResoluciones}>
                                            {
                                                resoluciones.length > 0 ?

                                                    resoluciones.map((resolucion, index) => {
                                                        const fecha = new Date(resolucion?.dtt_fecha_actualizacion);
                                                        const opciones = {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit"
                                                        };
                                                        return (
                                                            <tr key={resolucion.int_rss_id}>
                                                                <td>{resolucion.str_usuario_proc}</td>
                                                                <td> {(fecha.toLocaleDateString('en-US', opciones))}</td>
                                                                <td> {resolucion.str_decision_solicitud}</td>
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
                                                    }) :
                                                    <tr>
                                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                                            Sin datos para mostrar
                                                        </td>
                                                    </tr>


                                            }
                                        </Table>

                                        {/*SECCION APROBAR O NEGAR POR POR APROBAR SOLICITUD*/}
                                        {solicitudTarjeta?.str_estado_actual === "POR APROBAR SOLICITUD" &&
                                            <div className={`f-row w-100 `}>
                                                <Card className={[`f-col ${isMontoAprobarse ? 'w-50 ' : 'w-100'}`]}>
                                                    <h3>Decisión</h3>
                                                    <select disabled={isDecisionHabilitada} onChange={getDecision} value={valorDecisionSelect}>
                                                        {estadosDecisionComite.length > 0
                                                            && estadosDecisionComite?.map((estado, index) => {
                                                                let estadoOriginal = ""
                                                                if (estado === "APROBAR") estadoOriginal = "APROBADA";
                                                                if (estado === "NEGAR") estadoOriginal = "RECHAZADA";
                                                                const resultado = validaNombreParam(estadoOriginal);

                                                                if (index === 0) {
                                                                    return (
                                                                        <Fragment key={index} >
                                                                            <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                                                            <option value={resultado.prm_nemonico}> {estado}</option>
                                                                        </Fragment>
                                                                    )
                                                                }
                                                                else {
                                                                    return (
                                                                        <Fragment key={index} >
                                                                            <option value={resultado.prm_nemonico}> {estado}</option>
                                                                        </Fragment>
                                                                    )
                                                                }
                                                            })}
                                                    </select>
                                                    <br />
                                                </Card>

                                                {isMontoAprobarse &&
                                                    <Card className={[`f-col w-50`]}>
                                                        <h3>Valor a aprobar</h3>
                                                        <Input
                                                            className={`${(montoAprobado === "" || montoAprobado === 0 || Number(montoAprobado) < Number(controlMontoMinimoParametro)) || Number(montoAprobado) > Number(solicitudTarjeta.str_cupo_solicitado) ? 'no_valido' : ''}`}
                                                            type="number" placeholder="Ej. 1000" disabled={false} setValueHandler={(e) => setMontoAprobado(e)} value={montoAprobado} max={solicitudTarjeta?.str_cupo_solicitado}></Input>
                                                        <div className="f-row">
                                                            {montoAprobado < controlMontoMinimoParametro &&
                                                                <h4 className="strong ml-1 mt-1">*El valor mínimo a solicitar debe superar los {`${numberFormatMoney(controlMontoMinimoParametro)?.toLocaleString("en-US")}`}</h4>
                                                            }
                                                        </div>


                                                    </Card>
                                                }


                                            </div>                                            
                                        }
                                        {(isMontoAprobarse || isRechazaComite) &&
                                            //<Card className={["mt-2"]}>
                                            //        <h3>Valor a aprobarse</h3>
                                            //    <Input type="number" placeholder="Ej. 1000" disabled={false} setValueHandler={(e) => setMontoAprobado(e)} value={montoAprobado} max={solicitudTarjeta?.str_cupo_solicitado}></Input>
                                            //    </Card>

                                            <>
                                                <Card className={["mt-2"]}>
                                                    <h3>Observación:</h3>
                                                <Textarea placeholder="Ingrese su comentario" onChange={setObservacionComiteHandler} esRequerido={valorDecisionSelect === "EST_APROBADA" ? false: true} value={observacionComite} controlAnchoTexArea={false} maxlength={255}></Textarea>
                                                </Card>
                                            </>
                                        }

                                        {/*{isRechazaComite &&*/}
                                        {/*    <>*/}
                                        {/*        <Card className={["mt-2"]}>*/}
                                        {/*            <h3>Seleccione el motivo:</h3>*/}
                                        {/*            <select disabled={false} onChange={cambioMotivoNiegaComite} value={selectMotivoNiegaSolComite}>*/}
                                        {/*                {motivosNegacionComite.length > 0*/}
                                        {/*                    && motivosNegacionComite?.map((motivo, index) => {*/}
                                        {/*                        if (index === 0) {*/}
                                        {/*                            return (*/}
                                        {/*                                <Fragment key={index}>*/}
                                        {/*                                    <option disabled={true} value={"-1"}>Seleccione una opción</option>*/}
                                        {/*                                    <option value={motivo.str_nemonico}> {motivo.str_descripcion}</option>*/}
                                        {/*                                </Fragment>*/}
                                        {/*                            )*/}
                                        {/*                        }*/}
                                        {/*                        else {*/}
                                        {/*                            return (*/}
                                        {/*                                <Fragment key={index}>*/}
                                        {/*                                    <option value={motivo.str_nemonico}> {motivo.str_descripcion}</option>*/}
                                        {/*                                </Fragment>                                                                        */}
                                        {/*                            )*/}
                                        {/*                        }*/}
                                        {/*                    })}*/}
                                        {/*            </select>*/}
                                        {/*        </Card>*/}

                                        {/*        <Card className={["mt-2"]}>*/}
                                        {/*            <h3>Observación:</h3>*/}
                                        {/*        <Textarea placeholder="Ingrese su comentario" onChange={setObservacionComiteHandler} esRequerido={true} value={observacionComite} controlAnchoTexArea={false} maxlength={255}></Textarea>*/}
                                        {/*        </Card>*/}
                                        {/*    </>*/}

                                        {/*}*/}



                                        {/* FIN SECCION APROBAR O NEGAR POR COMITE*/}

                                    </Card>

                                    {/*CAMPO GENERICO PARA DEJAR COMENTARIO Y PASAR A LA SIGUIENTE BANDEJA*/}
                                    {(solicitudTarjeta?.str_estado_actual !== 'POR APROBAR SOLICITUD' && solicitudTarjeta?.str_estado_actual !== 'VERIFICAR SOCIO' && solicitudTarjeta?.str_estado_actual !== 'POR REVISAR JEFE UAC') &&
                                        <div className="mt-4">
                                            <h3 className="mb-3 strong">Observación</h3>
                                            <Textarea placeholder="Ingrese su comentario" onChange={setComentarioSolicitudHandler} esRequerido={true} value={comentarioSolicitud}
                                                controlAnchoTexArea={false} maxlength={255}></Textarea>
                                        </div>
                                    }
                                </div>

                                <div className="mt-2 f-row justify-content-center">
                                    {/*APROBADA O NEGADA POR COMITE ( 11275 EST_POR_APROBAR) */}
                                    {(solicitudTarjeta?.str_estado_actual === "POR APROBAR SOLICITUD") &&
                                        <Button className="btn_mg__primary" disabled={isActivoBtnDecision} onClick={guardarDecisionComiteHandler}>Guardar</Button>
                                    }

                                    {(solicitudTarjeta?.str_estado_actual !== 'POR APROBAR SOLICITUD' && solicitudTarjeta?.str_estado_actual !== 'VERIFICAR SOCIO') &&
                                        <Button className="btn_mg__primary" disabled={solicitudTarjeta?.str_estado_actual === "POR REVISAR JEFE UAC" ? false : faltaComentariosAsesor} onClick={guardarComentarioSiguiente}>Guardar</Button>
                                    }
                                </div>
                            </Card>
                    }
                </>

            }

            {accionSeleccionada !== 1 && accionSeleccionada === 2 &&
                <Card className={["w-100 justify-content-space-between align-content-center"]}>
                    <h3 className="mb-3 strong">Documentos digitalizados</h3>
                    <div className="mt-3">
                        <UploadDocumentos
                            grupoDocumental={separadores}
                            contenido={separadores}
                            token={props.token}
                            cedulaSocio={props.solicitud.cedulaPersona}
                            solicitud={props.solicitud.solicitud}
                            datosSocio={datosSocio}
                            datosUsuario={datosUsuario}
                            solicitudTarjeta={solicitudTarjeta}
                            seleccionToogleSolicitud={seleccionAccionSolicitud}
                            oficinaSolicitud={props.solicitud.oficinaSolicitud}
                            estadoSolicitud={props.solicitud.estado}
                            cupoSolicitado={solicitudTarjeta?.str_cupo_solicitado}
                            oficialSolicitud={solicitudTarjeta?.str_usuario_proc}
                            calificacionRiesgo={props.solicitud.calificacionRiesgo}
                        ></UploadDocumentos>
                    </div>
                </Card>
            }

        </Card>



        <Modal
            modalIsVisible={modalVisible}
            titulo={`Informe`}
            onNextClick={siguientePasoHandler}
            onCloseClick={closeModalHandler}
            isBtnDisabled={false}
            type="lg2"
            mainText="Guardar"
        >
            {modalVisible && <div className="mb-3">

                <table>
                    <thead>
                        <tr>
                            {
                                informe.map((comentario, index) => {
                                    return (
                                        <th key={comentario.int_id_parametro}>
                                            <div className='f-row justify-content-center'>
                                                {comentario.str_tipo}
                                                <div className='ml-1 tooltip' style={{ transform: "translateY(2px)" }}>
                                                    <InfoRoundedIcon
                                                        sx={{
                                                            fontSize: 15,
                                                            padding: 0,
                                                        }}
                                                    >
                                                    </InfoRoundedIcon>
                                                    <span className='tooltip-info'>{comentario.str_descripcion}</span>
                                                </div>
                                                </div>      
                                        </th>
                                    );
                                })
                            }  
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                informe.map((comentario, index) => {
                                    return (
                                        <td key={comentario.int_id_parametro}>
                                            <Textarea placeholder="Ej. Texto de ejemplo" type="textarea" onChange={(event, key = comentario.int_id_parametro) => { comentarioAdicionalHanlder(event, key) }} esRequerido={false} value={comentario.str_detalle} controlAnchoTexArea={true} rows={28} rowsMax={28}
                                                maxlength={1000}></Textarea>
                                        </td>

                                    );
                                })
                            }
                        </tr>                       
                    </tbody>                    
                </table>
            </div>}
        </Modal>
        <Modal
            modalIsVisible={modalVisibleOk}
            titulo={`Aviso!`}
            onNextClick={retornarSolicitud}
            onCloseClick={closeModalHandlerOk}
            isBtnDisabled={false}
            type="sm"
            mainText="Continuar"
        >
            {modalVisibleOk &&
                <div>
                    <h3 className="mt-3 mb-3 strong">{textoModal}</h3>
                </div>
            }
        </Modal>
        <Modal
            modalIsVisible={modalMonto}
            titulo={`Actualizar valor solicitado`}
            onNextClick={actualizarMonto}
            onCloseClick={closeModalMonto}
            isBtnDisabled={isDisableBtnGuardarNuevoCupo}
            type="sm"
            mainText="Guardar"
        >
            {modalMonto &&
                <div className="f-row w-100">
                    <div className="f-col w-100 ml-2 mt-4">
                        <h3 className="mb-3">Ingrese el nuevo valor:</h3>
                        <Input className={`"f-row w-100 mb-4"  ${(nuevoMonto === "" || nuevoMonto === 0 || Number(nuevoMonto) < Number(controlMontoMinimoParametro)) || Number(nuevoMonto) > Number(solicitudTarjeta.str_cupo_solicitado) ? 'no_valido' : ''}`} type="number" value={solicitudTarjeta?.str_cupo_solicitado} placeholder="1000.00" setValueHandler={nuevoMontoHandler} maxlength={8} max={solicitudTarjeta.str_cupo_solicitado }></Input>
                        <h4 className="strong mt-1 mb-4">*El valor mínimo debe ser mayor a {`${numberFormatMoney(controlMontoMinimoParametro)}`} y menor al valor solicitado {`${numberFormatMoney(solicitudTarjeta.str_cupo_solicitado)}`}.</h4>
                    </div>
                <br/>
            </div>}
        </Modal>

        <Modal
            modalIsVisible={modalResolucionSocio}
            titulo={`Resolución Socio`}
            onNextClick={guardarResolucionSocio}
            onCloseClick={closeModalResolucionSocio}
            isBtnDisabled={isBtnResolucionSocio}
            type="sm"
            mainText="Guardar"
        >
            {modalResolucionSocio && <div>
                <h3 className="mt-3 mb-1">Escoja una opción:</h3>

                <select className='w-100' onChange={selectResolucionSociolHandler} value={selectResolucionSocio}>
                    {estadosSigConfirmPorMontoMenor.length > 0
                        && estadosSigConfirmPorMontoMenor?.map((estado, index) => {
                            const resultado = validaNombreParam(estado);
                            if (index === 0) {
                                return (
                                    <Fragment key={index}>
                                        <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                        <option value={resultado.prm_nemonico}> {resultado.prm_valor_ini}</option>
                                    </Fragment>
                                )
                            }
                            else {
                                return (
                                    <Fragment key={index}>
                                        <option value={resultado.prm_nemonico}> {resultado.prm_valor_ini}</option>
                                    </Fragment>
                                )
                            }
                        })}


                </select>

                {(selectResolucionSocio === "EST_RECHAZADA") &&
                    <>
                        <h3 className="mt-2">Seleccione el motivo:</h3>
                        <select className='w-100' disabled={false} onChange={cambioMotivoNiegaSocio} value={selectMotivoNiegaSocio}>
                            {motivosNegacionSocio.length > 0
                                && motivosNegacionSocio?.map((motivo, index) => {
                                    if (index === 0) {
                                        return (
                                            <Fragment key={index}>
                                                <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                                <option value={motivo.str_nemonico}> {motivo.str_descripcion}</option>
                                            </Fragment>
                                        )
                                    }
                                    else {
                                        return (
                                            <Fragment key={index}>
                                                <option value={motivo.str_nemonico}> {motivo.str_descripcion}</option>
                                            </Fragment>
                                        )
                                    }
                                })}
                        </select>
                        <br />
                    </>
                }
                <div className="mt-2 mb-2">
                    <h3>Observación:</h3>
                    <Input className="w-100" type="text" value={comentarioResolucionSocio} placeholder="Ingrese comentario" setValueHandler={setComentarioResolucionSocio}></Input>
                </div>
            </div>}
        </Modal>

        <Modal
            modalIsVisible={modalRechazo}
            titulo={`Aviso`}
            onNextClick={rechazarSolicitudHandler}
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
            modalIsVisible={modalAvisoGenerico}
            titulo={`Aviso`}
            onNextClick={closeModalAvisoGenerico}
            onCloseClick={closeModalAvisoGenerico}
            isBtnDisabled={false}
            type="sm"
            mainText="OK"
        >
             <div>
                <h3 className="strong mt-4 mb-3">{textoAvisoGenerico }</h3>
            </div>
        </Modal>

        <Modal
            modalIsVisible={modalSeguimientoTC}
            titulo={`Seguimiento`}
            onNextClick={changeEstadoModalSeguimiento}
            onCloseClick={changeEstadoModalSeguimiento}
            isBtnDisabled={false}
            type="lg2"
            mainText="Salir"
        >
                <div className={"m-2"}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Usuario</th>
                                <th>Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            lstSeguimientoTC.map((seguimient) => {
                                const fecha = new Date(seguimient?.dtt_fecha_actualizacion);
                                const opciones = {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                };


                                    return (<tr key={seguimient.int_flujo_id}>
                                        <td>{seguimient.int_flujo_id}</td>
                                        <td>{seguimient.str_estado_flujo}</td>
                                        <td>{(fecha.toLocaleDateString('en-US', opciones))}</td>
                                        <td>{seguimient.str_usuario_proc}</td>
                                        <td>{seguimient.str_comentario_proceso}</td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>


                {/*<Accordion className="mt-3" title="Información económica" rotate={estadoAccordionSeguimiento} loading={false} toggleAccordion={() => { }} contentReady={true}>*/}
                {/*    <div className="f-row w-100 justify-content-center">*/}
                        
                        
                {/*    </div>*/}
                {/*</Accordion>*/}
            </div>
        </Modal>


        <Modal
            modalIsVisible={modalCambioBandeja}
            titulo={`Retornar Solicitud`}
            onNextClick={cambioEstadoBandeja}
            onCloseClick={closeModalambioBandeja}
            isBtnDisabled={isBtnDisableCambioBandeja}
            type="md"
            mainText="Devolver"
        >
            {modalCambioBandeja && <div>
                {/*ESTADOS DISPONIBLES PARA RETORNO DE BANDEJA DESDE COMITE*/}
                {solicitudTarjeta?.str_estado_actual === "POR APROBAR SOLICITUD" &&
                    <>
                        <h3 className="mt-4 mb-1">Seleccione a qué estado desea regresar la solicitud:</h3>

                        <select className='w-100' onChange={cambiarEstadoSolHandler} value={selectCambioEstadoSol}>
                            {estadosRetornaBandejaComite.length > 0
                                && estadosRetornaBandejaComite?.map((estado, index) => {
                                    const resultado = validaNombreParam(estado);
                                    if (index === 0) {
                                        return (
                                            <Fragment key={index}>
                                                <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                                <option value={resultado.prm_nemonico}> {resultado.prm_valor_ini}</option>
                                            </Fragment>
                                        )
                                    }
                                    else {
                                        return (
                                            <Fragment key={index}>
                                                <option value={resultado.prm_nemonico}> {resultado.prm_valor_ini}</option>
                                            </Fragment>
                                        )
                                    }
                                })}
                        </select>
                    </>
                }
                {/*ESTADOS DISPONIBLES PARA RETORNO DE BANDEJA DESDE COMITE*/}
                {solicitudTarjeta?.str_estado_actual === "POR REVISAR JEFE UAC" &&
                    <>
                        <h3 className="mt-4 mb-1">Seleccione a qué estado desea regresar la solicitud:</h3>

                    <select className='w-100' onChange={cambiarEstadoSolHandler} value={selectCambioEstadoSol}>
                        {estadosRetornaBandejaJefUac.length > 0
                            && estadosRetornaBandejaJefUac?.map((estado, index) => {
                                    const resultado = validaNombreParam(estado);
                                    if (index === 0) {
                                        return (
                                            <Fragment key={index}>
                                                <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                                <option value={resultado.prm_nemonico}> {resultado.prm_valor_ini}</option>
                                            </Fragment>
                                        )
                                    }
                                    else {
                                        return (
                                            <Fragment key={index}>
                                                <option value={resultado.prm_nemonico}> {resultado.prm_valor_ini}</option>
                                            </Fragment>
                                        )
                                    }
                                })}
                        </select>
                    </>
                }


                <br />
                <div>
                    <h3 className={`${solicitudTarjeta?.str_estado_actual === "POR APROBAR SOLICITUD" ? 'mt-4 mb-1' : 'mt-1 mb-1'}`}>Seleccione el motivo:</h3>
                    <select className='w-100' onChange={cambioMotivoRetornoBandeja} value={selectMotivoRetornoBanj}>
                        {motivosRegresaAntBandeja.length > 0
                            && motivosRegresaAntBandeja?.map((motivo, index) => {
                                if (index === 0) {
                                    return (
                                        <Fragment key={index}>
                                            <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                            <option value={motivo.str_nemonico}> {motivo.str_descripcion}</option>
                                        </Fragment>
                                    )
                                }
                                else {
                                    return (
                                        <Fragment key={index}>
                                            <option value={motivo.str_nemonico}> {motivo.str_descripcion}</option>
                                        </Fragment>
                                    )
                                }
                            })}
                    </select>


                </div>
                <div>
                    <h3 className="mt-2 mb-2">Observación: </h3>
                    <Input className="w-100" type="text" value={comentarioCambioEstado} placeholder="Ingrese comentario" setValueHandler={setComentarioCambioEstado}></Input>
                </div>

                <br />

            </div>}
        </Modal>


    </div>
}

export default connect(mapStateToProps, {})(VerSolicitud);