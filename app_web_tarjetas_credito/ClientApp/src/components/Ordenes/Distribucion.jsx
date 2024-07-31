import { Fragment, useState } from 'react';
import Sidebar from '../Common/Navs/Sidebar';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Card from '../Common/Card';
import Button from '../Common/UI/Button';
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from '../../js/utiles';
import "../../css/Components/Seguimiento.css";
import AccordionV2 from '../Common/UI/AccordionV2';
import Input from '../Common/UI/Input';
import ComponentItemsOrden from './ComponentItemsOrden';


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


function Distribucion(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [inputBusqueda, setInputBusqueda] = useState([]);



    const [ordenItemsCheckTotal, setOrdenItemsCheckTotal] = useState([]);
    const [totalTarjetasEnviar, setTotalTarjetasEnviar] = useState(0);

    const ordenesV2 = [
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 3, oficina: "MATRIZ",
            lst_socios: [
                { cedula: "1150214370", nombres: "DANNY VASQUEZ", solicitud: "1", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal" },
                { cedula: "0111978465", nombres: "LUIS CONDE", solicitud: "13", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal" },

            ]
        },
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 1, num_tarjetas_error: 1, oficina: "EL VALLE",
            lst_socios: [
                { cedula: "1101898147", nombres: "NICOLE ALBAN", solicitud: "2", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
            ]
        },
        {
            fecha_rel: "13/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 0, oficina: "ALAMOR",
            lst_socios: [
                { cedula: "1106849276", nombres: "SAMANTA CARRION", solicitud: "5", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal" },
                { cedula: "0681486841", nombres: "FULANITO CABRERA", solicitud: "7", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "13/07/2024 15:35", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal" },
            ]
        },
        {
            fecha_rel: "14/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 0, oficina: "AGENCIA NORTE",
            lst_socios: [
                { cedula: "1954984972", nombres: "MARTHA PINEDA", solicitud: "9", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal" },
                { cedula: "0981864365", nombres: "PIEDA TOLEDO", solicitud: "10", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "14/07/2024 17:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal" },
            ]
        },
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 3, num_tarjetas_error: 0, oficina: "AGENCIA CUARTO CENTENARIO",
            lst_socios: [
                { cedula: "1104732936", nombres: "LEO MONTALVAN", solicitud: "4", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso: "12/07/2024 22:30", oficina_solicita: "AGENCIA CUARTO CENTENARIO", tipo_tarjeta: "Principal" },
                { cedula: "0515846844", nombres: "LUISA VALDEZ", solicitud: "11", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTÁNDAR", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "AGENCIA CUARTO CENTENARIO", tipo_tarjeta: "Principal" },
                { cedula: "0849655446", nombres: "MARIA ORTEGA", solicitud: "12", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLD", fecha_proceso: "12/07/2024 16:30", oficina_solicita: "AGENCIA CUARTO CENTENARIOR", tipo_tarjeta: "Principal" },
            ]
        },
    ]

    const returnItemsHandler = (arrayItems) => {
        console.log("arrayItems ", arrayItems)
    }



    return (
        <div className="f-row w-100" >
            {/*<Sidebar enlace={props.location.pathname}></Sidebar>*/}
            <div className="container_mg">

                <h2 className="mt-5 mb-3">Distribuir órdenes</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px" }}>
                                <Card >
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg" alt="Distribuir órdenes"></img>
                                    <h4 className="mt-2">Distribuir órdenes</h4>
                                    <h5 className="mt-2"> </h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Enviar</Button>
                                </Card>
                            </div>

                        </div>

                    </div>

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

                <div className="contentTableOrden mt-3 mb-3">
                    {ordenesV2.map((orden, index) => {
                        return (
                            <Fragment key={index}>
                                <ComponentItemsOrden
                                    index={index}
                                    orden={orden}
                                    returnItems={returnItemsHandler}
                                    pantallaTituloExponer="RececepcionTarjetasProveedor"
                                ></ComponentItemsOrden>
                            </Fragment>
                        )
                    })}
                </div>

                <div className='row w-100 mt-2 f-row justify-content-center'>
                    <Button className="btn_mg__primary" disabled={false}>Enviar</Button>
                </div>


            </div>
        </div>
    )

}

export default connect(mapStateToProps, {})(Distribucion);