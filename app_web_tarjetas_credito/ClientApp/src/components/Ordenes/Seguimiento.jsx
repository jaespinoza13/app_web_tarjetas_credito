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
    const [numtotalTarjetasCambioEstado, setNumtotalTarjetasCambioEstado] = useState([]);
    const [subMenuOpcionesPerfil, setSubMenuOpcionesPerfil] = useState([]);
    const [funcionalidades, setFuncionalidades] = useState([]);

    const [comboOpcionesSeguimiento, setComboOpcionesSeguimiento] = useState(
        [
            { image: "", textPrincipal: `PEND. DE PERSONALIZAR`, textSecundario: "", key: 0, nemonico: "PENDIENTE DE PERSONALIZAR" },
            { image: "", textPrincipal: `PENDIENTE DE VERIFICAR`, textSecundario: "", key: 1, nemonico: "PENDIENTE DE VERIFICAR" },
            { image: "", textPrincipal: `PENDIENTE DE DISTRIBUIR`, textSecundario: "", key: 2, nemonico: "PENDIENTE DE DISTRIBUIR" },
        ]);

    const [comboOpcionesSegAsisteAgencia, setComboOpcionesSegAsisteAgencia] = useState(
        [
            { image: "", textPrincipal: `RECEPTAR TARJETAS DE CRÉDITO`, textSecundario: "", key: 0 },
            { image: "", textPrincipal: `ACTIVAR TARJETAS DE CRÉDITO`, textSecundario: "", key: 1 },
        ]);

    const headersTarjetas =
        [{ key: 0, nombre: "Identificación" }, { key: 1, nombre: "Nombre del titular" }, { key: 2, nombre: "Fecha proceso" }, { key: 3, nombre: "Tipo de tarjeta" }, { key: 4, nombre: "Tipo de producto" }, { key: 5, nombre: "Acciones" }]


    // Secciones para activar componentes
    const [boolSeccionRecepcionTarjetas, setBoolSeccionRecepcionTarjetas] = useState(false);
    const [boolSeccionActivacionTarjetas, setBoolSeccionActivacionTarjetas] = useState(false);

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


    const [tienePermisoEntregarTC, setTienePermisoEntregarTC] = useState(false);


    //Modales
    const [modalCambioEstadoOrdenes, setModalCambioEstadoOrdenes] = useState(false);
    const [textoCambioEstadoOrden, setTextoCambioEstadoOrden] = useState("");
    const [modalVisibleOk, setModalVisibleOk] = useState(false);
    const [textoTitulo, setTextoTitulo] = useState("");

    const [isOpenModalAccionTarjeta, setIsOpenModalAccionTarjeta] = useState(false);
    const [isOpenModalGestorDocumental, setIsOpenModalGestorDocumental] = useState(false);

    //Axentria
    const [separadores, setSeparadores] = useState([]);

    useEffect(() => {
        //console.log("PROPS seguimientoOrden ", props.seguimientoOrden)
        if (props.seguimientoOrden.seguimientoCedula) {
            //setSeguimientoIdAccion(props.seguimientoOrden)
            setIsOpenModalAccionTarjeta(true);
            console.log("PADRE ",props.seguimientoOrden)
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
        //(Hace la union de funcionalidades con parametros, ej: fun_nombre LISTAR_PENDIENTE_PERSONALIZAR_TC;  parametro prm_valor_ini es LISTAR_PENDIENTE_PERSONALIZAR_TC)
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
            if (paramOpciones.length > 0)
            {
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

                //Obtener la informacion de seeguimiento para ASISTENTE DE PLATAFORMA DE SERVICIOS
                if (datosUsuario[0]?.strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS") {
                    //console.log("toogleOpciones ", toogleOpciones)
                    obtenerLstSeguimientoTC(toogleOpciones[0].prm_id);
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
            setTienePermisoListarPersonalizarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "LISTAR_PENDIENTE_PERSONALIZAR_TC")
            }))
            setTienePermisoListarPendRecibirOperacTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "LISTAR_PENDIENTE_VERIFICAR_TC")
            }))
            setTienePermisoListarPendRecibirOperacTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "LISTAR_PENDIENTE_DISTRIBUIR_TC")
            }))
            setTienePermisoEnviarPersonalizarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_ENVIAR_PERSONALIZAR_TC")
            }))
            setTienePermisoVericarOperacionesTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_VERIFICAR_TC_OPERACIONES")
            }))

            setTienePermisoEnviarAgenciaTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_ENVIAR_AGENCIA_TC")
            }))

            setTienePermisoRechazarOperacionesTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_RECHAZAR_TC_OPERACIONES")
            }))

            /*ASISTENTE DE AGENCIA*/
            setTienePermisoListarPendRecibirAgenciaTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "LISTAR_PENDIENTE_RECIBIR_AGENCIA_TC")
            }))
            setTienePermisoListarPendActivarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "LISTAR_PENDIENTE_ACTIVAR_TC")
            }))

            setTienePermisoActivarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_ACTIVAR_TC")
            }))

            setTienePermisoReceptarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_RECEPTAR_TC_AGENCIA")
            }))


            /*ASISTENTE DE PLATAFORMA*/
            setTienePermisoEntregarTC(props?.funcionalidadesStore?.permisos.some(permisosAccion => {
                return funcionalidades.some(funcionalidad => funcionalidad.funcionalidad === permisosAccion.fun_nombre && funcionalidad.funcionalidad === "PERMISO_ENTREGAR_TC_SOCIO")
            }))
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
        setModalCambioEstadoOrdenes(false);
        setTextoCambioEstadoOrden("");
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
                    setTextoTitulo("Las tarjetas de crédito se han enviado a personalizar.")
                    setModalVisibleOk(true);
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
                    setTextoTitulo("Las tarjetas de crédito han sido verificadas con éxito.")
                    setModalVisibleOk(true);
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
                    setTextoTitulo("Se han distribuido las tarjetas de crédito con éxito.")
                    setModalVisibleOk(true);
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
                    setModalVisibleOk(true);
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
                setModalVisibleOk(true);
                setSeguimientoIdAccion(0);
                obtenerLstSeguimientoTC(subMenuOpcionesPerfil[0].prm_id);  //Realizar nueva consulta
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
            obtenerLstSeguimientoTC(valorParametro.prm_id);
            setBoolSeccionRecepcionTarjetas(true);
            setBoolSeccionActivacionTarjetas(false);
            setTextBtnAccionAsistenteAgencia("Recibir");
            setSelectFiltrarOrdenes(valor);
        }
        else if (valor === "EST_SEG_POR_ACT") { //ACTIVACION DE TARJETAS CREDITO
            obtenerLstSeguimientoTC(valorParametro.prm_id);
            setBoolSeccionActivacionTarjetas(true);
            setBoolSeccionRecepcionTarjetas(false);
            setSelectFiltrarOrdenes(valor);
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


    const obtenerLstSeguimientoTC = async (valorSelect) => {
        await fetchGetOrdenes(Number(valorSelect), props.token, (data) => { //12883 PEN_ENV_PERSONALIZAR  | 12884 ENV_PERSONALIZADOR |  12885 VERIFICADA_OPERACIONES
            //console.log("lst_ordenes_tc_ ", data.lst_ordenes_tc);
            setLstSeguimientoTC(data.lst_ordenes_tc);
        }, dispatch)
    }

    const cerrarModalVisible = () => {
        setTextoTitulo("");
        setModalVisibleOk(false);
    }


    const modalCambioEstadoOrdenesHandler = () => {
        if (selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER") {
            setTextoCambioEstadoOrden("¿Está seguro de enviar a personalizar las tarjetas de crédito?");
        } else if (selectFiltrarOrdenes === "EST_SEG_ENV_PER") {
            setTextoCambioEstadoOrden("¿Está seguro de recibir las tarjetas de crédito?");
        } else if (selectFiltrarOrdenes === "EST_SEG_VER_OPR") {
            setTextoCambioEstadoOrden("¿Está seguro de hacer el envío de tarjetas de crédito a las oficinas/agencias?");
        } else if (selectFiltrarOrdenes === "EST_SEG_ENV_AGN") {
            setTextoCambioEstadoOrden("¿Está seguro de cambiar a Recibido para las tarjetas de crédito seleccionadas?");
        }
        setModalCambioEstadoOrdenes(true)
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


    // ACCIONES PARA TABLE
    const AccionesAsistenteAgencia = ({ seguimiento }) => {
        //console.log("AccionesAsistentePlataforma ", seguimiento) //f-row w-100 icon-retorno
        return (
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
                

                {/*<button className="btn_mg_icons noborder" title="Visualizar documentos">*/}
                {/*    <img className="img-icons-acciones" src="Imagenes/search.svg" alt="Visualizar documentos"></img>*/}
                {/*</button>*/}


                {tienePermisoActivarTC && 

                <button className="btn_mg_icons noborder" title="Activar TC"
                    onClick={() => {
                        setSeguimientoIdAccion(Number(seguimiento));
                        setTextoCambioEstadoOrden('¿Esta seguro de activar la tarjeta de crédito?');
                        setModalCambioEstadoOrdenes(true);
                    }}>
                    <img className="img-icons-acciones" src="Imagenes/activate.svg" alt="Activar Tc"></img>
                    </button>
                }

            </div>
        )
    }


    const AccionesAsistentePlataforma = ({ seguimiento }) => {
        return (
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
                {/*<button className="btn_mg_icons noborder" title="Subir Doc Escaneado">*/}
                {/*    <img className="img-icons-acciones" src="Imagenes/upload_file.svg" alt="Subir Doc Escaneado"></img>*/}
                {/*</button>*/}

                {tienePermisoEntregarTC &&

                <div onClick={() => {
                    setSeguimientoIdAccion(Number(seguimiento));
                    setTextoCambioEstadoOrden('¿Esta seguro de realizar la entrega de la tarjeta de crédito?');
                    setModalCambioEstadoOrdenes(true);
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
                {/*        setModalCambioEstadoOrdenes(true);*/}
                {/*    }}>*/}
                {/*    <img className="img-icons-acciones" src="Imagenes/entregar.svg" alt="Entregar Tc"></img>*/}
                {/*</button>*/}

            </div>
        )
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
                {lstSeguimientoTC.length === 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && (boolSeccionActivacionTarjetas === true || boolSeccionRecepcionTarjetas === true ) &&
                    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">
                        <h3 className="strong">Sin datos para mostrar</h3>
                    </div>
                }

                {/*{lstSeguimientoTC.length === 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && boolSeccionRecepcionTarjetas === true &&*/}
                {/*    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">*/}
                {/*        <h3 className="strong">Sin datos para mostrar</h3>*/}
                {/*    </div>*/}
                {/*}*/}
                {/*FIN BANDEJAS PARA ASISTENTE DE OPERACIONES*/}


                {/*BANDEJAS PARA ASISTENTE DE AGENCIA*/}
                {/*{boolSeccionRecepcionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && lstSeguimientoTC.length > 0 &&*/}
                {boolSeccionRecepcionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && lstSeguimientoTC.length > 0 &&
                    <div className="contentTableOrden mt-3 mb-3">
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

                {/*{boolSeccionActivacionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && lstSeguimientoTC.length > 0  &&*/}
                {boolSeccionActivacionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && lstSeguimientoTC.length > 0  &&

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
                                            <AccionesAsistenteAgencia seguimiento={seguim.int_seg_id}/>
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>
                }
                {/*FIN BANDEJAS PARA ASISTENTE DE AGENCIA*/}

                {/*BANDEJA PARA ASISTENTE  DE PLATAFORMA DE SERVICIOS*/}
                {datosUsuario.length > 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" && lstSeguimientoTC.length > 0 &&               
                    <div className="contentTableOrden mt-3 mb-3">
                        <Table headers={headersTarjetas}>
                            {lstSeguimientoTC[0]?.lst_ord_ofi.map((seguim, index) => {
                                return (
                                    <tr key={seguim.int_seg_id}>
                                        <td>{seguim.str_identificacion}</td>
                                        <td>{seguim.str_denominacion_socio}</td>
                                        <td>{dateFormat("dd-MMM-yyyy HH:MIN:SS",seguim.dtt_fecha_entrega)}</td>
                                        <td>{seguim.str_tipo_propietario}</td>
                                        <td><Chip type={seguim.str_tipo_tarjeta}>{seguim.str_tipo_tarjeta}</Chip></td>
                                        <td>
                                            <AccionesAsistentePlataforma seguimiento={seguim.int_seg_id}/>
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>
                }
                {/*FIN BANDEJA PARA ASISTENTE  DE PLATAFORMA DE SERVICIOS*/}


                {/*SECCION BOTONES PARA ASISTENTE DE OPERACIONES*/}
                {tienePermisoEnviarPersonalizarTC  && lstSeguimientoTC.length > 0 && selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER" &&
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
                        <Button onClick={modalCambioEstadoOrdenesHandler} className="btn_mg__primary" disabled={( selectFiltrarOrdenes === "EST_SEG_VER_OPR" && numtotalTarjetasCambioEstado.length === 0) ? true : false}>{textoBotonAccion}</Button>
                    </div>
                }
                

                {/*SECCION BOTONES PARA ASISTENTE DE AGENCIA*/}
                {tienePermisoReceptarTC && boolSeccionRecepcionTarjetas === true && lstSeguimientoTC.length > 0 && 
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button onClick={modalCambioEstadoOrdenesHandler} className="btn_mg__primary" disabled={(selectFiltrarOrdenes === "EST_SEG_ENV_AGN" && numtotalTarjetasCambioEstado.length === 0) ? true : false}>{textBtnAccionAsistenteAgencia}</Button>
                    </div>
                }



            </div>

            <ModalDinamico
                modalIsVisible={modalCambioEstadoOrdenes}
                titulo={`Aviso!!!`}
                onCloseClick={closeModalCambioEstadoOrdenes}
                type="sm"
            >
                <div className="pbmg4 ptmg4">
                    <div className="f-row mb-4">
                        <h3 className="">{textoCambioEstadoOrden}</h3>
                    </div>
                    <div className="center_text_items">
                        {datosUsuario[0]?.strCargo !== "ASISTENTE DE PLATAFORMA DE SERVICIOS" && datosUsuario[0]?.strCargo !== "ASISTENTE DE AGENCIA" &&
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={cambioEstadoTCSeguimientoHandler}>Sí</button>
                        }                        
                        {datosUsuario[0]?.strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" && 
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit"
                                onClick={() => cambioEstadoTCAgenciaOficinas("La tarjeta de crédito se cambio al estado por Activarse")}>Sí</button>
                        }
                        
                        {datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && selectFiltrarOrdenes === "EST_SEG_ENV_AGN" &&
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit"
                                onClick={cambioEstadoTCSeguimientoHandler}>Sí</button>
                        } 

                        {datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && selectFiltrarOrdenes === "EST_SEG_POR_ACT" && 
                            <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" 
                                onClick={() => cambioEstadoTCAgenciaOficinas("La tarjeta de crédito se activo con éxito")}>Sí</button>
                        }
                        <button className="btn_mg btn_mg__secondary mt-2 " onClick={closeModalCambioEstadoOrdenes}>No</button>
                    </div>

                </div>
            </ModalDinamico>

            <Modal
                modalIsVisible={modalVisibleOk}
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


            <Modal
                modalIsVisible={isOpenModalAccionTarjeta}
                type="md"
                onCloseClick={closeModalAccionTarjeta}
                onNextClick={accionSeguimientoRealizar}
                mainText="Continuar"
                titulo="Acción a realizar">

                <div className="f-row w-100" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                    <div className="f-row">
                        <h3 className="strong mr-2 mt-1">Acción que puede realizar: </h3>
                    </div>

                    {datosUsuario[0]?.strCargo === "ASISTENTE DE OPERACIONES" &&
                        <select style={{ width: "55%" }}>
                            <option value="-1">SELECCIONE UNA ACCION</option>
                            <option value="RECHAZADA_OPERACIONES">RECHAZAR</option>
                        </select>            
                    }
                    {datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" &&
                        <select style={{ width: "55%" }}>
                            <option value="-1">SELECCIONE UNA ACCION</option>
                            <option value="RECHAZADA_AGENCIA">RECHAZAR</option>
                        </select>
                    }
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
                    <UploadDocumentos
                        grupoDocumental={separadores}
                        contenido={separadores}
                        token={props.token}
                        cedulaSocio={"1150214375"}
                        solicitud={null}
                        datosSocio={{ str_nombres: "FULANITO", str_apellido_paterno: "FABIAN", str_apellido_materno: "MARTINEZ" }}
                        datosUsuario={datosUsuario}
                        seleccionToogleSolicitud={""}
                        oficinaSolicitud={"MATRIZ"}
                        estadoSolicitud={"APROBADA"}
                        cupoSolicitado={"-"}
                        oficialSolicitud={""}
                        calificacionRiesgo={""}
                    ></UploadDocumentos>
                </div>
            </Modal>


        </div>

    )

}
export default connect(mapStateToProps, {})(Seguimiento);