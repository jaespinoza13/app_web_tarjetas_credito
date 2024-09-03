import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace, dateFormat } from '../../js/utiles';
import "../../css/Components/Seguimiento.css";
import Input from '../Common/UI/Input';
import { Fragment } from 'react';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import ComponentItemsOrden from './ComponentItemsOrden';
import { get } from '../../js/crypt';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip';
import TogglerV2 from '../Common/UI/TogglerV2';
import { fetchGetFuncionalidadesTC, fetchGetOrdenes, fetchGetParametrosSistema, fetchGetSeparadores, fetchUpdateOrdenes } from '../../services/RestServices';
import { setSeguimientOrdenAction } from '../../redux/SeguimientoOrden/actions';
import Modal from '../Common/Modal/Modal';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
import UploadDocumentos from "../Common/UploaderDocuments";
import ReplyAllRoundedIcon from '@mui/icons-material/ReplyAllRounded';

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data,
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        funcionalidadesStore: state.GetFuncionalidadesSistema.data,
        seguimientoOrden: state.GetSeguimientoOrden.data,
    };
};


function Seguimiento(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();

    //PARAMETROS REQUERIDOS
    const [estadosSeguimientoTC, setEstadosSeguimientoTC] = useState([]);

    const [inputBusqueda, setInputBusqueda] = useState([]);

    const [textoBotonAccion, setTextoBotonAccion] = useState("");
    const [textBtnAccionAsistenteAgencia, setTextBtnAccionAsistenteAgencia] = useState("");
    const [lstSeguimientoTC, setLstSeguimientoTC] = useState([]);
    const [lstParamsSeguimiento, setLstParamsSeguimiento] = useState([]);
    const [controlConsultaCargaComp, setControlConsultaCargaComp] = useState(false);
    const [selectFiltrarOrdenes, setSelectFiltrarOrdenes] = useState("");
    const [totalTarjetasAccionDiccionario, setTotalTarjetasAccionDiccionario] = useState([]);
    const [totalTarjetasListado, setTotalTarjetasListado] = useState(0);
    const [numtotalTarjetasCambioEstado, setNumtotalTarjetasCambioEstado] = useState([]);
    const [subMenuOpcionesPerfil, setSubMenuOpcionesPerfil] = useState([]);
    const [funcionalidades, setFuncionalidades] = useState([]);

    const headersTarjetas =
        [{ key: 0, nombre: "Identificación" }, { key: 1, nombre: "Nombre del titular" }, { key: 2, nombre: "Fecha proceso" }, { key: 3, nombre: "Tipo de tarjeta" }, { key: 4, nombre: "Tipo de producto" }, { key: 5, nombre: "Acciones" }]


    //Info sesión
    const [datosUsuario, setDatosUsuario] = useState([]);

    //Identificador de item seguimiento
    const [seguimientoIdAccion, setSeguimientoIdAccion] = useState(0);

    //Variables para habilitar permisos

    const [tienePermisoListarPendPersonalizarTC, setTienePermisoListarPersonalizarTC] = useState(false);
    const [tienePermisoListarPendRecibirOperacTC, setTienePermisoListarPendRecibirOperacTC] = useState(false);
    const [tienePermisoListarPendEnviarAgenciasTC, setTienePermisoListarPendEnviarAgenciasTC] = useState(false);
    const [tienePermisoEnviarPersonalizarTC, setTienePermisoEnviarPersonalizarTC] = useState(false);
    const [tienePermisoVericarOperacionesTC, setTienePermisoVericarOperacionesTC] = useState(false);
    const [tienePermisoEnviarAgenciaTC, setTienePermisoEnviarAgenciaTC] = useState(false);
    const [tienePermisoRechazarOperacionesTC, setTienePermisoRechazarOperacionesTC] = useState(false);

    const [tienePermisoListarPendRecibirAgenciaTC, setTienePermisoListarPendRecibirAgenciaTC] = useState(false);
    const [tienePermisoListarPendActivarTC, setTienePermisoListarPendActivarTC] = useState(false);
    const [tienePermisoActivarTC, setTienePermisoActivarTC] = useState(false);
    const [tienePermisoReceptarTC, setTienePermisoReceptarTC] = useState(false);

    const [tienePermisoListarPendEntregarTC, setTienePermisoListarPendEntregarTC] = useState(false);
    const [tienePermisoEntregarTC, setTienePermisoEntregarTC] = useState(false);


    //Modales
    const [isOpenModalCambioEstadoSiguiente, setIsOpenModalCambioEstadoSiguiente] = useState(false);
    const [textoCambioEstadoOrden, setTextoCambioEstadoOrden] = useState("");
    const [isModalVisibleOk, setIsModalVisibleOk] = useState(false);
    const [textoTitulo, setTextoTitulo] = useState("");

    const [isOpenModalAccionTarjeta, setIsOpenModalAccionTarjeta] = useState(false);
    const [isOpenModalGestorDocumental, setIsOpenModalGestorDocumental] = useState(false);
    const [isOpenModalDevolverTC, setIsOpenModalDevolverTC] = useState(false);

    //Axentria
    const [separadores, setSeparadores] = useState([]);

    useEffect(() => {
        //console.log("PROPS seguimientoOrden ", props.seguimientoOrden)
        if (props.seguimientoOrden.seguimientoCedula) {
            //setSeguimientoIdAccion(props.seguimientoOrden)
            setIsOpenModalAccionTarjeta(true);
            //console.log("PADRE ",props.seguimientoOrden)
        }
    }, [props.seguimientoOrden])


    useEffect(() => {
        if (selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER") {
            setSeguimientoOrdenRedux(false);
            setTextoBotonAccion("Enviar");
        }
        else if (selectFiltrarOrdenes === "EST_SEG_ENV_PER") {
            setSeguimientoOrdenRedux(true);
            setTextoBotonAccion("Recibir");
        }
        else if (selectFiltrarOrdenes === "EST_SEG_VER_OPR") {
            setSeguimientoOrdenRedux(false);
            setTextoBotonAccion("Distribuir");
        } else if (selectFiltrarOrdenes === "EST_SEG_ENV_AGN") {
            setSeguimientoOrdenRedux(true);
        } else {
            setSeguimientoOrdenRedux(false);
        }
        //setTotalTarjetasAccionDiccionario([])
    }, [selectFiltrarOrdenes])


    useEffect(() => {

        //setLstOrdenesFiltradas(ordenesV2.filter(tarjetas => tarjetas.estado === "PENDIENTE DE PERSONALIZAR"))
        //setSeguimientoOrdenRedux(true);

        //setLstItemsReceptarOficina([...ordenesAgencias]);
        if (!IsNullOrWhiteSpace(props.token) && !controlConsultaCargaComp && props.parametrosTC?.lst_parametros?.length > 0) {
            setControlConsultaCargaComp(true);
            const strOficial = get(localStorage.getItem("sender_name"));
            const strRol = get(localStorage.getItem("role"));

            const userOficial = get(localStorage.getItem('sender'));
            const userOficina = get(localStorage.getItem('office'));

            setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);
            if (props.parametrosTC.lst_parametros?.length > 0) {
                let ParametrosTC = props.parametrosTC.lst_parametros;
                setEstadosSeguimientoTC(ParametrosTC
                    ?.filter(param => param.str_nombre === 'ESTADOS_SEGUIMIENTO_TC')
                    ?.map(estado => ({
                        prm_id: estado.int_id_parametro,
                        prm_nombre: estado.str_nombre,
                        prm_nemonico: estado.str_nemonico,
                        prm_valor_ini: estado.str_valor_ini,
                        prm_valor_fin: estado.str_valor_fin
                    })));
            }
            consultarParametrosSeguimiento();

            //TRAE FUNCIONALIDADES (SETTINGS)
            fetchGetFuncionalidadesTC(props.token, (data) => {
                //console.log(data.lst_funcSettings)
                //console.log(data.lst_funcSettings2)
                console.log(data.lst_func_seguimiento_settings)
                setFuncionalidades(data.lst_func_seguimiento_settings);
            }, dispatch)
        }


    }, [props, controlConsultaCargaComp])



    useEffect(() => {
        //Para definir el toogle del perfil que este logueado (Se usa permisos de funcionalidad y parametros)
        //(Hace la union de funcionalidades con parametros, ej: fun_nombre VER_ORDEN_PENDIENTE_ENVIAR_PERSONALIZAR;  parametro prm_valor_ini es VER_ORDEN_PENDIENTE_ENVIAR_PERSONALIZAR)
        if (props?.funcionalidadesStore?.permisos?.length > 0 && lstParamsSeguimiento?.length > 0 && estadosSeguimientoTC?.length > 0) {
            //console.log(props?.funcionalidadesStore?.permisos)
            //console.log(lstParamsSeguimiento)
            //console.log(estadosSeguimientoTC)

            let paramOpciones = [];
            let toogleOpciones = [];
            props?.funcionalidadesStore?.permisos?.forEach(permiso => {
                let parametroEncontrado = lstParamsSeguimiento?.find(parametroSeg => parametroSeg?.prm_valor_ini === permiso?.fun_nombre);
                if (parametroEncontrado) {
                    paramOpciones = [...paramOpciones, parametroEncontrado];
                }
            });
            if (paramOpciones.length > 0) {
                paramOpciones?.forEach(paramOpc => {
                    let separador = paramOpc?.prm_valor_fin.split('|');
                    let estadoParametroSeguimiento = estadosSeguimientoTC?.find(paramEstadoSeg => paramEstadoSeg?.prm_nemonico === separador[0]?.toString());
                    let estadoParamSeguimSigEstado = estadosSeguimientoTC?.find(paramEstadoSeg => paramEstadoSeg?.prm_nemonico === separador[2]?.toString());
                    let opcion = {
                        key: separador[0], //Se coloca el nemonico
                        textPrincipal: separador[1], //Nombre del campo a presentar
                        image: "",
                        textSecundario: "",
                        prm_id: estadoParametroSeguimiento?.prm_id,
                        prm_id_sig_estado: estadoParamSeguimSigEstado?.prm_id,
                    }
                    toogleOpciones = [...toogleOpciones, opcion]
                });
                toogleOpciones.sort((a, b) => a.prm_id - b.prm_id);
                setSubMenuOpcionesPerfil(toogleOpciones);

                //SI SOLO SE TIENE UNA ACCION POR ROL, SE REALIZA LA CONSULTA DIRECTAMENTE PARA PRESENTARLA EN COMPONENTE, ejemplo para ASISTENTE DE PLATAFORMA DE SERVICIOS
                if (props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_POR_ENTREGAR_SOCIO")) {
                    //console.log("toogleOpciones ", toogleOpciones)
                    //obtenerLstSeguimientoTC(toogleOpciones[0].prm_id);
                    let estadoFiltrar = toogleOpciones.find(estadoSeg => estadoSeg.key === 'EST_SEG_POR_ENT_SOC')
                    //console.log("estadoFiltrar ", estadoFiltrar)
                    obtenerLstSeguimientoTC(estadoFiltrar?.prm_id);
                }
            }
        }
    }, [props?.funcionalidadesStore?.permisos, lstParamsSeguimiento, estadosSeguimientoTC])


    useEffect(() => {
        //Asignaciones de permisos para botones paso de bandejas
        if (funcionalidades?.length > 0 && props?.funcionalidadesStore?.permisos?.length > 0) {
            //console.log("props?.funcionalidadesStore?.permisos ", props?.funcionalidadesStore?.permisos)
            //console.log("funcionalidades ", funcionalidades)

            /*OPERACIONES*/
            setTienePermisoListarPersonalizarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_PENDIENTE_ENVIAR_PERSONALIZAR"))
            setTienePermisoListarPendRecibirOperacTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_ENVIADA_PERSONALIZAR"))
            setTienePermisoListarPendEnviarAgenciasTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_VERIFICAR_OPERACIONES"))
            setTienePermisoEnviarPersonalizarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "PERMISO_ENVIAR_PERSONALIZAR_TC"))
            setTienePermisoVericarOperacionesTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "PERMISO_VERIFICAR_TC_OPERACIONES"))
            setTienePermisoEnviarAgenciaTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "PERMISO_ENVIAR_AGENCIA_TC"))
            setTienePermisoRechazarOperacionesTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "PERMISO_RECHAZAR_TC_OPERACIONES"))

            /*ASISTENTE DE AGENCIA*/
            setTienePermisoListarPendRecibirAgenciaTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_ENVIADO_AGENCIA"))
            setTienePermisoListarPendActivarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_POR_ACTIVAR"))

            setTienePermisoActivarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "PERMISO_ACTIVAR_TC"))
            setTienePermisoReceptarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "PERMISO_RECEPTAR_TC_AGENCIA"))


            /*ASISTENTE DE PLATAFORMA*/
            setTienePermisoListarPendEntregarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_POR_ENTREGAR_SOCIO"))
            setTienePermisoEntregarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "PERMISO_ENTREGAR_TC_SOCIO"))
            /*
            setTienePermisoEntregarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_ENTREGAR_TC_SOCIO")
            }))*/
        }
    }, [funcionalidades, props?.funcionalidadesStore])

    useEffect(() => {
        let itemOrdenesSeleccionadas = [];
        for (const key in totalTarjetasAccionDiccionario) {
            if (totalTarjetasAccionDiccionario.hasOwnProperty(key) && totalTarjetasAccionDiccionario[key]?.length > 0) { // Aseguramos que la clave es parte del objeto y no del prototipo
                const value = totalTarjetasAccionDiccionario[key];
                itemOrdenesSeleccionadas = [...itemOrdenesSeleccionadas, ...value];
            }
        }
        //console.log("itemOrdenesSeleccionadas ", itemOrdenesSeleccionadas)
        setNumtotalTarjetasCambioEstado(itemOrdenesSeleccionadas);
    }, [totalTarjetasAccionDiccionario])


    const returnItemsHandler = (arrayItems, oficina) => {
        AddUpdateItemOrden(oficina, arrayItems);
    }

    function AddUpdateItemOrden(clave, valor) {
        //Actualizar o agregar el objeto
        setTotalTarjetasAccionDiccionario(prevTotalTarjetasAccionDiccionario => ({
            ...prevTotalTarjetasAccionDiccionario,
            [clave]: valor
        }));
    }

    const closeModalCambioEstadoOrdenes = () => {
        setIsOpenModalCambioEstadoSiguiente(false);
        setTextoCambioEstadoOrden("");
    }
    const closeModalDevolverTC = () => {
        setIsOpenModalDevolverTC(false);
    }

    const closeModalAccionTarjeta = () => {
        setIsOpenModalAccionTarjeta(false);
        setSeguimientoIdAccion(0);
    }

    const closeModalGestorDocumentalHandler = () => {
        setIsOpenModalGestorDocumental(false);
    }

    const cambioEstadoTCSeguimientoHandler = async () => {
        closeModalCambioEstadoOrdenes();
        //console.log("selectFiltrarOrdenes ", selectFiltrarOrdenes)
        if (selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER") { //Verificar TC si llegaron bien del proveedor
            let itemOrdenes = [];
            lstSeguimientoTC.forEach(seguim => {
                seguim.lst_ord_ofi.forEach(tarjeta => {
                    itemOrdenes = [...itemOrdenes, tarjeta.int_seg_id]
                })
            })

            if (itemOrdenes.length > 0) {
                let paramEstadoSeguimiento = subMenuOpcionesPerfil.find(opciones => opciones.key === selectFiltrarOrdenes);
                actualizarOrdenes(paramEstadoSeguimiento.prm_id_sig_estado, itemOrdenes, (callback) => {
                    setTextoTitulo("Las tarjetas de crédito se enviaron correctamente.")
                    setIsModalVisibleOk(true);
                    filtrarTarjetas(selectFiltrarOrdenes);//Realizar nueva consulta
                });

            } else {
                return
            }
        }

        else if (selectFiltrarOrdenes === "EST_SEG_ENV_PER") {
            let paramEstadoSeguimiento = subMenuOpcionesPerfil.find(opciones => opciones.key === selectFiltrarOrdenes);
            if (numtotalTarjetasCambioEstado.length > 0) {
                actualizarOrdenes(paramEstadoSeguimiento.prm_id_sig_estado, numtotalTarjetasCambioEstado, (callback) => {
                    setTextoTitulo("Las tarjetas de crédito han cambiado su estado a verificadas.")
                    setIsModalVisibleOk(true);
                    filtrarTarjetas(selectFiltrarOrdenes);//Realizar nueva consulta
                });
            } else {
                return
            }

        }
        else if (selectFiltrarOrdenes === "EST_SEG_VER_OPR") { //Para enviar a las agencias (distibucion TC)
            let paramEstadoSeguimiento = subMenuOpcionesPerfil.find(opciones => opciones.key === selectFiltrarOrdenes);
            if (numtotalTarjetasCambioEstado.length > 0) {
                actualizarOrdenes(paramEstadoSeguimiento.prm_id_sig_estado, numtotalTarjetasCambioEstado, (callback) => {
                    setTextoTitulo("Las tarjetas de crédito han cambiado su estado a distribuidas.")
                    setIsModalVisibleOk(true);
                    filtrarTarjetas(selectFiltrarOrdenes);//Realizar nueva consulta
                });
            } else {
                return
            }
        }
        //Para ASISTENTE DE AGENCIA
        else if (selectFiltrarOrdenes === "EST_SEG_ENV_AGN") { //Para receptar TC en las oficinas/agencias
            let paramEstadoSeguimiento = subMenuOpcionesPerfil.find(opciones => opciones.key === selectFiltrarOrdenes);
            if (numtotalTarjetasCambioEstado.length > 0) {
                actualizarOrdenes(paramEstadoSeguimiento.prm_id_sig_estado, numtotalTarjetasCambioEstado, (callback) => {
                    setTextoTitulo("Las tarjetas de crédito se cambiaron de estado a Recibido");
                    setIsModalVisibleOk(true);
                    filtrarTarjetas(selectFiltrarOrdenes);//Realizar nueva consulta
                });
            } else {
                return
            }
        }
    }

    const cambioEstadoTCAgenciaOficinas = async (tituloMensajeAviso) => {
        //console.log("seguimientoIdAccion ", seguimientoIdAccion)
        closeModalCambioEstadoOrdenes();
        if (seguimientoIdAccion !== 0) {
            let tarjetasArray = [seguimientoIdAccion];
            tarjetasArray.push();
            actualizarOrdenes(subMenuOpcionesPerfil[0]?.prm_id_sig_estado, tarjetasArray, (callback) => {
                setTextoTitulo(tituloMensajeAviso);
                setIsModalVisibleOk(true);
                setSeguimientoIdAccion(0);
                obtenerLstSeguimientoTC(subMenuOpcionesPerfil[0].prm_id);  //Realizar nueva consulta
            });
        } else {
            return
        }
    }

    const devolverTCHandler = async (tituloMensajeAviso) => {
        closeModalDevolverTC();
        if (seguimientoIdAccion !== 0) {
            let tarjetasArray = [seguimientoIdAccion];
            tarjetasArray.push();

            let estadoSeguimientoAnterior = estadosSeguimientoTC.find(estadoSegui => estadoSegui.prm_nemonico === "EST_SEG_POR_ENT_SOC")//"EST_SEG_ENV_AGN")
            console.log("estadoSeguimientoAnterior ", estadoSeguimientoAnterior)
            //TODO: buscar el ID de la anterio bandeja
            
            actualizarOrdenes(estadoSeguimientoAnterior?.int_id_parametro, tarjetasArray, (callback) => {
                setTextoTitulo(tituloMensajeAviso);
                setIsModalVisibleOk(true);
                setSeguimientoIdAccion(0);
                let estadoFiltrar = subMenuOpcionesPerfil.find(estadoSeg => estadoSeg.key === 'EST_SEG_POR_ACT')
                obtenerLstSeguimientoTC(estadoFiltrar.prm_id); 
            });
        } else {
            return
        }
    }

    const actualizarOrdenes = async (nuevoEstado, listaItems, callbackReturn) => {
        await fetchUpdateOrdenes(nuevoEstado, listaItems, props.token, (data) => {
            callbackReturn(true);
        }, dispatch)

    }

    const accionAsistenteAgenciaHandler = (valor) => {
        let valorParametro = subMenuOpcionesPerfil.find(opciones => opciones.key === valor);
        //setSelectAccionAsistAgencia(valor);
        if (valor === "EST_SEG_ENV_AGN") { //RECEPTAR TARJETAS CREDITO
            setSelectFiltrarOrdenes(valor);
            obtenerLstSeguimientoTC(valorParametro.prm_id);
            //setBoolSeccionRecepcionTarjetas(true);
            //setBoolSeccionActivacionTarjetas(false);
            setTextBtnAccionAsistenteAgencia("Recibir");
            setTotalTarjetasAccionDiccionario([]);
        }
        else if (valor === "EST_SEG_POR_ACT") { //ACTIVACION DE TARJETAS CREDITO
            setSelectFiltrarOrdenes(valor);
            obtenerLstSeguimientoTC(valorParametro.prm_id);
            //setBoolSeccionActivacionTarjetas(true);
            //setBoolSeccionRecepcionTarjetas(false);
            setTotalTarjetasAccionDiccionario([]);
        }

    }

    const setSeguimientoOrdenRedux = (activarAccionClick) => {
        dispatch(setSeguimientOrdenAction({
            seguimientoAccionClick: activarAccionClick,
        }))
    }

    const filtrarTarjetas = (keyToogle) => {
        let itemToogle = subMenuOpcionesPerfil.find(opciones => opciones.key === keyToogle);
        setSelectFiltrarOrdenes(keyToogle);
        obtenerLstSeguimientoTC(itemToogle.prm_id);
        setTotalTarjetasAccionDiccionario([]);
    }

    const obtenerLstSeguimientoTC = async (valorSelect) => {
        await fetchGetOrdenes(Number(valorSelect), props.token, (data) => { //12883 PEN_ENV_PERSONALIZAR  | 12884 ENV_PERSONALIZADOR |  12885 VERIFICADA_OPERACIONES
            //console.log("lst_ordenes_tc_ ", data.lst_ordenes_tc);
            const conteoTarjetas = data.lst_ordenes_tc.reduce((acumulador, tarj) => acumulador + tarj.int_total_tarjetas, 0);
            setTotalTarjetasListado(conteoTarjetas);
            setLstSeguimientoTC(data.lst_ordenes_tc);
        }, dispatch)
    }

    const consultarParametrosSeguimiento = async () => {
        await fetchGetParametrosSistema("SEGUIMIENTO_LISTADO_TC", props.token, (data) => {
            //console.log("data.lst_parametros ",data.lst_parametros)
            if (data.lst_parametros.length > 0) {
                let ParametrosEntregaTC = data.lst_parametros.map(seguimient => ({
                    prm_id: seguimient.int_id_parametro,
                    prm_nombre: seguimient.str_nombre,
                    prm_nemonico: seguimient.str_nemonico,
                    prm_valor_ini: seguimient.str_valor_ini,
                    prm_valor_fin: seguimient.str_valor_fin,
                    prm_descripcion: seguimient.str_descripcion
                }));
                setLstParamsSeguimiento(ParametrosEntregaTC)
            }
        }, dispatch)
    }

    const cerrarModalVisible = () => {
        setTextoTitulo("");
        setIsModalVisibleOk(false);
    }


    const modalCambioEstadoOrdenesHandler = () => {
        if (selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER") {
            let texto = `¿Está seguro de enviar a personalizar ${totalTarjetasListado} tarjeta/s de crédito?`
            setTextoCambioEstadoOrden(texto);
        } else if (selectFiltrarOrdenes === "EST_SEG_ENV_PER") {
            let texto = `¿Está seguro de recibir ${numtotalTarjetasCambioEstado.length} tarjeta/s de crédito?`
            setTextoCambioEstadoOrden(texto);
        } else if (selectFiltrarOrdenes === "EST_SEG_VER_OPR") {
            let texto = `¿Está seguro de hacer el envío de ${numtotalTarjetasCambioEstado.length} tarjeta/s de crédito a las oficinas/agencias?`

            //let texto = `<div class="mr-1">¿Está seguro de hacer el envío de <h3 class="strong">${numtotalTarjetasCambioEstado.length}</h3> tarjeta/s de crédito a las oficinas/agencias?</div>`
            setTextoCambioEstadoOrden(texto);
        } else if (selectFiltrarOrdenes === "EST_SEG_ENV_AGN") {
            let texto = `¿Está seguro de recibir ${numtotalTarjetasCambioEstado.length} tarjeta/s de crédito?`
            setTextoCambioEstadoOrden(texto);
        }
        setIsOpenModalCambioEstadoSiguiente(true)
    }


    const accionSeguimientoRealizar = () => {
        console.log("FALTA IMPLEMENTAR")

        closeModalAccionTarjeta();
    }

    const descargarContratoHandler = () => {

        const pdfUrl = "Imagenes/CONTRATO.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    const openModalGestorDocumentalHandler = async () => {
        if (props.token) {
            fetchGetSeparadores(props.token, (data) => {
                //console.log("RES, ", data.lst_separadores)
                setSeparadores(data.lst_separadores);
                setIsOpenModalGestorDocumental(true)
            }, dispatch);
        }

    }


    return (
        <div className="f-row w-100" >
            <div className="container_mg">
                <div className='f-row w-100'>
                    {datosUsuario.length > 0 && (tienePermisoEnviarPersonalizarTC || tienePermisoVericarOperacionesTC || tienePermisoEnviarAgenciaTC) && subMenuOpcionesPerfil?.length > 0 &&
                        <div className="f-row w-100 justify-content-center">
                            <div className="mb-4" style={{ marginTop: "2.5rem" }}>
                                <TogglerV2 toggles={subMenuOpcionesPerfil} selectedToggle={(e) => filtrarTarjetas(e)}></TogglerV2>
                            </div>
                        </div>
                    }
                    {datosUsuario.length > 0 && (tienePermisoReceptarTC || tienePermisoActivarTC) && subMenuOpcionesPerfil?.length > 0 &&
                        <div className="f-row w-100 justify-content-center">
                            <div className="mb-4" style={{ marginTop: "2.5rem" }}>
                                <TogglerV2 toggles={subMenuOpcionesPerfil} selectedToggle={(e) => accionAsistenteAgenciaHandler(e)}></TogglerV2>
                            </div>
                        </div>
                    }
                </div>


                {/*BANDEJAS PARA ASISTENTE DE OPERACIONES*/}
                {tienePermisoListarPendPersonalizarTC && selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstSeguimientoTC.length > 0 &&
                            <h3 style={{ fontSize: "1.3rem" }} className="strong mb-1">Total de tarjetas: {totalTarjetasListado}</h3>
                        }
                        {lstSeguimientoTC.length > 0 && lstSeguimientoTC.map((orden, index) => {
                            return (
                                <Fragment key={orden.str_oficina_entrega}>
                                    <ComponentItemsOrden
                                        index={index}
                                        orden={orden}
                                        returnItems={returnItemsHandler}
                                        pantallaTituloExponer="Seguimiento"
                                        opcionHeader={false}
                                        opcionItemDisable={true}
                                    ></ComponentItemsOrden>
                                </Fragment>
                            )
                        })}
                    </div>
                }

                {tienePermisoListarPendRecibirOperacTC && selectFiltrarOrdenes === "EST_SEG_ENV_PER" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstSeguimientoTC.length > 0 &&
                            <h3 style={{ fontSize: "1.3rem" }} className="strong mb-1">Total de tarjetas: {totalTarjetasListado}</h3>
                        }
                        {lstSeguimientoTC.length > 0 && lstSeguimientoTC.map((orden, index) => {
                            return (
                                <Fragment key={orden.str_oficina_entrega}>
                                    <ComponentItemsOrden
                                        index={index}
                                        orden={orden}
                                        returnItems={returnItemsHandler}
                                        pantallaTituloExponer="Seguimiento"
                                        opcionHeader={true}
                                        opcionItemDisable={false}
                                    ></ComponentItemsOrden>
                                </Fragment>
                            )
                        })}
                    </div>
                }
                {tienePermisoListarPendEnviarAgenciasTC && selectFiltrarOrdenes === "EST_SEG_VER_OPR" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstSeguimientoTC.length > 0 &&
                            <h3 style={{ fontSize: "1.3rem" }} className="strong mb-1">Total de tarjetas: {totalTarjetasListado}</h3>
                        }
                        {lstSeguimientoTC.length > 0 && lstSeguimientoTC.map((orden, index) => {
                            return (
                                <Fragment key={orden.str_oficina_entrega}>
                                    <ComponentItemsOrden
                                        index={index}
                                        orden={orden}
                                        returnItems={returnItemsHandler}
                                        pantallaTituloExponer="Seguimiento"
                                        opcionHeader={true}
                                        opcionItemDisable={false}
                                    ></ComponentItemsOrden>
                                </Fragment>
                            )
                        })}
                    </div>
                }

                {lstSeguimientoTC.length === 0 && (selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER" || selectFiltrarOrdenes === "EST_SEG_ENV_PER" || selectFiltrarOrdenes === "EST_SEG_VER_OPR") &&
                    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">
                        <h3 className="strong">Sin datos para mostrar</h3>
                    </div>
                }
                {/*FIN BANDEJAS PARA ASISTENTE DE OPERACIONES*/}

                {/*BANDEJAS PARA ASISTENTE DE AGENCIA*/}
                {tienePermisoListarPendRecibirAgenciaTC && selectFiltrarOrdenes === "EST_SEG_ENV_AGN" && lstSeguimientoTC.length > 0 &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstSeguimientoTC.length > 0 &&
                            <h3 style={{ fontSize: "1.3rem" }} className="strong mb-1">Total de tarjetas: {totalTarjetasListado}</h3>
                        }
                        {lstSeguimientoTC.length > 0 && lstSeguimientoTC.map((orden, index) => {
                            return (
                                <Fragment key={index}>
                                    <ComponentItemsOrden
                                        index={index}
                                        orden={orden}
                                        returnItems={returnItemsHandler}
                                        pantallaTituloExponer="Seguimiento"
                                        opcionHeader={true}
                                        opcionItemDisable={false}
                                    ></ComponentItemsOrden>
                                </Fragment>
                            )
                        })}
                    </div>
                }
                {tienePermisoListarPendActivarTC && selectFiltrarOrdenes === "EST_SEG_POR_ACT" && lstSeguimientoTC.length > 0 &&
                    <div className="contentTableOrden mt-3 mb-3">
                        <Table headers={headersTarjetas}>
                            {lstSeguimientoTC[0]?.lst_ord_ofi.map((seguim, index) => {
                                return (
                                    <tr key={seguim.int_seg_id}>
                                        <td>{seguim.str_identificacion}</td>
                                        <td>{seguim.str_denominacion_socio}</td>
                                        <td>{seguim.dtt_fecha_entrega}</td>
                                        <td>{seguim.str_tipo_propietario}</td>
                                        <td><Chip type={seguim.str_tipo_tarjeta}>{seguim.str_tipo_tarjeta}</Chip></td>
                                        <td>
                                            <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>
                                                <div onClick={() => {
                                                    setSeguimientoIdAccion(Number(seguim.int_seg_id));
                                                    setIsOpenModalDevolverTC(true);
                                                }} title="Devolver" className="btn_mg_icons noborder mr-1">
                                                    <ReplyAllRoundedIcon
                                                        sx={{
                                                            fontSize: 35,
                                                            marginTop: 0.5,
                                                            padding: 0,
                                                        }}>
                                                    </ReplyAllRoundedIcon>
                                                </div>


                                                <button className="btn_mg_icons noborder mr-1" title="Imprimir contrato" onClick={descargarContratoHandler}>
                                                    <img className="img-icons-acciones" src="Imagenes/printIcon.svg" alt="Imprimir contrato"></img>
                                                </button>

                                                <div onClick={openModalGestorDocumentalHandler} title="Gestor documental" className="btn_mg_icons noborder mr-1">
                                                    <DriveFolderUploadRoundedIcon
                                                        sx={{
                                                            fontSize: 35,
                                                            marginTop: 0.5,
                                                            padding: 0,
                                                        }}
                                                    >
                                                    </DriveFolderUploadRoundedIcon>
                                                </div>

                                                {tienePermisoActivarTC &&

                                                    <button className="btn_mg_icons noborder" title="Activar TC"
                                                        onClick={() => {
                                                            setSeguimientoIdAccion(Number(seguim.int_seg_id));
                                                            setTextoCambioEstadoOrden('¿Esta seguro de activar la tarjeta de crédito?');
                                                            setIsOpenModalCambioEstadoSiguiente(true);
                                                        }}>
                                                        <img className="img-icons-acciones" src="Imagenes/activate.svg" alt="Activar Tc"></img>
                                                    </button>
                                                }

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>
                }
                {lstSeguimientoTC.length === 0 && (selectFiltrarOrdenes === "EST_SEG_ENV_AGN" || selectFiltrarOrdenes === "EST_SEG_POR_ACT") &&
                    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">
                        <h3 className="strong">Sin datos para mostrar</h3>
                    </div>
                }
                {/*FIN BANDEJAS PARA ASISTENTE DE AGENCIA*/}

                {/*BANDEJA PARA ASISTENTE  DE PLATAFORMA DE SERVICIOS*/}
                {tienePermisoListarPendEntregarTC && lstSeguimientoTC.length > 0 &&
                    <div className="contentTableOrden mt-3 mb-3">
                        <Table headers={headersTarjetas}>
                            {lstSeguimientoTC[0]?.lst_ord_ofi.map((seguim, index) => {
                                return (
                                    <tr key={seguim.int_seg_id}>
                                        <td>{seguim.str_identificacion}</td>
                                        <td>{seguim.str_denominacion_socio}</td>
                                        <td>{dateFormat("dd-MMM-yyyy HH:MIN:SS", seguim.dtt_fecha_entrega)}</td>
                                        <td>{seguim.str_tipo_propietario}</td>
                                        <td><Chip type={seguim.str_tipo_tarjeta}>{seguim.str_tipo_tarjeta}</Chip></td>
                                        <td>
                                            <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

                                                <button className="btn_mg_icons noborder mr-1" title="Imprimir contrato" onClick={descargarContratoHandler}>
                                                    <img className="img-icons-acciones" src="Imagenes/printIcon.svg" alt="Imprimir contrato"></img>
                                                </button>

                                                <div onClick={openModalGestorDocumentalHandler} title="Gestor documental" className="btn_mg_icons noborder mr-1">
                                                    <DriveFolderUploadRoundedIcon
                                                        sx={{
                                                            fontSize: 35,
                                                            marginTop: 0.5,
                                                            padding: 0,
                                                        }}
                                                    >
                                                    </DriveFolderUploadRoundedIcon>
                                                </div>


                                                {tienePermisoEntregarTC &&
                                                    <div onClick={() => {
                                                        setSeguimientoIdAccion(Number(seguim.int_seg_id));
                                                        setTextoCambioEstadoOrden('¿Esta seguro de realizar la entrega de la tarjeta de crédito?');
                                                        setIsOpenModalCambioEstadoSiguiente(true);
                                                    }} title="Entregar Tc" className="btn_mg_icons noborder mr-1">
                                                        <CreditScoreRoundedIcon
                                                            sx={{
                                                                fontSize: 35,
                                                                marginTop: 0.5,
                                                                padding: 0,
                                                            }}>
                                                        </CreditScoreRoundedIcon>
                                                    </div>
                                                }


                                                {/*<button className="btn_mg_icons noborder" title="Entregar Tc"*/}
                                                {/*    onClick={() => {*/}
                                                {/*        setSeguimientoIdAccion(Number(seguimiento));*/}
                                                {/*        setTextoCambioEstadoOrden('¿Esta seguro de realizar la entrega de la tarjeta de crédito?');*/}
                                                {/*        setIsOpenModalCambioEstadoSiguiente(true);*/}
                                                {/*    }}>*/}
                                                {/*    <img className="img-icons-acciones" src="Imagenes/entregar.svg" alt="Entregar Tc"></img>*/}
                                                {/*</button>*/}

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>
                }
                {tienePermisoListarPendEntregarTC && lstSeguimientoTC.length === 0 && selectFiltrarOrdenes === "" &&
                    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">
                        <br /><br />
                        <h3 className="mt-4 strong">Sin datos para mostrar</h3>
                    </div>
                }
                {/*FIN BANDEJA PARA ASISTENTE  DE PLATAFORMA DE SERVICIOS*/}


                {/*SECCION BOTONES PARA ASISTENTE DE OPERACIONES*/}
                {tienePermisoEnviarPersonalizarTC && lstSeguimientoTC.length > 0 && selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER" &&
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button onClick={modalCambioEstadoOrdenesHandler} className="btn_mg__primary">{textoBotonAccion}</Button>
                    </div>
                }
                {tienePermisoVericarOperacionesTC && lstSeguimientoTC.length > 0 && selectFiltrarOrdenes === "EST_SEG_ENV_PER" &&
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button onClick={modalCambioEstadoOrdenesHandler} className="btn_mg__primary" disabled={(selectFiltrarOrdenes === "EST_SEG_ENV_PER" && numtotalTarjetasCambioEstado.length === 0) ? true : false}>{textoBotonAccion}</Button>
                    </div>
                }
                {tienePermisoEnviarAgenciaTC && lstSeguimientoTC.length > 0 && selectFiltrarOrdenes === "EST_SEG_VER_OPR" &&
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button onClick={modalCambioEstadoOrdenesHandler} className="btn_mg__primary" disabled={(selectFiltrarOrdenes === "EST_SEG_VER_OPR" && numtotalTarjetasCambioEstado.length === 0) ? true : false}>{textoBotonAccion}</Button>
                    </div>
                }

                {/*SECCION BOTONES PARA ASISTENTE DE AGENCIA*/}
                {tienePermisoReceptarTC && selectFiltrarOrdenes === "EST_SEG_ENV_AGN" && lstSeguimientoTC.length > 0 &&
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button onClick={modalCambioEstadoOrdenesHandler} className="btn_mg__primary" disabled={(selectFiltrarOrdenes === "EST_SEG_ENV_AGN" && numtotalTarjetasCambioEstado.length === 0) ? true : false}>{textBtnAccionAsistenteAgencia}</Button>
                    </div>
                }



            </div>

            {/*TODO CAMBIAR */}
            <ModalDinamico
                modalIsVisible={isOpenModalCambioEstadoSiguiente}
                titulo={`Aviso!!!`}
                onCloseClick={closeModalCambioEstadoOrdenes}
                type="sm"
            >
                <div className="pbmg4 ptmg4">
                    <div className="f-col w-100 mb-4">
                         <h3 className="strong">{textoCambioEstadoOrden}</h3>
                        {/*<div className="f-row w-100 mb-4">*/}
                        {/*    <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: textoCambioEstadoOrden }} />*/}
                        {/*</div>*/}
                    </div>
                    <div className="center_text_items">
                        {datosUsuario[0]?.strCargo !== "ASISTENTE DE PLATAFORMA DE SERVICIOS" && datosUsuario[0]?.strCargo !== "ASISTENTE DE AGENCIA" &&
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={cambioEstadoTCSeguimientoHandler}>Sí</button>
                        }
                        {datosUsuario[0]?.strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" &&
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit"
                                onClick={() => cambioEstadoTCAgenciaOficinas("La tarjeta de crédito ha cambiado su estado a por activarse.")}>Sí</button>
                        }

                        {datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && selectFiltrarOrdenes === "EST_SEG_ENV_AGN" &&
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit"
                                onClick={cambioEstadoTCSeguimientoHandler}>Sí</button>
                        }

                        {datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && selectFiltrarOrdenes === "EST_SEG_POR_ACT" &&
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit"
                                onClick={() => cambioEstadoTCAgenciaOficinas("La tarjeta de crédito fue activada con éxito.")}>Sí</button>
                        }
                        <button className="btn_mg btn_mg__secondary mt-2 " onClick={closeModalCambioEstadoOrdenes}>No</button>
                    </div>

                </div>
            </ModalDinamico>

            <ModalDinamico
                modalIsVisible={isOpenModalDevolverTC}
                titulo={`Aviso`}
                onCloseClick={closeModalDevolverTC}
                type="sm"
            >
                <div className="f-row mb-4">
                    <h3 className="">¿Esta seguro de devolver la tarjeta de crédito al (Asistente de Plataforma)?</h3>
                </div>
                <div className="pbmg4 ptmg4 center_text_items">
                    <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={()=>devolverTCHandler("Se ha devuelto la tarjeta de crédito con éxito.")}>Sí</button>
                    <button className="btn_mg btn_mg__secondary mt-2 " onClick={closeModalDevolverTC}>No</button>
                </div>
            </ModalDinamico>

            <Modal
                modalIsVisible={isModalVisibleOk}
                titulo={`Aviso!`}
                onNextClick={cerrarModalVisible}
                onCloseClick={cerrarModalVisible}
                isBtnDisabled={false}
                type="sm"
                mainText="Continuar"
            >
                <div className="mt-3 mb-3">
                    <h3 className="strong">{textoTitulo}</h3>
                </div>
            </Modal>

            {/*TODO CAMBIAR */}
            <Modal
                modalIsVisible={isOpenModalAccionTarjeta}
                type="md"
                onCloseClick={closeModalAccionTarjeta}
                onNextClick={accionSeguimientoRealizar}
                mainText="Continuar"
                titulo="Acción a realizar">

                <div className="f-row w-100" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                    {tienePermisoRechazarOperacionesTC &&
                        <>

                        <div className="f-row">
                            <h3 className="strong mr-2 mt-1">Acciones que puede realizar: </h3>
                        </div>
                            <select style={{ width: "55%" }}>
                                <option value="-1">SELECCIONE UNA ACCION</option>
                                <option value="RECHAZADA_OPERACIONES">RECHAZAR</option>
                            </select>
                        </>

                    }
                    {/*{datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" &&*/}
                    {/*    <select style={{ width: "55%" }}>*/}
                    {/*        <option value="-1">SELECCIONE UNA ACCION</option>*/}
                    {/*        <option value="RECHAZADA_AGENCIA">RECHAZAR</option>*/}
                    {/*    </select>*/}
                    {/*}*/}
                </div>
            </Modal>



            <Modal
                modalIsVisible={isOpenModalGestorDocumental}
                titulo={`GESTOR DOCUMENTAL`}
                onNextClick={closeModalGestorDocumentalHandler}
                onCloseClick={closeModalGestorDocumentalHandler}
                isBtnDisabled={false}
                type="lg2"
                mainText="Salir"
            >
                <div className={"m-2"}>
                    {props.token && isOpenModalGestorDocumental &&
                        <UploadDocumentos
                            token={props.token}
                            grupoDocumental={separadores}
                            contenido={separadores}
                            cedulaSocio={"1103684385"}
                            solicitud={24}
                            datosSocio={{ str_nombres: "FULANITO", str_apellido_paterno: "FABIAN", str_apellido_materno: "MARTINEZ" }}
                            datosUsuario={datosUsuario}
                            presentarEncabezado={false}
                            seleccionToogleSolicitud={null}
                        ></UploadDocumentos>
                    }
                </div>
            </Modal>


        </div>

    )

}
export default connect(mapStateToProps, {})(Seguimiento);