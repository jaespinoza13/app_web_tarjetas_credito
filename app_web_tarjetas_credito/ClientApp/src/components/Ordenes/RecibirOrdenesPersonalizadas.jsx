import { Fragment, useState } from 'react';
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
import ModalDinamico from '../Common/Modal/ModalDinamico';
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


function RecibirOrdenesPersonalizadas(props) {

    const navigate = useHistory();
    const dispatch = useDispatch();
    const [lstOrdenesEntrada, setLstOrdenesEntrada] = useState([]);
    const [lstOrdenesSalida, setLstOrdenesSalida] = useState([]);
    const [inputBusqueda, setInputBusqueda] = useState([]);



    const [ordenItemsCheckTotal, setOrdenItemsCheckTotal] = useState([]);
    const [totalTarjetasEnviar, setTotalTarjetasEnviar] = useState(0);



    const [modalEnviarPersonalizacion, setModalEnviarPersonalizacion] = useState(false);

    const ordenesV2 = [
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 3, oficina: "MATRIZ",
            lst_socios: [
                { cedula: "1150214370", nombres: "DANNY VASQUEZ", solicitud: "1", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLDEN", fecha_proceso_rel: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal" },
                { cedula: "0111978465", nombres: "LUIS CONDE", solicitud: "13", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLDEN", fecha_proceso_rel: "12/07/2024 22:30", oficina_solicita: "MATRIZ", tipo_tarjeta: "Principal" },

            ]
        },
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 1, num_tarjetas_error: 1, oficina: "EL VALLE",
            lst_socios: [
                { cedula: "1101898147", nombres: "NICOLE ALBAN", solicitud: "2", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTANDAR", fecha_proceso_rel: "12/07/2024 22:30", oficina_solicita: "EL VALLE", tipo_tarjeta: "Principal" },
            ]
        },
        {
            fecha_rel: "13/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 0, oficina: "ALAMOR",
            lst_socios: [
                { cedula: "1106849276", nombres: "SAMANTA CARRION", solicitud: "5", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLDEN", fecha_proceso_rel: "13/07/2024 15:35", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal" },
                { cedula: "0681486841", nombres: "FULANITO CABRERA", solicitud: "7", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLDEN", fecha_proceso_rel: "13/07/2024 15:35", oficina_solicita: "ALAMOR", tipo_tarjeta: "Principal" },
            ]
        },
        {
            fecha_rel: "14/07/2024", num_total_tarjetas: 2, num_tarjetas_error: 0, oficina: "AGENCIA NORTE",
            lst_socios: [
                { cedula: "1954984972", nombres: "MARTHA PINEDA", solicitud: "9", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTANDAR", fecha_proceso_rel: "14/07/2024 17:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal" },
                { cedula: "0981864365", nombres: "PIEDA TOLEDO", solicitud: "10", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLDEN", fecha_proceso_rel: "14/07/2024 17:30", oficina_solicita: "AGENCIA NORTE", tipo_tarjeta: "Principal" },
            ]
        },
        {
            fecha_rel: "12/07/2024", num_total_tarjetas: 3, num_tarjetas_error: 0, oficina: "AGENCIA CUARTO CENTENARIO",
            lst_socios: [
                { cedula: "1104732936", nombres: "LEO MONTALVAN", solicitud: "4", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "BLACK", fecha_proceso_rel: "12/07/2024 22:30", oficina_solicita: "AGENCIA CUARTO CENTENARIO", tipo_tarjeta: "Principal" },
                { cedula: "0515846844", nombres: "LUISA VALDEZ", solicitud: "11", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "ESTANDAR", fecha_proceso_rel: "12/07/2024 16:30", oficina_solicita: "AGENCIA CUARTO CENTENARIO", tipo_tarjeta: "Principal" },
                { cedula: "0849655446", nombres: "MARIA ORTEGA", solicitud: "12", estado: "PEN_ENV_PERSONALIZAR", tipo_producto: "GOLDEN", fecha_proceso_rel: "12/07/2024 16:30", oficina_solicita: "AGENCIA CUARTO CENTENARIOR", tipo_tarjeta: "Principal" },
            ]
        },
    ]

    const returnItemsHandler = (arrayItems) => {
        console.log("arrayItems ", arrayItems)
    }


    const closeModaEnvioPersonalizacion = () => {
        setModalEnviarPersonalizacion(false);
    }

    const envioPersonalizacionHandler = () => {

    }

    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname }></Sidebar>
            <div className="container_mg">
         
                <h2 className="mt-5 mb-3">Recibir órdenes</h2>

                <div className='row w-100'>

                    <div style={{ display: "flex", flexDirection: "column" }}>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>

                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "25%", marginRight: "10px"}}>
                                <Card >
                                    <img style={{ width: "25px" }} src="Imagenes/credit_card_FILL0_wght300_GRAD0_opsz24.svg"></img>
                                    
                                    <h4 className="mt-2">Recibir órdenes</h4>
                                     <h5 className="mt-2"> </h5>
                                    <Button autoWidth tabIndex="3" className={["btn_mg btn_mg__primary mt-2"]} disabled={false}>Extraer órdenes</Button>
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
                                    pantallaTituloExponer="EnvioRececepcionPersonalizacion"

                                ></ComponentItemsOrden>
                            </Fragment>
                        )
                    })}
                </div>

                <div className='row w-100 mt-2 f-row justify-content-center'>
                    <Button className="btn_mg__primary" disabled={false}>Recibir</Button>
                </div>

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

export default connect(mapStateToProps, {})(RecibirOrdenesPersonalizadas);