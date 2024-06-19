/* eslint-disable react-hooks/exhaustive-deps */
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from "../Common/Card";
import { IsNullOrEmpty, IsNullOrWhiteSpace, getBase64 } from "../../js/utiles";
import Sidebar from '../Common/Navs/Sidebar';
import Button from '../Common/UI/Button';
import { useState, useEffect } from 'react';
import ValidacionSocio from './ValidacionSocio';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from './ValidacionesGenerales';
import DatosSocio from './DatosSocio';
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion, fetchAddSolicitud, fetchInfoSocio } from '../../services/RestServices';
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
    };
};



const NuevaSolicitud = (props) => {
    const dispatch = useDispatch();
    const navigate = useHistory();
    //Info sesión
    const [usuario, setUsuario] = useState("");
    const [rol, setRol] = useState("");
    const [datosUsuario, setDatosUsuario] = useState([]);

    const [lstValidaciones, setLstValidaciones] = useState([]);
    const [gestion, setGestion] = useState("solicitud");
    const [score, setScore] = useState("");

    //Global
    const [textoSiguiente, setTextoSiguiente] = useState("Continuar");

    const [datosFinancieros, setDatosFinancieros] = useState({
        montoSolicitado: 0,
        montoIngresos: 0,
        montoEgresos: 0,
        montoGastosFinancieros: 0,
        montoGastoFinaCodeudor: "",
        montoRestaGstFinanciero: "",

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

    const [datosFaltan, setDatosFaltan] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [isCkeckGtosFinanCodeudor, setIsCkeckGtosFinanCodeudor] = useState(false);

    //Errores
    const [mensajeErrorScore, setMensajeErrorScore] = useState("");
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    //Boton siguiente
    const [estadoBotonSiguiente, setEstadoBotonSiguiente] = useState(true);
    const [estadoBotonProspecto, setEstadoBtonProspecto] = useState(true);

    //Score
    const [autorizacionOk, setAutorizacionOk] = useState(false);
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [step, setStep] = useState(0);
    const [subirAutorizacion, setSubirAutorizacion] = useState(false);
    const [isUploadingAthorization, setIsUploadingAthorization] = useState(false);
    const [idClienteScore, setIdClienteScore] = useState(0);

    // DatosSocio componente
    const [calificacionRiesgo, setCalificacionRiesgo] = useState("");


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
    const getIfoSocioHandler = (data) => {
        setDirDomicilioSocio([...data.lst_dir_domicilio]);
        setDirTrabajoSocio([...data.lst_dir_trabajo]);
    }

    //Retorno nueva simulacion
    const [realizaNuevaSimulacion, setRealizaNuevaSimulacion] = useState(false);


    //EFECTO PARA DESVANECER STEP 0
    const [isVisibleBloque, setIsVisibleBloque] = useState(true);

    /*const toggleVisibilityBloque = () => {
        setIsVisibleBloque(!isVisibleBloque);
    };*/

     useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        setUsuario(strOficial);
        const strRol = get(localStorage.getItem("role"));
         setRol(strRol);
         const userOficial = get(localStorage.getItem('sender'));
         setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial }]);
         //console.log(`DATOS USER, ${strOficial}, ${strRol} , ${userOficial}`)
    }, []);

    

    //Validacion campos cuando no se edita
    const validaCamposFinancieros = () => {
        //Si esta activo el check de Gastos Financieros valida campo
        let validadorCheck = false;
        let validadorOtrosMontos = false;
        let validaRestoMontoGstFinanciero = false;

        if (datosFinancieros.montoSolicitado > 0 && datosFinancieros.montoIngresos > 0 &&
            datosFinancieros.montoEgresos > 0
            //    && datosFinancieros.montoGastosFinancieros > 0
        ) {
            validadorOtrosMontos = true;
        }

        //console.log(`isCkeckGtosFinancieros ${isCkeckGtosFinancieros}, GastosFinancieros ${datosFinancieros.montoGastosFinancieros}`)
        if (isCkeckGtosFinanCodeudor === true) {
            if (IsNullOrEmpty(datosFinancieros.montoGastoFinaCodeudor) || datosFinancieros.montoGastoFinaCodeudor === "0" || datosFinancieros.montoGastoFinaCodeudor === "" || datosFinancieros.montoGastoFinaCodeudor === " ") {
                //console.log("GastosFinancieros, falso, ", datosFinancieros.montoGastosFinancieros)
                validadorCheck = false;
                return false;
            } else {
                validadorCheck = true;
                //console.log("GastosFinancieros, true")
            }
        } else if (isCkeckGtosFinanCodeudor === false) {
            validadorCheck = true;
        }        

        //Si se vuelve a realizar la Simulacion Habilita campos
        if (realizaNuevaSimulacion) {
            if (IsNullOrEmpty(datosFinancieros.montoRestaGstFinanciero) ||  datosFinancieros.montoRestaGstFinanciero === "" || datosFinancieros.montoRestaGstFinanciero === " ") {
                console.log("Resta Gst Financ, ", datosFinancieros.montoRestaGstFinanciero)
                validaRestoMontoGstFinanciero = false;
                return false;
            } else {
                validaRestoMontoGstFinanciero = true;
                
            }
        } else {
            validaRestoMontoGstFinanciero = true;
        }

        //console.log(`Check ${validadorCheck}, cupo ${validadorOtrosMontos},  restoGast ${validaRestoMontoGstFinanciero} `)
        if (validadorCheck && validadorOtrosMontos && validaRestoMontoGstFinanciero) {
            return true;
        } else {
            return false;
        }
        
    }

    const validaCamposPersonalizacion = () => {
        let validador = false;

        if (nombrePersonalTarjeta !== '' && direccionEntrega !== '' && tipoEntrega !== '') {
            validador = true
        }

        return validador;

    }



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
            const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);
            if (validaCamposFinancieros() && !index) {
                setEstadoBotonSiguiente(false);
            } else {
                setEstadoBotonSiguiente(true);
            }
        }

    }, [datosFinancieros, step, validaCamposFinancieros])

    useEffect(() => {
        const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);
        const validacionesErrorTotal = validacionesErr.length;
        //console.log("TOTAL validaciones ok, ", validacionesErrorTotal);

        // Controles para pasar a la consulta al score. Valida que todas las alertas esten OK
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
        else if (score.str_res_codigo === "") {
            setMensajeErrorScore("Hubo un error al obtener el score, intente más tarde");
            setMostrarAlerta(true);
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
        if (step === 5 && validaCamposPersonalizacion) {
            setEstadoBotonSiguiente(false);
        }
    }, [step]);


    

    const getFileHandler = (event) => {
        setArchivoAutorizacion(event);
        //console.log("RETURN ARC, ", event)      


    }


    const agregarComentarioHandler = (e) => {

    }

    const checkGastosFinancieroHandler = (e) => {
        setIsCkeckGtosFinanCodeudor(e);
    }

    const refrescarInformacionHandler = (valor) => {
        //setUpdGastoFinancieros(valor);
        //TODO: FALTA EDITAR PARA EXTRAER INGRESOS, EGRESOS, GASTOS FINANCIEROS TITULAR
        fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
            //console.log("SOC,", data)
            const arrValidacionesOk = [...data.lst_datos_alerta_true];
            const arrValidacionesErr = [...data.lst_datos_alerta_false];
            data.cedula = cedulaSocio;
            setValidacionesOk(arrValidacionesOk);
            setValidacionesErr(arrValidacionesErr);
            setEnteSocio(data.str_ente);
            setCelularSocio(data.str_celular);
            setCorreoSocio(data.str_email);
            setInfoSocio(data);
            //setApellidosSocio(`${data.str_apellido_paterno} ${data.str_apellido_materno}`)
            setNombreSocio(data.str_nombres);
            // ${data.str_apellido_paterno} ${data.str_apellido_materno}`);
            setApellidoPaterno(data.str_apellido_paterno);
            setApellidoMaterno(data.str_apellido_materno);

            let datosFinan = {
                montoSolicitado: 0,
                montoIngresos: data.dcm_total_ingresos,
                montoEgresos: data.dcm_total_egresos,
                montoGastosFinancieros: data.dcm_gastos_financieros,
                montoGastoFinaCodeudor: "",
                montoRestaGstFinanciero: "",
            }
            setDatosFinancieros(datosFinan);
            //console.log(`ingresos, ${data.dcm_total_ingresos}; egresos, ${data.dcm_total_egresos}; financ, ${data.dcm_gastos_financieros} `,);
            //console.log("FINAN, ", datosFinan);


            if (data.str_res_codigo === "100") {
                setTextoAviso("Ya se encuentra registrada una solicitud con esa cédula.")
                setModalMensajeAviso(true);
                //console.log("SOLIC YA CREADA");
            }
            else if (data.str_nombres !== "") {
                //setVisitadosSteps([...visitadosSteps, actualStep + 1])
                //setActualStep(1);
                //setTimeout('',2000);
                setStep(1);
                let retrasoEfecto = setTimeout(function () {
                    setIsVisibleBloque(true);
                    clearTimeout(retrasoEfecto);
                }, 100);
                //setEstadoBotonSiguiente(true);
            }
            else if (data.str_nombres === "") {
                setTextoAviso("Se requiere actualizar información personal. Intente realizar una Prospección.")
                setModalMensajeAviso(true);
            }
            const objValidaciones = {
                "lst_validaciones_ok": [...data.lst_datos_alerta_true],
                "lst_validaciones_err": [...data.lst_datos_alerta_false]
            }
            handleLists(objValidaciones);
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
        
        setIsVisibleBloque(true);
        setStep(step - 1)
    }

    const nextHandler = async () => {

        //console.log("step,", step)
        if (step === 0) {            
            setIsVisibleBloque(false);
            refrescarInformacionHandler();            
        }
        if (step === 1) {
            //setCambioRetorno(true)
            setStep(2);
            setVisitadosSteps([...visitadosSteps, actualStepper + 1])
            setActualStepper(1);
            
        }
        if (step === 2) {
            //console.log(`SHOW AUTOR, ${showAutorizacion}`)

            if (showAutorizacion) {
                //console.log("CED ENVIA DOC, ", cedulaSocio)
                fetchAddAutorizacion("C", 1, "F", cedulaSocio, nombreSocio, apellidoPaterno, apellidoMaterno, archivoAutorizacion, props.token, (data) => {
                    //console.log("AUTOR, ", data);
                    if (data.str_res_codigo === "000") {
                        const estadoAutorizacion = validacionesErr.find((validacion) => { return validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" })
                        estadoAutorizacion.str_estado_alerta = "True";
                        setSubirAutorizacion(false);
                        setIsUploadingAthorization(false);
                        setShowAutorizacion(false);
                        fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
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
                //setCambioRetorno(true)
                setActualStepper(2);
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setStep(3)
            }           
            

        }
        
        if (step === 3) {
            //DATOS FINANCIEROS SE GUARDA EN VARIABLES           
            
            const dataSocio = infoSocio;
            dataSocio.datosFinancieros = datosFinancieros;
            setInfoSocio(dataSocio);

            /*
            const strOficina = "MATRIZ";
            //const strOficina = get(localStorage.getItem("office"));
            const strOficial = get(localStorage.getItem("sender_name"));
            const strCargo = get(localStorage.getItem("role"));*/

            if (!realizaNuevaSimulacion) {
                //console.log("PRIMERA CONSULTA BURO ")
                await fetchScore("C", "1150214375", nombreSocio + " " + apellidoPaterno + " " + apellidoMaterno, "Matriz", datosUsuario.strOficial, datosUsuario.strCargo, props.token, (data) => {
                    setScore(data);
                    setIdClienteScore(data.int_cliente);
                    //console.log("SCORE, ", data.int_cliente)
                    setRealizaNuevaSimulacion(true);
                    const scoreStorage = JSON.stringify(data);
                    localStorage.setItem('dataPuntaje', scoreStorage.toString());
                    

                }, dispatch);
            } else {
                let scoreStorage = JSON.parse((localStorage.getItem('dataPuntaje')));
               

                //Simulacion nueva campo monto sugerido
                const ingresoNeto = ((datosFinancieros.montoIngresos - datosFinancieros.montoEgresos - datosFinancieros.montoGastosFinancieros + Number(datosFinancieros.montoRestaGstFinanciero)))

                //TODO CAMBIAR CEDULA y calificacion hacer cambio a porcentaje, ahora retorna solo A1.
                await fetchInfoSocio("1105970717", props.token, (data) => {
                    calificacionRiesgoHandler(data.datos_cliente[0].str_calificacion_riesgo)
                    console.log(data.datos_cliente[0].str_calificacion_riesgo)
                }, dispatch);
                
                const valorCP = ingresoNeto * 0.4; //TODO: valor temporal Calificacion riesgo -->  propiedad a recuperar calificacionRiesgo (infoSocio. str_calificacion_riesgo)
                const taza = 0.167;
                const plazo = 12;
                const tazaVsPlazo = (taza / plazo);

                

                //const numerador = (Math.pow(1 + tazaVsPlazo, plazo) - 1);
                //const denominador = (tazaVsPlazo * (Math.pow(1 + tazaVsPlazo, plazo)));
                //const nuevoCupoSugerido = valorCP *(numerador / denominador);
                //console.log(`Num ${numerador}, Den ${denominador}, NUevoCupo ${nuevoCupoSugerido}`);
               

                const nuevoCupoSugerido = valorCP * ((Math.pow(1 + tazaVsPlazo, plazo) - 1) / (tazaVsPlazo * (Math.pow(1 + tazaVsPlazo, plazo))));
                console.log(`NETO ${ingresoNeto}, cp ${valorCP}, tazaPla ${tazaVsPlazo}, nuevoCupo ${nuevoCupoSugerido}`);
                

                scoreStorage.montoSugerido = Number.parseFloat(nuevoCupoSugerido).toFixed(2);
                //console.log("data Score Alm ", scoreStorage.montoSugerido);
                setScore(scoreStorage);
            }

            

        }
        if (step === 4) {
            //setCambioRetorno(true)
            setVisitadosSteps([...visitadosSteps, actualStepper + 1])
            setActualStepper(4);
            setStep(5);
            setEstadoBotonSiguiente(true);
        }
        if (step === 5) {

            //console.log("CONTROL NOMBRE", nombreSocio)
            //console.log("apellidoPaterno", apellidoPaterno )
            //console.log("apellidoMaterno", apellidoMaterno )
            let body = {
                int_ente_aprobador: 589693,
                str_tipo_documento: "C",
                str_num_documento: cedulaSocio,
                str_nombres: nombreSocio, 
                str_primer_apellido: apellidoPaterno, 
                str_segundo_apellido: apellidoMaterno, 
                dtt_fecha_nacimiento: infoSocio.str_fecha_nacimiento, 
                str_sexo: infoSocio.str_sexo,
                dec_cupo_solicitado: datosFinancieros.montoSolicitado, 
                dec_cupo_sugerido: 100,
                str_correo: correoSocio,
                str_usuario_proc: datosUsuario.strUserOficial,
                int_oficina_proc: 1, //TODO: setItem('office' aun no retorna nada 
                str_ente: enteSocio,
                str_denominacion_tarjeta: nombrePersonalTarjeta,
                str_comentario_proceso: comentario,
                str_comentario_adicional: comentarioAdic
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

    const closeModalHandler = () => {
        setModalVisible(false);
    }


    const nombreTarjetaHandler = (data) => {
        setNombrePersonalTarjeta(data);
    }

    const tipoEntregaHandler = (data) => {
        setTipoEntrega(data);
    }

    const direccionEntregaHandler = (data) => {
        setDireccionEntrega(data);
    }

    const handleAutorizacion = (data) => {
        //console.log(data);
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

    const retornoAviso = () => {
        navigate.push('/solicitud');
    }

    const datosFinancierosHandler = (dato) => {
        let datosFinanciero = {
            montoSolicitado: dato.montoSolicitado,
            montoIngresos: dato.montoIngresos,
            montoEgresos: dato.montoEgresos,
            montoGastosFinancieros: dato.montoGastosFinancieros,
            montoGastoFinaCodeudor: dato.montoGastoFinaCodeudor,
            montoRestaGstFinanciero: dato.restaGastoFinanciero
        }
        setDatosFinancieros(datosFinanciero)

    }

    const calificacionRiesgoHandler = (calificacion) => {
        console.log("RETORNA CALIFICACION RIESGO, ", calificacion);
        setCalificacionRiesgo(calificacion)
    }

    const AtajoTecladoHandler = (event, accion) => {
        //ENTER
        /*console.log("Even ", event)
        console.log("Accion ", accion)
        console.log("Accion ", cedulaValida)*/
        if (accion === "Enter" && cedulaValida && step === 0 )  {
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
                        <Stepper steps={steps} setStepsVisited={visitadosSteps} setActualStep={actualStepper}/>
                    </div>
                    

                    {(step === 0 || step === 1) &&
                        <div className="f-row w-100 justify-content-center sliding-div ">
                            <ValidacionSocio paso={step}
                                token={props.token}
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
                                dataConsultFinan={datosFinancieros}
                                datosFinancieros={datosFinancierosHandler}
                                isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                                gestion={gestion}
                                habilitaRestaGstFinancieros={realizaNuevaSimulacion} 
                                requiereActualizar={refrescarInformacionHandler}
                        >
                        </DatosFinancieros>
                        </div>
                    }
                   {/* calificacionRiesgo={calificacionRiesgoHandler}*/}
                    {(step === 4) &&
                        <DatosSocio
                            informacionSocio={infoSocio}
                            lst_validaciones={lstValidaciones}
                            score={score}
                            token={props.token}
                            onAgregarComentario={agregarComentarioHandler}
                            gestion={gestion}
                            onInfoSocio={getIfoSocioHandler}
                            onComentario={handleComentario}
                            onComentarioAdic={handleComentarioAdic}
                            idClienteScore={idClienteScore}
                            
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
                    {step === 6 }

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
                        {(step === 1 || step === 3 ) &&
                            <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} onClick={refrescarInformacionHandler}>{"Actualizar"}</Button>
                        }                        
                        <Button className={["btn_mg btn_mg__primary mt-2 ml-2"]} disabled={estadoBotonSiguiente} onClick={()=>nextHandler(step)}>{textoSiguiente}</Button>
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