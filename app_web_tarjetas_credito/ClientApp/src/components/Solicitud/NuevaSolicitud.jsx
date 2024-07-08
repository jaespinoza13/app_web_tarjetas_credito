﻿/* eslint-disable react-hooks/exhaustive-deps */
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from "../Common/Card";
import { IsNullOrEmpty, IsNullOrWhiteSpace } from "../../js/utiles";
import Sidebar from '../Common/Navs/Sidebar';
import Button from '../Common/UI/Button';
import { useState, useEffect, useRef } from 'react';
import ValidacionSocio from './ValidacionSocio';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from './ValidacionesGenerales';
import DatosSocio from './DatosSocio';
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion, fetchAddSolicitud, fetchNuevaSimulacionScore, fetchGetAlertasCliente } from '../../services/RestServices';
import { get } from '../../js/crypt';
import Modal from '../Common/Modal/Modal';
import Personalizacion from './Personalizacion';
import FinProceso from './FinProceso';
import DatosFinancieros from './DatosFinancieros';
import Stepper from '../Common/Stepper';

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
    const dispatch = useDispatch();
    const navigate = useHistory();
    //Info sesión
    const [datosUsuario, setDatosUsuario] = useState([]);

    const [lstValidaciones, setLstValidaciones] = useState([]);
    const [gestion, setGestion] = useState("solicitud");
    const [score, setScore] = useState("");

    //Global
    const [textoSiguiente, setTextoSiguiente] = useState("Continuar");

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

    //Errores
    const [mensajeErrorScore, setMensajeErrorScore] = useState("");

    //Boton siguiente
    const [estadoBotonSiguiente, setEstadoBotonSiguiente] = useState(true);
    //Score

    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [step, setStep] = useState(0);

    //const [isUploadingAthorization, setIsUploadingAthorization] = useState(false);
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

    //Retorno nueva simulacion
    const realizaNuevaSimulacion = useRef(false);


    //EFECTO PARA DESVANECER STEP 0
    const [isVisibleBloque, setIsVisibleBloque] = useState(true);


    //PARAMETROS REQUERIDOS
    const [parametrosTC, setParametrosTC] = useState([]);


    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));

        const userOficial = get(localStorage.getItem('sender'));
        const userOficina = get(localStorage.getItem('office'));
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);
        //console.log(`DATOS USER, ${strOficial}, ${strRol} , ${userOficial}, ${userOficina}`)

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

        }


    }, []);



    //Validacion campos cuando no se edita
    const validaCamposFinancieros = () => {

        //Si esta activo el check de Gastos Financieros valida campo
        let validadorOtrosMontos = false;
        let validaRestoMontoGstFinanciero = false;

        console.log(`montoSolicitado ${datosFinancierosObj.montoSolicitado}, montoEgresos ${datosFinancierosObj.montoIngresos},  montoEgresos ${datosFinancierosObj.montoEgresos} `)

        if ((datosFinancierosObj.montoSolicitado > 0 && datosFinancierosObj.montoSolicitado <= 99999) &&
            (datosFinancierosObj.montoIngresos > 0 && datosFinancierosObj.montoIngresos <= 99999) &&
            (datosFinancierosObj.montoEgresos > 0 && datosFinancierosObj.montoEgresos <= 99999)
        ) {
            validadorOtrosMontos = true;
        }

        if (isCkeckRestaGtoFinananciero === true) {
            if ((datosFinancierosObj.montoRestaGstFinanciero > 0 && datosFinancierosObj.montoRestaGstFinanciero <= 99999)) {
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
        console.log(` Valor nom tarjeta ${nombrePersonalTarjeta} `, validador)
        return validador;
    }



    useEffect(() => {
        if (step === 2 && archivoAutorizacion) {
            setEstadoBotonSiguiente(false);
        }
        else if (step === 2 && !archivoAutorizacion) {
            setEstadoBotonSiguiente(true);
        }
    }, [archivoAutorizacion]);


    useEffect(() => {
        if (step === 3) {
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
        if (step === 2 && showAutorizacion === false) {
            if (!index && validacionesErrorTotal === 0) {
                setEstadoBotonSiguiente(false);
            } else {
                setEstadoBotonSiguiente(true);
            }
        }
    }, [step, validacionesErr, archivoAutorizacion]);

    useEffect(() => {
        if (score.str_res_codigo === "000") {
            setStep(step + 1); // VA AL step(3)
            setActualStepper(3);
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
        if (step === 5 && validaCamposPersonalizacion()) {
            setEstadoBotonSiguiente(false);
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


    const agregarComentarioHandler = (e) => {

    }

    const checkGastosFinancieroHandler = (e) => {
        setIsCkeckRestaGtoFinananciero(e);
    }

    const refrescarDatosInformativos = () => {
        fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
            let datosFinan = {
                montoSolicitado: datosFinancierosObj.montoSolicitado,
                montoIngresos: data.dcm_total_ingresos,
                montoEgresos: data.dcm_total_egresos,
                montoGastoFinaCodeudor: datosFinancierosObj.montoGastoFinaCodeudor,
                montoRestaGstFinanciero: 0,
            }
            setDatosFinancierosObj(datosFinan);
            //console.log(`ingresos, ${data.dcm_total_ingresos}; egresos, ${data.dcm_total_egresos}; `,);
            //console.log("FINAN, ", datosFinan);
            anteriorStepHandler();
        }, dispatch);

    }

    const refrescarInformacionHandler = (actualizarInfo) => {
        fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
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
                console.log("SOLIC YA CREADA ", data.str_res_info_adicional);
            }
            if (data.str_res_codigo === "000") {
                if (!actualizarInfo) {
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

        }, dispatch);

    }


    const steps = [
        "Datos personales",
        "Requisitos",
        "Datos financieros",
        "Simulación",
        "Personalización",
        "Registro de Solicitud",
    ];



    const anteriorStepHandler = (paso) => {

        if (actualStepper !== 0) {
            const updateSteps = visitadosSteps.filter((index) => index !== actualStepper);
            setVisitadosSteps(updateSteps);
            setActualStepper(actualStepper - 1);
        }
        if (step === 2) {
            //setIsUploadingAthorization(false);
            setShowAutorizacion(false);
        }
        if (step === 4) {
            setNombrePersonalTarjeta("");
        }

        setIsVisibleBloque(true);
        setStep(step - 1)
    }


    const consultaAlertas = async (seguirAlSigPaso) => {
        await fetchGetAlertasCliente(cedulaSocio, '', fechaNacimiento, nombreSocio, apellidoPaterno + " " + apellidoMaterno, props.token, (data) => {
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
                setStep(2);
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setActualStepper(1);
            }
        }, dispatch);
    }

    const nextHandler = async () => {

        //console.log("step,", step)
        if (step === 0) {
            setIsVisibleBloque(false);
            refrescarInformacionHandler(false);

        }
        if (step === 1) {
            await consultaAlertas(true);
        }
        if (step === 2) {
            //console.log(`SHOW AUTOR, ${showAutorizacion}`)

            if (showAutorizacion) {
                //console.log("CED ENVIA DOC, ", cedulaSocio)
                fetchAddAutorizacion("C", 1, "F", cedulaSocio, nombreSocio, apellidoPaterno, apellidoMaterno, archivoAutorizacion, props.token, (data) => {
                    //console.log("AUTOR, ", data);
                    if (data.str_res_codigo === "000") {
                        //setIsUploadingAthorization(false);
                        setShowAutorizacion(false);
                        consultaAlertas(false);

                    }
                }, dispatch);
                return;
            } else {
                setActualStepper(2);
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setStep(3)
            }



        }

        if (step === 3) {
            //DATOS FINANCIEROS SE GUARDA EN VARIABLES
            const dataSocio = infoSocio;
            dataSocio.datosFinancieros = datosFinancierosObj;
            setInfoSocio(dataSocio);
            //console.log("INFO SOCI SOL, ", dataSocio)

            if (!realizaNuevaSimulacion.current) {
                //console.log("PRIMERA CONSULTA BURO ")
                //TODO cambiar cedula a a -> cedulaSocio
                await fetchScore("C", "1150214375", nombreSocio + " " + apellidoPaterno + " " + apellidoMaterno, "Matriz", datosUsuario[0].strOficial, datosUsuario[0].strCargo, props.token, (data) => {
                    setScore(data);
                    setIdClienteScore(data.int_cliente);
                    //console.log("SCORE, ", data.int_cliente)

                    //TODO VALIDAR  CAMPO capacidadPago
                    console.log("SCORE cupoSugerido, ", data.response.result.capacidadPago[0].cupoSugerido)
                    setCupoSugeridoAval(data.response.result?.capacidadPago[0].cupoSugerido.toString());

                    realizaNuevaSimulacion.current = true
                    datosFinancierosObj.montoGastoFinaCodeudor = Number(data.str_gastos_codeudor);
                    setDatosFinancierosObj(datosFinancierosObj)


                    //TODO VALIDAR ESA INFO
                    //Calificacion riesgo
                    //console.log("SCORE ", data.response.result);
                    //console.log("CALIFICACION RIESGO COOP, ", data.response.result.modeloCoopmego[0].decisionModelo);
                    setCalificacionRiesgo(data.response.result.modeloCoopmego[0].decisionModelo)


                }, dispatch);

            } else if (realizaNuevaSimulacion.current) {
                console.log("NUEVA SIMULACION")

                let datosFinan = datosFinancierosObj;
                if (!datosFinan.montoIngresos) datosFinan.montoIngresos = 0;
                if (!datosFinan.montoEgresos) datosFinan.montoEgresos = 0;
                if (!datosFinan.montoRestaGstFinanciero || datosFinan.montoRestaGstFinanciero === "" || datosFinan.montoRestaGstFinanciero === " " || IsNullOrEmpty(datosFinan.montoRestaGstFinanciero)) datosFinan.montoRestaGstFinanciero = 0;
                if (!datosFinan.montoGastoFinaCodeudor || datosFinan.montoGastoFinaCodeudor === "" || datosFinan.montoGastoFinaCodeudor === " " || IsNullOrEmpty(datosFinan.montoGastoFinaCodeudor)) datosFinan.montoGastoFinaCodeudor = 0;

                //TODO CAMBIAR LA CEDULA ->cedulaSocio
                await fetchNuevaSimulacionScore("C", "1150214375", nombreSocio + " " + apellidoPaterno + " " + apellidoMaterno, "Matriz", datosUsuario[0].strOficial, datosUsuario[0].strCargo, datosFinan.montoIngresos, datosFinan.montoEgresos, datosFinan.montoRestaGstFinanciero, datosFinan.montoGastoFinaCodeudor,
                    props.token, (data) => {
                        //TODO: RECUPERAR EL data.int_cliente y 
                        setIdClienteScore(data.int_cliente);
                        setCupoSugeridoCoopM(data.str_cupo_sugerido);
                        setScore(data);

                    }, dispatch);


            }
            setEstadoBotonSiguiente(true);


        }
        if (step === 4) {
            //setCambioRetorno(true)
            setVisitadosSteps([...visitadosSteps, actualStepper + 1])
            setActualStepper(4);
            setStep(5);
            setEstadoBotonSiguiente(true);
        }
        if (step === 5) {

            let fechaNac = infoSocio.str_fecha_nacimiento.split('-');
            let fechaNacFormatoReq = fechaNac[2] + '-' + fechaNac[0] + '-' + fechaNac[1]
            let intEstadoCreado = parametrosTC.filter(param => param.prm_nemonico === "EST_SOL_CREADA");

            let int_oficina_entrega = 0;
            let direccion = "";
            let localidad = "";
            let barrio = "";
            let provincia = "";
            let cod_postal = "";

            if (tipoEntrega === "Retiro en agencia") {
                int_oficina_entrega = direccionEntrega;

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


            let body = {

                str_tipo_documento: "C",
                str_num_documento: cedulaSocio,
                int_ente: enteSocio,
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
                int_oficina_proc: datosUsuario[0].strUserOficina,
                mny_cupo_solicitado: datosFinancierosObj.montoSolicitado.toString(),
                mny_cupo_sugerido_aval: cupoSugeridoAval,
                mny_cupo_sugerido_coopmego: cupoSugeridoCoopM.toString(),
                str_estado_civil: estadoCivil,
                mny_total_ingresos: datosFinancierosObj.montoIngresos.toString(),
                mny_total_egresos: datosFinancierosObj.montoEgresos.toString(),
                str_denominacion_socio: "",

                str_direccion: direccion,
                str_localidad: localidad,
                str_barrio: barrio,
                str_telefono: celularSocio,
                str_provincia: provincia,
                //str_cod_postal: "",
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
                str_calificacion_buro: calificacionRiesgo

            }

            fetchAddSolicitud(body, props.token, (data) => {
                //setCambioRetorno(true)
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setActualStepper(5);
                setStep(-1);

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
        console.log("TIPO ENREGA ", data)
    }

    const direccionEntregaHandler = (data) => {
        setDireccionEntrega(data);
        console.log("DIRECCION ENREGA ", data)
    }

    const handleAutorizacion = (data) => {
        //console.log(data);
        //setIsUploadingAthorization(data);
    }

    const [comentario, setComentario] = useState("");
    const [comentarioAdic, setComentarioAdic] = useState("");

    useEffect(() => {
        if (comentarioAdic === "") {
            setEstadoBotonSiguiente(true);
        } else {
            setEstadoBotonSiguiente(false);
        }
    }, [comentarioAdic])

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
        //ENTER
        /*console.log("Even ", event)
        console.log("Accion ", accion)
        console.log("Accion ", cedulaValida)*/
        if (accion === "Enter" && cedulaValida && step === 0) {
            nextHandler(step);
        }
    }

    return (
        <div className="f-row" >
            <Sidebar enlace={props.location.pathname}></Sidebar>
            {/* {showAutorizacion.toString()}*/}
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-col justify-content-center">

                    <div className="stepper">
                        <Stepper steps={steps} setStepsVisited={visitadosSteps} setActualStep={actualStepper} />
                    </div>


                    {(step === 0 || step === 1) &&
                        <div className="f-row w-100 justify-content-center sliding-div ">
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
                    }

                    {(step === 2) &&
                        <div className="f-row w-100 justify-content-center">
                            <ValidacionesGenerales token={props.token}
                                lst_validaciones={lstValidaciones}
                                onFileUpload={getFileHandler}
                                onShowAutorizacion={showAutorizacion}
                                infoSocio={infoSocio}
                                onAddAutorizacion={handleAutorizacion}
                                datosUsuario={datosUsuario}
                                onSetShowAutorizacion={showAutorizacionHandler}
                                cedula={cedulaSocio}
                            ></ValidacionesGenerales>
                        </div>
                    }
                    {(step === 3) &&
                        <div className="f-row w-100">
                            <DatosFinancieros
                                dataConsultFinan={datosFinancierosObj}
                                setDatosFinancierosFunc={datosFinancierosHandler}
                                isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                                gestion={gestion}
                                requiereActualizar={refrescarDatosInformativos}
                                isCheckMontoRestaFinanciera={isCkeckRestaGtoFinananciero}
                            >
                            </DatosFinancieros>
                        </div>
                    }

                    {(step === 4) &&
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

                        ></DatosSocio>
                    }
                    {step === 5 &&
                        <div className="f-row w-100 justify-content-center">
                            <Personalizacion
                                nombres={nombreSocio}
                                str_apellido_paterno={apellidoPaterno}
                                str_apellido_materno={apellidoMaterno}
                                lstDomicilio={dirDocimicilioSocio}
                                lstTrabajo={dirTrabajoSocio}
                                onNombreTarjeta={nombreTarjetaHandler}
                                onTipoEntrega={tipoEntregaHandler}
                                onDireccionEntrega={direccionEntregaHandler}
                            ></Personalizacion>
                        </div>
                    }
                    {step === 6}

                    {step === -1 &&
                        <FinProceso gestion={gestion}
                            nombres={`${nombreSocio} ${apellidoPaterno} ${apellidoMaterno}`}
                            cedula={cedulaSocio}
                            telefono={celularSocio}
                            email={correoSocio}
                        ></FinProceso>}
                </div>
                <div id="botones" className="f-row ">
                    <Item xs={2} sm={2} md={2} lg={2} xl={2} className="">
                        {(step !== 0 || step === -1) &&
                            <Button className={["btn_mgprev mt-2"]} onClick={anteriorStepHandler}>{"Anterior"}</Button>
                        }

                    </Item>
                    <Item xs={8} sm={8} md={8} lg={8} xl={8} className="f-row justify-content-center align-content-center">
                        {(step === 1) &&
                            <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} onClick={() => refrescarInformacionHandler(true)}>{"Actualizar"}</Button>
                        }
                        {(step === 3) &&
                            <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} onClick={refrescarDatosInformativos}>{"Actualizar"}</Button>
                        }
                        <Button className={["btn_mg btn_mg__primary mt-2 ml-2"]} disabled={estadoBotonSiguiente} onClick={() => nextHandler(step)}>{textoSiguiente}</Button>
                    </Item>

                </div>

            </Card>



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