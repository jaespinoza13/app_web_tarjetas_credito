import { useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace } from '../../js/utiles';
import "../../css/Components/Reprocesar.css";
import AccordionV2 from '../Common/UI/AccordionV2';
import Input from '../Common/UI/Input';
import { Fragment } from 'react';
import ModalDinamico from '../Common/Modal/ModalDinamico';
import ComponentItemsOrden from './ComponentItemsOrden';
import { get } from '../../js/crypt';
import Table from '../Common/Table';
import Chip from '../Common/UI/Chip';

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


function Seguimiento(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();

    const [inputBusqueda, setInputBusqueda] = useState([]);

    const [ordenItemsCheckTotal, setOrdenItemsCheckTotal] = useState([]);
    const [totalTarjetasEnviar, setTotalTarjetasEnviar] = useState(0);
    const [textoBotonAccion, setTextoBotonAccion] = useState("");
    const [textBtnAccionAsistenteAgencia, setTextBtnAccionAsistenteAgencia] = useState("");
    const [lstOrdenesFiltradas, setLstOrdenesFiltradas] = useState([]);
    const [lstItemsReceptarOficina, setLstItemsReceptarOficina] = useState([]);
    const [modalEnviarPersonalizacion, setModalEnviarPersonalizacion] = useState(false);
    const [selectFiltrarOrdenes, setSelectFiltrarOrdenes] = useState("PENDIENTE DE PERSONALIZAR");
    const [selectAccionAsistAgencia, setSelectAccionAsistAgencia] = useState("-1");



    const [boolSeccionRecepcionTarjetas, setBoolSeccionRecepcionTarjetas] = useState(false);
    const [boolSeccionActivacionTarjetas, setBoolSeccionActivacionTarjetas] = useState(false);

    //Info sesión
    const [datosUsuario, setDatosUsuario] = useState([]);


    const [textoTitulo, setTextoTitulo] = useState("");
    const [totalTarjetasAccionDiccionario, setTotalTarjetasAccionDiccionario] = useState([])

    useEffect(() => {
        if (selectFiltrarOrdenes === "PENDIENTE DE PERSONALIZAR") {
            setTextoBotonAccion("Enviar");
        }
        else if (selectFiltrarOrdenes === "PENDIENTE DE VERIFICAR") {
            setTextoBotonAccion("Recibir");
        }
        else if (selectFiltrarOrdenes === "PENDIENTE DE DISTRIBUIR") {
            setTextoBotonAccion("Distribuir");
        }
        //setTotalTarjetasAccionDiccionario([])
    }, [lstOrdenesFiltradas])


    useEffect(() => {
        setLstOrdenesFiltradas(ordenesV2.filter(tarjetas => tarjetas.estado === "PENDIENTE DE PERSONALIZAR"))
        setLstItemsReceptarOficina([...ordenesAgencias]);

        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));

        const userOficial = get(localStorage.getItem('sender'));
        const userOficina = get(localStorage.getItem('office'));

        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);
    }, [])

    const ordenesV2 = [
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 3, num_tarjetas_error: 3, oficina: "MATRIZ", estado: "PENDIENTE DE PERSONALIZAR",
            lst_socios: [
                { cedula: "1150214370", nombres: "DANNY VASQUEZ", solicitud: "1", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0111978465", nombres: "LUIS CONDE", solicitud: "13", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", realizar_accion: false },
                { "cedula": "1102658321", "nombres": "MARIA GONZALEZ", "solicitud": "22", "estado": "PEN_ENV_PERSONALIZAR", "tipo_producto": "ESTÁNDAR", "fecha_proceso": "12/07/2024 10:15", "oficina_solicita": "MATRIZ", "tipo_tarjeta": "Principal", realizar_accion: false },
            ]
        },
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 1, oficina: "EL VALLE", estado: "PENDIENTE DE PERSONALIZAR",
            lst_socios: [
                { cedula: "1101898147", nombres: "NICOLE ALBAN", solicitud: "2", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0913547802", nombres: "ANA RUIZ", solicitud: "12", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:33", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal", realizar_accion: false },
            ]
        },
        {
            fecha_rel: "13/07/2024", num_total_tarjetas: 3, num_tarjetas_error: 0, oficina: "ALAMOR", estado: "PENDIENTE DE VERIFICAR",
            lst_socios: [
                { cedula: "1106849276", nombres: "SAMANTA CARRION", solicitud: "5", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0681486841", nombres: "FULANITO CABRERA", solicitud: "17", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0804512376", nombres: "CARLOS LOPEZ", solicitud: "11", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal", realizar_accion: false },
            ]
        },
        {
            fecha_rel: "14/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 0, oficina: "AGENCIA NORTE", estado: "PENDIENTE DE VERIFICAR",
            lst_socios: [
                { cedula: "1954984972", nombres: "MARTHA PINEDA", solicitud: "9", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0981864365", nombres: "PIEDA TOLEDO", solicitud: "10", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal", realizar_accion: false },
            ]
        },
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 3, num_tarjetas_error: 0, oficina: "AGENCIA CUARTO CENTENARIO", estado: "PENDIENTE DE VERIFICAR",
            lst_socios: [
                { cedula: "1104732936", nombres: "LEO MONTALVAN", solicitud: "4", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "AGENCIA CUARTO CENTENARIO", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0515846844", nombres: "LUISA VALDEZ", solicitud: "11", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "AGENCIA CUARTO CENTENARIO", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0849655446", nombres: "MARIA ORTEGA", solicitud: "12", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "AGENCIA CUARTO CENTENARIOR", tipo_tarjeta: "Principal", realizar_accion: false },
            ]
        },
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 5, num_tarjetas_error: 3, oficina: "MATRIZ", estado: "PENDIENTE DE DISTRIBUIR",
            lst_socios: [
                { cedula: "0111978465", nombres: "LUIS CONDE", solicitud: "13", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "1305876421", nombres: "SOFIA RAMIREZ", solicitud: "13", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 22:31", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0601789456", nombres: "FERNANDO GOMEZ", solicitud: "13", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 22:32", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "1105874213", nombres: "LAURA CASTILLO", solicitud: "23", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", realizar_accion: false },
                { cedula: "0907654321", nombres: "MIGUEL DIAZ", solicitud: "14", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal", realizar_accion: false },

            ]
        },
        {
            fecha_rel: "14/07/2024", num_total_tarjetas: 1, num_tarjetas_error: 0, oficina: "AGENCIA SUR", estado: "PENDIENTE DE DISTRIBUIR",
            lst_socios: [
                { cedula: "1235434654", nombres: "LORENA PINEDA", solicitud: "9", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "AGENCIA SUR", tipo_tarjeta: "Principal", realizar_accion: false },
            ]
        },
    ]


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

    const returnItemsHandler = (arrayItems, oficina) => {
        AddUpdateItemOrden(oficina, arrayItems);
    }


    /*function AddUpdateItemOrden(clave, valor) {

        if (valor.length === 0) {
            setTotalTarjetasAccionDiccionario(prevTotalTarjetasAccionDiccionario => {
                let updatedDictionary = { ...prevTotalTarjetasAccionDiccionario };
                delete updatedDictionary[clave];
                return updatedDictionary;
            });
        }
        if (totalTarjetasAccionDiccionario.hasOwnProperty(clave) && totalTarjetasAccionDiccionario[clave].length === 0) {
            //console.log("--> ",totalTarjetasAccionDiccionario[clave])
            // Si la clave ya existe, actualizamos el arreglo asociado
            setTotalTarjetasAccionDiccionario(prevTotalTarjetasAccionDiccionario => ({
                ...prevTotalTarjetasAccionDiccionario,
                [clave]: [...prevTotalTarjetasAccionDiccionario[clave], valor]
            }));
        } else {
            // Si la clave no existe, creamos un nuevo arreglo con el valor
            setTotalTarjetasAccionDiccionario(prevTotalTarjetasAccionDiccionario => ({
                ...prevTotalTarjetasAccionDiccionario,
                [clave]: [valor]
            }));
        }
    }*/
    
    function AddUpdateItemOrden(clave, valor) {
       //Actualizar o agregar el objeto
        setTotalTarjetasAccionDiccionario(prevTotalTarjetasAccionDiccionario => ({
            ...prevTotalTarjetasAccionDiccionario,
            [clave]: [valor]
        }));
    }

    
    useEffect(() => {
        console.log(totalTarjetasAccionDiccionario)
    }, [totalTarjetasAccionDiccionario])
    


    const closeModaEnvioPersonalizacion = () => {
        setModalEnviarPersonalizacion(false);
    }

    const envioPersonalizacionHandler = () => {
        closeModaEnvioPersonalizacion();
    }

    const filtrarTarjetas = (valorSelect) => {
        setSelectFiltrarOrdenes(valorSelect);
        setLstOrdenesFiltradas(ordenesV2.filter(tarjetas => tarjetas.estado === valorSelect));
        setTotalTarjetasAccionDiccionario([])
    }

    const accionAsistenteAgenciaHandler = (valor) => {
        setSelectAccionAsistAgencia(valor);
        if (valor === "RECEPCION_TARJETAS_CREDITO") {
            setBoolSeccionRecepcionTarjetas(true);
            setBoolSeccionActivacionTarjetas(false);
            setTextBtnAccionAsistenteAgencia("Recibir");
        }
        else if (valor === "ACTIVAR_TARJETAS_CREDITO") {
            setBoolSeccionActivacionTarjetas(true);
            setBoolSeccionRecepcionTarjetas(false);
        }

    }



    const headersTarjetas = [{ key: 0, nombre: "Ente" }, { key: 1, nombre: "Fecha recepción" }, { key: 2, nombre: "Identificación" }, { key: 3, nombre: "Nombre del titular" }, { key: 4, nombre: "Tipo de tarjeta" }, { key: 5, nombre: "Tipo de producto" }, { key: 6, nombre: "Acciones" }]


    return (
        <div className="f-row w-100" >
            {/*<Sidebar enlace={props.location.pathname}></Sidebar>*/}
            <div className="container_mg">
                {/*<h2 className="mt-5 mb-3">{textoTitulo}</h2>*/}
                <div className='f-row w-100'>

                    {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" &&
                        <div className="content-filtro">
                            <div className="f-row w-100">
                                <h3 className="strong mr-4">Seleccione el estado que desea revisar:</h3>
                                <select style={{ width: "350px" }} id="tarjetas_select" name="tarjetas_select" value={selectFiltrarOrdenes} onChange={(e) => filtrarTarjetas(e.target.value)}>
                                    <option value="PENDIENTE DE PERSONALIZAR">PENDIENTE DE PERSONALIZAR</option>
                                    <option value="PENDIENTE DE VERIFICAR">PENDIENTE DE VERIFICAR</option>
                                    <option value="PENDIENTE DE DISTRIBUIR">PENDIENTE DE DISTRIBUIR</option>
                                </select>
                               {/* <Button className="btn_mg btn_mg__primary ml-3" disabled={false} type="submit" onClick={filtrarTarjetas}>Buscar</Button>*/}
                            </div>
                        </div>
                    }


                    {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" &&
                        <div className="content-filtro">
                            <div className="f-row w-100">
                                <h3 className="strong mr-4">Acción a realizar:</h3>
                                <select style={{ width: "350px" }} id="tarjetas_selectAsisAgencia" name="tarjetas_selectAsisAgencia" value={selectAccionAsistAgencia} onChange={(e) => accionAsistenteAgenciaHandler(e.target.value)}>
                                    <option value="-1" disabled={true }>Seleccione una opción</option>
                                    <option value="RECEPCION_TARJETAS_CREDITO">RECEPTAR TARJETAS DE CRÉDITO</option>
                                    <option value="ACTIVAR_TARJETAS_CREDITO">ACTIVAR TARJETAS DE CRÉDITO</option>
                                </select>
                               {/* <Button className="btn_mg btn_mg__primary ml-3" disabled={false} type="submit" onClick={accionAsistenteAgenciaHandler}>Buscar</Button>*/}
                            </div>
                        </div>
                    }


                    {/*<div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>*/}
                    {/*    <Card >*/}
                    {/*        <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Enviar órdenes a personalizar"></img>*/}
                    {/*        <h4 className="mt-2">Enviar órdenes a personalizar</h4>*/}
                    {/*        */}{/* <h5 className="mt-2">Generar las órdenes</h5>*/}
                    {/*        <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Generar archivo</Button>*/}
                    {/*    </Card>*/}
                    {/*</div>*/}

                </div>

                <div className="f-row w-100" style={{ display: "flex", justifyContent: "right", paddingRight: "30px" }}>
                    <div className="input-wrapper">
                        <Input className="w-20 ml-1 inputBusqueda" id="buscarOrden" type="text" disabled={false} value={inputBusqueda} setValueHandler={(e) => setInputBusqueda(e)} placeholder={"Buscar"}></Input>
                        <img className="input-icon icon" src="Imagenes/search.svg" alt="Buscar"></img>
                    </div>

                    <div className="input-fitro">
                        <img className="input-icon icon" src="Imagenes/filter.svg" alt="Filtrar"></img>
                    </div>
                </div>


                {/*BANDEJAS PARA ASISTENTE DE OPERACIONES*/}
                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && selectFiltrarOrdenes === "PENDIENTE DE PERSONALIZAR" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstOrdenesFiltradas.map((orden, index) => {
                            return (
                                <Fragment key={index}>
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

                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && selectFiltrarOrdenes === "PENDIENTE DE VERIFICAR" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstOrdenesFiltradas.map((orden, index) => {
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

                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" && selectFiltrarOrdenes === "PENDIENTE DE DISTRIBUIR" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstOrdenesFiltradas.map((orden, index) => {
                            return (
                                <Fragment key={index}>
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
                {/*FIN BANDEJAS PARA ASISTENTE DE OPERACIONES*/}


                {/*BANDEJAS PARA ASISTENTE DE AGENCIA*/}
                {boolSeccionRecepcionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        {lstItemsReceptarOficina.map((itemOrden, index) => {
                            return (
                                <Fragment key={index}>
                                    <ComponentItemsOrden
                                        index={index}
                                        orden={itemOrden}
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

                {boolSeccionActivacionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" &&
                    <div className="contentTableOrden mt-3 mb-3">
                        <Table headers={headersTarjetas}>
                            {/*BODY*/}
                            {tarjetasV2.map((tarjeta, index) => {
                                return (
                                    <tr key={tarjeta.ente}>
                                        <td>{tarjeta.ente}</td>
                                        <td>{tarjeta.fecha_proceso}</td>
                                        <td>{tarjeta.cedula}</td>
                                        <td>{tarjeta.nombres}</td>
                                        <td>{tarjeta.tipo_tarjeta}</td>
                                        <td><Chip type={tarjeta.tipo_producto}>{tarjeta.tipo_producto}</Chip></td>
                                        <td>
                                            <AccionesTarjetaV2 />
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>
                }
                {/*FIN BANDEJAS PARA ASISTENTE DE AGENCIA*/}

                {/*BANDEJA PARA ASISTENTE  DE PLATAFORMA DE SERVICIOS*/}
                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE PLATAFORMA DE SERVICIOS" &&
                    <Fragment>
                        <div className="contentTableOrden mt-3 mb-3">
                            <Table headers={headersTarjetas}>
                                {/*BODY*/}
                                {tarjetas.map((tarjeta, index) => {
                                    return (
                                        <tr key={tarjeta.ente}>
                                            <td>{tarjeta.ente}</td>
                                            <td>{tarjeta.fecha_proceso}</td>
                                            <td>{tarjeta.cedula}</td>
                                            <td>{tarjeta.nombres}</td>
                                            <td>{tarjeta.tipo_tarjeta}</td>
                                            <td><Chip type={tarjeta.tipo_producto}>{tarjeta.tipo_producto}</Chip></td>
                                            <td>
                                                <AccionesTarjeta />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </Table>
                        </div>


                    </Fragment>
                }
                {/*FIN BANDEJA PARA ASISTENTE  DE PLATAFORMA DE SERVICIOS*/}


                {/*SECCION BOTONES PARA ASISTENTE DE OPERACIONES*/}
                {datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE OPERACIONES" &&
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button onClick={() => { setModalEnviarPersonalizacion(true) }} className="btn_mg__primary" disabled={false}>{textoBotonAccion}</Button>
                    </div>
                }

                {/*SECCION BOTONES PARA ASISTENTE DE AGENCIA*/}
                {boolSeccionRecepcionTarjetas === true && datosUsuario.length > 0 && datosUsuario[0].strCargo === "ASISTENTE DE AGENCIA" &&
                    <div className='row w-100 mt-2 f-row justify-content-center'>
                        <Button className="btn_mg__primary" disabled={false}>{textBtnAccionAsistenteAgencia}</Button>
                    </div>
                }



            </div>

            <ModalDinamico
                modalIsVisible={modalEnviarPersonalizacion}
                titulo={`Aviso!!!`}
                onCloseClick={closeModaEnvioPersonalizacion}
                type="sm"
            >
                <div className="pbmg4 ptmg4">
                    <div className="f-row mb-4">
                        {/*<h3 className="">¿Está seguro de realizar el envio de </h3>  <h3 className="strong">&nbsp;{totalTarjetasEnviar}&nbsp;</h3>  <h3>tarjetas a personalizar?</h3>*/}
                        <h3 className="">¿Está seguro de realizar el envio de tarjetas a personalizar?</h3>
                    </div>
                    <div className="center_text_items">
                        <button className="btn_mg btn_mg__primary mt-2" disabled={false} type="submit" onClick={envioPersonalizacionHandler}>Enviar</button>
                        <button className="btn_mg btn_mg__secondary mt-2 " onClick={closeModaEnvioPersonalizacion}>Cancelar</button>
                    </div>

                </div>
            </ModalDinamico>
        </div>

    )

}

/*
const ComponentItemsOrden = (props) => {

    const [checkSeleccionPadre, setCheckSeleccionPadre] = useState(false);
    const [checkSeleccionHijo, setCheckSeleccionHijo] = useState(false);
    const [totalItemOrdenCheck, setTotalItemOrdenCheck] = useState([]);

    const setStatusCheckHandler = (valor) => {
        setCheckSeleccionHijo(valor);
    }

    const itemsOrdenCkeckTotal = (array) => {
        setTotalItemOrdenCheck(array)        
        props.returnItems(array);
    }

    
    useEffect(() => {
        if (props.orden.lst_socios.length > 0) {
            setCheckSeleccionPadre(totalItemOrdenCheck.length === props.orden.lst_socios.length && totalItemOrdenCheck.length !== 0)
        }
    }, [totalItemOrdenCheck])
    

    return (
        <Fragment key={props.index}>
            <TituloComponente index={props.index} header={props.orden} inicialStateCheck={checkSeleccionPadre} checkStatusChange={(e) => { setStatusCheckHandler(e) }} >
                <ComponentOrdenItems ordenItem={props.orden} checkStatusSeleccion={checkSeleccionHijo} returnItemOrden={itemsOrdenCkeckTotal} ></ComponentOrdenItems>
            </TituloComponente>

        </Fragment>

    )

}

const TituloComponente = (props) => {


    const [checkSeleccionAll, setCheckSeleccionAll] = useState(false);

    useEffect(() => {
        props.checkStatusChange(checkSeleccionAll);
    }, [props, checkSeleccionAll])

    let titulo = (
        <div className="w-95 f-row">
            <div className='content-headertable' >
                <div className="content-block" style={{ width: "9%", minWidth: "50px" }} >
                    <h4 className="item-header white">Oficina</h4>
                </div>
                <div className="content-block" style={{ width: "21%", minWidth: "270px" }} >
                    <h4 className="item-header white">{props.header.oficina}</h4>
                </div>
                <div className="content-block" style={{ width: "14%", minWidth: "130px" }} >
                    <h4 className="item-header white">Total de tarjetas</h4>
                </div>
                <div className="content-block" style={{ width: "7%", minWidth: "50px" }} >
                    <h4 className="item-header white">{props.header.num_total_tarjetas}</h4>
                </div>
                <div className="content-block" style={{ width: "5%", minWidth: "130px" }} >
                    <h4 className="item-header white">Fecha procesado</h4>
                </div>
                <div className="content-block" style={{ width: "12%", minWidth: "120px" }} >
                    <h4 className="item-header white">{props.header.fecha_rel}</h4>
                </div>
                <div className="" style={{ position: "absolute", right: "80px" }}>
                    <input type="checkbox" name={props.header.orden} checked={props.inicialStateCheck}
                        onChange={(e) => setCheckSeleccionAll(!checkSeleccionAll)}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <Fragment key={props.index}>
            <div className="mb-1">
                <AccordionV2 title={titulo} classNameTitulo={"accordionStyle2"} >
                    {props.children}
                </AccordionV2>
            </div>
        </Fragment>

    )
}


const ComponentOrdenItems = ({ ordenItem, checkStatusSeleccion, returnItemOrden }) => {

    const [tarjetasCheckBox, setTarjetaCheckBox] = useState([]);

    useEffect(() => {
        seleccionMultiple();
    }, [checkStatusSeleccion])
    
    useEffect(() => {
        returnItemOrden(tarjetasCheckBox);
    }, [tarjetasCheckBox])

    const seleccionMultiple = (e) => {
        toggleSelectAll(checkStatusSeleccion);
    }

    const toggleSelectAll = (checkStatus) => {
        if (checkStatus) {
            const resultado = ordenItem.lst_socios.map(itemOrden => itemOrden).flat();
            setTarjetaCheckBox(resultado);
        } else {
            setTarjetaCheckBox([]);
        }
    };

    const checkTarjeta = (ordenCheck) => {
        if (tarjetasCheckBox.includes(ordenCheck)) {
            setTarjetaCheckBox(tarjetasCheckBox.filter(ordenItem => ordenItem !== ordenCheck));
        } else {
            setTarjetaCheckBox([...tarjetasCheckBox, ordenCheck]);
        }
    }

    return (
        <Fragment key={ordenItem.cedula}>
            <table className='table-accordion2' style={{ overflowY: "hidden" }}>
                <thead className='thead-accordion2'>
                    <tr>
                        <th className='paddingSpacing'>Identificación</th>
                        <th className='paddingSpacing'>Nombre del titular</th>
                        <th className='paddingSpacing'>Tipo de tarjeta</th>
                        <th className='paddingSpacing'>Tipo de producto</th>
                        <th className='paddingSpacing'> </th>
                    </tr>
                </thead>
                <tbody style={{ overflowY: "hidden" }}>
                    {ordenItem.lst_socios.map(cliente => {
                        return (
                            <tr key={cliente.cedula}>
                                <td className='paddingSpacing'>{cliente.cedula}</td>
                                <td className='paddingSpacing'>{cliente.nombres}</td>
                                <td className='paddingSpacing'>{cliente.tipo_tarjeta}</td>
                                <td className='paddingSpacing'>{cliente.tipo_producto}</td>
                                <td className='paddingSpacing'>
                                    <Input key={cliente.cedula} disabled={false} type="checkbox" checked={tarjetasCheckBox.includes(cliente)} setValueHandler={() => checkTarjeta(cliente)}></Input>
                                </td>

                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Fragment>
    )
}
*/



const AccionesTarjeta = () => {
    return (
        <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

            <button className="btn_mg_icons noborder" title="Imprimir contrato">
                <img className="img-icons-acciones" src="Imagenes/printIcon.svg" alt="Imprimir contrato"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Subir Doc Escaneado">
                <img className="img-icons-acciones" src="Imagenes/upload_file.svg" alt="Subir Doc Escaneado"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Entregar Tc">
                <img className="img-icons-acciones" src="Imagenes/entregar.svg" alt="Entregar Tc"></img>
            </button>

        </div>
    )
}


const AccionesTarjetaV2 = () => {
    return (
        <div className="f-row" style={{ gap: "6px", justifyContent: "center" }}>

            <button className="btn_mg_icons noborder" title="Visualizar documentos">
                <img className="img-icons-acciones" src="Imagenes/search.svg" alt="Visualizar documentos"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Regresar Tc">
                <img className="img-icons-acciones" src="Imagenes/return.svg" alt="Regresar Tc"></img>
            </button>

            <button className="btn_mg_icons noborder" title="Activar Tc">
                <img className="img-icons-acciones" src="Imagenes/activate.svg" alt="Activar Tc"></img>
            </button>

        </div>
    )
}

export default connect(mapStateToProps, {})(Seguimiento);