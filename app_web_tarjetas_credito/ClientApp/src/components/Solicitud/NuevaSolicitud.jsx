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
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion, fetchAddSolicitud, fetchCrearSeparadoresAxentria } from '../../services/RestServices';
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
        montoGastosFinancieros: "",

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
    const [infoSocio, setInfoSocio] = useState([]);
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');

    const [datosFaltan, setDatosFaltan] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [isCkeckGtosFinancieros, setIsCkeckGtosFinancieros] = useState(false);

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


    //Prospeccion - Solicitud

    //Personalizacion
    const [nombreTarjeta, setNombreTarjeta] = useState("");
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [modalMensajeAviso, setModalMensajeAviso] = useState(false);
    const [textoAviso, setTextoAviso] = useState(false);

    //Stepper
    const [visitadosSteps, setVisitadosSteps] = useState([0]);
    const [actualStep, setActualStep] = useState(0);


    const [direccionEntrega, setDireccionEntrega] = useState("");


    //Info Socio
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);
    const getIfoSocioHandler = (data) => {
        setDirDomicilioSocio([...data.lst_dir_domicilio]);
        setDirTrabajoSocio([...data.lst_dir_trabajo]);
    }

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
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial }]);
         //console.log(`DATOS USER, ${strOficial}, ${strRol}`)
    }, []);

    


    const validaCamposFinancieros = () => {
        //Si esta activo el check de Gastos Financieros valida campo
        //console.log("ckec,", isCkeckGtosFinancieros)
        let validadorCheck = false;
        let validadorCupo = false;


        if (datosFinancieros.montoSolicitado > 0) {
            //console.log("montoSolicitado, true ")
            validadorCupo = true;
        }
        else if (IsNullOrEmpty(datosFinancieros.montoSolicitado) || IsNullOrWhiteSpace((datosFinancieros.montoSolicitado))
            || datosFinancieros.montoSolicitado === "" || datosFinancieros.montoSolicitado === undefined) {
            validadorCupo = false;
        }

       // console.log(`isCkeckGtosFinancieros ${isCkeckGtosFinancieros}, GastosFinancieros ${datosFinancieros.montoGastosFinancieros}`)
        if (isCkeckGtosFinancieros === true) {
            if (IsNullOrEmpty(datosFinancieros.montoGastosFinancieros) || datosFinancieros.montoGastosFinancieros === "0" || datosFinancieros.montoGastosFinancieros === "" || datosFinancieros.montoGastosFinancieros === " ") {
                //console.log("GastosFinancieros, falso, ", datosFinancieros.montoGastosFinancieros)
                validadorCheck = false;
                return false;
            } else {
                validadorCheck = true;
                //console.log("GastosFinancieros, true")
            }
        } else if (isCkeckGtosFinancieros === false) {
            validadorCheck = true;
        }

        //console.log(`Check ${validadorCheck}, cupo ${validadorCupo}`)

        if (validadorCheck && validadorCupo) {
            return true;
        } else {
            return false;
        }
        
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
            setActualStep(3);
            setVisitadosSteps([...visitadosSteps, actualStep + 1])
        }
        else if (score.str_res_codigo === "") {
            setMensajeErrorScore("Hubo un error al obtener el score, intente más tarde");
            setMostrarAlerta(true);
        }
    }, [score]);


    useEffect(() => {
        if (step === 1) {
            setEstadoBotonSiguiente(false);
        }
        if (step === -1) {
            setTextoSiguiente("Volver al inicio")
        }
    }, [step]);


    

    const getFileHandler = (event) => {
        setArchivoAutorizacion(event);
        //console.log("RETURN ARC, ", event)      


    }


    const agregarComentarioHandler = (e) => {

    }

    const checkGastosFinancieroHandler = (e) => {
        setIsCkeckGtosFinancieros(e);
    }

    
    const steps = [
        "Datos personales",
        "Requisitos",
        "Datos financieros",
        "Simulación",
        "Personalización",
        "Registro de Solicitud",
    ];

    /*
    const steps = [
        { nombre: "PASO 1", isActivo: true },
        { nombre: "PASO 2", isActivo: true },
        { nombre: "PASO 3", isActivo: true },
        { nombre: "PASO 4", isActivo: true },
        { nombre: "PASO 5", isActivo: true },
        { nombre: "PASO 6", isActivo: true },
        //"PASO 2",
        //"PASO 3",
        //"PASO 4",
        //"PASO 5",
        //"PASO 6",
    ];*/


    const nextHandler = async () => {

        /*
        const updatedVisitedSteps = [...visitadosSteps, currentStep + 1];
        setVisitadosSteps(updatedVisitedSteps);
        setCurrentStep(currentStep + 1);*/

        //console.log("step,", step)
        if (step === 0) {
            //TODO: FALTA EDITAR PARA REGISTRO DE INGRESOS, EGRESOS, ETC
            setIsVisibleBloque(!isVisibleBloque);
            fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {             
                console.log("SOC,",data)
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

                //console.log("COD rescodigo ", data.str_res_codigo);

                if (data.str_res_codigo === "100") {
                    setTextoAviso("Ya se encuentra registrada una solicitud con esa cédula.")
                    setModalMensajeAviso(true);
                    //console.log("SOLIC YA CREADA");

                }
                else if (data.str_nombres !== "") {

                    
                    //setVisitadosSteps([...visitadosSteps, actualStep + 1])
                    //setActualStep(1);
                    setTimeout('',2000);
                    setStep(1);
                    setEstadoBotonSiguiente(true);
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
            //if (nombreSocio !== '') setIsVisibleBloque(!isVisibleBloque);

            
        }
        if (step === 1) {
            setStep(2);
            setVisitadosSteps([...visitadosSteps, actualStep + 1])
            setActualStep(1)
        }
        if (step === 2) {
            console.log(`SHOW AUTOR, ${showAutorizacion}`)

            if (showAutorizacion) {
                console.log("CED ENVIA DOC, ", cedulaSocio)
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
            } 

            setActualStep(2);
            setVisitadosSteps([...visitadosSteps, actualStep + 1])
            setStep(3)
            
            

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

            await fetchScore("C", "1150214375", nombreSocio + " " + apellidoPaterno + " " + apellidoMaterno, "Matriz", datosUsuario.strOficial, datosUsuario.strCargo, props.token, (data) => {
                setScore(data);
                //console.log("SCORE, ",data)
            }, dispatch);
            //setVisitadosSteps([...visitadosSteps, actualStep + 1])
            //setActualStep(3);
            //return;

            /*setVisitadosSteps([...visitadosSteps, actualStep + 1])
            setActualStep(4);
            setStep(4);*/
        }
        if (step === 4) {
            setVisitadosSteps([...visitadosSteps, actualStep + 1])
            setActualStep(4);
            setStep(5);
        }
        if (step === 5) {

            console.log("CONTROL NOMBRE", nombreSocio)
            console.log("apellidoPaterno", apellidoPaterno )
            console.log("apellidoMaterno", apellidoMaterno )
            let body = {
                int_ente_aprobador: 589693,
                str_tipo_documento: "C",
                str_num_documento: cedulaSocio,
                str_nombres: nombreSocio, 
                str_primer_apellido: apellidoPaterno, 
                str_segundo_apellido: apellidoMaterno, 
                dtt_fecha_nacimiento: "1994-06-08", 
                str_sexo: "M",
                dec_cupo_solicitado: datosFinancieros.montoSolicitado, 
                dec_cupo_sugerido: 100,
                str_correo: correoSocio,
                str_usuario_proc: "xnojeda1",
                int_oficina_proc: 1,
                str_ente: enteSocio,
                str_denominacion_tarjeta: "ROBERTH TORRES",
                str_comentario_proceso: comentario,
                str_comentario_adicional: comentarioAdic
            }
            fetchAddSolicitud(body, props.token, (data) => {
                setVisitadosSteps([...visitadosSteps, actualStep + 1])
                setActualStep(5);
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
        setNombreTarjeta(data);
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
            montoGastosFinancieros: dato.montoGastosFinancieros
        }
        setDatosFinancieros(datosFinanciero)

    }

    return (
        <div className="f-row" >
            <Sidebar enlace={props.location.pathname}></Sidebar>
            {showAutorizacion.toString()}
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-col justify-content-center">

                    <div className="stepper">
                        <Stepper steps={steps} setStepsVisited={visitadosSteps} setActualStep={actualStep}/>
                    </div>
                    

                    {(step === 0 || step === 1) &&
                        <div className="f-row w-100 justify-content-center sliding-div ">
                            <ValidacionSocio paso={step}
                                token={props.token}
                                setCedulaSocio={cedulaSocioHandler}
                                infoSocio={infoSocio}
                                isVisibleBloque={isVisibleBloque}
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
                            datosFinancieros={datosFinancierosHandler}
                            isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                            gestion={gestion}
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
                            onInfoSocio={getIfoSocioHandler}
                            onComentario={handleComentario}
                            onComentarioAdic={handleComentarioAdic}
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
                    <Item xs={2} sm={2} md={2} lg={2} xl={2} className=""></Item>
                    <Item xs={8} sm={8} md={8} lg={8} xl={8} className="f-row justify-content-space-evenly">
                        <Button className={["btn_mg btn_mg__primary mt-2"]} disabled={estadoBotonSiguiente} onClick={nextHandler}>{textoSiguiente}</Button>
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

            
            {/*<Modal*/}
            {/*    modalIsVisible={modalVisible}*/}
            {/*    titulo={`Información!!!`}*/}
            {/*    onNextClick={siguientePasoHandler}*/}
            {/*    onCloseClick={closeModalHandler}*/}
            {/*    isBtnDisabled={isBtnDisabled}*/}
            {/*    type="sm"*/}
            {/* >*/}
            {/*    {modalVisible && <div>*/}
            {/*        <h4>{usuario}</h4>*/}
            {/*        <p className="mt-3 mb-3">La persona con la cédula <strong>{cedulaSocio}</strong> no es socio de CoopMego</p>*/}
            {/*        <p className="mb-3">Para poder realizar una solicitud de Tarjeta de crédito, la persona solicitante debe ser socio de CoopMego.</p>*/}
            {/*        <p className="mb-3">Presiona en continuar si deseas realizar una prospección a esta persona</p>*/}

            {/*    </div>}*/}
            {/*</Modal>*/}
            
        </div >
    )
}

export default connect(mapStateToProps, {})(NuevaSolicitud);