/* eslint-disable react-hooks/exhaustive-deps */
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from "../Common/Card";
import { IsNullOrEmpty, IsNullOrWhiteSpace } from "../../js/utiles";
import Sidebar from '../Common/Navs/Sidebar';
import Button from '../Common/UI/Button';
import { useState, useEffect, useRef } from 'react';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from '../Solicitud/ValidacionesGenerales';
import DatosSocio from '../Solicitud/DatosSocio';
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion, fetchAddProspecto, fetchInfoSocio, fetchNuevaSimulacionScore } from '../../services/RestServices';
import { get, set } from '../../js/crypt';
import Modal from '../Common/Modal/Modal';
import FinProceso from '../Solicitud/FinProceso';
import RegistroCliente from './RegistroCliente';
import DatosFinancieros from '../Solicitud/DatosFinancieros';
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
    };
};



const NuevaProspeccion = (props) => {
    const dispatch = useDispatch();
    const navigate = useHistory();
    //Info sesión
    const [usuario, setUsuario] = useState("");
    const [rol, setRol] = useState("");
    const [datosUsuario, setDatosUsuario] = useState([]);

    const [lstValidaciones, setLstValidaciones] = useState([]);
    const [gestion, setGestion] = useState("prospeccion");
    const [score, setScore] = useState("");

    //Global
    const [textoSiguiente, setTextoSiguiente] = useState("Continuar");

    //ValidacionesSocio

    //Validaciones
    const [validacionesOk, setValidacionesOk] = useState([]);
    const [validacionesErr, setValidacionesErr] = useState([]);
    const [nombreSocio, setNombreSocio] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [enteSocio, setEnteSocio] = useState('');
    const [celularSocio, setCelularSocio] = useState('');
    const [correoSocio, setCorreoSocio] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    
    //const [cedulaValidacion, setCedulaValidacion] = useState('');
    const [infoSocio, setInfoSocio] = useState([]);
    const [datosFaltan, setDatosFaltan] = useState(false);
    //const [modalVisible, setModalVisible] = useState(false);

    const [tipoDocumento, setTipoDocumento] = useState('-1');
    const [documento, setDocumento] = useState('');
    const [cedulaValida, setCedulaValida] = useState(false);

    //const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [datosFinancieros, setDatosFinancieros] = useState({
        montoSolicitado: 0,
        montoIngresos: 0,
        montoEgresos: 0,
        //montoGastosFinancieros: 0,
        montoGastoFinaCodeudor: "",
        montoRestaGstFinanciero: "",

    })
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    //Errores
    const [mensajeErrorScore, setMensajeErrorScore] = useState("");
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    //Boton siguiente
    const [estadoBotonSiguiente, setEstadoBotonSiguiente] = useState(true);
    

    //Score
    const [autorizacionOk, setAutorizacionOk] = useState(false);
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [step, setStep] = useState(0);
    const [subirAutorizacion, setSubirAutorizacion] = useState(false);
    const [isUploadingAthorization, setIsUploadingAthorization] = useState(false);
    const [idClienteScore, setIdClienteScore] = useState("");

    const [isCkeckRestaGtoFinananciero, setIsCkeckRestaGtoFinananciero] = useState(false);

    // Para registro Solicitud
    const [calificacionRiesgo, setCalificacionRiesgo] = useState("");
    const [cupoSugeridoAval, setCupoSugeridoAval] = useState(0);
    const [cupoSugeridoCoopM, setCupoSugeridoCoopM] = useState(0);


    //Info Socio
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);
    const getInfoSocioHandler = (data) => {
        setDirDomicilioSocio([...data.lst_dir_domicilio]);
        setDirTrabajoSocio([...data.lst_dir_trabajo]);
    }

    //Stepper
    const [visitadosSteps, setVisitadosSteps] = useState([0]);
    const [actualStepper, setActualStepper] = useState(0);

    //EFECTO PARA DESVANECER STEP 0
    const [isVisibleBloque, setIsVisibleBloque] = useState(true);

    //Retorno nueva simulacion
    //const [realizaNuevaSimulacion, setRealizaNuevaSimulacion] = useState(false);
    const realizaNuevaSimulacion = useRef(false);

    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        setUsuario(strOficial);
        const strRol = get(localStorage.getItem("role"));
        setRol(strRol);
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial }]);
    }, []);




    useEffect(() => {
        if (score.str_res_codigo === "000") {
            setStep(step + 1); // PASA AL PASO 2
            setActualStepper(3);
            setVisitadosSteps([...visitadosSteps, actualStepper + 1])
        }
        else if (score.str_res_codigo === "") {
            setMensajeErrorScore("Hubo un error al obtener el score, intente más tarde");
            setMostrarAlerta(true);
        }
    }, [score]);

     /*
    useEffect(() => {
        const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);

        //console.log("index,", index)
        //console.log("Autorizacion,", autorizacionOk)
        //console.log("Step,", step)

        //Si no se encuentra alerta, no debe subise la autorizacion para consulta al buro, caso contrario si
        if (!index && step === 1) {
        //if ((!index && step === 1) || (!index && step === 2)) {
            setEstadoBotonSiguiente(false);
            setAutorizacionOk(true);
            setGestion("prospeccion")
        }
        else {
            setAutorizacionOk(false);
            setSubirAutorizacion(false);
            setEstadoBotonSiguiente(false);
            setGestion("prospeccion")
        }
        if (validacionesErr.length === 10) {
            setEstadoBotonSiguiente(true);
            //setEstadoBtonProspecto(true);
        }    
        console.log("Autorizacion,", autorizacionOk)
    }, [validacionesErr]);*/


    const agregarComentarioHandler = (e) => {

    }

    useEffect(() => {
        if (step === 0 && documento !== '' && !setCedulaValida) {
            setEstadoBotonSiguiente(true);
        }
        if (step === 1) {
            setEstadoBotonSiguiente(true);
        }
        if (step === -1) {
            setTextoSiguiente("Volver al inicio")
        }
    }, [step]);

    const validaCamposSocio = () => {
        //console.log(`${documento}|${nombreSocio}|${apellidoPaterno}|${apellidoMaterno}|${correoSocio}|${celularSocio}`)

        

        if (documento !== "" && nombreSocio !== "" && apellidoPaterno !== "" && apellidoMaterno !== "" && correoSocio !== "" &&
            (celularSocio !== "" && celularSocio.length > 0 && celularSocio.length === 10)) {
            //console.log("CAMPOS CLIENTE LLENOS")
            return true;
        }
        //console.log("Faltan campos a rellenar")
        return false;
    }


    //Validacion campos cuando no se edita
    const validaCamposFinancieros = () => {
        //Si esta activo el check de Gastos Financieros valida campo
        let validadorOtrosMontos = false;
        let validaRestoMontoGstFinanciero = false;


        console.log(`montoSolicitado ${datosFinancieros.montoSolicitado}, montoEgresos ${datosFinancieros.montoIngresos},  montoEgresos ${datosFinancieros.montoEgresos} `)
        if ((datosFinancieros.montoSolicitado > 0 && datosFinancieros.montoSolicitado <= 99999) &&
            (datosFinancieros.montoIngresos > 0 && datosFinancieros.montoIngresos <= 99999) &&
            (datosFinancieros.montoEgresos > 0 && datosFinancieros.montoEgresos <= 99999)
            //    && datosFinancieros.montoGastosFinancieros > 0
        ) {
            validadorOtrosMontos = true;
        } 

        //TODO VALIDAR CAMPO FINANCIERO CODEUDOR CUANDO SEA NUEVO SIMULACION
        console.log("RESTA GASTO FIN ", datosFinancieros.montoRestaGstFinanciero)
        if (isCkeckRestaGtoFinananciero === true) {
            if (IsNullOrEmpty(datosFinancieros.montoRestaGstFinanciero) || datosFinancieros.montoRestaGstFinanciero === "" || datosFinancieros.montoRestaGstFinanciero === " ") {
                //console.log("Resta Gst Financ, ", datosFinancieros.montoRestaGstFinanciero)
                console.log("Retorna 1");
                validaRestoMontoGstFinanciero = false;
                return false;
            } else if (Number(datosFinancieros.montoRestaGstFinanciero) < 0 && Number(datosFinancieros.montoRestaGstFinanciero) >= 100000) {
                validaRestoMontoGstFinanciero = false;
                return false;
            }
            else {
                validaRestoMontoGstFinanciero = true;
            }
        } else if (isCkeckRestaGtoFinananciero === false) {
            validaRestoMontoGstFinanciero = true;
        }      

        //console.log(`Check ${validadorCheck}, cupo ${validadorOtrosMontos},  restoGast ${validaRestoMontoGstFinanciero} `)
        //if (validadorCheck && validadorOtrosMontos && validaRestoMontoGstFinanciero) {
        if (validadorOtrosMontos && validaRestoMontoGstFinanciero) {
            return true;
        } else {
            return false;
        }

    }
   
    useEffect(() => {
        if (step === 1) {
            if (validaCamposSocio()) {
                setEstadoBotonSiguiente(false);
            }
            else {
                setEstadoBotonSiguiente(true);
            }
        }
    }, [validaCamposSocio, step])



    ///CAMBIOS
    useEffect(() => {
        if (step === 2 && autorizacionOk) {
            setEstadoBotonSiguiente(false);
        }
        else if (step === 2 && archivoAutorizacion) {
            setEstadoBotonSiguiente(false);
        }
        else if (step === 2 && !archivoAutorizacion) {
            setEstadoBotonSiguiente(true);
        }
    }, [archivoAutorizacion]);

    useEffect(() => {
        if (step === 3) {
            //setDatosFinancieros(datosFinancieros);
            const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);
            if (validaCamposFinancieros() && !index) {
                setEstadoBotonSiguiente(false);
            } else {
                setEstadoBotonSiguiente(true);
            }
        }

    }, [datosFinancieros, step, validaCamposFinancieros, validacionesErr, isCkeckRestaGtoFinananciero])

   
  
    /*
    useEffect(() => {
        const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);

        //console.log("index,", index)
        // console.log("VALIDACION DE CAMPOS,", step);
        // Controles para pasar a la consulta al score. Valida que no exista Alerta Consulta buro
        if (step === 2 && showAutorizacion === false) {
            if (validaCamposSocio()) {
                if (validaCamposFinancieros() && !index) {
                    setEstadoBotonSiguiente(false);
                } else {
                    setEstadoBotonSiguiente(true);
                }
            }
            else {
                setEstadoBotonSiguiente(true);
            }
        }
    }, [datosFinancieros, step, validaCamposSocio, validaCamposFinancieros, isCkeckGtosFinancieros, validacionesErr, archivoAutorizacion]);
    */

    const refrescarInformacionHandler = (actualizarInfo) => {
        fetchValidacionSocio(documento, '', props.token, (data) => {
            console.log("PROSP ", data)
            setNombreSocio(data.str_nombres);
            setApellidoPaterno(data.str_apellido_paterno);
            setApellidoMaterno(data.str_apellido_materno);
            setCelularSocio(data.str_celular);
            setCorreoSocio(data.str_email);
            setFechaNacimiento(data.str_fecha_nacimiento)

            data.cedula = documento
            data.nombres = data.str_nombres
            data.apellidoPaterno = data.str_apellido_paterno
            data.apellidoMaterno = data.str_apellido_materno
            data.celularCliente = data.str_celular
            data.correoCliente = data.str_email
            data.fechaNacimiento = data.str_fecha_nacimiento

            //console.log(`ingresos, ${data.dcm_total_ingresos}; egresos, ${data.dcm_total_egresos}; financ, ${data.dcm_gastos_financieros} `,);
            let datosFinan = {
                montoSolicitado: 0,
                montoIngresos: data.dcm_total_ingresos,
                montoEgresos: data.dcm_total_egresos,
                //montoGastosFinancieros: data.dcm_gastos_financieros,
                montoGastoFinaCodeudor: "",
                montoRestaGstFinanciero: "",
            }
            setDatosFinancieros(datosFinan);

            setInfoSocio(data);
            setEnteSocio("")
            if (!actualizarInfo) {
                setStep(1);
                let retrasoEfecto = setTimeout(function () {
                    setIsVisibleBloque(true);
                    clearTimeout(retrasoEfecto);
                }, 100);
            }
            

        }, dispatch);
    }

    const nextHandler = async () => {
        console.log("STEPPP ", step)
        if (step === 0) {
            //TODO: FALTA EDITAR PARA EXTRAER INGRESOS, EGRESOS, GASTOS FINANCIEROS TITULAR
            setIsVisibleBloque(false);
            refrescarInformacionHandler(false);
        }
        if (step === 1) {
            setStep(2);
            setVisitadosSteps([...visitadosSteps, actualStepper + 1])
            setActualStepper(1);

            //TODO: HACER NUEVA CONSULTA DE LAS ALERTAS ANTES DE PASAR AL 2 pasar la fecha de nacimiento
            const objValidaciones = {
                "lst_validaciones_ok": [
                    { str_descripcion_alerta: "SOCIO CUENTA CON INFORMACION ACTUALIZADA" }, { str_descripcion_alerta: "SOCIO MANTIENE ACTIVA SUS CUENTAS DE AHORROS" },
                    { str_descripcion_alerta: "SOCIO PUEDE REALIZAR LA CONSULTA AL BURO" }],
                "lst_validaciones_err": []
            }
            handleLists(objValidaciones)

            /*
            const arrValidacionesOk = [...data.lst_datos_alerta_true];
            const arrValidacionesErr = [...data.lst_datos_alerta_false];
            setValidacionesOk(arrValidacionesOk);
            setValidacionesErr(arrValidacionesErr);
            const objValidaciones = {
                "lst_validaciones_ok": [...data.lst_datos_alerta_true],
                "lst_validaciones_err": [...data.lst_datos_alerta_false]
            }
            //console.log("VALIDACIONES, ", objValidaciones)
            handleLists(objValidaciones);*/


        }
        if (step === 2) {
            //console.log("STEP 1, SHOW ", showAutorizacion)

            if (showAutorizacion) {
                fetchAddAutorizacion("C", 1, "F", documento, nombreSocio, apellidoPaterno, apellidoMaterno,
                    archivoAutorizacion, props.token, (data) => {
                        //console.log("AUTOR, ", data);
                        if (data.str_res_codigo === "000") {
                            const estadoAutorizacion = validacionesErr.find((validacion) => { return validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" })
                            estadoAutorizacion.str_estado_alerta = "True";
                            setSubirAutorizacion(false);
                            setIsUploadingAthorization(false);
                            setShowAutorizacion(false);


                            //TODO CAMBIAR AL NUEVO METODO DE ALERTAS
                            fetchValidacionSocio(documento, '', props.token, (data) => {
                                const arrValidacionesOk = [...data.lst_datos_alerta_true];
                                const arrValidacionesErr = [...data.lst_datos_alerta_false];
                                setValidacionesOk(arrValidacionesOk);
                                const objValidaciones = {
                                    "lst_validaciones_ok": [...data.lst_datos_alerta_true],
                                    "lst_validaciones_err": [...data.lst_datos_alerta_false]
                                }
                                handleLists(objValidaciones);
                                setAutorizacionOk(false);
                                setValidacionesErr(arrValidacionesErr);
                            }, dispatch);
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
            const dataSocio = infoSocio;
            dataSocio.datosFinancieros = datosFinancieros;
            setInfoSocio(dataSocio);
            //setVisitadosSteps([...visitadosSteps, actualStep + 1])
            //setActualStep(4);
            //setStep(4);

            //const strNombreSocio = `${nombresSolicitud} ${pApellidoSolicitud} ${sApellidoSolicitud}`;

            /*const strOficina = "MATRIZ";
            //const strOficina = get(localStorage.getItem("office"));
            const strOficial = get(localStorage.getItem("sender_name"));
            const strCargo = get(localStorage.getItem("role"));*/

            if (!realizaNuevaSimulacion.current) {
                console.log("PRIMERA CONSULTA BURO ")

                //TODO: CAMBIAR LA CEDULA por "documento"
                await fetchScore("C", "1150214375", nombreSocio + " " + apellidoPaterno + " " + apellidoMaterno, "Matriz", datosUsuario[0].strOficial, datosUsuario[0].strCargo, props.token, (data) => {
                    setScore(data);
                    setIdClienteScore(data.int_cliente);
                    //console.log("SCORE, ", data.int_cliente)
                    //setRealizaNuevaSimulacion(true);
                    realizaNuevaSimulacion.current = true
                    //const scoreStorage = JSON.stringify(data);
                    //localStorage.setItem('dataPuntaje', scoreStorage.toString());
                    datosFinancieros.montoGastoFinaCodeudor = data.str_gastos_codeudor;
                    setDatosFinancieros(datosFinancieros)


                }, dispatch);

            } else if (realizaNuevaSimulacion.current){

                console.log("NUEVA SIMULACION")

                let datosFinan = datosFinancieros;
                if (!datosFinan.montoIngresos) datosFinan.montoIngresos = 0;
                if (!datosFinan.montoEgresos) datosFinan.montoEgresos = 0;
                if (!datosFinan.montoRestaGstFinanciero || datosFinan.montoRestaGstFinanciero === "" || datosFinan.montoRestaGstFinanciero === " " || IsNullOrEmpty(datosFinan.montoRestaGstFinanciero)) datosFinan.montoRestaGstFinanciero = 0;
                if (!datosFinan.montoGastoFinaCodeudor || datosFinan.montoGastoFinaCodeudor === "" || datosFinan.montoGastoFinaCodeudor === " " || IsNullOrEmpty(datosFinan.montoGastoFinaCodeudor)) datosFinan.montoGastoFinaCodeudor = 0;

                //TODO CAMBIAR LA CEDULA
                await fetchNuevaSimulacionScore("C", "1150214375", nombreSocio + " " + apellidoPaterno + " " + apellidoMaterno, "Matriz", datosUsuario[0].strOficial, datosUsuario[0].strCargo, datosFinan.montoIngresos, datosFinan.montoEgresos, datosFinan.montoRestaGstFinanciero, datosFinan.montoGastoFinaCodeudor,
                    props.token, (data) => {

                        //scoreStorage.montoSugerido = Number.parseFloat(nuevoCupoSugerido).toFixed(2);
                        /*scoreStorage.montoSugerido = Number.parseFloat(data.str_cupo_sugerido).toFixed(2);
                        let datosFinan = datosFinancieros;
                        datosFinan.montoGastoFinaCodeudor = data.str_gastos_codeudor;
                        setDatosFinancieros(datosFinan);
                        console.log("data Score Alm ", scoreStorage.montoSugerido);
                        console.log("data FINAN ACT ", datosFinan);*/

                        //console.log("CUPO SUG COOPMEGO, ", data.str_cupo_sugerido_ccopmego);
                        //setCupoSugeridoCoopM(data.str_cupo_sugerido_ccopmego);
                        setCupoSugeridoCoopM(data.str_cupo_sugerido);
                        setScore(data);

                    }, dispatch);

            }           
            
        }

        if (step === 4) {
            //REALIZA REGISTROS DE SIMULACION
            //SIMULACION GUARDADA
            console.log("STEP 4")
            fetchAddProspecto(documento, 0, nombreSocio, apellidoPaterno + " " + apellidoMaterno, celularSocio, correoSocio, datosFinancieros.montoSolicitado, comentario, comentarioAdic, props.token, (data) => {
                console.log("RESP ADD PROSP, ", data)
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setActualStepper(4);
                setStep(-1);
            }, dispatch)

           
        }
        
        if (step === -1) {
            navigate.push('/solicitud');
        }
    }

    const handleLists = (e) => {
        setLstValidaciones(e);
    }

    const checkGastosFinancieroHandler = (e) => {
        setIsCkeckRestaGtoFinananciero(e);
    }

    
    const cedulaSocioHandler = (e) => {
        setDocumento(e.valor)
        //setCedulaValidacion(e.valor)
        if (step === 0 && e.valido) {
            setEstadoBotonSiguiente(false)
            setCedulaValida(true);
        }
        else {
            setEstadoBotonSiguiente(true);
        }
    }

    const datosFinancierosHandler = (dato) => {
        let datosFinanciero = {
            montoSolicitado: dato.montoSolicitado,
            montoIngresos: dato.montoIngresos,
            montoEgresos: dato.montoEgresos,
            //montoGastosFinancieros: dato.montoGastosFinancieros,
            montoGastoFinaCodeudor: dato.montoGastoFinaCodeudor,
            montoRestaGstFinanciero: dato.restaGastoFinanciero
        }
        setDatosFinancieros(datosFinanciero)

    }

    const datosIngresadosHandler = (e) => {
        //setCedulaSocio(e.documento)
        setNombreSocio(e.nombres);
        setApellidoPaterno(e.apellidoPaterno);
        setApellidoMaterno(e.apellidoMaterno);
        setCelularSocio(e.celular);
        setCorreoSocio(e.correo);
        setDocumento(e.documento);
        setFechaNacimiento(e.fechaNacimiento);
    }



    const getFileHandler = (e) => {
        //Si se carga documento enviar a step para agregar la autorizacion a consulta buro
        setArchivoAutorizacion(e);
        setEstadoBotonSiguiente(true);
        


        /*
        const bytesArchivo = null;        
        const fileBytes = new Uint8Array(e);
        // Ahora puedes trabajar con 'fileBytes'
        console.log(fileBytes);
        bytesArchivo(fileBytes);
        setArchivoAutorizacion(bytesArchivo);*/


    }

    
    const handleAutorizacion = (data) => {
        console.log(data);
        setIsUploadingAthorization(data);
    }

    const [comentario, setComentario] = useState("");
    const [comentarioAdic, setComentarioAdic] = useState("");

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

    const steps = [
        "Datos personales",
        "Requisitos",
        "Datos financieros",
        "Simulación",
        "Registro simulación",
    ];

    const anteriorStepHandler = (paso) => {
        if (actualStepper !== 0) {
            const updateSteps = visitadosSteps.filter((index) => index !== actualStepper);
            setVisitadosSteps(updateSteps);
            setActualStepper(actualStepper - 1);
        }
        setIsVisibleBloque(true);
        setStep(step - 1)
    }


    const AtajoTecladoHandler = (event, accion) => {
        if (accion === "Enter" && cedulaValida && step === 0) {
            nextHandler(step);
        }
    }

    return (
        <div className="f-row" >
            <Sidebar enlace={props.location.pathname}></Sidebar>
            
            {showAutorizacion.toString()}
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-col justify-content-center">

                    <div className="stepper">
                        <Stepper steps={steps} setStepsVisited={visitadosSteps} setActualStep={actualStepper} />
                    </div>

                    {(step === 0 || step === 1) &&
                        <div className={"f-row w-100 justify-content-center"}>
                            <RegistroCliente paso={step}
                                token={props.token}
                                setCedulaSocio={cedulaSocioHandler}
                                infoSocio={infoSocio}
                                datosIngresados={datosIngresadosHandler} 
                                isVisibleBloque={isVisibleBloque}
                                requiereActualizar={refrescarInformacionHandler}
                                AtajoHandler={AtajoTecladoHandler}
                                ></RegistroCliente>
                        </div>
                    }

                    {(step === 2) &&
                        <div className="f-row w-100 justify-content-center">
                        <ValidacionesGenerales token={props.token}
                            infoSocio={infoSocio}
                            lst_validaciones={lstValidaciones}
                            onFileUpload={getFileHandler}
                            onShowAutorizacion={showAutorizacion}                            
                            onAddAutorizacion={handleAutorizacion}
                            datosUsuario={datosUsuario}
                            onSetShowAutorizacion={showAutorizacionHandler}
                            cedula={documento}
                            ></ValidacionesGenerales>
                        </div>
                    }


                    {(step === 3) &&
                        /*habilitaRestaGstFinancieros={realizaNuevaSimulacion}*/
                        <div className="f-row w-100">
                            <DatosFinancieros
                                dataConsultFinan={datosFinancieros}
                                datosFinancieros={datosFinancierosHandler}
                                isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                                gestion={gestion}
                                requiereActualizar={refrescarInformacionHandler}
                                isCheckMontoRestaFinanciera={isCkeckRestaGtoFinananciero}
                            >
                            </DatosFinancieros>
                        </div>
                    }

                    {(step === 4) &&
                            <DatosSocio
                                informacionSocio={infoSocio}
                                lst_validaciones={lstValidaciones}
                                score={score}
                                token={props.token}
                                onAgregarComentario={agregarComentarioHandler}
                                gestion={gestion}
                                onInfoSocio={getInfoSocioHandler}
                                onComentario={handleComentario}
                            onComentarioAdic={handleComentarioAdic}
                            idClienteScore={idClienteScore}
                            ></DatosSocio>                        
                    }
                  
                    {step === -1 &&
                        <FinProceso gestion={gestion}
                            nombres={`${nombreSocio} ${apellidoPaterno} ${apellidoMaterno}`}
                            cedula={documento}
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
                    <Item xs={8} sm={8} md={8} lg={8} xl={8} className="f-row justify-content-space-evenly">
                        {(step === 1 || step === 3) &&
                            <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} onClick={refrescarInformacionHandler}>{"Actualizar"}</Button>
                        }  
                        <Button className={["btn_mg btn_mg__primary mt-2"]} disabled={estadoBotonSiguiente} onClick={nextHandler}>{textoSiguiente}</Button>
                    </Item>

                </div>

            </Card>


        </div >
    )
}

export default connect(mapStateToProps, {})(NuevaProspeccion);