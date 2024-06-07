/* eslint-disable react-hooks/exhaustive-deps */
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from "../Common/Card";
import { IsNullOrEmpty, IsNullOrWhiteSpace } from "../../js/utiles";
import Sidebar from '../Common/Navs/Sidebar';
import Button from '../Common/UI/Button';
import { useState, useEffect } from 'react';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from '../Solicitud/ValidacionesGenerales';
import DatosSocio from '../Solicitud/DatosSocio';
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion,  fetchAddProspecto} from '../../services/RestServices';
import { get } from '../../js/crypt';
import Modal from '../Common/Modal/Modal';
//import Personalizacion from './Personalizacion';
import FinProceso from '../Solicitud/FinProceso';
import RegistroCliente from './ValidacionCliente';

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
    
    const [cedulaValidacion, setCedulaValidacion] = useState('');
    const [infoSocio, setInfoSocio] = useState([]);
    const [datosFaltan, setDatosFaltan] = useState(false);
    //const [modalVisible, setModalVisible] = useState(false);

    const [tipoDocumento, setTipoDocumento] = useState('-1');
    const [documento, setDocumento] = useState('');

    //const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [datosFinancieros, setDatosFinancieros] = useState({
        montoSolicitado: 0,
        montoIngresos: 0,
        montoEgresos: 0,
        montoGastosFinancieros: "",

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

    const [isCkeckGtosFinancieros, setIsCkeckGtosFinancieros] = useState(false);

    //Info Socio
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);
    const getIfoSocioHandler = (data) => {
        setDirDomicilioSocio([...data.lst_dir_domicilio]);
        setDirTrabajoSocio([...data.lst_dir_trabajo]);
    }

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
        //console.log("ESTADO STEP,", step)
        //console.log("ESTADO ShoAutorizacion,", showAutorizacion)
        if (step === 1) {
            setEstadoBotonSiguiente(true);
        }
        /*if (step === 2 && showAutorizacion) {
            setTextoSiguiente("Continuar solicitud")
        }
        if (step === 2) {
            if (validacionesErr.length === 10) {
                setEstadoBotonSiguiente(true);
            }
        }
        if (step === 2 && !showAutorizacion) {
            setTextoSiguiente("Continuar")
            
        }*/
        if (step === -1) {
            setTextoSiguiente("Volver al inicio")
        }
    }, [step]);

    const validaCamposSocio = () => {
        //console.log(`${documento}|${nombreSocio}|${apellidoPaterno}|${apellidoMaterno}|${correoSocio}|${celularSocio}`)

        if (documento !== "" && nombreSocio !== "" && apellidoPaterno !== "" && apellidoMaterno !== "" && correoSocio !== "" && celularSocio !== "") {
            //console.log("CAMPOS CLIENTE LLENOS")
            return true;
        }
        //console.log("Faltan campos a rellenar")
        return false;
    }

    const validaCamposFinancieros = () => {
        let validadorCheck = false;
        let validadorCupo = false;
        let validadorOtrosMontos = false;

        if (datosFinancieros.montoSolicitado > 0 && datosFinancieros.montoIngresos > 0 &&
            datosFinancieros.montoEgresos > 0) {
            validadorOtrosMontos = true;
        }

        if (datosFinancieros.montoSolicitado > 0) {
            //console.log("montoSolicitado, true ")
            validadorCupo = true;
        }
        else if (IsNullOrEmpty(datosFinancieros.montoSolicitado) || IsNullOrWhiteSpace((datosFinancieros.montoSolicitado))
            || datosFinancieros.montoSolicitado === "" || datosFinancieros.montoSolicitado === undefined) {
            validadorCupo = false;
        }

        if (isCkeckGtosFinancieros === true) {
            if (IsNullOrEmpty(datosFinancieros.montoGastosFinancieros) || datosFinancieros.montoGastosFinancieros === "0" || datosFinancieros.montoGastosFinancieros === "") {
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

        //console.log(`Check ${validadorCheck}, cupo ${validadorCupo}, montosOtros${validadorOtrosMontos}`)

        if (validadorCheck && validadorCupo && validadorOtrosMontos) {
            return true;
        } else {
            return false;
        }

    }
   



    ///CAMBIOS

    useEffect(() => {
        if (step === 1 && autorizacionOk) {
            setEstadoBotonSiguiente(false);
        }
        else if (step === 1 && archivoAutorizacion) {
            setEstadoBotonSiguiente(false);
        }
        else if (step === 1 && !archivoAutorizacion) {
            setEstadoBotonSiguiente(true);
        }
    }, [archivoAutorizacion]);

    useEffect(() => {
        const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);

        //console.log("index,", index)
        // console.log("VALIDACION DE CAMPOS,", step);
        if (step === 1 && showAutorizacion === false) {
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



    const nextHandler = async () => {
        if (step === 0) {
            //console.log(`doc ${documento}, ced ${cedulaValidacion}`)

            var informacionCliente = null;
            //TODO: FALTA EDITAR PARA REGISTRO DE INGRESOS, EGRESOS, ETC
            fetchValidacionSocio(documento, '', props.token, (data) => {
                const arrValidacionesOk = [...data.lst_datos_alerta_true];
                const arrValidacionesErr = [...data.lst_datos_alerta_false];
                setValidacionesOk(arrValidacionesOk);
                setValidacionesErr(arrValidacionesErr);
                const objValidaciones = {
                    "lst_validaciones_ok": [...data.lst_datos_alerta_true],
                    "lst_validaciones_err": [...data.lst_datos_alerta_false]
                }       
                //console.log("VALIDACIONES, ", objValidaciones)
                handleLists(objValidaciones);

                setNombreSocio(data.str_nombres);
                setApellidoPaterno(data.str_apellido_paterno);
                setApellidoMaterno(data.str_apellido_materno);
                setCelularSocio(data.str_celular);
                setCorreoSocio(data.str_email);

                informacionCliente = {
                    cedula: documento,
                    nombres: data.str_nombres,
                    apellidoPaterno: data.str_apellido_paterno,
                    apellidoMaterno: data.str_apellido_materno,
                    celularCliente: data.str_celular,
                    correoCliente: data.str_email
                }
                setInfoSocio(informacionCliente);
                setEnteSocio("")
                setStep(1);
            }, dispatch);

            //TODO PARA LAS ALERTAS           
            //console.log("Info cliente consulta ",informacionCliente)

        }


        if (step === 1) {
            console.log("STEP 1, SHOW ", showAutorizacion)

            if (showAutorizacion) {
                fetchAddAutorizacion("C", 1, "F", documento, nombreSocio, apellidoPaterno, apellidoMaterno,
                    archivoAutorizacion, props.token, (data) => {
                        //console.log("AUTOR, ", data);
                        //TODO DESCOMENTAR
                        //if (data.str_res_codigo === "000") {
                            const estadoAutorizacion = validacionesErr.find((validacion) => { return validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" })
                            estadoAutorizacion.str_estado_alerta = "True";
                            setSubirAutorizacion(false);
                            setIsUploadingAthorization(false);
                            setShowAutorizacion(false);
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
                        //}             
                }, dispatch);
                return;
            }

            //const strNombreSocio = `${nombresSolicitud} ${pApellidoSolicitud} ${sApellidoSolicitud}`;
            const strOficina = "MATRIZ";
            //const strOficina = get(localStorage.getItem("office"));
            const strOficial = get(localStorage.getItem("sender_name"));
            const strCargo = get(localStorage.getItem("role"));


            //TODO: CAMBIAR LA CEDULA por "documento"
            await fetchScore("C", "1150214375", nombreSocio, "Matriz", strOficial, strCargo, props.token, (data) => {
                setScore(data);
            }, dispatch);
            return;

        }
        if (step === 2) {
            //REALIZA REGISTROS DE SIMULACION

            //SIMULACION GUARDADA
            fetchAddProspecto(documento, 0, nombreSocio, apellidoPaterno + " " + apellidoMaterno, celularSocio, correoSocio, datosFinancieros.montoSolicitado, comentario, comentarioAdic, props.token, (data) => {
                //console.log("RESP ADD PROSP, ", data)
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
        setIsCkeckGtosFinancieros(e);
    }

    
    const cedulaSocioHandler = (e) => {
        setDocumento(e.valor)
        setCedulaValidacion(e.valor)
        if (step === 0 && e.valido) {
            setEstadoBotonSiguiente(false)
        }
        else {
            setEstadoBotonSiguiente(true);
        }
    }

    /*
    const montoSolicitadoHandler = (e) => {
        setMontoSolicitado(e);
    }*/

    const datosFinancierosHandler = (dato)  => {
        let datosFinanciero = {
            montoSolicitado: dato.montoSolicitado,
            montoIngresos: dato.montoIngresos,
            montoEgresos: dato.montoEgresos,
            montoGastosFinancieros: dato.montoGastosFinancieros
        }
        setDatosFinancieros(datosFinanciero)

    }

    const datosIngresadosHandler = (e) => {
        //setCedulaSocio(e.documento)
        setNombreSocio(e.nombres);
        setApellidoPaterno(e.apellidoMaterno);
        setApellidoMaterno(e.apellidoMaterno);
        setCelularSocio(e.celular);
        setCorreoSocio(e.correo);
        //setTipoDocumento(e.tipo_documento);
        setDocumento(e.documento);
    }

    /*const closeModalHandler = () => {
        setModalVisible(false);
    }*/

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

    const handleComentario = (data) => {
        setComentario(data);
    }

    const handleComentarioAdic = (data) => {
        setComentarioAdic(data);
    }

    const [showAutorizacion, setShowAutorizacion] = useState(false);

    const showAutorizacionHandler = (data) => {
        setShowAutorizacion(data);
    }

    return (
        <div className="f-row" >
            <Sidebar enlace={props.location.pathname}></Sidebar>
            <div className="stepper"></div>
            {showAutorizacion.toString()}
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-row justify-content-center">
                    {(step === 0 || step === 1) &&
                        <div className={step === 1 ? "f-col w-50 align-content-center" : "f-row w-100"}>
                            <RegistroCliente paso={step}
                                token={props.token}
                                setCedulaSocio={cedulaSocioHandler}
                                datosIngresados={datosIngresadosHandler}
                                datosFinancieros={datosFinancierosHandler}
                                infoSocio={infoSocio}
                                isCkeckGtosFinancierosHandler={checkGastosFinancieroHandler}
                                    
                                ></RegistroCliente>
                        </div>
                    }

                    {(step === 1) &&
                        <div className={showAutorizacion ? "f-col w-50" : ''}>
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


                        //<ValidacionesGenerales token={props.token}
                        //    lst_validaciones={lstValidaciones}
                        //    onFileUpload={getFileHandler}
                        //    onShowAutorizacion={showAutorizacion}
                        //    infoSocio={infoSocio}
                        //    onAddAutorizacion={handleAutorizacion}
                        //    datosUsuario={datosUsuario}
                        //    onSetShowAutorizacion={showAutorizacionHandler}
                        //    cedula={documento}
                        //></ValidacionesGenerales>

                    }
                    {(step === 2) &&
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
                  
                    {step === -1 &&
                        <FinProceso gestion={gestion}
                            nombres={`${nombreSocio} ${apellidoPaterno} ${apellidoMaterno}`}
                            cedula={documento}
                            telefono={celularSocio}
                            email={correoSocio}
                        ></FinProceso>}
                </div>
                <div id="botones" className="f-row ">
                    <Item xs={2} sm={2} md={2} lg={2} xl={2} className=""></Item>
                    <Item xs={8} sm={8} md={8} lg={8} xl={8} className="f-row justify-content-space-evenly">
                        <Button className={["btn_mg btn_mg__primary mt-2"]} disabled={estadoBotonSiguiente} onClick={nextHandler}>{textoSiguiente}</Button>
                        {/*{((step === 2 && !autorizacionOk) && (step === 2 && !showAutorizacion)) &&*/}
                        {/*    <Button className={["btn_mg btn_mg__secondary mt-2"]} disabled={estadoBotonProspecto} onClick={nextProspeccionHandler}>Continuar como prospecto</Button>}*/}




                    </Item>

                </div>

            </Card>

            {/*<Modal*/}
            {/*    modalIsVisible={modalVisible}*/}
            {/*    titulo={`Información!!!`}*/}
            {/*    onNextClick={siguientePasoHandler}*/}
            {/*    onCloseClick={closeModalHandler}*/}
            {/*    isBtnDisabled={isBtnDisabled}*/}
            {/*    type="sm"*/}
            {/*>*/}
            {/*    {modalVisible && <div>*/}
            {/*        <h4>{usuario}</h4>*/}
            {/*        <p className="mt-3 mb-3">La persona con la cédula <strong>{documento}</strong> no es socio de CoopMego</p>*/}
            {/*        <p className="mb-3">Para poder realizar una solicitud de Tarjeta de crédito, la persona solicitante debe ser socio de CoopMego.</p>*/}
            {/*        <p className="mb-3">Presiona en continuar si deseas realizar una prospección a esta persona</p>*/}

            {/*    </div>}*/}
            {/*</Modal>*/}

        </div >
    )
}

export default connect(mapStateToProps, {})(NuevaProspeccion);