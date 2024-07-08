import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect} from "react";
import { fetchGetSolicitudes} from "../../services/RestServices";
import { IsNullOrWhiteSpace } from '../../js/utiles';
import Modal from '../Common/Modal/Modal';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';
import { get } from '../../js/crypt';
import Button from '../Common/UI/Button';
import Toggler from '../Common/UI/Toggler';
import Table from '../Common/Table';
import TableWithTextArea from '../Common/UI/TableWithTextArea';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import { setSolicitudStateAction } from '../../redux/Solicitud/actions';
import Paginacion from '../Common/Paginacion';


const mapStateToProps = (state) => {
    //console.log("state, ", state)
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

function Solicitud(props) {
    //console.log("props, ",props)
    const navigate = useHistory();
    const dispatch = useDispatch();

    //Inicio
    const [usuario, setUsuario] = useState("");
    const [rol, setRol] = useState("");
    const [datosUsuario, setDatosUsuario] = useState([]);

    const [isLstSolicitudes, setIsLstSolicitudes] = useState(true);
    const [isLstProspecciones, setIsLstProspecciones] = useState(false);
    const [isModalComentarios, setisModalComentarios] = useState(false);
    const [accionesSolicitud, setAccionesSolicitud] = useState(
        [
            { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
            { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
        ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [permisoNuevaSol, setPermisoNuevaSol] = useState(false);

    //Paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasEnVista] = useState(10); //Número de registros listados por página
    const indexOfLastRecord = paginaActual * paginasEnVista;
    const indexOfFirstRecord = indexOfLastRecord - paginasEnVista;
    const [registrosPagActual, setRegistrosPagActual] = useState();
    const [numPaginas, setNumPaginas] = useState(0);

    //ACTUALIZA LA PAGINA DONDE SE QUIERE IR
    useEffect(() => {
        setRegistrosPagActual(lstSolicitudes.slice(indexOfFirstRecord, indexOfLastRecord));
    }, [paginaActual])

    //Headers tablas Solicitudes y Prospectos
    const headerTableSolicitantes = [
        { nombre: 'Nro. Solicitud', key: 0 }, { nombre: 'Identificación', key: 1 }, { nombre: 'Ente', key: 2 }, { nombre: 'Nombre solicitante', key: 3 },
        { nombre: 'Monto', key: 5 }, { nombre: 'Calificación', key: 6 },
        { nombre: 'Estado', key: 7 }, { nombre: 'Oficina Crea', key: 8 }, { nombre: 'Acciones', key: 9 },
    ];

    const headerTableProspectos = [
        { nombre: 'Id', key: 1 }, { nombre: 'Cédula', key: 2 }, { nombre: 'Nombres', key: 3 },
        { nombre: 'Celular', key: 4 }, { nombre: 'Correo', key: 5 }, { nombre: 'Cupo solicitado', key: 6 }, { nombre: 'Usuario Crea', key: 7 }
    ];


    //Headers y Body TextArea
    const headersTable_with_Text_Area = [
        { nombre: "Tipo", key: 1 },
        { nombre: "Descripción", key: 2 },
        { nombre: "Detalle", key: 3 }
    ]

    const [parametrosTC, setParametrosTC] = useState([]);
    const [permisoImprimirMedio, setPermisoImprimirMedio] = useState([]);
    const [permisoRetornarBandeja, setPermisoRetornarBandeja] = useState([]);
    const [permisoApruebaMontoMenor, setPermisoApruebaMontoMenor] = useState([]);
    const [permisoEstadosSigComite, setPermisoEstadosSigComite] = useState([]);
    const [permisoEstadoHabilitarAprobarSol, setPermisoEstadoHabilitarAprobarSol] = useState([]);

    const parametros = [
        { prm_id: 11272, prm_valor_ini: "SOLICITUD CREADA" },
        { prm_id: 11273, prm_valor_ini: "ANALISIS UAC" },
        { prm_id: 11274, prm_valor_ini: "ANALISIS JEFE UAC" },
        { prm_id: 11275, prm_valor_ini: "ANALISIS COMITE" },
        { prm_id: 11276, prm_valor_ini: "APROBADA COMITE" },
        { prm_id: 11277, prm_valor_ini: "RECHAZADA COMITE" },
        { prm_id: 11278, prm_valor_ini: "POR CONFIRMAR" },
        { prm_id: 11279, prm_valor_ini: "APROBADA" },//APROBADA SOCIO
        //{ prm_id: 11280, prm_valor_ini: "NEGADA" }, //RECHAZADA SOCIO
        { prm_id: 11280, prm_valor_ini: "OPERATIVO NEGOCIOS" }, //RECHAZADA SOCIO
        { prm_id: 10934, prm_valor_ini: "ANULADA COMITE" },        
    ];

    const validaNombreParam = (id) => {
        //console.log(id);
        const parametro = parametros.find((param) => { return param.prm_id === id });
        return parametro.prm_valor_ini;
    }

    const bodyTable_with_Text_Area = [
        { tipo: "DESCRIPCION GENERAL DEL SOCIO", descripcion: "Descripción general socio", detalle: "Socio se desempeña como Cbo. Primero...", key: 98 },
        { tipo: "CARACTER", descripcion: "Antecedentes crediticios...", detalle: "Socio y conyugue cuentan con historial crediticio...", key: 50 },
        { tipo: "CAPACIDAD", descripcion: "Fuentes de ingreso...", detalle: "Socio y conyugue perciben ingresos por sueldo...", key: 7 }
    ]


    const [valoresTextArea, setvaloresTextArea] = useState(bodyTable_with_Text_Area)

    const textAreaHandler = (valor, index) => {
        //console.log("EL KEY ACTUALIZAR ES", index)
        const newData = [...valoresTextArea];
        //newData[index].detalle = valor; // Cambiar propiedad detalle por el que se requiera
        newData.find(comentario => comentario.key === index ? comentario.detalle = valor : '')
        setvaloresTextArea(newData);
    };

    const cancelarComentariosHandler = () => {
        setisModalComentarios(!isModalComentarios);
    }

    const onSubmitComentarios = (e) => {
        e.preventDefault();
        console.log("IMPLEMENTAR GUARDADO COMENTARIOS");
        setisModalComentarios(!isModalComentarios)
    };


    //Prostectos y solicitudes
    const [lstProstectos, stLstProspectos] = useState([]);
    const [lstSolicitudes, stLstSolicitudes] = useState([]);

    const [controlConsultaCargaComp, setControlConsultaCargaComp] = useState(false);

    //Carga de solicitudes (SE MODIFICA PARA QUE APAREZCA PRIMERA PANTALLA COMO PREDETERMINADA AL LOGUEARSE)
    useEffect(() => {
        if (props.token && !controlConsultaCargaComp) {
            //console.log("TOKEN", props.token);
            fetchGetSolicitudes(props.token, (data) => {
                //console.log("ENTRA SOLICITUDES");
                //console.log(data);
                stLstProspectos(data.prospectos);
                stLstSolicitudes(data.solicitudes);

                //Aplicacion Paginacion para Solicitudes (predeterminado)
                setRegistrosPagActual(data.solicitudes.slice(indexOfFirstRecord, indexOfLastRecord));
                setNumPaginas(Math.ceil(data.solicitudes.length / paginasEnVista))
                
            }, dispatch)
            const strOficial = get(localStorage.getItem("sender_name"));
            setUsuario(strOficial);
            const strRol = get(localStorage.getItem("role"));
            //console.log(strRol);
            setRol(strRol);
            setDatosUsuario([{ strCargo: strRol, strOficial: strOficial }]);
            setControlConsultaCargaComp(true);

            
            //console.log("PROPS PARAM", props.parametrosTC)
        }

    }, [props.token]);

    /*
    useEffect(() => {
        console.log(`1. ${parametrosTC};`)
        console.log(` 2. ${permisoImprimirMedio}; `)
        console.log(` 3. ${permisoRetornarBandeja}`)
        console.log(`4. ${permisoApruebaMontoMenor}; `)
        console.log(`2. ${permisoEstadosSigComite}; `)
        console.log(` 3. ${permisoEstadoHabilitarAprobarSol}`)
    }, [permisoEstadoHabilitarAprobarSol])*/

    /** OBTENER LOS PARAMETROS DEL STORAGE*/
    useEffect(() => {
        //console.log("PROPS parametrosTC", props.parametrosTC.lst_parametros)
        if (props.parametrosTC.lst_parametros?.length > 0) {
            let ParametrosTC = props.parametrosTC.lst_parametros;
            //console.log("Entr", props.parametrosTC.lst_parametros)
            //console.log("Entr", ParametrosTC.filter(param => param.str_nombre === 'IMPRIMIR_MEDIO_APROBACION_TC'))
            
            setParametrosTC(ParametrosTC.filter(param => param.str_nombre === 'ESTADOS_SOLICITUD_TC'));

            let permisosImprimiMedio = ParametrosTC.filter(param => param.str_nombre === 'IMPRIMIR_MEDIO_APROBACION_TC')[0];
            //permisosImprimiMedio = permisosImprimiMedio.split('|');
            setPermisoImprimirMedio(permisosImprimiMedio);

            let permisoRetornoBandeja = ParametrosTC.filter(param => param.str_nombre === 'RETORNO_ESTADO_BANDEJA_TC')[0];
            //permisoRetornoBandeja = permisoRetornoBandeja.split('|');
            setPermisoRetornarBandeja(permisoRetornoBandeja);

            let permisoApruebaMonto = ParametrosTC.filter(param => param.str_nombre === 'APROBACION_MONTO_MENOR')[0];
            //permisoApruebaMonto = permisoApruebaMonto.split('|');
            setPermisoApruebaMontoMenor(permisoApruebaMonto);

            let permisosEstadoSigComite = ParametrosTC.filter(param => param.str_nombre === 'ESTADOS_SIGUIENTES_ANALISIS_COMITE')[0];
            //permisosEstadoSigComite = permisosEstadoSigComite.split('|');
            setPermisoEstadosSigComite(permisosEstadoSigComite);

            let permisoHabilitaEstSigComite = ParametrosTC.filter(param => param.str_nombre === 'HABILITA_DECISION_APRUEBA_SOLICITUD')[0];
            //permisoHabilitaEstSigComite = permisoHabilitaEstSigComite.split('|');
            setPermisoEstadoHabilitarAprobarSol(permisoHabilitaEstSigComite);
    
        }

    }, [props.parametrosTC])


    useEffect(() => {
        if (rol) {
            validaPermiso("CREAR SOLICITUD");
        }
    }, [rol]);

    const validaPermiso = (strNombrePermiso) => {
        //console.log(rol);
        if (rol) {
            var permisosUusuario = [];
            if (rol === "ASESOR DE CRÉDITO") {
                permisosUusuario = ["CREAR SOLICITUD"];
            }

            var permis = permisosUusuario.includes(strNombrePermiso);
            //console.log(permis);
            if (permis) {
                setPermisoNuevaSol(permis);
            }
        }
    }

    const handleSelectedToggle = (index) => {
        setPaginaActual(1);
        const lstSeleccionada = accionesSolicitud.find((acciones) => acciones.key === index);
        if (lstSeleccionada.textPrincipal === "Solicitudes") {
            //Aplicacion Paginacion para Solicitudes (predeterminado)
            setRegistrosPagActual(lstSolicitudes.slice(indexOfFirstRecord, indexOfLastRecord));
            setNumPaginas(Math.ceil(lstSolicitudes.length / paginasEnVista))

            setIsLstProspecciones(false);
            setIsLstSolicitudes(true);
        } else {
            //Aplicacion Paginacion para Solicitudes (predeterminado)
            setRegistrosPagActual(lstProstectos.slice(indexOfFirstRecord, indexOfLastRecord));
            setNumPaginas(Math.ceil(lstProstectos.length / paginasEnVista))
            
            setIsLstSolicitudes(false);
            setIsLstProspecciones(true);
        }
    }

    const irNuevaSolicitud = () => {
        navigate.push('/solicitud/nueva');
    }

    const irNuevaProspección = () => {
        navigate.push('/prospeccion/nueva');
    }

    const closeModalHandler = () => {
        setisModalComentarios(false);
    }

    const moveToSolicitud = (solId) => {
        //console.log(solId)
        const solicitudSeleccionada = registrosPagActual.find((solicitud) => { return solicitud.int_id === solId });
        /* PARA VER SOLICITUD POR PARTE DEL ASESOR DE NEGOCIOS*/ 
        // 11276 EST_APROBADA_COMITE || 11272 EST_SOL_CREADA || 11278 EST_POR_CONFIRMAR
        console.log(solicitudSeleccionada)
        if ((solicitudSeleccionada.int_estado === 11276 || solicitudSeleccionada.int_estado === 11272 || solicitudSeleccionada.int_estado === 11278) && rol === "ASESOR DE CRÉDITO") { 
            dispatch(setSolicitudStateAction({ solicitud: solicitudSeleccionada.int_id, cedulaPersona: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.int_estado, rol: rol, estado: solicitudSeleccionada.str_estado }))
            navigate.push('/solicitud/ver');
        }
        /* PARA QUE PUEDAN HACER EL PASO DE BANDEJA CADA PERFIL */ 
        else if ((rol === "ANALISTA CREDITO" || rol === "JEFE DE UAC" || rol === "DIRECTOR DE NEGOCIOS" || rol === "OPERATIVO DE NEGOCIOS" ) && solicitudSeleccionada.int_estado !== 11272) {
            dispatch(setSolicitudStateAction({ solicitud: solicitudSeleccionada.int_id, cedulaPersona: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.int_estado, rol: rol, estado: solicitudSeleccionada.str_estado }))
            navigate.push('/solicitud/ver');
        }
        else {
            setModalVisible(true);
        }
    }

    const siguientePasoHandler = () => {
        setModalVisible(false);
    }

    const closeModalHandlerMsg = () => {
        setModalVisible(false);
    }


    const descargarEstadoCuenta = () => {
       
        const pdfUrl = "Imagenes/Estado de cuenta-Final.pdf";
            const link = document.createElement("a");
            link.href = pdfUrl;
        link.download = "EstadoCuenta.pdf"; // specify the filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
       
    }

    return (<div className="f-row">
        <Sidebar enlace={props.location.pathname}></Sidebar>
        
        <div className="container_mg mb-4">
            {permisoNuevaSol && 
                <>
                <div className="content-cards mt-2">
                    
                    <Card>
                        <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                        <h4 className="mt-2">Solicitud</h4>
                        <h5 className="mt-5">Genera una nueva solicitud de tarjeta de crédito</h5>
                        <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaSolicitud}>Siguiente</Button>
                    </Card>

                    <Card>
                        <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                            <h4 className="mt-2">Prospección</h4>
                            <h5 className="mt-2">Genera una nueva prospección de tarjeta de crédito</h5>
                            <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaProspección}>Siguiente</Button>
                    </Card>


                    <Card>
                        <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                        <h4 className="mt-4">Estado de cuenta</h4>
                        <h5 className="mt-4 mb-2">Generar estado de cuenta </h5>
                        <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={descargarEstadoCuenta}>Descargar</Button>
                    </Card>
                   
                </div>

                </>

            }
            
            <Toggler className="mt-2" toggles={accionesSolicitud}
                selectedToggle={handleSelectedToggle}>
            </Toggler>
            {isLstSolicitudes &&
                <div id="listado_solicitudes" className="mt-2">
                    <Table headers={headerTableSolicitantes}>
                        {/*BODY*/}
                        {registrosPagActual && registrosPagActual.map((solicitud) => {
                            return (
                                <tr key={solicitud.int_id} onClick={() => { moveToSolicitud(solicitud.int_id) }}>
                                    <td>{solicitud.int_id}</td>
                                    <td>{solicitud.str_identificacion}</td>
                                    <td>{solicitud.int_ente}</td>
                                    <td>{solicitud.str_nombres}</td>
                                    <td>{`$ ${Number(solicitud.dec_cupo_solicitado).toLocaleString('en-US')}`}</td>
                                    <td>{"AA"}</td>
                                    <td>{validaNombreParam(solicitud.int_estado)}</td>
                                    <td>{"Matriz"}</td>
                                    <td>
                                        {/*<IconButton onClick={() => { setisModalComentarios(!isModalComentarios) }}>*/}
                                        {/*    <RateReviewSharpIcon></RateReviewSharpIcon>*/}
                                        {/*</IconButton>*/}
                                        
                                    </td>
                                </tr>
                            );
                        })}
                        
                    </Table>
                   
                </div>
            }
            {isLstProspecciones &&
                <div id="listado_prospectos" className="mt-2">
                    <Table headers={headerTableProspectos}>
                        {/*BODY*/}
                        {registrosPagActual && registrosPagActual.map((prospecto) => {
                            return (
                                <tr key={prospecto.pro_id}>
                                    <td>{prospecto.pro_id}</td>
                                    <td>{prospecto.pro_num_documento}</td>
                                    <td>{`${prospecto.pro_nombres} ${prospecto.pro_apellidos}`}</td>
                                    <td>{prospecto.pro_celular}</td>
                                    <td>{prospecto.pro_email}</td>
                                    <td>{`$ ${prospecto.pro_cupo_solicitado}`}</td>
                                    <td>{prospecto.pro_usuario_crea}</td>
                                </tr>);
                        })}

                    </Table>
                </div>
            }

            {(isLstSolicitudes || isLstProspecciones) && numPaginas > 1 &&

                <div>
                    <Paginacion numPaginas={numPaginas}
                        paginaActual={paginaActual}
                        setPaginaActual={setPaginaActual} />
                </div>
                
            }
            
        </div>

        <ModalDinamico
            //props para Modal
            modalIsVisible={isModalComentarios}
            titulo={'COMENTARIOS DEL ASESOR'}
            onCloseClick={closeModalHandler}
            type="md"
        >
            <TableWithTextArea
                isBtnDisabled={!isModalComentarios}
                headers={headersTable_with_Text_Area}
                body={valoresTextArea}
                onChangeTable={textAreaHandler}
                onSubmitComentarios={onSubmitComentarios}
                onCancelarSubmit={cancelarComentariosHandler}
            >
            </TableWithTextArea>

        </ModalDinamico>

        <Modal
            modalIsVisible={modalVisible}
            titulo={`Aviso`}
            onNextClick={siguientePasoHandler}
            onCloseClick={closeModalHandlerMsg}
            isBtnDisabled={false}
            type="sm"
        >
            {modalVisible && <div>
                <p>No tiene permiso para acceder a esta solicitud</p>
            </div>}
        </Modal>


       

    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);