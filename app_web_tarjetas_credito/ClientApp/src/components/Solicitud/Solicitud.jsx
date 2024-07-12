import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect} from "react";
import { fetchGetOficinas, fetchGetSolicitudes} from "../../services/RestServices";
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
    const [rol, setRol] = useState("");

    const [isLstSolicitudes, setIsLstSolicitudes] = useState(true);
    const [isLstProspecciones, setIsLstProspecciones] = useState(false);
    const [accionesSolicitud, setAccionesSolicitud] = useState(
        [
            { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
            { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
        ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [permisoNuevaSol, setPermisoNuevaSol] = useState(false);

    //Paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasEnVista, setPaginasEnVista] = useState(10); //Número de registros listados por página
    const indexOfLastRecord = paginaActual * paginasEnVista;
    const indexOfFirstRecord = indexOfLastRecord - paginasEnVista;
    const [registrosPagActual, setRegistrosPagActual] = useState();
    const [numPaginas, setNumPaginas] = useState(0);

  
    //Headers tablas Solicitudes y Prospectos
    const headerTableSolicitantes = [
        { nombre: 'Nro. Solicitud', key: 0 }, { nombre: 'Identificación', key: 1 }, { nombre: 'Ente', key: 2 }, { nombre: 'Nombre solicitante', key: 3 },
        { nombre: 'Monto', key: 5 }, { nombre: 'Calificación', key: 6 },
        { nombre: 'Estado', key: 7 }, { nombre: 'Oficina Crea', key: 8 }, //{ nombre: 'Acciones', key: 9 },
    ];

    const headerTableProspectos = [
        { nombre: 'Id', key: 1 }, { nombre: 'Cédula', key: 2 }, { nombre: 'Nombres', key: 3 },
        { nombre: 'Celular', key: 4 }, { nombre: 'Correo', key: 5 }, { nombre: 'Cupo solicitado', key: 6 }, { nombre: 'Usuario Crea', key: 7 }
    ];


    //Prostectos y solicitudes
    const [lstProstectos, stLstProspectos] = useState([]);
    const [lstSolicitudes, stLstSolicitudes] = useState([]);

    const [oficinas, setOficinas] = useState([]);
    const [controlConsultaCargaComp, setControlConsultaCargaComp] = useState(false);

    //OBTENER PARAMETROS
    const [habilitarPerfilesVerSolicitud, setHabilitarPerfilesVerSolicitud] = useState([]);

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
            fetchGetOficinas(props.token, (data) => {
                setOficinas(data.lst_oficinas);
            }, dispatch);

            const strRol = get(localStorage.getItem("role"));
            //console.log(strRol);
            setRol(strRol);
            setControlConsultaCargaComp(true);
        }
    }, [props.token]);

    useEffect(() => {
        if (props.token && props.parametrosTC.lst_parametros?.length > 0) {
            let ParametrosTC = props.parametrosTC.lst_parametros;
            /* PERFILES AUTORIZADOS EN VER LA SOLICITUD */            
            let perfilesAutorizados = (ParametrosTC
                .filter(param => param.str_nombre === 'PERFILES_AUTORIZADOS_VER_SOLICITUD')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini
                })));
            if (perfilesAutorizados.length > 0) setHabilitarPerfilesVerSolicitud(perfilesAutorizados[0].prm_valor_ini.split('|'))
        }
    }, [props])

    //ACTUALIZA LA PAGINA DONDE SE QUIERE IR
    useEffect(() => {
       if (isLstSolicitudes) {
            setRegistrosPagActual(lstSolicitudes.slice(indexOfFirstRecord, indexOfLastRecord));
       } else if (isLstProspecciones) {
            setRegistrosPagActual(lstProstectos.slice(indexOfFirstRecord, indexOfLastRecord));
       }
    }, [paginaActual])



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


    const moveToSolicitud = (solId) => {
        const solicitudSeleccionada = registrosPagActual.find((solicitud) => { return solicitud.int_id === solId });
        let nombreOficinaDeSolicitud = validarNombreOficina(solicitudSeleccionada.int_oficina_crea);
        //console.log(solicitudSeleccionada)
        /* PARA VER SOLICITUD POR PARTE DEL ASESOR DE NEGOCIOS*/
        if (rol === "ASESOR DE CRÉDITO") {
            dispatch(setSolicitudStateAction({
                solicitud: solicitudSeleccionada.int_id, cedulaPersona: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.int_estado, rol: rol, estado: solicitudSeleccionada.str_estado, oficinaSolicitud: nombreOficinaDeSolicitud, calificacionRiesgo: solicitudSeleccionada.str_calificacion
            }))
            navigate.push('/solicitud/ver');
        }

        /* PARA QUE PUEDAN HACER EL PASO DE BANDEJA CADA PERFIL */ 
        else if (habilitarPerfilesVerSolicitud.includes(rol)) {
            dispatch(setSolicitudStateAction({
                solicitud: solicitudSeleccionada.int_id, cedulaPersona: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.int_estado, rol: rol, estado: solicitudSeleccionada.str_estado, oficinaSolicitud: nombreOficinaDeSolicitud, calificacionRiesgo: solicitudSeleccionada.str_calificacion
                }))
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
            link.target = "_blank"; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);       
    }

    const validarNombreOficina = (idOficina) => {        
        let nombreOficina = oficinas.find(ofic => Number(ofic.id_oficina) === Number(idOficina));
        return nombreOficina?.agencia ? nombreOficina.agencia : '';
    }

    return (<div className="f-row">
        <Sidebar enlace={props.location.pathname}></Sidebar>
        
        <div className="container_mg mb-4">
            {permisoNuevaSol && 
                <>
                <div className="content-cards mt-2">
                    
                    <Card>
                        <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Solicitud"></img>
                        <h4 className="mt-2">Solicitud</h4>
                        <h5 className="mt-5">Genera una nueva solicitud de tarjeta de crédito</h5>
                        <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaSolicitud}>Siguiente</Button>
                    </Card>

                    <Card>
                        <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Prospección"></img>
                            <h4 className="mt-2">Prospección</h4>
                            <h5 className="mt-2">Genera una nueva prospección de tarjeta de crédito</h5>
                            <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaProspección}>Siguiente</Button>
                    </Card>


                    <Card>
                        <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Estado de cuenta"></img>
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
                                    <td style={{ width:"10%" }}>
                                        {solicitud.int_id}
                                    </td>
                                    <td>{solicitud.str_identificacion}</td>
                                    <td>{solicitud.int_ente}</td>
                                    <td>{solicitud.str_nombres}</td>
                                    <td>{`$ ${Number(solicitud.dec_cupo_solicitado).toLocaleString('en-US')}`}</td>
                                    <td>{solicitud.str_calificacion}</td>
                                    <td>
                                        {solicitud.str_analista ? <div>
                                            {solicitud.str_estado}
                                            <div className='tooltip ml-1'>
                                                <img className='tooltip-icon' src='/Imagenes/info.svg' alt="Analista encargado seguimiento"></img>
                                                <span className='tooltip-info'>Analista: {solicitud.str_analista}</span>
                                            </div>
                                        </div> : '' }                                        
                                    </td>
                                    <td>
                                        {validarNombreOficina(solicitud.int_oficina_crea)}
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
                                    <td style={{ width: "10%" }}>{prospecto.pro_id}</td>
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

        <Modal
            modalIsVisible={modalVisible}
            titulo={`Aviso`}
            onNextClick={siguientePasoHandler}
            onCloseClick={closeModalHandlerMsg}
            isBtnDisabled={false}
            type="sm"
        >
            {modalVisible && <div>
                <p className="mt-2 mb-2">No tiene permiso para acceder a esta solicitud</p>
            </div>}
        </Modal>
       

    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);