/* eslint-disable react-hooks/exhaustive-deps */
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from "../Common/Card";
import { IsNullOrEmpty, IsNullOrWhiteSpace } from "../../js/utiles";
import Button from '../Common/UI/Button';
import { useState, useEffect, useRef } from 'react';
import ValidacionSocio from './ValidacionSocio';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from './ValidacionesGenerales';
import DatosSocio from './DatosSocio';
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion, fetchAddSolicitud, fetchNuevaSimulacionScore, fetchGetAlertasCliente, fetchGetParametrosSistema } from '../../services/RestServices';
import { get } from '../../js/crypt';
import Modal from '../Common/Modal/Modal';
import Personalizacion from './Personalizacion';
import FinProceso from './FinProceso';
import DatosFinancieros from './DatosFinancieros';
import Stepper from '../Common/Stepper';
import { v4 as uuidv4 } from 'uuid';
import { setDataSimulacionStateAction } from '../../redux/DataSimulacion/actions';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { Fragment } from 'react';
import { setSolicitudStateAction } from '../../redux/Solicitud/actions';


const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data
    };
};



const NuevaSolicitud = (props) => {
    const generarKey = () => {
        let myUUID = uuidv4();
        setKeyComponente(myUUID);
    }
    const [keyComponente, setKeyComponente] = useState();
    const [oficinasParametros, setOficinasParametros] = useState([]);

    const dispatch = useDispatch();
    const navigate = useHistory();
    //Info sesión
    const [datosUsuario, setDatosUsuario] = useState([]);

    const [lstValidaciones, setLstValidaciones] = useState([]);
    const [gestion, setGestion] = useState("solicitud");
    const [score, setScore] = useState("");
    const [puntajeScore, setPuntajeScore] = useState("");

    //Global
    const [textoSiguiente, setTextoSiguiente] = useState("Continuar");

    const [controlMontoMinimoParametro, setControlMontoMinimoParametro] = useState(0);

    const [datosFinancierosObj, setDatosFinancierosObj] = useState({
        montoSolicitado: 0,
        montoIngresos: 0,
        montoEgresos: 0,
        montoGastoFinaCodeudor: 0,
        montoRestaGstFinanciero: 0,

    })

    //Validaciones
    const [validacionesOk, setValidacionesOk] = useState([]);
    const [validacionesErr, setValidacionesErr] = useState([]);
    const [nombreSocio, setNombreSocio] = useState('');
    //const [apellidosSocio, setApellidosSocio] = useState('');
    const [enteSocio, setEnteSocio] = useState('');
    const [celularSocio, setCelularSocio] = useState('');
    const [correoSocio, setCorreoSocio] = useState('');
    const [cedulaSocio, setCedulaSocio] = useState('');
    const [cedulaValida, setCedulaValida] = useState(false);
    const [infoSocio, setInfoSocio] = useState([]);
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [isCkeckRestaGtoFinananciero, setIsCkeckRestaGtoFinananciero] = useState(false);
    const [controlValorMaxInputs, setControlValorMaxInputs] = useState(100000);
    const [isActivarSeccionRestaGastoFinan, setIsActivarSeccionRestaGastoFinan] = useState(false);
    const [solicitudIdCreado, setSolicitudIdCreado] = useState(false);

    //Boton siguiente
    const [estadoBotonSiguiente, setEstadoBotonSiguiente] = useState(true);

    //Score
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [step, setStep] = useState(0);


    const [idClienteScore, setIdClienteScore] = useState(0);

    // Para registro Solicitud
    const [calificacionRiesgo, setCalificacionRiesgo] = useState("");
    const [cupoSugeridoAval, setCupoSugeridoAval] = useState(0);
    const [cupoSugeridoCoopM, setCupoSugeridoCoopM] = useState(0);


    //Personalizacion
    const [nombrePersonalTarjeta, setNombrePersonalTarjeta] = useState("");
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [modalMensajeAviso, setModalMensajeAviso] = useState(false);
    const [textoAviso, setTextoAviso] = useState(false);

    //Stepper
    const [visitadosSteps, setVisitadosSteps] = useState([0]);
    const [actualStepper, setActualStepper] = useState(0);


    const [direccionEntrega, setDireccionEntrega] = useState("");
    //const [cambioRetorno, setCambioRetorno] = useState(false);


    //Info Socio
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);
    const getInfoSocioHandler = (data) => {
        setDirDomicilioSocio([...data.lst_dir_domicilio]);
        setDirTrabajoSocio([...data.lst_dir_trabajo]);
    }

    const [comentario, setComentario] = useState("");
    const [comentarioAdic, setComentarioAdic] = useState("");

    //Retorno nueva simulacion
    const realizaNuevaSimulacion = useRef(false);


    //EFECTO PARA DESVANECER STEP 0
    const [isVisibleBloque, setIsVisibleBloque] = useState(true);


    //PARAMETROS REQUERIDOS
    const [parametrosTC, setParametrosTC] = useState([]);

    //Parametros para tipo de entrega en vista Personalizacion de TC
    const [lstTiposEntrega, setLstTiposEntrega] = useState([]);




    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));

        const userOficial = get(localStorage.getItem('sender'));
        const userOficina = get(localStorage.getItem('office'));
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);
        //console.log(`DATOS USER, ${strOficial}, ${strRol} , ${userOficial}, ${userOficina}`)

        if (props.parametrosTC?.lst_parametros?.length > 0) {
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

            //Obtener oficinas parametrizadas
            let oficinasParametrosTC = ParametrosTC
                .filter(param => param.str_nombre === 'OFICINAS_TC')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_nombre: estado.str_nombre,
                    prm_nemonico: estado.str_nemonico,
                    prm_valor_ini: estado.str_valor_ini,
                    prm_valor_fin: estado.str_valor_fin,
                    prm_descripcion: estado.str_descripcion
                }));
            setOficinasParametros(oficinasParametrosTC)
        }

        

        //TODO REVISAR
        fetchGetParametrosSistema("TIPO_ENTREGA_WS_TC", props.token, (data) => {
            console.log("data.lst_parametros ", data.lst_parametros)
            if (data.lst_parametros.length > 0) {
                /*let informacion = [];
                data.lst_parametros.forEach((param) => {
                    let nuevoTipoEntrega = {
                        textPrincipal: param.str_valor_ini,
                        key: param.str_valor_ini,
                        vigencia: param.bl_vigencia,
                        idETC: Number(param.int_id_parametro),
                        image: "",
                        textSecundario: "",
                    }
                    informacion.push(nuevoTipoEntrega)
                    nuevoTipoEntrega = null;
                });
                setLstTiposEntrega(informacion);*/
                let ParametrosEntregaTC = data.lst_parametros.map(estadoEnt => ({
                    key: estadoEnt.str_valor_ini,
                    textPrincipal: estadoEnt.str_valor_ini,
                    vigencia: estadoEnt.bl_vigencia,
                    image: "",
                    textSecundario: "",
                }));
                setLstTiposEntrega(ParametrosEntregaTC);

            }
        }, dispatch)
    }, []);



    //Validacion campos cuando no se edita
    const validaCamposFinancieros = () => {

        //Si esta activo el check de Gastos Financieros valida campo
        let validadorOtrosMontos = false;
        let validaRestoMontoGstFinanciero = false;

        //console.log(`montoSolicitado ${datosFinancierosObj.montoSolicitado}, montoEgresos ${datosFinancierosObj.montoIngresos},  montoEgresos ${datosFinancierosObj.montoEgresos} `)
        if ((datosFinancierosObj.montoSolicitado > 0 && datosFinancierosObj.montoSolicitado <= controlValorMaxInputs && datosFinancierosObj.montoSolicitado >= controlMontoMinimoParametro) &&
            (datosFinancierosObj.montoIngresos > 0 && datosFinancierosObj.montoIngresos <= controlValorMaxInputs) &&
            (datosFinancierosObj.montoEgresos > 0 && datosFinancierosObj.montoEgresos <= controlValorMaxInputs)
        ) {
            validadorOtrosMontos = true;
        }

        if (isCkeckRestaGtoFinananciero === true) {
            if ((Number(datosFinancierosObj.montoRestaGstFinanciero) > 0 && Number(datosFinancierosObj.montoRestaGstFinanciero) <= controlValorMaxInputs)) {
                validaRestoMontoGstFinanciero = true;
            }
            else {
                validaRestoMontoGstFinanciero = false;
                return false;
            }
        } else if (isCkeckRestaGtoFinananciero === false) {
            validaRestoMontoGstFinanciero = true;
        }
        if (validadorOtrosMontos && validaRestoMontoGstFinanciero) {
            return true;
        } else {
            return false;
        }

    }

    const validaCamposPersonalizacion = () => {
        let validador = false;
        if (nombrePersonalTarjeta !== '' && direccionEntrega !== '' && direccionEntrega !== '-1' && tipoEntrega !== '') {
            validador = true
        }
        //console.log(` Valor nom tarjeta ${nombrePersonalTarjeta} `, validador)
        return validador;
    }



    useEffect(() => {
        if (step === 1 && archivoAutorizacion) {
            setEstadoBotonSiguiente(false);
        }
        else if (step === 1 && !archivoAutorizacion) {
            setEstadoBotonSiguiente(true);
        }
    }, [archivoAutorizacion]);


    useEffect(() => {
        if (step === 2) {
            const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_090" && validacion.str_estado_alerta === "False");
            if (validaCamposFinancieros() && !index) {
                setEstadoBotonSiguiente(false);
            } else {
                setEstadoBotonSiguiente(true);
            }
        }

    }, [datosFinancierosObj, step, validaCamposFinancieros])


    // Controles para pasar a la consulta al score Comp DatosSocio. Valida que todas las alertas esten OK
    useEffect(() => {
        const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_090" && validacion.str_estado_alerta === "False");
        const validacionesErrorTotal = validacionesErr.length;
        //console.log("TOTAL validaciones ok, ", validacionesErrorTotal);        
        if (step === 1 && showAutorizacion === false) {
            if (!index && validacionesErrorTotal === 0) {
                setEstadoBotonSiguiente(false);
            } else {
                setEstadoBotonSiguiente(true);
            }
        }
    }, [step, validacionesErr, archivoAutorizacion]);


    useEffect(() => {
        if (comentarioAdic !== "") {
            setEstadoBotonSiguiente(false);
        } else {
            setEstadoBotonSiguiente(true);
        }
    }, [comentarioAdic])

    useEffect(() => {
        if (score.str_res_codigo === "000") {
            setStep(step + 1); // VA AL step(3)
            setActualStepper(2);
            setVisitadosSteps([...visitadosSteps, actualStepper + 1])
        }
    }, [score]);


    useEffect(() => {
        if (step === 0 && cedulaSocio !== '' && !setCedulaValida) {
            setEstadoBotonSiguiente(true);
        }
        if (step === 1) {
            setEstadoBotonSiguiente(false);
        }
        if (step === -1) {
            setTextoSiguiente("Volver al inicio")
        }
        if (step === 3) {
            setTextoSiguiente("Continuar")
        }
        if (step === 4) {
            setTextoSiguiente("Registrar")
            if (validaCamposPersonalizacion()) {
                setEstadoBotonSiguiente(false);
            }
        }
    }, [step]);


    useEffect(() => {
        if (validaCamposPersonalizacion()) {
            setEstadoBotonSiguiente(false);
        } else {
            setEstadoBotonSiguiente(true);
        }
    }, [nombrePersonalTarjeta, direccionEntrega, tipoEntrega])



    const getFileHandler = (event) => {
        setArchivoAutorizacion(event);
    }


    const checkGastosFinancieroHandler = (e) => {
        setIsCkeckRestaGtoFinananciero(e);
    }

    const refrescarDatosInformativos = async () => {
        await fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
            let datosFinan = {
                montoSolicitado: Number(datosFinancierosObj.montoSolicitado),
                montoIngresos: Number(data.dcm_total_ingresos),
                montoEgresos: Number(data.dcm_total_egresos),
                montoGastoFinaCodeudor: Number(datosFinancierosObj.montoGastoFinaCodeudor),
                montoRestaGstFinanciero: Number(datosFinancierosObj.montoRestaGstFinanciero),
            }
            setDatosFinancierosObj(datosFinan);
        },
        (errorCallback) => {
            if (errorCallback.error) {
                console.log("ERROR AL OBTENER DATOS DEL SOCIO");
            }

        }, dispatch);

    }

    const refrescarInformacionHandler = async  (actualizarInfo) => {
        await fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
            data.cedula = cedulaSocio;
            setEnteSocio(data.str_ente);
            setCelularSocio(data.str_celular);
            setCorreoSocio(data.str_email);
            setInfoSocio(data);
            setNombreSocio(data.str_nombres);
            setApellidoPaterno(data.str_apellido_paterno);
            setApellidoMaterno(data.str_apellido_materno);
            setEstadoCivil(data.str_estado_civil);
            setFechaNacimiento(data.str_fecha_nacimiento);

            let datosFinan = {
                montoSolicitado: 0,
                montoIngresos: Number(data.dcm_total_ingresos),
                montoEgresos: Number(data.dcm_total_egresos),
                montoGastoFinaCodeudor: Number(datosFinancierosObj.montoGastoFinaCodeudor),
                montoRestaGstFinanciero: Number(datosFinancierosObj.montoRestaGstFinanciero),
            }
            setDatosFinancierosObj(datosFinan);

            //console.log(`ingresos, ${data.dcm_total_ingresos}; egresos, ${data.dcm_total_egresos}; `,);
            //console.log("FINAN, ", datosFinan);

            if (data.str_res_codigo === "004") {
                setTextoAviso(data.str_res_info_adicional ? data.str_res_info_adicional : "Ya se encuentra registrada una solicitud con esa cédula.")
                setModalMensajeAviso(true);
                //console.log("SOLIC YA CREADA ", data.str_res_info_adicional);
            }
            if (data.str_res_codigo === "000") {
                if (!actualizarInfo) {
                    generarKey();
                    consultaAlertas(cedulaSocio, data.str_fecha_nacimiento, data.str_nombres, data.str_apellido_paterno + " " + data.str_apellido_materno, true);
                    setStep(1);
                    let retrasoEfecto = setTimeout(function () {
                        setIsVisibleBloque(true);
                        clearTimeout(retrasoEfecto);
                    }, 100);
                }

            }
            if (data.str_res_codigo === "003") {
                setTextoAviso(data.str_res_info_adicional ? data.str_res_info_adicional : "Se requiere actualizar información personal. Intente realizar una Prospección.")
                setModalMensajeAviso(true);
            }

        },
            (errorCallback) => {
                if (errorCallback.error) {
                    setStep(0);
                    let retrasoEfecto = setTimeout(function () {
                        setIsVisibleBloque(true);
                        clearTimeout(retrasoEfecto);
                    }, 100);
                }

            }, dispatch);

    }


    const steps = [
        //"Datos personales",
        //"Requisitos",
        "Validaciones",
        "Datos financieros",
        "Simulación",
        "Personalización",
        "Registro de Solicitud",
    ];



    const anteriorStepHandler = (paso) => {

        if (step === 0 || step === -1) {
            navigate.push("/");
        }
        if (actualStepper !== 0) {
            const updateSteps = visitadosSteps.filter((index) => index !== actualStepper);
            setVisitadosSteps(updateSteps);
            setActualStepper(actualStepper - 1);
        }
        if (step === 1) {
            setShowAutorizacion(false);
        }
        if (step === 3) {
            setNombrePersonalTarjeta("");
            setIsActivarSeccionRestaGastoFinan(true); //Para activar el btn de resta gastos financieros
        }

        setIsVisibleBloque(true);
        setStep(step - 1)
    }


    const consultaAlertas = async (cedulaSocioAlert, fechaNacimientoAlert, nombreSocioAlert, apellidosAlert, seguirAlSigPaso) => {
        await fetchGetAlertasCliente(cedulaSocioAlert, '', fechaNacimientoAlert, nombreSocioAlert, apellidosAlert, props.token, (data) => {
            let alertasIniciales_Validas = [...data.alertas_iniciales.lst_datos_alerta_true];
            let alertasIniciales_Invalidas = [...data.alertas_iniciales.lst_datos_alerta_false];
            let alertasRestriccion_Validas = [...data.alertas_restriccion.lst_datos_alerta_true];
            let alertasRestriccion_Invalidas = [...data.alertas_restriccion.lst_datos_alerta_false];

            let lst_validaciones_ok = [];
            if (alertasIniciales_Validas.length > 0) {
                alertasIniciales_Validas.forEach(alertaN1 => {
                    lst_validaciones_ok.push(alertaN1)
                });
            }
            if (alertasRestriccion_Validas.length > 0) {
                alertasRestriccion_Validas.forEach(alertaN2 => {
                    lst_validaciones_ok.push(alertaN2)
                });
            }

            let lst_validaciones_err = [];
            if (alertasIniciales_Invalidas.length > 0) {
                alertasIniciales_Invalidas.forEach(alertaN3 => {
                    lst_validaciones_err.push(alertaN3)
                });
            }
            if (alertasRestriccion_Invalidas.length > 0) {
                alertasRestriccion_Invalidas.forEach(alertaN4 => {
                    lst_validaciones_err.push(alertaN4)
                });
            }

            const objValidaciones = {
                lst_validaciones_ok: [...lst_validaciones_ok],
                lst_validaciones_err: [...lst_validaciones_err]
            }

            setValidacionesOk(lst_validaciones_ok);
            setValidacionesErr(lst_validaciones_err);
            handleLists(objValidaciones);

            if (seguirAlSigPaso) {
                generarKey();
                //setStep(1);
                //setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                //setActualStepper(1);
            }
        }, dispatch);
    }

    const nextHandler = async () => {
        if (step === 0) {
            setIsVisibleBloque(false);
            refrescarInformacionHandler(false);

        }
        /*if (step === 1) {
            await consultaAlertas(true);
        }*/
        if (step === 1) {
            if (showAutorizacion) {
                await fetchAddAutorizacion("C", 1, "F", cedulaSocio, nombreSocio, apellidoPaterno, apellidoMaterno, archivoAutorizacion, props.token, (data) => {
                    if (data.str_res_codigo === "000") {
                        setShowAutorizacion(false);
                        consultaAlertas(false);
                    }
                }, dispatch);
                return;
            } else {
                generarKey();
                //Se actuliza la informacion, de manera que se guarde la mas actualizada, en caso no se de click al actualizar
                refrescarInformacionHandler(true);
                setActualStepper(1);
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setStep(2);
            }



        }

        if (step === 2) {
            //DATOS FINANCIEROS SE GUARDA EN VARIABLES
            const dataSocio = infoSocio;
            dataSocio.datosFinancieros = datosFinancierosObj;
            setInfoSocio(dataSocio);
            //console.log("INFO SOCI SOL, ", dataSocio)

            let nombreSocioTC = nombreSocio + " " + apellidoPaterno;
            nombreSocioTC = (apellidoMaterno !== null && apellidoMaterno !== '' && apellidoMaterno !== ' ') ? nombreSocioTC + " " + apellidoMaterno : nombreSocioTC;

            //Redux guardar informaciion necesaria para nueva simulacion en DatosSocio
            //TODO CAMBIAR DE CEDULA
            dispatch(setDataSimulacionStateAction({
                cedula: "1105952475", nombresApellidos: nombreSocioTC
            }))

            if (!realizaNuevaSimulacion.current) {
                //Se refresca informacion
                await refrescarDatosInformativos();
                //TODO cambiar cedula a a -> cedulaSocio
                await fetchScore("C", "1105952475", nombreSocioTC, datosUsuario[0].strUserOficina, datosUsuario[0].strOficial, datosUsuario[0].strCargo, props.token, (data) => {
                   
                    setIdClienteScore(data.int_cliente);
                    setPuntajeScore(data?.response?.result?.scoreFinanciero[0]?.score)
                    setCupoSugeridoAval(data.response.result?.capacidadPago[0].cupoSugerido.toString());
                    realizaNuevaSimulacion.current = true
                    datosFinancierosObj.montoGastoFinaCodeudor = Number(data.str_gastos_codeudor);
                    let restaGastoFinancieroBuro = Number.parseFloat(data.response?.result?.parametrosCapacidadPago[0]?.restaGastoFinanciero);
                    datosFinancierosObj.montoRestaGstFinanciero = restaGastoFinancieroBuro;
                    setDatosFinancierosObj(datosFinancierosObj);
                    //Se captura la calificacion que retorna de la consulta al buro
                    setCalificacionRiesgo(data.response.result.modeloCoopmego[0].decisionModelo)
                    dataSocio.datosFinancieros = datosFinancierosObj;
                    setInfoSocio(dataSocio);
                    setEstadoBotonSiguiente(true);
                    setScore(data);
                }, dispatch);

            } else if (realizaNuevaSimulacion.current) {
                //Se refresca informacion
                await refrescarDatosInformativos();

                let datosFinan = datosFinancierosObj;
                if (!datosFinan.montoIngresos) datosFinan.montoIngresos = 0;
                if (!datosFinan.montoEgresos) datosFinan.montoEgresos = 0;
                if (!datosFinan.montoRestaGstFinanciero || datosFinan.montoRestaGstFinanciero === "" || datosFinan.montoRestaGstFinanciero === " " || IsNullOrEmpty(datosFinan.montoRestaGstFinanciero)) datosFinan.montoRestaGstFinanciero = 0;
                if (!datosFinan.montoGastoFinaCodeudor || datosFinan.montoGastoFinaCodeudor === "" || datosFinan.montoGastoFinaCodeudor === " " || IsNullOrEmpty(datosFinan.montoGastoFinaCodeudor)) datosFinan.montoGastoFinaCodeudor = 0;

                //TODO CAMBIAR LA CEDULA ->cedulaSocio
                await fetchNuevaSimulacionScore("C", "1105952475", nombreSocioTC, datosUsuario[0].strUserOficina, datosUsuario[0].strOficial, datosUsuario[0].strCargo, datosFinan.montoIngresos, datosFinan.montoEgresos, datosFinan.montoRestaGstFinanciero, datosFinan.montoGastoFinaCodeudor,
                    props.token, (data) => {
                        setIdClienteScore(data.int_cliente);
                        setCupoSugeridoCoopM(data.str_cupo_sugerido);
                        setEstadoBotonSiguiente(true);
                        setScore(data);
                    }, dispatch);
            }

        }
        if (step === 3) {
            //setCambioRetorno(true)
            setVisitadosSteps([...visitadosSteps, actualStepper + 1])
            setActualStepper(3);
            setStep(4);
            setEstadoBotonSiguiente(true);
        }
        if (step === 4) {

            let fechaNac = infoSocio.str_fecha_nacimiento.split('-');
            let fechaNacFormatoReq = fechaNac[2] + '-' + fechaNac[0] + '-' + fechaNac[1]
            let intEstadoCreado = parametrosTC.filter(param => param.prm_nemonico === "EST_CREADA");

            let int_oficina_entrega = 0;
            let direccion = "";
            let localidad = "";
            let barrio = "";
            let provincia = "";
            let cod_postal = "";

            if (tipoEntrega === "Retiro en agencia") {
                int_oficina_entrega = Number(direccionEntrega);

            } else {
                if (direccionEntrega.textPrincipal === "Casa") {
                    let direccionEntregaTarjeta = dirDocimicilioSocio.find(direcc => direcc.int_dir_direccion === Number(direccionEntrega.key));

                    direccion = direccionEntregaTarjeta?.str_dir_descripcion_dom;
                    localidad = direccionEntregaTarjeta?.str_dir_sector;
                    barrio = direccionEntregaTarjeta?.str_dir_barrio;
                    provincia = direccionEntregaTarjeta?.str_dir_ciudad;
                    cod_postal = direccionEntregaTarjeta?.int_codigo_postal;

                } else if (direccionEntrega.textPrincipal === "Trabajo") {
                    let direccionEntregaTarjeta2 = dirTrabajoSocio.find(direcc => direcc.int_dir_direccion === Number(direccionEntrega.key));

                    direccion = direccionEntregaTarjeta2?.str_dir_descripcion_emp;
                    localidad = direccionEntregaTarjeta2?.str_dir_sector;
                    barrio = direccionEntregaTarjeta2?.str_dir_barrio;
                    provincia = direccionEntregaTarjeta2?.str_dir_ciudad;
                    cod_postal = direccionEntregaTarjeta2?.int_codigo_postal;


                }

            }

            let nombreSocioTC = nombreSocio + " " + apellidoPaterno;
            nombreSocioTC = (apellidoMaterno !== null && apellidoMaterno !== '' && apellidoMaterno !== ' ') ? nombreSocioTC + " " + apellidoMaterno : nombreSocioTC;

            let body = {

                str_tipo_documento: "C",
                str_num_documento: cedulaSocio,
                int_ente: Number(enteSocio),
                str_nombres: nombreSocio,
                str_primer_apellido: apellidoPaterno,
                str_segundo_apellido: apellidoMaterno,
                dtt_fecha_nacimiento: fechaNacFormatoReq,
                str_sexo: infoSocio.str_sexo,
                str_oficial_proc: datosUsuario[0].strUserOficial,
                str_correo: correoSocio,
                str_denominacion_tarjeta: nombrePersonalTarjeta,
                str_comentario_proceso: comentario,
                str_comentario_adicional: comentarioAdic,
                int_oficina_proc: Number(datosUsuario[0].strUserOficina),
                mny_cupo_solicitado: datosFinancierosObj.montoSolicitado.toString(),
                mny_cupo_sugerido_aval: cupoSugeridoAval,
                mny_cupo_sugerido_coopmego: cupoSugeridoCoopM.toString(),
                str_estado_civil: estadoCivil,
                mny_total_ingresos: datosFinancierosObj.montoIngresos.toString(),
                mny_total_egresos: datosFinancierosObj.montoEgresos.toString(),
                str_denominacion_socio: nombreSocioTC,
                str_direccion: direccion,
                str_localidad: localidad,
                str_barrio: barrio,
                str_telefono: celularSocio,
                str_provincia: provincia,
                str_cod_postal: cod_postal.toString(),
                str_zona_geo: "",
                int_oficina_entrega: int_oficina_entrega,
                int_estado: intEstadoCreado[0]?.prm_id,

                int_entidad_sucursal: 0,
                int_num_promotor: 0,
                str_habilita_compra: "",
                mny_limite_compras: 0,
                str_telefono_2: "",
                str_datos_adicionales: "",
                str_marca_graba_tarjeta: "",
                str_codigo_ocupacion: "",
                int_cuenta_bancaria: 0,
                int_tasa: 0,
                int_estado_entregado: 0,
                mny_excedente: "0",
                mny_cuota_estimada: "0",
                str_segmento: "",
                str_calificacion_buro: calificacionRiesgo,
                str_score_buro: puntajeScore.toString(),

            }

            fetchAddSolicitud(body, props.token, (data) => {
                //setCambioRetorno(true)
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setActualStepper(4);
                setStep(-1);

                setSolicitudIdCreado(data.int_id_solicitud);

            }, dispatch);
        }
        if (step === -1) {
            navigate.push('/solicitud');
        }
    }

    const handleLists = (e) => {
        setLstValidaciones(e);
    }

    const cedulaSocioHandler = (e) => {
        setCedulaSocio(e.valor);
        if (step === 0 && e.valido) {
            setEstadoBotonSiguiente(false);
            setCedulaSocio(e.valor);
            setCedulaValida(true)
        }
        else {
            setEstadoBotonSiguiente(true);
            setCedulaSocio(e.valor);
        }
    }


    const nombreTarjetaHandler = (data) => {
        setNombrePersonalTarjeta(data);
    }

    const tipoEntregaHandler = (data) => {
        setTipoEntrega(data);
        //console.log("TIPO ENREGA ", data)
    }

    const direccionEntregaHandler = (data) => {
        setDireccionEntrega(data);
        //console.log("DIRECCION ENREGA ", data)
    }

    const handleComentario = (comentarioToggle) => {
        setComentario(comentarioToggle);
    }

    const handleComentarioAdic = (valor) => {
        setComentarioAdic(valor);
    }

    const [showAutorizacion, setShowAutorizacion] = useState(false);

    const showAutorizacionHandler = (data) => {
        setShowAutorizacion(data);
    }

    const retornoAviso = () => {
        navigate.push('/solicitud');
    }

    const datosFinancierosHandler = (dato) => {
        let datosFinanciero = {
            montoSolicitado: dato.montoSolicitado,
            montoIngresos: dato.montoIngresos,
            montoEgresos: dato.montoEgresos,
            montoGastoFinaCodeudor: dato.montoGastoFinaCodeudor,
            montoRestaGstFinanciero: dato.restaGastoFinanciero
        }
        setDatosFinancierosObj(datosFinanciero)

    }

    const AtajoTecladoHandler = (event, accion) => {
        if (accion === "Enter" && cedulaValida && step === 0) {
            nextHandler(step);
        }
    }
    const validarNombreOficina = (idOficina) => {
        let nombreOficina = oficinasParametros.find(ofic => Number(ofic.prm_valor_fin) === Number(idOficina));
        return nombreOficina?.prm_descripcion ? nombreOficina.prm_descripcion : '';
    }


    const visualizarSolicitudHandler = () => {
        let nombreOficinaDeSolicitud = validarNombreOficina(datosUsuario[0].strUserOficina);

        dispatch(setSolicitudStateAction({
            solicitud: solicitudIdCreado,
            cedulaPersona: cedulaSocio,
            idSolicitud: parametrosTC.filter(estado => estado.prm_nemonico === "EST_CREADA")[0]?.prm_id,
            rol: datosUsuario[0].strCargo,
            estado: parametrosTC.filter(estado => estado.prm_nemonico === "EST_CREADA")[0]?.prm_valor_ini,
            oficinaSolicitud: nombreOficinaDeSolicitud,
            calificacionRiesgo: calificacionRiesgo
        }))
        navigate.push('/solicitud/ver');
    }

    return (
        <div className="f-row w-100" >
            {/* <Sidebar enlace={props.location.pathname}></Sidebar>*/}
            {/* {showAutorizacion.toString()}*/}
            {/*<div className={["w-100"]}>   */}

            {/*<button className="btn_mg_icons" onClick={anteriorStepHandler}>*/}
            {/*<img src="/Imagenes/right.svg" alt="Cumplir requisito"></img> <p>Anterior</p>*/}
            {/*</button>*/}

            <div style={{ marginLeft: "9rem", marginTop: "2.5rem", position: "absolute" }} >
                <div className="f-row w-100 icon-retorno" onClick={anteriorStepHandler}>
                    <KeyboardArrowLeftRoundedIcon
                        sx={{
                            fontSize: 35,
                            marginTop: 0.5,
                            padding: 0, 
                        }}
                    ></KeyboardArrowLeftRoundedIcon>
                    <h2 className="blue ml-2 mt-1">Solicitudes</h2>

                </div>
            </div>
            

            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-col justify-content-center">

                    <div className="stepper">
                        <Stepper steps={steps} setStepsVisited={visitadosSteps} setActualStep={actualStepper} />
                    </div>


                    {(step === 0 || step === 1) &&

                        <div className={`f-row w-100' justify-content-center sliding-div `}>
                            <div className={`${step === 0 ? 'f-row w-80 justify-content-center' : ''} ${step === 1 ? 'f-col w-40 justify-content-start mt-5' : ''} `}>
                                <div className={"f-row justify-content-end mt-2"}></div>
                                <ValidacionSocio paso={step}
                                    token={props.token}
                                    cedulaSocioValue={cedulaSocio}
                                    setCedulaSocio={cedulaSocioHandler}
                                    infoSocio={infoSocio}
                                    isVisibleBloque={isVisibleBloque}
                                    requiereActualizar={refrescarInformacionHandler}
                                    AtajoHandler={AtajoTecladoHandler}
                                ></ValidacionSocio>
                            </div>
                            {(step === 1) &&
                                <div className="f-col w-40 justify-content-start">
                                    <div className={"f-row justify-content-end"}>
                                        <Button className="btn_mg__auto " onClick={() =>refrescarInformacionHandler(false) }>
                                            <img src="/Imagenes/refresh.svg" style={{ transform: "scaleX(-1)", width:"2.1rem" }} alt="Volver a consultar"></img>
                                        </Button>
                                    </div>

                                    <ValidacionesGenerales
                                        key={keyComponente}
                                        token={props.token}
                                        lst_validaciones={lstValidaciones}
                                        onFileUpload={getFileHandler}
                                        onShowAutorizacion={showAutorizacion}
                                        infoSocio={infoSocio}
                                        datosUsuario={datosUsuario}
                                        onSetShowAutorizacion={showAutorizacionHandler}
                                        cedula={cedulaSocio}
                                    ></ValidacionesGenerales>
                                </div>
                            }


                        </div>
                    }

                    {/*{(step === 1) &&*/}
                    {/*    <div className="f-col w-50 justify-content-center">*/}
                    {/*        <ValidacionesGenerales token={props.token}*/}
                    {/*            lst_validaciones={lstValidaciones}*/}
                    {/*            onFileUpload={getFileHandler}*/}
                    {/*            onShowAutorizacion={showAutorizacion}*/}
                    {/*            infoSocio={infoSocio}*/}
                    {/*            datosUsuario={datosUsuario}*/}
                    {/*            onSetShowAutorizacion={showAutorizacionHandler}*/}
                    {/*            cedula={cedulaSocio}*/}
                    {/*        ></ValidacionesGenerales>*/}
                    {/*    </div>*/}
                    {/*}*/}
                    {(step === 2) &&
                        <div className="f-row w-100">
                            <DatosFinancieros
                                key={keyComponente}
                                dataConsultFinan={datosFinancierosObj}
                                setDatosFinancierosFunc={datosFinancierosHandler}
                                isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                                gestion={gestion}
                                requiereActualizar={refrescarDatosInformativos}
                                isCheckMontoRestaFinanciera={isCkeckRestaGtoFinananciero}
                                montoMinimoCupoSolicitado={controlMontoMinimoParametro}
                                isActivarSeccionRestaGasto={isActivarSeccionRestaGastoFinan}
                            >
                            </DatosFinancieros>
                        </div>
                    }

                    {(step === 3) &&
                        <DatosSocio
                            informacionSocio={infoSocio}
                            score={score}
                            token={props.token}
                            gestion={gestion}
                            onInfoSocio={getInfoSocioHandler}
                            onComentario={handleComentario}
                            onComentarioAdic={handleComentarioAdic}
                            idClienteScore={idClienteScore}
                            comentarioAdicionalValor={comentarioAdic}
                            calificacionRiesgo={calificacionRiesgo}
                            isCheckMontoRestaFinanciera={isCkeckRestaGtoFinananciero}
                            setDatosFinancierosFunc={datosFinancierosHandler}
                            isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}

                        ></DatosSocio>
                    }
                    {step === 4 &&
                        <div className="f-row w-100 justify-content-center">
                            <Personalizacion
                                token={props.token}
                                nombres={nombreSocio}
                                str_apellido_paterno={apellidoPaterno}
                                str_apellido_materno={apellidoMaterno}
                                lstDomicilio={dirDocimicilioSocio}
                                lstTrabajo={dirTrabajoSocio}
                                onNombreTarjeta={nombreTarjetaHandler}
                                onTipoEntrega={tipoEntregaHandler}
                                onDireccionEntrega={direccionEntregaHandler}
                                lstTiposEntregaTC={lstTiposEntrega }
                            ></Personalizacion>
                        </div>
                    }

                    {step === -1 &&
                        <FinProceso gestion={gestion}
                            nombres={`${nombreSocio} ${apellidoPaterno} ${apellidoMaterno}`}
                            cedula={cedulaSocio}
                            telefono={celularSocio}
                            email={correoSocio}
                            cupoSolicitado={datosFinancierosObj.montoSolicitado}
                        ></FinProceso>}
                </div>
                <div id="botones" className="f-row ">
                    {step !== -1 && 
                       <Item xs={12} sm={12} md={12} lg={12} xl={12} className="f-row justify-content-center align-content-center">
                        <Button className={["btn_mg btn_mg__primary mt-2"]} disabled={estadoBotonSiguiente} onClick={() => nextHandler(step)}>{textoSiguiente}</Button>
                    </Item>  
                    }
                    {step === -1 && 
                        <Fragment>
                            <Item xs={3} sm={3} md={3} lg={3} xl={3} ></Item>
                            <Item xs={6} sm={6} md={6} lg={6} xl={6} className="f-row justify-content-space-evenly  align-content-center">
                                <Button className={["btn_mg__secondary mt-2"]} disabled={estadoBotonSiguiente} onClick={() => nextHandler(step)}>{textoSiguiente}</Button>
                                {/*TODO mover la solicitud al detalle*/}
                                <Button className="btn_mg btn_mg__primary mt-2" onClick={visualizarSolicitudHandler} >Ver Solicitud</Button>
                            </Item>
                            <Item xs={3} sm={3} md={3} lg={3} xl={3} ></Item>
                    </Fragment>                        
                    }

                </div>

            </Card>

            {/*</div>*/}





            <Modal
                modalIsVisible={modalMensajeAviso}
                titulo={`Aviso!`}
                onNextClick={retornoAviso}
                onCloseClick={retornoAviso}
                isBtnDisabled={false}
                type="sm"
            >
                {modalMensajeAviso && <div>
                    <h3 className='mt-4 mb-4'>{textoAviso}</h3>
                </div>}
            </Modal>

        </div >
    )
}

export default connect(mapStateToProps, {})(NuevaSolicitud);