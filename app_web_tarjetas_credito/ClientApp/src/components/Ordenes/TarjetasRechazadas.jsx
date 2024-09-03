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
    return {
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        funcionalidadesStore: state.GetFuncionalidadesSistema.data,
        seguimientoOrden: state.GetSeguimientoOrden.data,
    };
};


function TarjetasRechazadas(props) {

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
        [{ key: 0, nombre: "Identificación" }, { key: 1, nombre: "Nombre del titular" }, { key: 2, nombre: "Fecha proceso" }, { key: 3, nombre: "Tipo de tarjeta" }, { key: 4, nombre: "Tipo de producto" }, { key: 5, nombre: "Oficina" }, { key: 6, nombre: "Acciones" }]


    //Info sesión
    const [datosUsuario, setDatosUsuario] = useState([]);

    //Identificador de item seguimiento
    const [seguimientoIdAccion, setSeguimientoIdAccion] = useState(0);

    //Variables para habilitar permisos

    const [tienePermisoListarPendPersonalizarTC, setTienePermisoListarPersonalizarTC] = useState(false);
    const [tienePermisoListarPendRecibirOperacTC, setTienePermisoListarPendRecibirOperacTC] = useState(false);



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
        if (props?.funcionalidadesStore?.permisos?.length > 0 && lstParamsSeguimiento?.length > 0 && estadosSeguimientoTC?.length > 0) {          

                //SI SOLO SE TIENE UNA ACCION POR ROL, SE REALIZA LA CONSULTA DIRECTAMENTE PARA PRESENTARLA EN COMPONENTE, ejemplo para ASISTENTE DE PLATAFORMA DE SERVICIOS
                if (props?.funcionalidadesStore?.permisos.some(permisosAccion => permisosAccion.fun_nombre === "VER_ORDEN_RECHAZADA_OPERACIONES")) {
                    //console.log("toogleOpciones ", toogleOpciones)
                    //obtenerLstSeguimientoTC(toogleOpciones[0].prm_id);
                    let estadoFiltrar = estadosSeguimientoTC.find(estadoSeg => estadoSeg.prm_nemonico === 'EST_SEG_REC_OPR')
                    //console.log("estadoFiltrar ", estadoFiltrar)
                    obtenerLstSeguimientoTC(estadoFiltrar?.prm_id);
                }
            
        }
    }, [props?.funcionalidadesStore?.permisos, lstParamsSeguimiento, estadosSeguimientoTC])


    useEffect(() => {
        //Asignaciones de permisos para botones paso de bandejas
        if (funcionalidades?.length > 0 && props?.funcionalidadesStore?.permisos?.length > 0) {
            
        }
    }, [funcionalidades, props?.funcionalidadesStore])

   

    const closeModalDevolverTC = () => {
        setIsOpenModalDevolverTC(false);
    }

    const closeModalAccionTarjeta = () => {
        setIsOpenModalAccionTarjeta(false);
        setSeguimientoIdAccion(0);
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

    const setSeguimientoOrdenRedux = (activarAccionClick) => {
        dispatch(setSeguimientOrdenAction({
            seguimientoAccionClick: activarAccionClick,
        }))
    }


    const obtenerLstSeguimientoTC = async (idSeguimiento) => {
        await fetchGetOrdenes(Number(idSeguimiento), props.token, (data) => {
            //console.log("lst_ordenes_tc_ ", data.lst_ordenes_tc);
            //const conteoTarjetas = data.lst_ordenes_tc.reduce((acumulador, tarj) => acumulador + tarj.int_total_tarjetas, 0);
            //setTotalTarjetasListado(conteoTarjetas);
            let dataResulta = [];
            data.lst_ordenes_tc.forEach(orden => dataResulta.push(orden.lst_ord_ofi));
            //console.log("dataResulta ", dataResulta.flat())
            setLstSeguimientoTC(dataResulta.flat());

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
                 
                </div>

                <div className="contentTableOrden mt-3 mb-3">
                    <Table headers={headersTarjetas}>
                        {lstSeguimientoTC.map((seguim, index) => {
                            return (
                                <tr key={seguim.int_seg_id}>
                                    <td>{seguim.str_identificacion}</td>
                                    <td>{seguim.str_denominacion_socio}</td>
                                    <td>{seguim.dtt_fecha_entrega}</td>
                                    <td>{seguim.str_tipo_propietario}</td>
                                    <td><Chip type={seguim.str_tipo_tarjeta}>{seguim.str_tipo_tarjeta}</Chip></td>
                                    <td>{seguim.str_oficina_entrega}</td>
                                    <td>
                                        <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>
                                            <div onClick={() => {
                                                   
                                            }} title="Devolver" className="btn_mg_icons noborder mr-1">
                                                <ReplyAllRoundedIcon
                                                    sx={{
                                                        fontSize: 35,
                                                        marginTop: 0.5,
                                                        padding: 0,
                                                    }}>
                                                </ReplyAllRoundedIcon>
                                            </div>


                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </div>
            </div>


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


        </div>

    )

}
export default connect(mapStateToProps, {})(TarjetasRechazadas);