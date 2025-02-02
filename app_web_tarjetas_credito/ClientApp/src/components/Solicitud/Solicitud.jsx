﻿import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect } from "react";
import { fetchAddProcEspecifico, fetchGetFuncionalidadesTC, fetchGetSolicitudes } from "../../services/RestServices";
import { IsNullOrWhiteSpace, dateFormat, numberFormatMoney } from '../../js/utiles';
import Modal from '../Common/Modal/Modal';
import Card from '../Common/Card';
import { get } from '../../js/crypt';
import Button from '../Common/UI/Button';
import Toggler from '../Common/UI/Toggler';
import { setSolicitudStateAction } from '../../redux/Solicitud/actions';
import { setProspectoStateAction } from '../../redux/Prospecto/actions';
import Paginacion from '../Common/Paginacion';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import SortableTable from '../Common/SortableTable';

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data,
        funcionalidadesStore: state.GetFuncionalidadesSistema.data
    };
};

function Solicitud(props) {
    const navigate = useHistory();
    const dispatch = useDispatch();

    //Inicio
    const [rol, setRol] = useState("");

    const [isLstSolicitudes, setIsLstSolicitudes] = useState(true);
    const [isLstProspecciones, setIsLstProspecciones] = useState(false);
    const [accionesSolicitud, setAccionesSolicitud] = useState([]);
     /*   [
            { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
            { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
        ]);*/
    const [modalVisible, setModalVisible] = useState(false);
    const [permisoNuevaSol, setPermisoNuevaSol] = useState(false);

    //Paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasEnVista, setPaginasEnVista] = useState(10); //Número de registros listados por página
    const indexOfLastRecord = paginaActual * paginasEnVista;
    const indexOfFirstRecord = indexOfLastRecord - paginasEnVista;
    const [registrosPagActual, setRegistrosPagActual] = useState([]);
    const [numPaginas, setNumPaginas] = useState(0);
    const [isPuedeListarFiltrado, setIsPuedeListarFiltrado] = useState(false);


    const [oficinasParametros, setOficinasParametros] = useState([]);
    const [modalAnularVisible, setModalAnularVisible] = useState(false);
    const [solicitudAnular, setSolicitudAnular] = useState({ idSolicitud: 0, cupoSolicitadoAnular: 0 });
    const [solicitudCupoAnulacion, setSolicitudCupoAnulacion] = useState(false);



    //Headers tablas Solicitudes y Prospectos
    const headerTableSolicitantes = [
        { nombre: 'Número', key: 0, shortableColumn: true, keyName: "int_id" },
        { nombre: 'Fecha', key: 1, shortableColumn: true, keyName: "dtt_fecha_solicitud" },
        { nombre: 'Cédula', key: 2, shortableColumn: true, keyName: "str_identificacion" },
        { nombre: 'Nombre', key: 3, shortableColumn: true, keyName: "str_nombres" },
        { nombre: 'Cupo Solicitado', key: 4, shortableColumn: true, keyName: "dec_cupo_solicitado" },
        { nombre: 'Oficina', key: 5, shortableColumn: true, keyName: "int_oficina_crea" },
        { nombre: 'Estado', key: 7, keyName: "int_estado" },
        { nombre: 'Canal', key: 6, shortableColumn: true, keyName: "str_canal_crea" },        
        { nombre: 'Usuario', key: 8, shortableColumn: true, keyName: "str_usuario_crea" },
        //{ nombre: 'Calificación', key: 6, shortableColumn: true, keyName: "str_calificacion" },

        { nombre: 'Acción', key: 9, shortableColumn: true, keyName: "" },
    ];

    const headerTableProspectos = [
        { nombre: 'Número', key: 0, shortableColumn: true, keyName: "pro_id" },
        { nombre: 'Fecha', key: 1, shortableColumn: true, keyName: "pro_fecha_solicitud" },
        { nombre: 'Cédula', key: 2, shortableColumn: true, keyName: "pro_num_documento" },
        { nombre: 'Nombre', key: 3, shortableColumn: true, keyName: "pro_nombres" },
        //{ nombre: 'Celular', key: 4, shortableColumn: true, keyName: "pro_celular" },
        { nombre: 'Cupo solicitado', key: 4, shortableColumn: true, keyName: "pro_cupo_solicitado" },
        //{ nombre: 'Correo', key: 5, shortableColumn: true, keyName: "pro_email" },
        { nombre: 'Oficina', key: 5, shortableColumn: true, keyName: "pro_oficina_crea" },
        { nombre: 'Canal', key: 6, shortableColumn: true, keyName: "pro_canal_crea" },
        { nombre: 'Usuario', key: 7, shortableColumn: true, keyName: "pro_usuario_crea" },
    ];


    //Prostectos y solicitudes
    const [lstProstectos, stLstProspectos] = useState([]);
    const [lstSolicitudes, stLstSolicitudes] = useState([]);

    const [controlConsultaCargaComp, setControlConsultaCargaComp] = useState(false);

    //OBTENER PARAMETROS
    const [habilitarPerfilesVerSolicitud, setHabilitarPerfilesVerSolicitud] = useState([]);

    //FUNCIONALIDADES SETTINGS
    const [funcionalidades, setFuncionalidades] = useState([]);
    const [tienePermisosCrearSolicitud, setTienePermisosCrearSolicitud] = useState(false);


    //Carga de solicitudes (SE MODIFICA PARA QUE APAREZCA PRIMERA PANTALLA COMO PREDETERMINADA AL LOGUEARSE)
    useEffect(() => {
        if (props.token && !controlConsultaCargaComp) {
            setControlConsultaCargaComp(true);

            //TRAE FUNCIONALIDADES (SETTINGS)
            fetchGetFuncionalidadesTC(props.token, (data) => {
                //console.log(data.lst_funcSettings)
                console.log(data.lst_funcSettings2)
                setFuncionalidades(data.lst_funcSettings2);
            }, dispatch)

            fetchGetSolicitudes(props.token, (data) => {
                stLstProspectos(data.prospectos);
                stLstSolicitudes(data.solicitudes);

                //Aplicacion Paginacion para Solicitudes (predeterminado)
                setRegistrosPagActual(data.solicitudes.slice(indexOfFirstRecord, indexOfLastRecord));
                setNumPaginas(Math.ceil(data.solicitudes.length / paginasEnVista))
            }, dispatch)

            const strRol = get(localStorage.getItem("role"));
            setRol(strRol);
            //setControlConsultaCargaComp(true);
        }
    }, [props.token, controlConsultaCargaComp]);


    useEffect(() => {
        if (props.token && props.parametrosTC.lst_parametros?.length > 0 && oficinasParametros.length === 0) {
            let ParametrosTC = props.parametrosTC.lst_parametros;
            /* PERFILES AUTORIZADOS EN VER LA SOLICITUD */
            let perfilesAutorizados = (ParametrosTC
                .filter(param => param.str_nombre === 'PERFILES_AUTORIZADOS_VER_SOLICITUD')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_valor_ini: estado.str_valor_ini
                })));
            if (perfilesAutorizados.length > 0) setHabilitarPerfilesVerSolicitud(perfilesAutorizados[0].prm_valor_ini.split('|'))

            //Obtener oficinas parametrizadas
            let oficinasParametrosTC = ParametrosTC
                .filter(param => param.str_nombre === 'OFICINAS_TC')
                .map(estado => ({
                    prm_id: estado.int_id_parametro,
                    prm_nombre: estado.str_nombre,
                    prm_nemonico: estado.str_nemonico,
                    prm_valor_ini: estado.str_valor_ini,
                    prm_valor_fin: estado.str_valor_fin,
                    prm_descripcion: estado.str_descripcion
                }));
            setOficinasParametros(oficinasParametrosTC)
        }

        /*if (props.token && props.funcionalidadesStore.permisos?.length > 0 && accionesSolicitud.length === 0) {
            

            setAccionesSolicitud([
                { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
                { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
            ])
        }*/

    }, [props])


    //Para definir que acciones puede realizar por perfil
    useEffect(() => {
        if (funcionalidades?.length > 0 && props?.funcionalidadesStore?.permisos?.length > 0) {
            //console.log("props?.funcionalidadesStore?.permisos ", props?.funcionalidadesStore?.permisos)
            console.log("props?.funcionalidadesStore?.permisos ", props?.funcionalidadesStore?.permisos)

            //Permisos para crear solicitudes/prospectos
            setTienePermisosCrearSolicitud(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.keyTexto === "CREAR_SOLICITUD_TC")
            }))

            //Permisos para toogler acciones
            let puedeVerProspectos = props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.keyTexto === "VER_PROSPECTOS_TC")
            });
            if (puedeVerProspectos) {
                setAccionesSolicitud([
                    { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
                    { image: "", textPrincipal: `Prospectos`, textSecundario: "", key: 2 }
                ])
            } else {
                setAccionesSolicitud([
                    { image: "", textPrincipal: `Solicitudes`, textSecundario: "", key: 1 },
                ])
            }

        }
    }, [funcionalidades, props?.funcionalidadesStore])


    //ACTUALIZA LA PAGINA DONDE SE QUIERE IR
    useEffect(() => {
        if (isLstSolicitudes) {
            setRegistrosPagActual(lstSolicitudes.slice(indexOfFirstRecord, indexOfLastRecord));
        } else if (isLstProspecciones) {
            setRegistrosPagActual(lstProstectos.slice(indexOfFirstRecord, indexOfLastRecord));
        }
    }, [paginaActual])


    /*
    useEffect(() => {
        if (rol) {
            validaPermiso("CREAR SOLICITUD");
        }
    }, [rol]);

    const validaPermiso = (strNombrePermiso) => {
        if (rol) {
            var permisosUusuario = [];
            if (rol === "ASESOR DE CRÉDITO") {
                permisosUusuario = ["CREAR SOLICITUD"];
            }
            var permis = permisosUusuario.includes(strNombrePermiso);
            if (permis) {
                setPermisoNuevaSol(permis);
            }
        }
    }*/

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
        /* PARA VER SOLICITUD POR PARTE DEL ASESOR DE NEGOCIOS*/


        //console.log("solId ", solId)
        //console.log("solicitudSeleccionada ", solicitudSeleccionada)
        //console.log("nombreOficinaDeSolicitud ", nombreOficinaDeSolicitud)


        if (rol === "ASESOR DE CRÉDITO") {
            dispatch(setSolicitudStateAction({
                solicitud: solicitudSeleccionada.int_id, cedulaPersona: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.int_estado, rol: rol, estado: solicitudSeleccionada.str_estado, oficinaSolicitud: nombreOficinaDeSolicitud, calificacionRiesgo: solicitudSeleccionada.str_calificacion
            }))
            navigate.push('/solicitud/ver');
        } else {




            /* PARA QUE PUEDAN HACER EL PASO DE BANDEJA CADA PERFIL */
            //else if (habilitarPerfilesVerSolicitud.includes(rol)) {
            dispatch(setSolicitudStateAction({
                solicitud: solicitudSeleccionada.int_id, cedulaPersona: solicitudSeleccionada.str_identificacion, idSolicitud: solicitudSeleccionada.int_estado, rol: rol, estado: solicitudSeleccionada.str_estado, oficinaSolicitud: nombreOficinaDeSolicitud, calificacionRiesgo: solicitudSeleccionada.str_calificacion
            }))
            navigate.push('/solicitud/ver');
            //}
            /*else {
                setModalVisible(true);
            }*/
        }
    }

    const moveToProspecto = (prospectoId) => {
        const prospectoSeleccionado = registrosPagActual.find((prospect) => { return prospect.pro_id === prospectoId });
        dispatch(setProspectoStateAction({
            prospecto_id: prospectoSeleccionado.pro_id,
            prospecto_cedula: prospectoSeleccionado.pro_num_documento,
            prospecto_nombres: prospectoSeleccionado.pro_nombres,
            prospecto_apellidos: prospectoSeleccionado.pro_apellidos

        }))
        navigate.push('/prospeccion/ver');

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
        let nombreOficina = oficinasParametros.find(ofic => Number(ofic.prm_valor_fin) === Number(idOficina));
        return nombreOficina?.prm_descripcion ? nombreOficina.prm_descripcion : '';
    }

    const deleteSolicitudHandler = () => {
        fetchAddProcEspecifico(solicitudAnular.idSolicitud, 0, "EST_ANULADA", "", solicitudAnular.cupoSolicitadoAnular, props.token, (data) => {
            if (data.str_res_codigo === "000") {
                setModalAnularVisible(false);
                navigate.push('/')
            }
        }, dispatch)
    }

    const closeModalRechazo = () => {
        setModalAnularVisible(false);
    }

    const dataFiltradaHandler = (data, puedeFiltrar) => {
        //console.log("DATA RET ", data)
        //console.log("DATA Ahora ", registrosPagActual)
        setRegistrosPagActual([...data])
        setIsPuedeListarFiltrado(puedeFiltrar)
    }

    const puedeFiltrarHandler = (valor) => {
        setIsPuedeListarFiltrado(valor)
    }

    return (
        <div className="f-row w-100" >

            <div className="container_mg mb-4">
                {/* {permisoNuevaSol && 
                <>*/}

                {tienePermisosCrearSolicitud &&
                    <div className="content-cards mt-2">

                        <Card>
                            <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Prospección"></img>
                            <h3 className="mt-2">Prospección</h3>
                            <h4 className="mt-2">Genera una nueva prospección de tarjeta de crédito</h4>

                            <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaProspección}>Siguiente</Button>
                        </Card>


                        <Card>
                            <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Solicitud"></img>
                            <h3 className="mt-2">Solicitud</h3>
                            <h4 className="mt-2">Genera una nueva solicitud de tarjeta de crédito</h4>
                            <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={irNuevaSolicitud}>Siguiente</Button>
                        </Card>



                        <Card>
                            <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Estado de cuenta"></img>
                            <h3 className="mt-4">Estado de cuenta</h3>
                            <h4 className="mt-4 mb-3">Generar estado de cuenta </h4>
                            <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false} onClick={descargarEstadoCuenta}>Descargar</Button>
                        </Card>

                    </div>        

                }

                              
                

                {accionesSolicitud.length > 0 &&
                <Toggler className="mt-2" toggles={accionesSolicitud}
                    selectedToggle={handleSelectedToggle}>
                </Toggler>
                }
                <div id="listados" className="f-col mt-2" style={{ maxWidth: `${isLstSolicitudes ? "calc(100vw - 1rem)" : "calc(100vw - 2rem)"}` }}>
                {isLstSolicitudes &&
                    
                        <SortableTable
                            headers={headerTableSolicitantes}
                            paginaActual={paginaActual}
                            informacion={registrosPagActual}
                            dataFiltrada={dataFiltradaHandler}
                            sortConfig={{ key: 'int_id', direction: 'descending' }}
                        >
                            {registrosPagActual.length > 0 && isPuedeListarFiltrado && registrosPagActual.map((solicitud) => {
                                return (
                                    <tr key={solicitud.int_id}>
                                        <td style={{ width: "10%" }} onClick={() => { moveToSolicitud(solicitud.int_id) }}>
                                            {solicitud.int_id}
                                        </td>
                                        <td onClick={() => { moveToSolicitud(solicitud.int_id) }}>{dateFormat("dd-MMM-yyyy HH:MIN:SS", solicitud.dtt_fecha_solicitud)}</td>
                                        <td onClick={() => { moveToSolicitud(solicitud.int_id) }}>{solicitud.str_identificacion}</td>
                                        <td style={{ textWrap: "balance" }} onClick={() => { moveToSolicitud(solicitud.int_id) }}>{`${solicitud.str_nombres} ${solicitud.str_apellidos}`}</td>
                                        <td onClick={() => { moveToSolicitud(solicitud.int_id) }}>{numberFormatMoney(solicitud.dec_cupo_solicitado)}</td>
                                        {/*<td onClick={() => { moveToSolicitud(solicitud.int_id) }}>{solicitud.str_calificacion}</td>*/}
                                        <td style={{ textWrap: "balance" }} onClick={() => { moveToSolicitud(solicitud.int_id) }}>{validarNombreOficina(solicitud.int_oficina_crea)}</td>
                                        <td style={{ textWrap: "nowrap" }} onClick={() => { moveToSolicitud(solicitud.int_id) }}>
                                            <div>
                                                {solicitud.str_estado}
                                                {solicitud.str_analista ?
                                                    <div className='tooltip ml-1'>
                                                        <img className='tooltip-icon' src='/Imagenes/info.svg' alt="Analista encargado seguimiento"></img>
                                                        <span className='tooltip-info'>Analista: {solicitud.str_analista}</span>
                                                    </div> : ''}
                                            </div>
                                        </td>
                                        <td onClick={() => { moveToSolicitud(solicitud.int_id) }}>{solicitud.str_canal_crea}</td>
                                        
                                        <td onClick={() => { moveToSolicitud(solicitud.int_id) }}>{solicitud.str_usuario_crea}</td>
                                        <td style={{ padding:"3px 0px 0px 0px"  }}>
                                            <div className="f-col justify-content-center icon-botton"
                                                onClick={() => {
                                                    setSolicitudCupoAnulacion(solicitud.dec_cupo_solicitado);
                                                    let solicitudAnular = {
                                                        idSolicitud: solicitud.int_id, cupoSolicitadoAnular: solicitud.dec_cupo_solicitado
                                                    } 
                                                    setSolicitudAnular(solicitudAnular);
                                                    setModalAnularVisible(true)
                                                }}>
                                                <DeleteForeverRoundedIcon
                                                    sx={{
                                                        fontSize: 33,
                                                        margin: 0,
                                                        padding: 0
                                                    }}
                                                ></DeleteForeverRoundedIcon>
                                            </div>



                                        </td>

                                    </tr>
                                );
                            })}

                        </SortableTable>

                    
                }
                {isLstProspecciones &&
                   
                        <SortableTable
                            headers={headerTableProspectos}
                            paginaActual={paginaActual}
                            informacion={registrosPagActual}
                            dataFiltrada={dataFiltradaHandler}
                            sortConfig={{ key: 'pro_id', direction: 'descending' }}
                        >
                            {registrosPagActual && registrosPagActual.map((prospecto) => {
                                return (
                                    <tr key={prospecto.pro_id} onClick={() => { moveToProspecto(prospecto.pro_id) }}>
                                        <td style={{ maxWidth: "5%" }}>{prospecto.pro_id}</td>
                                        <td>{dateFormat("dd-MMM-yyyy HH:MIN:SS", prospecto.pro_fecha_solicitud)}</td>
                                        <td>{prospecto.pro_num_documento}</td>
                                        <td style={{ textWrap: "balance" }}>{`${prospecto.pro_nombres} ${prospecto.pro_apellidos}`}</td>
                                        <td>{numberFormatMoney(prospecto.pro_cupo_solicitado)}</td>
                                        <td style={{ textWrap: "balance" }}>{validarNombreOficina(prospecto.pro_oficina_crea)}</td>
                                        <td>{prospecto.pro_canal_crea}</td>
                                        <td>{prospecto.pro_usuario_crea}</td>
                                    </tr>);
                            })}

                        </SortableTable>
                   
                    }

                {(isLstSolicitudes || isLstProspecciones) && numPaginas > 1 &&

                        <div>
                            <Paginacion numPaginas={numPaginas}
                                paginaActual={paginaActual}
                                setPaginaActual={setPaginaActual} />
                        </div>
                   
                        
                    }
                </div>

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

            <Modal
                modalIsVisible={modalAnularVisible}
                titulo={`Aviso!!!`}
                onNextClick={deleteSolicitudHandler}
                onCloseClick={closeModalRechazo}
                isBtnDisabled={false}
                type="sm"
                mainText="Anular tarjeta"
            >
                <div>
                    <h3 className="mt-4 mb-3">¿Esta seguro que anular la solicitud de la tarjeta?</h3>
                </div>
            </Modal>

        </div>);

}

export default connect(mapStateToProps, {})(Solicitud);