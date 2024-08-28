import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace, convertFecha } from '../../js/utiles';
import "../../css/Components/Seguimiento.css";
import Input from '../Common/UI/Input';
import { Fragment } from 'react';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import ComponentItemsOrden from './ComponentItemsOrden';
import { get } from '../../js/crypt';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip';
import TogglerV2 from '../Common/UI/TogglerV2';
import { fetchGetFuncionalidadesTC, fetchGetOrdenes, fetchGetParametrosSistema, fetchUpdateOrdenes } from '../../services/RestServices';
import { setSeguimientOrdenAction } from '../../redux/SeguimientoOrden/actions';
import Modal from '../Common/Modal/Modal';

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
        funcionalidadesStore: state.GetFuncionalidadesSistema.data
        //seguimientoOrden:state.GetSeguimientoOrden.data,
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


    //Modales
    const [modalCambioEstadoOrdenes, setModalCambioEstadoOrdenes] = useState(false);
    const [textoCambioEstadoOrden, setTextoCambioEstadoOrden] = useState("");
    const [modalVisibleOk, setModalVisibleOk] = useState(false);
    const [textoTitulo, setTextoTitulo] = useState("");


    //Identificador de item seguimiento
    const [seguimientoIdAccion, setSeguimientoIdAccion] = useState(0);

    useEffect(() => {
        if (selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER") {
            setSeguimientoOrdenRedux(true);
            setTextoBotonAccion("Enviar");
        }
        else if (selectFiltrarOrdenes === "EST_SEG_ENV_PER") {
            setSeguimientoOrdenRedux(false);
            setTextoBotonAccion("Recibir");
        }
        else if (selectFiltrarOrdenes === "EST_SEG_VER_OPR") {
            setSeguimientoOrdenRedux(false);
            setTextoBotonAccion("Distribuir");
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
                console.log(data.lst_funcSettings2)
                console.log(data.lst_func_seguimiento_settings)
                setFuncionalidades(data.lst_func_seguimiento_settings);
            }, dispatch)
        }


    }, [props, controlConsultaCargaComp])



    useEffect(() => {
        //Para definir el toogle del perfil que este logueado (Se usa permisos de funcionalidad y parametros)
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
                if (datosUsuario[0].strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS") {
                    //console.log("toogleOpciones ", toogleOpciones)
                    obtenerLstSeguimientoTC(toogleOpciones[0].prm_id);
                }

            }        

        }
    }, [props?.funcionalidadesStore?.permisos, lstParamsSeguimiento, estadosSeguimientoTC])

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




    const ordenesAgencias = [
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 10, num_tarjetas_error: 1, oficina: "EL VALLE", fecha_envio: "14/07/2024",
            lst_socios: [
                { cedula: "1101898147", nombres: "NICOLE ALBAN", solicitud: "2", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 14:38", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "1150214370", nombres: "DANNY VASQUEZ", solicitud: "1", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 14:42", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "0111978465", nombres: "LUIS CONDE", solicitud: "13", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 15:00", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "1106849276", nombres: "SAMANTA CARRION", solicitud: "5", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "13/07/2024 15:36", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "0681486841", nombres: "FULANITO CABRERA", solicitud: "7", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:37", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "1954984972", nombres: "MARTHA PINEDA", solicitud: "9", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 17:10", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "0981864365", nombres: "PIEDA TOLEDO", solicitud: "10", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "14/07/2024 17:20", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "1104732936", nombres: "LEO MONTALVAN", solicitud: "4", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "15/07/2024 11:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "0515846844", nombres: "LUISA VALDEZ", solicitud: "11", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "15/07/2024 11:45", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
                { cedula: "0849655446", nombres: "MARIA ORTEGA", solicitud: "12", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "15/07/2024 11:50", oficina_solicita: "EL VALLER", tipo_tarjeta: "Principal" },
            ]
        }

    ]

    const tarjetas = [
        { ente: "15188", cedula: "1101898147", nombres: "NICOLE ALBAN", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "49456", cedula: "1150214370", nombres: "DANNY VASQUEZ", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "84684", cedula: "0111978465", nombres: "LUIS CONDE", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "95464", cedula: "1106849276", nombres: "SAMANTA CARRION", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "11546", cedula: "0681486841", nombres: "FULANITO CABRERA", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "186424", cedula: "1954984972", nombres: "MARTHA PINEDA", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "2298", cedula: "0981864365", nombres: "PIEDA TOLEDO", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "6849", cedula: "1104732936", nombres: "LEO MONTALVAN", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "97678", cedula: "0515846844", nombres: "LUISA VALDEZ", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "15864", cedula: "0849655446", nombres: "MARIA ORTEGA", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "EL VALLER", tipo_tarjeta: "Principal" },
    ]

    const tarjetasV2 = [
        { ente: "1111", cedula: "1306543210", nombres: "JORGE SANCHEZ", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "2222", cedula: "1001234567", nombres: "PATRICIA LOPEZ", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "3333", cedula: "1203456789", nombres: "CLAUDIA HERRERA", tipo_producto: "BLACK", fecha_proceso: "14/07/2024 15:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
        { ente: "4443", cedula: "0509876543", nombres: "PEDRO RAMOS", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 15:35", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
    ]



    const closeModalCambioEstadoOrdenes = () => {
        setModalCambioEstadoOrdenes(false);
        setTextoCambioEstadoOrden("");
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
        console.log("seguimientoIdAccion ", seguimientoIdAccion)
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



    // ACCIONES PARA TABLE
    const AccionesAsistenteAgencia = ({ seguimiento }) => {
        console.log("AccionesAsistentePlataforma ", seguimiento)
        return (
            <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

                <button className="btn_mg_icons noborder" title="Visualizar documentos">
                    <img className="img-icons-acciones" src="Imagenes/search.svg" alt="Visualizar documentos"></img>
                </button>

                <button className="btn_mg_icons noborder" title="Regresar Tc">
                    <img className="img-icons-acciones" src="Imagenes/return.svg" alt="Regresar Tc"></img>
                </button>

                <button className="btn_mg_icons noborder" title="Activar Tc"
                    onClick={() => {
                        setSeguimientoIdAccion(Number(seguimiento));
                        setTextoCambioEstadoOrden('¿Esta seguro de activar la tarjeta de crédito?');
                        setModalCambioEstadoOrdenes(true);
                    }}>
                    <img className="img-icons-acciones" src="Imagenes/activate.svg" alt="Activar Tc"></img>
                </button>

            </div>
        )
    }


    const AccionesAsistentePlataforma = ({ seguimiento }) => {
        return (
            <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

                <button className="btn_mg_icons noborder" title="Imprimir contrato">
                    <img className="img-icons-acciones" src="Imagenes/printIcon.svg" alt="Imprimir contrato"></img>
                </button>

                <button className="btn_mg_icons noborder" title="Subir Doc Escaneado">
                    <img className="img-icons-acciones" src="Imagenes/upload_file.svg" alt="Subir Doc Escaneado"></img>
                </button>

                <button className="btn_mg_icons noborder" title="Entregar Tc"
                    onClick={() => {
                        setSeguimientoIdAccion(Number(seguimiento));
                        setTextoCambioEstadoOrden('¿Esta seguro de realizar la entrega de la tarjeta de crédito?');
                        setModalCambioEstadoOrdenes(true);
                    }}>
                    <img className="img-icons-acciones" src="Imagenes/entregar.svg" alt="Entregar Tc"></img>
                </button>

            </div>
        )
    }



    return (
        <div className="f-row w-100" >
            <div className="container_mg">
                <div className='f-row w-100'>


                    {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && subMenuOpcionesPerfil?.length > 0 &&
                        <div className="f-row w-100 justify-content-center">
                            <div className="mb-4" style={{ marginTop: "2.5rem" }}>
                                <TogglerV2 toggles={subMenuOpcionesPerfil} selectedToggle={(e) => filtrarTarjetas(e)}></TogglerV2>
                            </div>

                        </div>
                    }

                    {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" && subMenuOpcionesPerfil?.length > 0 &&

                        <div className="f-row w-100 justify-content-center">
                            <div className="mb-4" style={{ marginTop: "2.5rem" }}>
                                <TogglerV2 toggles={subMenuOpcionesPerfil} selectedToggle={(e) => accionAsistenteAgenciaHandler(e)}></TogglerV2>
                            </div>

                        </div>

                    }


                </div>


                {/*BANDEJAS PARA ASISTENTE DE OPERACIONES*/}
                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && selectFiltrarOrdenes === "EST_SEG_PEN_ENV_PER" &&
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

                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && selectFiltrarOrdenes === "EST_SEG_ENV_PER" &&
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

                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && selectFiltrarOrdenes === "EST_SEG_VER_OPR" &&
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
                                    opcionItemDisable={true}
                                ></ComponentItemsOrden>
                                </Fragment>
                            )
                        })}
                    </div>
                }
                {lstSeguimientoTC.length === 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE OPERACIONES" &&
                    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">
                        <h3 className="strong">Sin datos para mostrar</h3>
                    </div>
                }

                {/*todo: temporal tarjetasV2 */}
                {lstSeguimientoTC.length === 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && boolSeccionActivacionTarjetas === true &&
                    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">
                        <h3 className="strong">Sin datos para mostrar</h3>
                    </div>
                }

                {lstSeguimientoTC.length === 0 && datosUsuario[0]?.strCargo === "ASISTENTE DE AGENCIA" && boolSeccionRecepcionTarjetas === true &&
                    <div className="f-row mt-4 mb-5 align-content-center justify-content-center">
                        <h3 className="strong">Sin datos para mostrar</h3>
                    </div>
                }
                {/*FIN BANDEJAS PARA ASISTENTE DE OPERACIONES*/}


                {/*BANDEJAS PARA ASISTENTE DE AGENCIA*/}
                {boolSeccionRecepcionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" && lstSeguimientoTC.length > 0 &&
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

                {boolSeccionActivacionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" && lstSeguimientoTC.length > 0  &&
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
                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" && lstSeguimientoTC.length > 0 &&               
                    <div className="contentTableOrden mt-3 mb-3">
                        <Table headers={headersTarjetas}>
                            {lstSeguimientoTC[0]?.lst_ord_ofi.map((seguim, index) => {
                                return (
                                    <tr key={seguim.int_seg_id}>
                                        <td>{seguim.str_identificacion}</td>
                                        <td>{seguim.str_denominacion_socio}</td>
                                        <td>{convertFecha(seguim.dtt_fecha_entrega)}</td>
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
                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && lstSeguimientoTC.length > 0 && 
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button onClick={modalCambioEstadoOrdenesHandler} className="btn_mg__primary" disabled={(selectFiltrarOrdenes === "EST_SEG_ENV_PER" && numtotalTarjetasCambioEstado.length === 0) ? true: false}>{textoBotonAccion}</Button>
                    </div>
                }
                

                {/*SECCION BOTONES PARA ASISTENTE DE AGENCIA*/}
                {boolSeccionRecepcionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" && lstSeguimientoTC.length > 0 && 
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


        </div>

    )

}
export default connect(mapStateToProps, {})(Seguimiento);