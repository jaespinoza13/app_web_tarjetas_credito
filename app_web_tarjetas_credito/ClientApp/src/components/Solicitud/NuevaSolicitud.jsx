import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from "../Common/Card";
import { IsNullOrWhiteSpace } from "../../js/utiles";
import Sidebar from '../Common/Navs/Sidebar';
import Input from '../Common/UI/Input';
import Button from '../Common/UI/Button';
import { useState, useEffect } from 'react';
import ValidacionSocio from './ValidacionSocio';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from './ValidacionesGenerales';
import DatosSocio from './DatosSocio';
import { fetchScore, fetchValidacionSocio, fetchAddAutorizacion, fetchA, fetchAddProspecto, fetchAddSolicitud } from '../../services/RestServices';
import { get } from '../../js/crypt';
import ModalAlert from '../Common/Alert';
import Modal from '../Common/Modal/Modal';
import Personalizacion from './Personalizacion';
import FinProceso from './FinProceso';

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

    const [lstValidaciones, setLstValidaciones] = useState([]);
    const [tipoGestion, setTipoGestion] = useState("solicitud");
    const [score, setScore] = useState("");

    //Validaciones
    const [validacionesOk, setValidacionesOk] = useState([]);
    const [validacionesErr, setValidacionesErr] = useState([]);
    const [nombreSocio, setNombreSocio] = useState('');
    const [apellidosSocio, setApellidosSocio] = useState('');
    const [enteSocio, setEnteSocio] = useState('');
    const [celularSocio, setCelularSocio] = useState('');
    const [correoSocio, setCorreoSocio] = useState('');
    const [cedulaSocio, setCedulaSocio] = useState('');
    const [infoSocio, setInfoSocio] = useState([]);
    const [datosFaltan, setDatosFaltan] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [gestion, setGestion] = useState("propspeccion");

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

    //Prospeccion - Solicitud

    //Personalizacion
    const [nombreTarjeta, setNombreTarjeta] = useState("");
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [direccionEntrega, setDireccionEntrega] = useState("");

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
    }, []);

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
        if (step === 1 && (montoSolicitado > 0 && montoSolicitado !== '') && validaCamposSocio()) {
            setEstadoBotonSiguiente(false);
        }
        else {
            //
            setEstadoBotonSiguiente(true);
        }
    }, [montoSolicitado, nombreSocio, apellidosSocio, correoSocio, celularSocio]);

    useEffect(() => {
        if (score.str_res_codigo === "000") {
            setStep(step + 1);
        }
        else if (score.str_res_codigo === "") {
            setMensajeErrorScore("Hubo un error al obtener el score, intente más tarde");
            setMostrarAlerta(true);
        }
    }, [score]);

    useEffect(() => {
        const index = validacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);
        if (!index && step === 2) {
            setEstadoBotonSiguiente(false);
            setAutorizacionOk(true);
        }
        else {
            setAutorizacionOk(false);
            setSubirAutorizacion(false);
        }
    }, [validacionesErr]);

    useEffect(() => {
        if (validacionesOk.length === 10) {
            setGestion("solicitud");
        }
        else {
            setGestion("prospeccion");
        }
    }, [validacionesOk]);

    useEffect(() => {
        if (infoSocio.str_nombres === "") {
            setDatosFaltan(true);
        }
    }, [infoSocio]);

    useEffect(() => {
        if (step === 1) {
            setEstadoBotonSiguiente(true);
        }
    }, [step]);

    const validaCamposSocio = () => {        
        if (nombreSocio !== "" && apellidosSocio !== "" && correoSocio !== "" && celularSocio.length === 10) {
            console.log("validaCamposSocio true");
            return true
        }
        console.log("validaCamposSocio false");
        return false;
    }

    const agregarComentarioHandler = (e) => {

    }

    const siguientePasoHandler = () => {
        setModalVisible(false);
        setEstadoBotonSiguiente(true);
        setStep(1);
    }

    const nextProspeccionHandler = async () => {
        setTipoGestion("prospeccion");
        await nextHandler();
    }


    const nextHandler = async () => {
        if (step === 0) {
            setNombreSocio("");
            fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
                const arrValidacionesOk = [...data.lst_datos_alerta_true];
                const arrValidacionesErr = [...data.lst_datos_alerta_false];
                setValidacionesOk(arrValidacionesOk);
                setValidacionesErr(arrValidacionesErr);
                setEnteSocio(data.str_ente);
                setCelularSocio(data.str_celular);
                setCorreoSocio(data.str_email);
                setInfoSocio(data);
                setApellidosSocio(`${data.str_apellido_paterno} ${data.str_apellido_materno}`)
                setNombreSocio(`${data.str_nombres} ${data.str_apellido_paterno} ${data.str_apellido_materno}`);
                if (data.str_nombres !== "") {
                    setStep(1);
                }
                else {
                    setModalVisible(true);
                }
                const objValidaciones = {
                    "lst_validaciones_ok": [...data.lst_datos_alerta_true],
                    "lst_validaciones_err": [...data.lst_datos_alerta_false]
                }
                handleLists(objValidaciones);
                const index = arrValidacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);
            }, dispatch);
        }
        if (step === 1) {
            console.log(autorizacionOk);
            if (autorizacionOk) {
                setEstadoBotonSiguiente(false);
            }
            else {
                //setEstadoBotonSiguiente(true);
            }
            setStep(2);
        }
        if (step == 2) {

            if (showAutorizacion) {
                fetchAddAutorizacion("C", 1, "F", cedulaSocio, nombreSocio, apellidosSocio, apellidosSocio, props.token, (data) => {
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
                            setValidacionesErr(arrValidacionesErr);                            
                            const objValidaciones = {
                                "lst_validaciones_ok": [...data.lst_datos_alerta_true],
                                "lst_validaciones_err": [...data.lst_datos_alerta_false]
                            }
                            handleLists(objValidaciones);
                            setAutorizacionOk(false);
                            setEstadoBotonSiguiente(false);
                            const index = arrValidacionesErr.find((validacion) => validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && validacion.str_estado_alerta);
                        }, dispatch);
                    }
                }, dispatch);
                return;
            }

            //const strNombreSocio = `${nombresSolicitud} ${pApellidoSolicitud} ${sApellidoSolicitud}`;
            const strOficina = "MATRIZ";
            //const strOficina = get(localStorage.getItem("office"));
            const strOficial = get(localStorage.getItem("sender_name"));
            const strCargo = get(localStorage.getItem("role"));
            
            await fetchScore("C", cedulaSocio, nombreSocio, "Matriz", strOficial, strCargo, props.token, (data) => {
                setScore(data);
            }, dispatch);
            return;
        }
        
        if (step === 3 && tipoGestion === "solicitud") {
            setStep(4);
        }
        if (step === 3 && tipoGestion === "prospeccion") {
            fetchAddProspecto(cedulaSocio, enteSocio, nombreSocio, apellidosSocio, cedulaSocio, correoSocio, montoSolicitado, comentario, comentarioAdic, props.token, (data) => {
                if (data.str_res_codigo === "000") {
                    setStep(-1);
                }
            }, dispatch)
        }
        if (step === 4) {
            let body = {
                int_ente_aprobador: 589693,
                str_tipo_documento: "C", 
                str_num_documento: "1105970717", 
                str_nombres: "ROBERTH ESTEBAN ", 
                str_primer_apellido: "TORRES", 
                str_segundo_apellido: "REYES", 
                dtt_fecha_nacimiento: "1994-06-08", 
                str_sexo: "M", 
                dec_cupo_solicitado: 4500, 
                dec_cupo_sugerido: 100,
                str_correo: "santiago.espinoza@gmail.com",
                str_usuario_proc: "xnojeda1",
                int_oficina_proc: 1, 
                str_denominacion_tarjeta: "PAPI_2",
                str_comentario_proceso: "comentario 1",
                str_comentario_adicional: "comentario 2"
            }
            console.log(body);
            fetchAddSolicitud(body, props.token, (data) => {
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
    }

    const montoSolicitadoHandler = (e) => {
        setMontoSolicitado(e);
    }

    const datosIngresadosHandler = (e) => {
        console.log(e);
        setNombreSocio(e.nombres);
        setApellidosSocio(e.apellidos);
        setCelularSocio(e.celular);
        setCorreoSocio(e.correo);
    }

    const closeModalHandler = () => {
        setModalVisible(false);
    }

    const getFileHandler = (e) => {
        setArchivoAutorizacion(e);
    }
    //const [nombreTarjeta, setNombreTarjeta] = useState("");
    //const [tipoEntrega, setTipoEntrega] = useState("");
    //const [direccionEntrega, setDireccionEntrega] = useState("");
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
            <Sidebar></Sidebar>
            <div className="stepper"></div>
            {`isUploadingAthorization ${isUploadingAthorization}` }
            {estadoBotonSiguiente.toString()}
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-row">
                    {step}
                    {(step === 0 || step === 1) &&
                        <div className="f-row w-100">
                            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                            <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                                <ValidacionSocio paso={step}
                                    token={props.token}
                                    setCedulaSocio={cedulaSocioHandler}
                                    setMontoSolicitado={montoSolicitadoHandler}
                                    infoSocio={infoSocio}
                                    ingresoDatos={datosFaltan}
                                    datosIngresados={datosIngresadosHandler}
                                ></ValidacionSocio>
                            </Item>
                            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                        </div>
                    }

                    {(step === 2) &&
                        <ValidacionesGenerales token={props.token}
                            lst_validaciones={lstValidaciones}
                            onFileUpload={getFileHandler}
                            onAddAutorizacion={handleAutorizacion}
                            onShowAutorizacion={showAutorizacion}
                            onSetShowAutorizacion={showAutorizacionHandler}
                        ></ValidacionesGenerales>
                    }
                    {(step === 3) &&
                        <DatosSocio
                            informacionSocio={infoSocio}
                            lst_validaciones={lstValidaciones}
                            score={score}
                            token={props.token}
                            onAgregarComentario={agregarComentarioHandler}
                            tipoGestion={gestion}
                            onInfoSocio={getIfoSocioHandler}
                            onComentario={handleComentario}
                            onComentarioAdic={handleComentarioAdic}
                        ></DatosSocio>
                    }
                    {step === 4 &&
                        <Personalizacion
                            nombres={"ROBERTH ESTEBAN"}
                            str_apellido_paterno={"TORRES"}
                            str_apellido_materno={"REYES"}
                            lstDomicilio={dirDocimicilioSocio}
                            lstTrabajo={dirTrabajoSocio}
                            onNombreTarjeta={nombreTarjetaHandler}
                            onTipoEntrega={tipoEntregaHandler}
                            onDireccionEntrega={direccionEntregaHandler}
                        ></Personalizacion>
                    }
                    {step == 5 }

                    {step === -1 &&
                        <FinProceso gestion={tipoGestion}
                            nombres={`${nombreSocio} ${apellidosSocio}`}
                            cedula={cedulaSocio}
                            telefono={celularSocio}
                            email={correoSocio}
                        ></FinProceso>}
                </div>
                <div id="botones" className="f-row ">
                    <Item xs={2} sm={2} md={2} lg={2} xl={2} className=""></Item>
                    <Item xs={8} sm={8} md={8} lg={8} xl={8} className="f-row justify-content-space-evenly">
                        <Button className={["btn_mg btn_mg__primary mt-2"]} disabled={estadoBotonSiguiente} onClick={nextHandler}>Siguiente</Button>
                        {(step === 2 && !autorizacionOk) && <Button className={["btn_mg btn_mg__secondary mt-2"]} disabled={false} onClick={nextProspeccionHandler}>Continuar como prospecto</Button>}
                    </Item>
                    
                </div>

            </Card>
            
            <Modal
                modalIsVisible={modalVisible}
                titulo={`Información!!!`}
                onNextClick={siguientePasoHandler}
                onCloseClick={closeModalHandler}
                isBtnDisabled={isBtnDisabled}
                type="sm"
             >
                {modalVisible && <div>
                    <h4>{usuario}</h4>
                    <p className="mt-3 mb-3">La persona con la cédula <strong>{cedulaSocio}</strong> no es socio de CoopMego</p>
                    <p className="mb-3">Para poder realizar una solicitud de Tarjeta de crédito, la persona solicitante debe ser socio de CoopMego.</p>
                    <p className="mb-3">Presiona en continuar si deseas realizar una prospección a esta persona</p>

                </div>}
            </Modal>
            
        </div >
    )
}

export default connect(mapStateToProps, {})(NuevaSolicitud);