import { connect, useDispatch } from 'react-redux';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect, useReducer } from "react";
import { fetchValidacionSocio, fetchScore, fetchInfoSocio, fetchInfoEconomica, fetchAddAutorizacion, fetchGetSolicitudes, fetchAddSolicitud } from "../../services/RestServices";
import { IsNullOrWhiteSpace } from '../../js/utiles';
import Modal from '../Common/Modal/Modal';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { get } from '../../js/crypt';


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

function Solicitud(props) {

    //Inicio
    const dispatch = useDispatch();
    const [accion, setAccion] = useState("solicitud");
    const [tipoDoc, setTipoDoc] = useState("C");
    const [documento, setDocumento] = useState("");
    const [validaciones, setValidaciones] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isBtnDisabled, setBtnDisabled] = useState(false);
    const [ciValido, setCiValido] = useState(true);

    //Ingreso información para validaciones
    const [isErrorDocumento, setIsErrorDocumento] = useState(true);

    //Validaciones
    const [isValidaciones, setIsValidaciones] = useState(false);
    const [isValidacionesOk, setIsValidacionesOk] = useState(false);
    const [isInfoEconomica, setIsInfoEconomica] = useState(false);
    //Solicitud - prospeccion
    const [nombresSolicitud, setNombresSolicitud] = useState("");
    const [pApellidoSolicitud, setPApellidoSolicitud] = useState("");
    const [sApellidoSolicitud, setSApellidoSolicitud] = useState("");
    const [enteSolicitud, setEnteSolicitud] = useState("");
    //Score
    const [isScore, setIsScore] = useState(false);
    const [score, setScore] = useState({});
    const [isScoreFaltante, setIsScoreFaltante] = useState(false);
    const [datosScoreFaltante, setDatosScoreFaltante] = useState(false);
    const [isDescargarPdf, setIsDescargarPdf] = useState(true);
    const [isSubirPdf, setIsSubirPdf] = useState(true);

    const [infoSocio, setInfoSocio] = useState([]);
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [infoEconomica, setInfoEconomica] = useState([]);
    const [ingresos, setIngresos] = useState([]); 
    const [egresos, setEgresos] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);
    const [isInfoSocio, setIsInfoSocio] = useState(false);
    const [isInfoEco, setIsInfoEco] = useState(false);
    //Modals
    const [isModalVisible, setisModalVisible] = useState(false);
    const [isModalScoreVisible, setIsModalScoreVisible] = useState(false);
    const [isDatosSolicitud, setIsDatosSolicitud] = useState(false);
    const [lugarEntrega, setLugarEntrega] = useState();
    const [direccionEntrega, setDirecciónEntrega] = useState("");
    const [nombreTarjeta, setNombreTarjeta] = useState("");
    const [imprimeAutorizacion, setImprimeAutorizacion] = useState(false);
    const [isAutorizacion, setIsAutorizacion] = useState(false);
    const [autorizacionPdf, setAutorizacionPdf] = useState("");

    //Info solicitud
    const [comentarioAsesor, setComentarioAsesor] = useState("");

    const inputCargaRef = useReducer(null);
    //Carga de solicitudes
    useEffect(() => {
        fetchGetSolicitudes(props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setSolicitudes(data.lst_solicitudes);
            }
        }, dispatch)
    }, [])

    const nombreTarjetaHnadler = (event) => {
        setNombreTarjeta(event.target.value);
    }

    const accionHandler = (e) => {
        setAccion(e.target.value);
        if (e.target.value === "prospeccion") {
            setBtnDisabled(false);
        }
        setisModalVisible(false);
    }

    const oficinaEntregaHandler = (event) => {
        setDirecciónEntrega(event.target.value);
    }

    const tipoDocHandler = (e) => {
        setTipoDoc(e.target.value);
    }

    const documentoHandler = (e) => {
        let validacionCedula = validaCedula(e.target.value);
        if (validacionCedula) {
            setCiValido(true);
            setIsErrorDocumento(false);
        }
        else {
            setCiValido(false);
        }
        setDocumento(e.target.value);
    }
    const submitConsultaValidaciones = async (event) => {
        event.preventDefault();
        setImprimeAutorizacion(false);
        await fetchValidacionSocio(documento, '', props.token, (data) => {
            setValidaciones([...data.list_datos_alertas]);
            setEnteSolicitud(data.str_ente);
            setNombresSolicitud(data.str_nombres);
            setPApellidoSolicitud(data.str_apellido_paterno);
            setSApellidoSolicitud(data.str_apellido_materno);
            validaAlertaBuro("ALERTA_SOLICITUD_TC_005", [...data.list_datos_alertas])
        }, dispatch)
    }

    const validaAlertaBuro = (nemonico, data) => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].str_nemonico === nemonico) {
                data[i].str_estado_alerta === 'CORRECTO' ? setIsScoreFaltante(false) : setIsScoreFaltante(true);
            }
        }
    }

    const closeModalHandler = () => {
        if (isModalScoreVisible) {
            setIsModalScoreVisible(false);
        } else {
            setisModalVisible(false);
            setIsValidaciones(false);
            setIsScore(false);
            setScore({});
            setInfoSocio([]);
            setIsInfoSocio(false);
            setIsDatosSolicitud(false);
            setIsInfoEconomica(false);
            setLugarEntrega();
            setDirecciónEntrega("");
            setNombreTarjeta("");
            setImprimeAutorizacion(false);
            setDocumento("");
            setIsErrorDocumento(true);
        }
    }

    useEffect(() => {
        if (isModalVisible === false) {
            setIsValidaciones(true);
            setIsInfoSocio(false);
            setIsScore(false);
        }
    }, [isModalVisible]);

    useEffect(() => {
        if (validaciones.length > 0) {
            setisModalVisible(true);
            setIsValidaciones(true);
            accionSiguienteHandler(validaciones);
            const validacionesOk = validaciones.some((validacion) => validacion.str_estado_alerta === "INCORRECTO");
            setIsValidacionesOk(validacionesOk);
            const estadoAutorizacion = validaciones.find((validacion) => { return validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" })
            if (estadoAutorizacion.str_estado_alerta === "INCORRECTO") {
                setImprimeAutorizacion(true);
            }

        }
    }, [validaciones]);

    useEffect(() => {
        if (accion === 'solicitud')
            setBtnDisabled(isValidacionesOk);
        else
            setBtnDisabled(false);
    }, [accion]);

    useEffect(() => {
        if (score.str_res_codigo === "000") {
            setIsValidaciones(false);
            setIsScore(true);
            if (accion === "prospeccion") {
                setBtnDisabled(true);
            }
            else {
                setBtnDisabled(false);
            }
        }
        else if (score.str_res_codigo === "010") {
            const pdf = atob(score.file_bytes);
            //const sanitizedHtml = DOMPurify.sanitize(pdf);
            setAutorizacionPdf(pdf);
        }
        //else {

        //}
        
    }, [score]);

    useEffect(() => {
        if (infoSocio.length > 0) {
            setIsScore(false);
            setIsInfoSocio(true);
        }
    }, [infoSocio]);

    useEffect(() => {
        if (infoEconomica.str_res_codigo === "000") {
            setIsInfoSocio(false);
            setIsInfoEconomica(true);
        }
    }, [infoEconomica])

    const accionSiguienteHandler = (validaciones) => {
        var isValidacionOk;
        isValidacionOk = validaciones.find((validacion) => validacion.str_estado_alerta !== "CORRECTO");
        if (accion === "solicitud" && isValidacionOk) {
            setBtnDisabled(true);
        }
    }

    
    const getAutorizacion = () => {

    }

    const nombreSolicitudHandler = (event) => {
        setNombresSolicitud(event.target.value);
    }

    const pApellidoSolicitudHandler = (event) => {
        setPApellidoSolicitud(event.target.value);
    }

    const sApellidoSolicitudHandler = (event) => {
        setSApellidoSolicitud(event.target.value);
    }

    const getDocAutorizacion = async () => {
        if (isScoreFaltante) {
            setIsModalScoreVisible(true);
            return;
        }
    }

    const getScoreSocioHandler = async () => {
        if (isValidaciones) {
            if (isScoreFaltante) {
                setIsModalScoreVisible(true);
                return;
            }
            const strNombreSocio = `${nombresSolicitud} ${pApellidoSolicitud} ${sApellidoSolicitud}`;
            const strOficial = get(localStorage.getItem("sender_name"));
            const strCargo = get(localStorage.getItem("role"));
            await fetchScore(tipoDoc, documento, strNombreSocio, "Matriz", strOficial, strCargo, props.token, (data) => {
                setScore(data);
            }, dispatch);
        }
        if (isScore) {
            await fetchInfoSocio(documento, props.token, (data) => {
                setDirDomicilioSocio([...data.lst_dir_domicilio]);
                setDirTrabajoSocio([...data.lst_dir_trabajo]);
                setInfoSocio([...data.datos_cliente]);
            }, dispatch);
        }
        if (isInfoSocio) {
            await fetchInfoEconomica(enteSolicitud, props.token, (data) => {
                setInfoEconomica(data)
                setIngresos([...data.lst_ingresos_socio]);
                setEgresos([...data.lst_egresos_socio]);
            }, dispatch);
        }
        if (isInfoEconomica) {
            setIsInfoEconomica(false);
            setIsDatosSolicitud(true);
        }
        if (isDatosSolicitud) {
            // Original date string
            var dateString = infoSocio[0].str_fecha_nacimiento;

            // Split the date string into day, month, and year
            var parts = dateString.split('/');

            // Create a new Date object with the year, month, and day in the correct order
            var dateObject = new Date(parts[2], parts[0] - 1, parts[1]);

            // Get the ISO 8601 format (YYYY-MM-DD) from the date object
            var isoDateString = dateObject.toISOString().split('T')[0];
            let body = {
                str_comentario: comentarioAsesor,
                str_tipo_documento: tipoDoc,
                str_num_documento: documento,
                int_ente: parseInt(enteSolicitud),
                int_tipo_tarjeta: 0,
                str_nombres: [infoSocio[0].str_nombres, pApellidoSolicitud, sApellidoSolicitud].join(' '),
                str_primer_apellido: pApellidoSolicitud,
                str_segundo_apellido: sApellidoSolicitud,
                dtt_fecha_nacimiento: isoDateString,
                str_sexo: (infoSocio[0].str_sexo === 'Masculino' ? 'M' : 'F'),
                dec_cupo_solicitado: 100,
                dec_cupo_aprobado: 1000,
                str_celular: "0993048204",
                str_correo: "roberthtorres40@gmail.com",
                str_usuario_proc: get(localStorage.getItem("sender_name")),
                int_oficina_proc: 1,
                int_ente_aprobador: 0,
                str_codigo_producto: "1",
                int_codigo_sucursal: 1,
                int_modelo_tratamiento: 1,
                str_codigo_afinidad: "A1",
                int_num_promotor: 1,
                str_habilitada_compra: "S",
                dec_max_compra: 5,
                str_denominacion_tarjeta: "ROBERTH TORRES",
                str_marca_graba: "S",
                str_calle_num_puerta: "s26",
                str_localidad: "LOJA",
                str_barrio: "CIUDAD ALEGRÍA",
                str_codigo_provincia: "A",
                str_codigo_postal: "11001",
                str_zona_geografica: "L05",
                str_grupo_liquidacion: "S",
                dec_imp_lim_compras: 1,
                str_telefono_2: "072112109",
                str_datos_adicionales: "string",
                str_codigo_ocupacion: "AS",
                str_duracion: "5",
                str_marca_emision: "A",
                str_rfc: "S",
                str_marca_tpp: "S",
                str_rsrv_uso_credencial_1: "string",
                str_rsrv_uso_credencial_2: "string",
                str_cuarta_linea: "string",
                str_comentario_proceso: "string",
                int_numero_cuenta: 404010093840,
                str_ente: enteSolicitud
            }
            console.log(body);
            fetchAddSolicitud(body, props.token, (data) => {
                console.log(data);
            }, dispatch);
        }
    }

    const comentarioHandler = (event) => {
        setComentarioAsesor(event.target.value);
    }

    const lugarEntregaHandler = (event) => {
        setLugarEntrega(event.target.value);
    }

    const generaAutorizacionPdf = async () => {
        const strNombreSocio = `${nombresSolicitud} ${pApellidoSolicitud} ${sApellidoSolicitud}`;
        const strOficina = "MATRIZ";
        //const strOficina = get(localStorage.getItem("office"));
        const strOficial = get(localStorage.getItem("sender_name"));
        const strCargo = get(localStorage.getItem("role"));
        await fetchScore(tipoDoc, documento, strNombreSocio, "Matriz", strOficial, strCargo, props.token, (data) => {
            setScore(data);
            setIsDescargarPdf(false);
        }, dispatch);
        
    }

    const handleDownload = () => {
        const pd = "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";
        // Path to your static PDF file
        const byteCharacters = atob(pd);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create a URL for the Blob object
        const url = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = "arhcivo.pdf" || 'download.pdf';

        // Programmatically trigger the click event on the link
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        setIsSubirPdf(false);
    };

    const handleUpload = () => {
        inputCargaRef.current.click();
    }

    const handleFileChange = (event) => {
        // Get the selected file from the file input element
        const file = event.target.files[0];
        console.log('Selected file:', file);

        // Perform file upload logic here (e.g., send file to server)
        // For demonstration, just log the file details
        console.log('Uploading file:', file);
        fetchAddAutorizacion(tipoDoc, 1, "F", documento, nombresSolicitud, pApellidoSolicitud, sApellidoSolicitud, props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setImprimeAutorizacion(false);
                const estadoAutorizacion = validaciones.find((validacion) => { return validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" })
                estadoAutorizacion.str_estado_alerta = "CORRECTO";
                setIsModalScoreVisible(false);
            }
        }, dispatch);
    };

    const validaCedula = (strCedula) => {
        let suma = 0;
        let resultado = false;

        // Validar longitud de la cédula o RUC
        if (strCedula.length !== 10) {
            // Si la longitud no es igual a 10, retorna falso
            return false;
        }

        // Iterar sobre los primeros 9 dígitos de la cédula o RUC
        for (let i = 0; i < 9; i++) {
            // Obtener el i-ésimo dígito como número
            const j = parseInt(strCedula.charAt(i), 10);

            // Determinar el factor multiplicador (1 o 2)
            let x = (i % 2 === 0) ? j * 2 : j;

            // Si el resultado de la multiplicación es mayor a 9, ajustar
            if (x > 9) {
                x = x - 9;
            }

            // Sumar el resultado al acumulador
            suma += x;
        }

        // Calcular el dígito verificador
        const verificador = (10 - (suma % 10)) % 10;

        // Comparar el dígito verificador calculado con el último dígito de la cédula o RUC
        if (verificador === parseInt(strCedula.charAt(9), 10)) {
            resultado = true;
        }

        return resultado;
    }

    

    return (<div className="content">
        <Sidebar></Sidebar>
        <div className="container_mg">
            <div className="consulta_buro">
                <Card>
                    <form className="form_mg form_mg__md" onSubmit={submitConsultaValidaciones}>
                        <div className="form_mg__item form_mg__item_row">

                            <label htmlFor="username" className="pbmg1">Ingrese documento</label>
                            <input className={`${!ciValido && 'no_valido'}`} tabIndex="1" type="number" value={documento} name="username" placeholder="Número de cédula" id="username" autoComplete="off" onChange={documentoHandler} />

                            <label htmlFor="tipo_accion">Seleccione acción...</label>
                            <select tabIndex="1" id="tipo_accion" onChange={accionHandler}>
                                <option value="solicitud">Solicitud</option>
                                <option value="prospeccion">Prospección</option>
                            </select>

                            <label htmlFor="tipo_documento">Seleccione tipo documento...</label>
                            <select tabIndex="2" id="tipo_documento" onChange={tipoDocHandler} value={tipoDoc}>
                                <option value="C">Cédula</option>
                                <option value="R">R.U.C</option>
                                <option value="P">Pasaporte</option>
                            </select>

                        </div>
                        <button tabIndex="3" className="btn_mg btn_mg__primary" disabled={isErrorDocumento}>Siguiente</button>

                    </form>

                </Card>
            </div>
            <div id="listado_solicitudes">
                <table>
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre solicitante</th>
                            <th>Producto TC</th>
                            <th>Monto</th>
                            <th>Calificación</th>
                            <th>Estado</th>
                            <th>Oficina Crea</th>
                            <th>Oficial</th>
                            <th>Usuario</th>
                            <th>Fecha modificación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.map((solicitud) => {
                            return (<tr key={solicitud.int_id}>
                                <td>{solicitud.int_ente}</td>
                                <td>{"Edison José Villamagua Mendieta"}</td>
                                <td>{solicitud.str_tipo_tarjeta}</td>
                                <td>{solicitud.dec_cupo_solicitado}</td>
                                <td>{"200"}</td>
                                <td>{solicitud.str_estado}</td>   
                                <td>{"Matriz"}</td>
                                <td>{solicitud.str_usuario_crea}</td>
                                <td>{solicitud.str_usuario_crea}</td>
                                <td>{solicitud.str_usuario_crea}</td>
                            </tr>);
                        })}
                    </tbody>
                </table>
            </div>
            <Modal
                modalIsVisible={isModalVisible}
                titulo={`${accion.charAt(0).toUpperCase() + accion.slice(1)} de tarjeta de crédito`}
                onNextClick={getScoreSocioHandler}
                onCloseClick={closeModalHandler}
                isBtnDisabled={isBtnDisabled}>
                {isValidaciones && <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Validación</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                validaciones.map((validacion) => {
                                    return (<tr key={validacion.str_nemonico}>
                                        <td>{validacion.str_descripcion_alerta}</td>
                                        <td>{validacion.str_estado_alerta === 'CORRECTO'
                                            ? <button className="btn_mg"><img src="/Imagenes/statusActive.png"></img></button>
                                            : <button className="btn_mg" title={validacion.str_descripcion_alerta}><img src="/Imagenes/statusBlocked.png"></img></button>
                                        }</td>
                                        <td>
                                            {(validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && imprimeAutorizacion === true) &&
                                                <button className="btn_mg" onClick={getDocAutorizacion}>
                                                    <img src="/Imagenes/printIcon.svg"></img>
                                                </button>
                                        }
                                        </td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>}
                {isScore && <div>
                    {score.response.result.identificacionTitular &&
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="">Nombre:</label>
                            <input name="nombre" type="text" value={score.response.result.identificacionTitular[0]?.nombreRazonSocial} disabled={true}></input>
                            <label htmlFor="score">Score:</label>
                            <input name="score" type="text" value={score.response.result && score.response.result.scoreFinanciero && score.response.result.scoreFinanciero[0] && score.response.result.scoreFinanciero[0].score ? score.response.result.scoreFinanciero[0].score : 800} disabled={true}></input>
                            <label htmlFor="name">Detalle de deudas:</label>
                            {score.response.result.deudaVigenteTotal.map((deuda) => {
                                return (<div>
                                    <label>{deuda.sistemaCrediticio}</label>
                                    <div>
                                        <div>
                                            <label>Total deuda:</label>
                                            <input value={deuda.totalDeuda}></input>
                                            <label>Valor demanda judicial:</label>
                                            <input value={deuda.valorDemandaJudicial}></input>
                                            <label>Valor por vencer:</label>
                                            <input value={deuda.valorPorVencer}></input>
                                        </div>
                                    </div>
                                </div>);
                            })
                            }
                        </div>

                    }

                </div>}
                {isInfoSocio && <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "row", alignSelf: "center" }}>
                        <label>Nombres:</label>
                        <input value={infoSocio[0].str_nombres} readOnly={true}></input>
                        <label>Apellido paterno:</label>
                        <input value={infoSocio[0].str_apellido_paterno} readOnly={true}></input>
                        <label>Apellido materno:</label>
                        <input value={infoSocio[0].str_apellido_materno} readOnly={true}></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: "20px" }}>
                            <label>Fecha de nacimiento:</label>
                            <input value={infoSocio[0].str_fecha_nacimiento} readOnly={true}></input>
                            <label>Años reside en el pais:</label>
                            <input value="N/D" readOnly={true}></input>
                            <label>Nivel de educación:</label>
                            <input value={infoSocio[0].str_nivel_educacion} readOnly={true}></input>
                            <label>Código de profesión:</label>
                            <input value={infoSocio[0].str_codigo_profesion} readOnly={true}></input>
                            <label>Actividad:</label>
                            <input value={infoSocio[0].str_actividad_economica} readOnly={true}></input>
                            <label>Ocupación:</label>
                            <input value={infoSocio[0].str_ocupacion} readOnly={true}></input>
                            <label>Estado civil:</label>
                            <input value={infoSocio[0].str_estado_civil} readOnly={true}></input>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                            <label>Nacionalidad:</label>
                            <input value={infoSocio[0].str_nacionalidad} readOnly={true}></input>
                            <label>Sexo:</label>
                            <input value={infoSocio[0].str_sexo === "M" ? "Masculino" : "Femenino"} readOnly={true}></input>
                            <label>Sector:</label>
                            <input value={dirDocimicilioSocio[0].str_dir_sector} readOnly={true}></input>
                            <label>Subsector:</label>
                            <input value={dirDocimicilioSocio[0].str_dir_barrio} readOnly={true}></input>
                            <label>Tipo de persona:</label>
                            <input value={infoSocio[0].str_tipo_persona} readOnly={true}></input>
                            <label>Medio de información:</label>
                            <input value={infoSocio[0].str_medio_informacion} readOnly={true}></input>
                            <label>Calificación de riesgo:</label>
                            <input value={infoSocio[0].str_calificacion_riesgo} readOnly={true}></input>
                        </div>
                    </div>

                </div>}
                {isInfoEconomica && <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className={"mr-4"}>
                        <h3>Ingresos</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ingreso</th>
                                    <th>Valor Reportado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ingresos.map((ingreso) => {
                                        return (<tr key={ingreso.int_codigo}>
                                            <td>{ingreso.str_descripcion}</td>
                                            <td>{ingreso.dcm_valor}</td>
                                        </tr>);
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>Egresos</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Egreso</th>
                                    <th>Valor Reportado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    egresos.map((egreso) => {
                                        return (<tr key={egreso.int_codigo}>
                                            <td>{egreso.str_descripcion}</td>
                                            <td>{egreso.dcm_valor}</td>
                                        </tr>);
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>}
                {isDatosSolicitud && <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: "20px" }}>
                        <Card className={["mb-3"] } >
                            <h3>Opción de entrega:</h3>
                            <div>
                                <input type="radio" id="oficina" name="tipo_entrega" value="oficina" onChange={lugarEntregaHandler}></input>
                                <label htmlFor="oficina">Oficina:</label>
                                <input type="radio" id="domicilio" name="tipo_entrega" value="domicilio" onChange={lugarEntregaHandler}></input>
                                <label htmlFor="domicilio">Domicilio:</label>
                                <input type="radio" id="trabajo" name="tipo_entrega" value="trabajo" onChange={lugarEntregaHandler}></input>
                                <label htmlFor="trabajo">Trabajo:</label>
                                <input type="radio" id="otro" name="tipo_entrega" value="otro" onChange={lugarEntregaHandler}></input>
                                <label htmlFor="otro">Otro:</label>
                            </div>
                            {lugarEntrega === "oficina" &&
                                <div>
                                    <select id="tipo_documento" onChange={oficinaEntregaHandler} value={direccionEntrega}>
                                        <option value="1">MATRIZ</option>
                                        <option value="2">SARAGURO</option>
                                        <option value="3">CATAMAYO</option>
                                        <option value="4">CARIAMANGA</option>
                                        <option value="5">ALAMOR</option>
                                        <option value="6">ZAMORA</option>
                                        <option value="7">CUENCA</option>
                                        <option value="8">AGENCIA NORTE</option>
                                        <option value="9">MACARA</option>
                                        <option value="10">AGENCIA SUR</option>
                                        <option value="11">AGENCIA YANTZAZA</option>
                                        <option value="12">BALSAS</option>
                                        <option value="13">CATACOCHA</option>
                                        <option value="14">SANTA ROSA</option>
                                        <option value="15">AGENCIA GUALAQUIZA</option>
                                        <option value="16">AGENCIA CUARTO CENTENARIO</option>
                                        <option value="17">AGENCIA ZUMBA</option>
                                        <option value="18">AGENCIA EL VALLE</option>
                                        <option value="19">AGENCIA MACHALA</option>
                                        <option value="20">AGENCIA EL EJIDO</option>
                                        <option value="21">AGENCIA LATACUNGA</option>
                                        <option value="22">AGENCIA SANTO DOMINGO</option>
                                    </select>
                                </div>
                            }
                            {lugarEntrega === "domicilio" && <div>
                                <select id="domicilio_entrega" onChange={oficinaEntregaHandler} value={direccionEntrega}>
                                    {dirDocimicilioSocio.map((domicilio) => {
                                        return (<option key={domicilio.int_dir_direccion} value={domicilio.str_dir_descripcion_dom}>{`${domicilio.str_dir_ciudad} - ${domicilio.str_dir_sector} - ${domicilio.str_dir_barrio} `}</option>);
                                    }
                                    )}
                                </select>
                            </div>}
                            {lugarEntrega === "trabajo" && <div>
                                <select id="domicilio_entrega" onChange={oficinaEntregaHandler} value={direccionEntrega}>
                                    {dirTrabajoSocio.map((trabajo) => {
                                        return (<option key={trabajo.int_dir_direccion} value={trabajo.str_dir_descripcion_dom}>{`${trabajo.str_dir_ciudad} - ${trabajo.str_dir_sector} - ${trabajo.str_dir_barrio} `}</option>);
                                    }
                                    )}
                                </select>
                            </div>
                            }
                            {lugarEntrega === "otro" && <div>
                                <label htmlFor="lugar_entrega">Ingrese el lugar de entrega</label>
                                <input type="text"></input>
                            </div>
                            }
                        </Card>
                        <Card className={["mb-3"]}>
                            <div>
                                <h3>Nombre para imprimir en la tarjeta:</h3>
                                <div>
                                    <input
                                        type="radio"
                                        name="nombre_tarjeta"
                                        value={`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}
                                        onChange={nombreTarjetaHnadler}
                                        id={`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}></input>
                                    <label htmlFor={`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}>{`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}</label>
                                    <input
                                        type="radio"
                                        name="nombre_tarjeta"
                                        value={`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}`}
                                        onChange={nombreTarjetaHnadler}
                                        id={`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}`} ></input>
                                    <label htmlFor={`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}` }>{`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}`}</label>
                                </div>
                            </div>

                        </Card>
                        <Card className={["mb-3"]}>
                            <div>
                                <h3>Comentario del asesor:</h3>
                                <textarea name="comentario_asesor" placeholder="Ingrese su comentario..." cols="50" rows="4" value={comentarioAsesor} onChange={comentarioHandler}></textarea>
                            </div>

                        </Card>
                    </div>
                    </div>
                    
                }
            </Modal>

            <Modal
                modalIsVisible={isModalScoreVisible}
                titulo={`Información para consultar Buró`}
                onNextClick={getAutorizacion}
                onCloseClick={closeModalHandler}
                isBtnDisabled={isBtnDisabled}>
                {isModalScoreVisible && <div>
                    <label>Nombres:</label>
                    <input readOnly={datosScoreFaltante} value={nombresSolicitud} onChange={nombreSolicitudHandler}></input>
                    <label>Apellido paterno:</label>
                    <input readOnly={datosScoreFaltante} value={pApellidoSolicitud} onChange={pApellidoSolicitudHandler}></input>
                    <label>Apellido materno:</label>
                    <input readOnly={datosScoreFaltante} value={sApellidoSolicitud} onChange={sApellidoSolicitudHandler}></input>
                    <button className={"btn_mg btn_mg__primary"} onClick={generaAutorizacionPdf}>Generar pdf</button>
                    <button className={"btn_mg btn_mg__primary"} onClick={handleDownload} disabled={isDescargarPdf}>Descargar</button>
                    <input type="file" accept=".pdf" ref={inputCargaRef} style={{ display: 'none' }} onChange={handleFileChange} />
                    <button className={"btn_mg btn_mg__primary"} onClick={handleUpload} disabled={isSubirPdf}>Subir archivo</button>
                    <div className={"mt-4"} style={{ width: 100 }} dangerouslySetInnerHTML={{ __html: autorizacionPdf }} />
                    
                </div>}
            </Modal>

            {/*<ModalAlert*/}
            {/*    titleAlert={'Error'}*/}
            {/*    icon={'danger'}*/}
            {/*    oepnMidal={score.str_res_codigo !== "000" && score.str_res_codigo !=="010"}*/}
            {/*>*/}
            {/*</ModalAlert>*/}
            
        </div>
    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);