/* eslint-disable react-hooks/exhaustive-deps */
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from "../Common/Card";
import { IsNullOrEmpty, IsNullOrWhiteSpace, validarCorreo } from "../../js/utiles";
import Button from '../Common/UI/Button';
import { useState, useEffect, useRef } from 'react';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from '../Solicitud/ValidacionesGenerales';
import DatosSocio from '../Solicitud/DatosSocio';
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion, fetchAddProspecto, fetchNuevaSimulacionScore, fetchGetAlertasCliente } from '../../services/RestServices';
import { get } from '../../js/crypt';
import FinProceso from '../Solicitud/FinProceso';
import RegistroCliente from './RegistroCliente';
import DatosFinancieros from '../Solicitud/DatosFinancieros';
import Stepper from '../Common/Stepper';
import { v4 as uuidv4 } from 'uuid';
import { setDataSimulacionStateAction } from '../../redux/DataSimulacion/actions';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { Fragment } from 'react';

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



const NuevaProspeccion = (props) => {
    const [keyComponente, setKeyComponente] = useState();
    const generarKey = () => {
        let myUUID = uuidv4();
        setKeyComponente(myUUID);
    }

    const dispatch = useDispatch();
    const navigate = useHistory();
    //Info sesión
    const [usuario, setUsuario] = useState("");
    const [rol, setRol] = useState("");
    const [datosUsuario, setDatosUsuario] = useState([]);

    const [lstValidaciones, setLstValidaciones] = useState([]);
    const [gestion, setGestion] = useState("prospeccion");
    const [score, setScore] = useState("");
    const [puntajeScore, setPuntajeScore] = useState("");
    const [cupoSugeridoAval, setCupoSugeridoAval] = useState("");
    const [cupoSugeridoCoopmego, setCupoSugeridoCoopmego] = useState("0");

    //Global
    const [textoSiguiente, setTextoSiguiente] = useState("Continuar");

    const [controlMontoMinimoParametro, setControlMontoMinimoParametro] = useState(0);

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
    const [keyRegistroCliente, setKeyRegistroCliente] = useState(0);
    
    const [infoSocio, setInfoSocio] = useState([]);
    const [documento, setDocumento] = useState('');
    const [cedulaValida, setCedulaValida] = useState(false);
    const [datosFinancierosObj, setDatosFinancierosObj] = useState({
        montoSolicitado: 0,
        montoIngresos: 0,
        montoEgresos: 0,
        montoGastoFinaCodeudor: 0,
        montoRestaGstFinanciero: 0,

    })



    const [objetoDatosGenerales, setObjetoDatosGenerales] = useState({
        cedula: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        celularCliente: "",
        correoCliente: "",
        fechaNacimiento: "",
    })

    useEffect(() => {
        let data = {
            cedula: documento,
            nombres: nombreSocio,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celularCliente: celularSocio,
            correoCliente: correoSocio,
            fechaNacimiento: fechaNacimiento,
        }
        setObjetoDatosGenerales(data)

    }, [celularSocio, correoSocio, documento, nombreSocio, apellidoPaterno, apellidoMaterno, fechaNacimiento]) //enteSocio



    const [comentario, setComentario] = useState("");
    const [comentarioAdic, setComentarioAdic] = useState("");

    //Errores
    const [mensajeErrorScore, setMensajeErrorScore] = useState("");
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    //Boton siguiente
    const [estadoBotonSiguiente, setEstadoBotonSiguiente] = useState(true);
    

    //Score
    const [autorizacionOk, setAutorizacionOk] = useState(false);
    const [archivoAutorizacion, setArchivoAutorizacion] = useState('');
    const [step, setStep] = useState(0);


    const [idClienteScore, setIdClienteScore] = useState("");

    const [isCkeckRestaGtoFinananciero, setIsCkeckRestaGtoFinananciero] = useState(false);


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
    const realizaNuevaSimulacion = useRef(false);

    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));
        const userOficina = get(localStorage.getItem('office'));
        const userOficial = get(localStorage.getItem('sender'));
        setUsuario(strOficial);
        setRol(strRol);
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);

        if (props.parametrosTC?.lst_parametros?.length > 0) {
            let ParametrosTC = props.parametrosTC.lst_parametros;
            /*PARAMETRO PARA CONTROL DE CUPO MINIMO A SOLICITAR EN TARJETA DE CRÉDITO*/
            setControlMontoMinimoParametro(Number(ParametrosTC.filter(param => param.str_nemonico === 'PRM_WS_TC_CUPO_MINIMO_SOL_TC')[0]?.str_valor_ini));
        }

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



    useEffect(() => {
        if (step === 0 && documento !== '' && !setCedulaValida) {

            setDocumento(" ")
            setNombreSocio(" ")
            setApellidoPaterno(" ")
            setApellidoMaterno(" ")
            setEnteSocio(" ")
            setCorreoSocio(" ")
            setFechaNacimiento(" ")
            setEstadoBotonSiguiente(true);
           
        }
        if (step === 1) {
            setEstadoBotonSiguiente(true);
        }
        if (step === 3) {
            setTextoSiguiente("Continuar")
        }
        if (step === 4) {
            setTextoSiguiente("Registrar")
        }
        if (step === -1) {
            setTextoSiguiente("Volver al inicio")
        }
    }, [step]);

    const validaCamposSocio = () => {  
        //apellidoMaterno !== "" &&
        if (documento !== "" && nombreSocio !== "" && apellidoPaterno !== "" && 
            (correoSocio !== "" && validarCorreo(correoSocio)) && (celularSocio !== "" && celularSocio.length > 0 && celularSocio.length === 10 &&
            fechaNacimiento !== "undefined--undefined")) {
            return true;
        }
        return false;
    }


    //Validacion campos cuando no se edita
    const validaCamposFinancieros = () => {
        //Si esta activo el check de Gastos Financieros valida campo
        let validadorOtrosMontos = false;
        let validaRestoMontoGstFinanciero = false;


        //console.log(`montoSolicitado ${datosFinancierosObj.montoSolicitado}, montoEgresos ${datosFinancierosObj.montoIngresos},  montoEgresos ${datosFinancierosObj.montoEgresos} `)
        if ((datosFinancierosObj.montoSolicitado > 0 && datosFinancierosObj.montoSolicitado <= 99999 && datosFinancierosObj.montoSolicitado >= controlMontoMinimoParametro) &&
            (datosFinancierosObj.montoIngresos > 0 && datosFinancierosObj.montoIngresos <= 99999) &&
            (datosFinancierosObj.montoEgresos > 0 && datosFinancierosObj.montoEgresos <= 99999)
            //    && datosFinancieros.montoGastosFinancieros > 0
        ) {
            validadorOtrosMontos = true;
        } 

        if (isCkeckRestaGtoFinananciero === true) {
            if ((Number(datosFinancierosObj.montoRestaGstFinanciero) > 0 && Number(datosFinancierosObj.montoRestaGstFinanciero) <= 99999)) {
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
            const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_090" && validacion.str_estado_alerta === "False");
            if (validaCamposFinancieros() && !index) {
                setEstadoBotonSiguiente(false);
            } else {
                setEstadoBotonSiguiente(true);
            }
        }

    }, [datosFinancierosObj, step, validaCamposFinancieros, validacionesErr, isCkeckRestaGtoFinananciero])

   
  
    
    // Controles para pasar a la consulta al score Comp DatosSocio. Valida que todas las alertas esten OK
    useEffect(() => {
        const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_090" && validacion.str_estado_alerta === "False");     
        if (step === 2 && showAutorizacion === false) {
            if (!index) {
                setEstadoBotonSiguiente(false);
            } else {
                setEstadoBotonSiguiente(true);
            }
        }
    }, [step, validacionesErr, archivoAutorizacion]);
    
    useEffect(() => {
        if (comentario !== "" && comentarioAdic !== "") {
            setEstadoBotonSiguiente(false);
        } else {
            setEstadoBotonSiguiente(true); 
        }
    }, [comentario, comentarioAdic])


    useEffect(() => {
        console.log(datosUsuario)
    }, [datosUsuario])

    const refrescarInformacionHandler = (actualizarInfo) => {
        fetchValidacionSocio(documento, '', props.token, (data, error) => {
            //console.log("ERR ", error)

            setNombreSocio(data.str_nombres);
            setApellidoPaterno(data.str_apellido_paterno);
            let apellidoMaterno = data?.str_apellido_materno ? data.str_apellido_materno : '';
            setApellidoMaterno(apellidoMaterno);
            setCelularSocio(data.str_celular);
            setCorreoSocio(data.str_email);
            setFechaNacimiento(data.str_fecha_nacimiento)
            setKeyRegistroCliente(prevState => prevState+1) //se actualiza key para nuevo renderizado del componente


            data.cedula = documento
            data.nombres = data.str_nombres
            data.apellidoPaterno = data.str_apellido_paterno
            data.apellidoMaterno = apellidoMaterno
            data.celularCliente = data.str_celular
            data.correoCliente = data.str_email
            data.fechaNacimiento = data.str_fecha_nacimiento

            //console.log(`ingresos, ${data.dcm_total_ingresos}; egresos, ${data.dcm_total_egresos}; financ, ${data.dcm_gastos_financieros} `,);
            let datosFinan = {
                montoSolicitado: 0,
                montoIngresos: Number(data.dcm_total_ingresos),
                montoEgresos: Number(data.dcm_total_egresos),
                montoGastoFinaCodeudor: Number(datosFinancierosObj.montoGastoFinaCodeudor),
                montoRestaGstFinanciero: Number(datosFinancierosObj.montoRestaGstFinanciero),
            }
            setDatosFinancierosObj(datosFinan);
            setInfoSocio(data);
            //TODO validar que no tenga ente
            setEnteSocio("")
            if (!actualizarInfo) {
                setStep(1);
                let retrasoEfecto = setTimeout(function () {
                    setIsVisibleBloque(true);
                    clearTimeout(retrasoEfecto);
                }, 100);
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

    const consultaAlertas = async (seguirAlSigPaso) => {
        let apellidosCliente = (apellidoMaterno !== null && apellidoMaterno !== '') ? apellidoPaterno + " " + apellidoMaterno : apellidoPaterno;
        await fetchGetAlertasCliente(documento, '', fechaNacimiento, nombreSocio, apellidosCliente, props.token, (data) => {
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
                    //lst_validaciones_ok.push(alertaN3)
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
                setStep(2);
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setActualStepper(1);
            }
        }, dispatch);
    }

    const nextHandler = async () => {
        //console.log("STEPPP ", step)
        if (step === 0) {
            setIsVisibleBloque(false);
            refrescarInformacionHandler(false);
        }
        if (step === 1) {
            //Se actuliza la informacion, de manera que se guarde la mas actualizada, en caso no se de click al actualizar
            refrescarInformacionHandler(true);
            await consultaAlertas(true);    
        }
        if (step === 2) {
            //console.log("STEP 1, SHOW ", showAutorizacion)
            if (showAutorizacion) {

                await fetchAddAutorizacion("C", 1, "F", documento, nombreSocio, apellidoPaterno, apellidoMaterno ? apellidoMaterno : '',
                    archivoAutorizacion, props.token, (data) => {
                        //console.log("AUTOR, ", data);
                        if (data.str_res_codigo === "000") {
                            setShowAutorizacion(false);
                            consultaAlertas(false);
                        }
                    }, dispatch);
                return;
            } else {
                generarKey();
                setActualStepper(2);
                setVisitadosSteps([...visitadosSteps, actualStepper + 1])
                setStep(3);                
            }

        }

        if (step === 3) {
            const dataSocio = infoSocio;
            dataSocio.datosFinancieros = datosFinancierosObj;
            setInfoSocio(dataSocio);

            let nombreSocioTC = nombreSocio + " " + apellidoPaterno;
            nombreSocioTC = (apellidoMaterno !== null && apellidoMaterno !== '' && apellidoMaterno !== ' ') ? nombreSocioTC + " " + apellidoMaterno : nombreSocioTC;
            //Redux guardar informaciion necesaria para nueva simulacion en DatosSocio
            dispatch(setDataSimulacionStateAction({
                cedula: "1150214375", nombresApellidos: nombreSocioTC
            }))


            if (!realizaNuevaSimulacion.current) {
                //TODO: CAMBIAR LA CEDULA por "documento"
                await fetchScore("C", "1150214375", nombreSocioTC, datosUsuario[0].strUserOficina, datosUsuario[0].strOficial, datosUsuario[0].strCargo, props.token, (data) => {
                    setScore(data);
                    setPuntajeScore(data?.response?.result?.scoreFinanciero[0]?.score)
                    setCupoSugeridoAval(data.response?.result?.capacidadPago[0]?.cupoSugerido)
                    setIdClienteScore(data.int_cliente);
                    //console.log("SCORE int_cliente, ", data.int_cliente)
                    //setRealizaNuevaSimulacion(true);
                    realizaNuevaSimulacion.current = true
                    //const scoreStorage = JSON.stringify(data);
                    //localStorage.setItem('dataPuntaje', scoreStorage.toString());
                    datosFinancierosObj.montoGastoFinaCodeudor = Number(data.str_gastos_codeudor);
                    setDatosFinancierosObj(datosFinancierosObj)
                    setEstadoBotonSiguiente(true);

                }, dispatch);

            } else if (realizaNuevaSimulacion.current){
                let datosFinan = datosFinancierosObj;
                if (!datosFinan.montoIngresos) datosFinan.montoIngresos = 0;
                if (!datosFinan.montoEgresos) datosFinan.montoEgresos = 0;
                if (!datosFinan.montoRestaGstFinanciero || datosFinan.montoRestaGstFinanciero === "" || datosFinan.montoRestaGstFinanciero === " " || IsNullOrEmpty(datosFinan.montoRestaGstFinanciero)) datosFinan.montoRestaGstFinanciero = 0;
                if (!datosFinan.montoGastoFinaCodeudor || datosFinan.montoGastoFinaCodeudor === "" || datosFinan.montoGastoFinaCodeudor === " " || IsNullOrEmpty(datosFinan.montoGastoFinaCodeudor)) datosFinan.montoGastoFinaCodeudor = 0;


                //TODO CAMBIAR LA CEDULA, oficina matriz
                await fetchNuevaSimulacionScore("C", "1150214375", nombreSocioTC, datosUsuario[0].strUserOficina, datosUsuario[0].strOficial, datosUsuario[0].strCargo, datosFinan.montoIngresos, datosFinan.montoEgresos, datosFinan.montoRestaGstFinanciero, datosFinan.montoGastoFinaCodeudor,
                    props.token, (data) => {
                        setScore(data);
                        setEstadoBotonSiguiente(true);
                        setCupoSugeridoCoopmego(data.str_cupo_sugerido)
                    }, dispatch);

            }              
        }

        if (step === 4) { //  ingresos, egresos, gastoFinanciero, gastoCodeudor, cupoAval, cupoCoopmego, score,

            let datosFinan = datosFinancierosObj;
            if (!datosFinan.montoIngresos) datosFinan.montoIngresos = 0;
            if (!datosFinan.montoEgresos) datosFinan.montoEgresos = 0;
            if (!datosFinan.montoRestaGstFinanciero || datosFinan.montoRestaGstFinanciero === "" || datosFinan.montoRestaGstFinanciero === " " || IsNullOrEmpty(datosFinan.montoRestaGstFinanciero)) datosFinan.montoRestaGstFinanciero = 0;
            if (!datosFinan.montoGastoFinaCodeudor || datosFinan.montoGastoFinaCodeudor === "" || datosFinan.montoGastoFinaCodeudor === " " || IsNullOrEmpty(datosFinan.montoGastoFinaCodeudor)) datosFinan.montoGastoFinaCodeudor = 0;

            //str_num_documento, ente, nombres, apellidos, celular, correo, cupoSoli, comentario, comentarioAdic, ingresos, egresos, gastoFinanciero, gastoCodeudor, cupoAval,cupoCoopmego, score, token, onSucces, dispatch
            let apellidosCliente = (apellidoMaterno !== null && apellidoMaterno !== '') ? apellidoPaterno + " " + apellidoMaterno : apellidoPaterno;
            fetchAddProspecto(documento, 0, nombreSocio, apellidosCliente, celularSocio, correoSocio, datosFinancierosObj.montoSolicitado.toString(), comentario, comentarioAdic,
                datosFinan.montoIngresos.toString(), datosFinan.montoEgresos.toString(), datosFinan.montoRestaGstFinanciero.toString(),datosFinan.montoGastoFinaCodeudor.toString(), cupoSugeridoAval.toString(), cupoSugeridoCoopmego.toString(), puntajeScore.toString(),
                props.token, (data) => {
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
        console.log("ALERTAS ",e)
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
            montoGastoFinaCodeudor: dato.montoGastoFinaCodeudor,
            montoRestaGstFinanciero: dato.restaGastoFinanciero
        }
        setDatosFinancierosObj(datosFinanciero)

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

        //Se actualiza los campos conforme se edite en el componente de Registrar cliente
        let datosInfo = infoSocio;
        datosInfo.cedula =e.documento;
        datosInfo.str_nombres= e.nombres;
        datosInfo.str_apellido_paterno = e.apellidoPaterno;
        datosInfo.str_apellido_materno= e.apellidoMaterno;
        setInfoSocio(datosInfo)
    }



    const getFileHandler = (e) => {
        //Si se carga documento enviar a step para agregar la autorizacion a consulta buro
        setArchivoAutorizacion(e);
        setEstadoBotonSiguiente(true);
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

    const steps = [
        "Datos personales",
        "Requisitos",
        "Datos financieros",
        "Simulación",
        "Registro simulación",
    ];

    const anteriorStepHandler = (paso) => {
        if (step === 0 || step === -1) {
            navigate.push("/");
        }
        if (step === 2) {
            setShowAutorizacion(false);
        }
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

    const refrescarDatosInformativos = () => {
        generarKey();
        fetchValidacionSocio(documento, '', props.token, (data) => {
            let datosFinan = {
                montoSolicitado: datosFinancierosObj.montoSolicitado,
                montoIngresos: data.dcm_total_ingresos,
                montoEgresos: data.dcm_total_egresos,
                montoGastoFinaCodeudor: datosFinancierosObj.montoGastoFinaCodeudor,
                montoRestaGstFinanciero: datosFinancierosObj.montoRestaGstFinanciero,
            }
            setDatosFinancierosObj(datosFinan);

            //anteriorStepHandler();
        },
            (errorCallback) => {
                if (errorCallback.error) {
                    setStep(3);
                }
            }, dispatch);

    }

    /*<div className={`f-col ${step === 0 ? 'w-100' : ''} ${step === 0 ? 'w-50' : ''} justify-content-center`}>*/
    return (
        <div className="f-row w-100" >

            <div style={{ marginLeft: "9rem", marginTop: "2.5rem", position: "absolute" }} >
                <div className="f-row w-100 icon-retorno" onClick={anteriorStepHandler}>
                    <KeyboardArrowLeftRoundedIcon
                        sx={{
                            fontSize: 35,
                            marginTop: 0.5,
                            padding: 0,
                        }}
                    ></KeyboardArrowLeftRoundedIcon>
                    <h2 className="blue ml-2 mt-1">Prospecciones</h2>

                </div>
            </div>

            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-col justify-content-center">

                    <div className="stepper">
                        <Stepper steps={steps} setStepsVisited={visitadosSteps} setActualStep={actualStepper} />
                    </div>

                    {(step === 0 || step === 1) &&
                     <div className={"f-row w-100 justify-content-center"}>
                            <RegistroCliente
                                key={keyRegistroCliente }
                                paso={step}
                                token={props.token}
                                setCedulaSocio={cedulaSocioHandler}
                                infoSocio={objetoDatosGenerales}
                                datosIngresados={datosIngresadosHandler} 
                                isVisibleBloque={isVisibleBloque}
                                requiereActualizar={refrescarInformacionHandler}
                                AtajoHandler={AtajoTecladoHandler}
                                ></RegistroCliente>
                        </div>
                    }

                    {(step === 2) &&
                        <div className="f-row w-100 justify-content-center">
                            <ValidacionesGenerales
                                key={keyComponente }
                                token={props.token}
                                infoSocio={infoSocio}
                                lst_validaciones={lstValidaciones}
                                onFileUpload={getFileHandler}
                                onShowAutorizacion={showAutorizacion}
                                datosUsuario={datosUsuario}
                                onSetShowAutorizacion={showAutorizacionHandler}
                                cedula={documento}
                                ></ValidacionesGenerales>
                        </div>
                    }


                    {(step === 3) &&
                        <div className="f-row w-100">
                            <DatosFinancieros
                                key={keyComponente }
                                dataConsultFinan={datosFinancierosObj}
                                setDatosFinancierosFunc={datosFinancierosHandler}
                                isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                                gestion={gestion}
                                requiereActualizar={refrescarDatosInformativos}
                                isCheckMontoRestaFinanciera={isCkeckRestaGtoFinananciero}
                                montoMinimoCupoSolicitado={controlMontoMinimoParametro}
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
                            isCheckMontoRestaFinanciera={isCkeckRestaGtoFinananciero}
                            setDatosFinancierosFunc={datosFinancierosHandler}
                            isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                            ></DatosSocio>                        
                    }
                  
                    {step === -1 &&
                        <FinProceso gestion={gestion}
                            nombres={`${nombreSocio} ${apellidoPaterno} ${apellidoMaterno}`}
                            cedula={documento}
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
                                <Button className="btn_mg btn_mg__primary mt-2">Ver Prospecto</Button>
                            </Item>
                            <Item xs={3} sm={3} md={3} lg={3} xl={3} ></Item>
                        </Fragment>
                    }


                </div>

            </Card>


        </div >
    )
}

export default connect(mapStateToProps, {})(NuevaProspeccion);