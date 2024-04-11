import "../../css/Components/DatosSocio.css";
import Accordion from "../Common/UI/Accordion";
import { Fragment, useState } from "react";
import { useDispatch } from 'react-redux';
import Item from "../Common/UI/Item";
import { fetchInfoSocio, fetchInfoEconomica, fetchGetInfoFinan } from "../../services/RestServices";
import Switch from "../Common/UI/Switch";
import Toggler from "../Common/UI/Toggler";
import Input from "../Common/UI/Input";
import Textarea from "../Common/UI/Textarea";
import Button from "../Common/UI/Button";

const DatosSocio = (props) => {
    const dispatch = useDispatch();

    const comentarioNegacion = [
        {
            prm_id: 1,
            prm_valor_ini: "Solicitará en otra IFI"
        },
        {
            prm_id: 2,
            prm_valor_ini: "Monto muy bajo"
        },
        {
            prm_id: 3,
            prm_valor_ini: "No desea por el momento"
        },
        {
            prm_id: 4,
            prm_valor_ini: "Regresará con la documentación"
        }
    ];

    const comentarioAfirmacion = [
        {
            prm_id: 5,
            prm_valor_ini: "En trámite de ser socio"
        },
        {
            prm_id: 6,
            prm_valor_ini: "Lorem Ipsum"
        },
        {
            prm_id: 7,
            prm_valor_ini: "Lorem Ipsum"
        },
        {
            prm_id: 8,
            prm_valor_ini: "Regresará con la documentación"
        }
    ];
    //Acordeon Score
    const [estadoAccordionScore, setEstadoAccordionScore] = useState(true);
    const [estadoLoadingScore, setEstadoLoadingScore] = useState(false);
    const [contentReadyScore, setContentReadyScore] = useState(true);
    //Acordeon InfoSocio
    const [estadoAccordionInfoSocio, setEstadoAccordionInfoSocio] = useState(false);
    const [estadoAccordionInfoFinan, setEstadoAccordionInfoFinan] = useState(false);
    const [estadoAccordionInfoEco, setEstadoAccordionInfoEco] = useState(false);
    const [estadoLoadingInfoSocio, setEstadoLoadingInfoSocio] = useState(false);
    const [estadoLoadingInfoFinan, setEstadoLoadingInfoFinan] = useState(false);
    const [estadoLoadingInfoEco, setEstadoLoadingInfoEco] = useState(false);
    const [estadoMediosNotif, setEstadoMediosNotif] = useState(false);
    const [contentReadyInfoSocio, setContentReadyInfoSocio] = useState(false);
    const [contentReadyInfoFinan, setContentReadyInfoFinan] = useState(false);
    const [contentReadyInfoEco, setContentReadyInfoEco] = useState(false);

    const [infoSocio, setInfoSocio] = useState([]);
    const [infoEco, setInfoEco] = useState([]);
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);

    //ComentarioGestion
    const [deseaTarjeta, setDeseaTarjeta] = useState(false);
    const [comentarioAdicional, setComentarioAdicional] = useState(false);

    //InfoEconomica
    const [infoEconomica, setInfoEconomica] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [egresos, setEgresos] = useState([]);

    //InfoFinanciera
    const [dpf, setDpf] = useState([]);
    const [creditosHis, setCreditosHis] = useState([]);

    const toggleAccordionScore = () => {
        setEstadoAccordionScore(!estadoAccordionScore);
        console.log(estadoAccordionScore)
    }

    const comentarioAdicionalHanlder = (e) => {
        setComentarioAdicional(e);
        props.onComentarioAdic(e);
    }

    const getInfoSocioHandler = () => {
        if (infoSocio.length > 0) {
            setEstadoAccordionInfoSocio(!estadoAccordionInfoSocio);
        } else {
            getInfoSocio();
        }
    }

    
    const deseaTarjetaHandler = (value) => {
        setDeseaTarjeta(value);
    }

    const getInfoSocio = () => {

        setEstadoLoadingInfoSocio(true);
        fetchInfoSocio("1105970717", props.token, (data) => {
            setDirDomicilioSocio([...data.lst_dir_domicilio]);
            setDirTrabajoSocio([...data.lst_dir_trabajo]);
            setInfoSocio([...data.datos_cliente]);
            setEstadoAccordionInfoSocio(true);
            setContentReadyInfoSocio(true);
            props.onInfoSocio(data);
        }, dispatch);
        setEstadoLoadingInfoSocio(false);
    }

    const getInfoFinan = () => {
        setEstadoLoadingInfoFinan(true);
        fetchGetInfoFinan(props.informacionSocio.str_ente, props.token, (data) => {
            setDpf(...[data.lst_dep_plazo_fijo]);
            setCreditosHis(...[data.lst_creditos_historicos]);
            setEstadoAccordionInfoFinan(true);
            setContentReadyInfoFinan(true);
        }, dispatch);
        setEstadoLoadingInfoFinan(false);
    }

    const seleccionComentarioAfirma = (value) => {
        props.onComentario(value);
    }
    const seleccionComentarioNega = (value) => {
        props.onComentario(value);
    }

    const getInfoMediosNotif = () => {
        setEstadoMediosNotif(!estadoMediosNotif);
    }

    const getInfoEco = () => {
        setEstadoLoadingInfoEco(true);
        fetchInfoEconomica(props.informacionSocio.str_ente, props.token, (data) => {
            setInfoEconomica(data)
            setIngresos([...data.lst_ingresos_socio]);
            setEgresos([...data.lst_egresos_socio]);
            setEstadoAccordionInfoEco(true);
            setContentReadyInfoEco(true);
        }, dispatch);
        setEstadoLoadingInfoEco(false);
    }

    const descargarReporte = () => {
        const pdfUrl = "Imagenes/reporteavalhtml.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="f-col w-100">
            <div id="montoSugerido" className="f-row w-100 ">
                <img src="Imagenes/monetization_on.svg"></img>
                <div className="datosMonto">
                    <h3>Monto sugerido:</h3>
                    <h2>{`$ ${props.montoSugerido || '10000.00'}`}</h2>
                </div>
            </div>
            <div id="infoSocio" className="w-100">
                <Accordion contentReady={contentReadyScore} title="Score" rotate={estadoAccordionScore} loading={estadoLoadingScore} toggleAccordion={toggleAccordionScore}>
                    <div className="m-4">
                        <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <h4>Resultado de la calificación</h4>
                            <div>
                                <p>Cupo sugerido:</p>
                                <h4>{`$ ${props.montoSugerido || '10000.00'}`}</h4>
                            </div>
                        </Item>
                        <Item xs={6} sm={6} md={6} lg={6} xl={6}></Item>
                        <input name="nombre" type="text" value={props.score.response.result.identificacionTitular[0]?.nombreRazonSocial} disabled={true}></input>
                        <label htmlFor="score">Score:</label>
                        <input name="score" type="text" value={props.score.response.result && props.score.response.result.scoreFinanciero && props.score.response.result.scoreFinanciero[0] && props.score.response.result.scoreFinanciero[0].score ? props.score.response.result.scoreFinanciero[0].score : 800} disabled={true}></input>
                        <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} disabled={false} onClick={descargarReporte}>Descargar reporte</Button>
                        <label htmlFor="name">Detalle de deudas:</label>
                        {props.score.response.result.deudaVigenteTotal.map((deuda) => {
                            return (<div>
                                <label>{deuda.sistemaCrediticio}</label>
                                <div>
                                    <div>
                                        <label>Total deuda:</label>
                                        <input value={deuda.totalDeuda}></input>
                                        <label>Valor demanda judicial:</label>
                                        <input value={deuda.valorDemandaJudicial}></input>
                                        <label>Valor por vencer:</label>
                                        <input value={deuda.valorPorVencer}></input>
                                    </div>
                                </div>
                            </div>);
                        })
                        }
                    </div>
                </Accordion>
                <Accordion className="mt-3" title="Datos generales" rotate={estadoAccordionInfoSocio} loading={estadoLoadingInfoSocio} toggleAccordion={() => { getInfoSocioHandler(); } } contentReady={contentReadyInfoSocio}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: "20px" }}>
                                <label>Fecha de nacimiento:</label>
                                <input value={`${infoSocio[0]?.str_fecha_nacimiento}`} readOnly={true}></input>
                                <label>Años reside en el pais:</label>
                                <input value="N/D" readOnly={true}></input>
                                <label>Nivel de educación:</label>
                                <input value={`${infoSocio[0]?.str_nivel_educacion}`} readOnly={true}></input>
                                <label>Código de profesión:</label>
                                <input value={`${infoSocio[0]?.str_codigo_profesion}`} readOnly={true}></input>
                                <label>Actividad:</label>
                                <input value={`${infoSocio[0]?.str_actividad_economica}`} readOnly={true}></input>
                                <label>Ocupación:</label>
                                <input value={`${infoSocio[0]?.str_ocupacion}`} readOnly={true}></input>
                                <label>Estado civil:</label>
                                <input value={`${infoSocio[0]?.str_estado_civil}`} readOnly={true}></input>
                            </div>
                            <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                <label>Nacionalidad:</label>
                                <input value={`${infoSocio[0]?.str_nacionalidad}`} readOnly={true}></input>
                                <label>Sexo:</label>
                                <input value={`${infoSocio[0]?.str_sexo === "M" ? "Masculino" : "Femenino"}`} readOnly={true}></input>
                                <label>Sector:</label>
                                <input value={`${dirDocimicilioSocio[0]?.str_dir_sector}`} readOnly={true}></input>
                                <label>Subsector:</label>
                                <input value={`${dirDocimicilioSocio[0]?.str_dir_barrio}`} readOnly={true}></input>
                                <label>Tipo de persona:</label>
                                <input value={`${infoSocio[0]?.str_tipo_persona}`} readOnly={true}></input>
                                <label>Medio de información:</label>
                                <input value={`${infoSocio[0]?.str_medio_informacion}`} readOnly={true}></input>
                                <label>Calificación de riesgo:</label>
                                <input value={`${infoSocio[0]?.str_calificacion_riesgo}`} readOnly={true}></input>
                            </div>
                        </div>

                    </div>
                </Accordion>
                {props.tipoGestion === 'solicitud' &&
                    <Fragment>
                        <Accordion className="mt-3" title="Medios de notificación" rotate={estadoMediosNotif} loading={estadoLoadingInfoSocio} toggleAccordion={() => { getInfoMediosNotif(); }} contentReady={contentReadyInfoSocio}>
                            <div className="m-2">
                            <label>Celular:</label>
                            <input value={`${props.informacionSocio.str_celular || ''}`} readOnly={true}></input>
                            <label>Correo:</label>
                            <input value={`${props.informacionSocio.str_email || ''}`} readOnly={true}></input>
                            </div>
                        </Accordion>
                        <Accordion className="mt-3" title="Información económica" rotate={estadoAccordionInfoEco} loading={estadoLoadingInfoEco} toggleAccordion={() => { getInfoEco(); }} contentReady={contentReadyInfoEco}>
                            <div className="f-row">
                                <div className={"m-2"}>
                                    <h3>Ingresos</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Ingreso</th>
                                                <th>Valor Reportado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                ingresos.map((ingreso) => {
                                                    return (<tr key={ingreso.int_codigo}>
                                                        <td>{ingreso.str_descripcion}</td>
                                                        <td>{ingreso.dcm_valor}</td>
                                                    </tr>);
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className={"m-2"}>
                                    <h3>Egresos</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Egreso</th>
                                                <th>Valor Reportado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                egresos.map((egreso) => {
                                                    return (<tr key={egreso.int_codigo}>
                                                        <td>{egreso.str_descripcion}</td>
                                                        <td>{egreso.dcm_valor}</td>
                                                    </tr>);
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Accordion>
                        <Accordion className="mt-3" title="Situación financiera CoopMego" rotate={estadoAccordionInfoFinan} loading={estadoLoadingInfoFinan} toggleAccordion={() => { getInfoFinan(); }} contentReady={contentReadyInfoFinan}>
                            <div className={"m-2"}>
                                <h3>Créditos históricos</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Id.</th>
                                            <th>Tipo</th>
                                            <th>Operación</th>
                                            <th>Monto Aprobado</th>
                                            <th>Fecha vencimiento</th>
                                            <th>Fecha concesión</th>
                                            <th>Cuotas vencidas</th>
                                            <th>Días mora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            creditosHis.map((credito) => {
                                                return (<tr key={credito.int_operacion}>
                                                    <td>{credito.str_tipo}</td>
                                                    <td>{credito.int_operacion}</td>
                                                    <td>{credito.str_operacion_cred}</td>
                                                    <td>{`$ ${credito.dcm_monto_aprobado}`}</td>
                                                    <td>{credito.dtt_fecha_vencimiento}</td>
                                                    <td>{credito.dtt_fecha_concesion}</td>
                                                    <td>{credito.int_cuotas_vencidas}</td>
                                                    <td>{credito.int_dias_mora}</td>
                                                </tr>);
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className={"m-2"}>
                                <h3>Depósitos a plazo fijo</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Número cta</th>
                                            <th>Tipo cta</th>
                                            <th>Monto disponible</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dpf.map((valor) => {
                                                return (<tr key={valor.int_id_cuenta}>
                                                    <td>{valor.str_num_cuenta}</td>
                                                    <td>{valor.str_tipo_cta}</td>
                                                    <td>{`$ ${valor.dcm_ahorro}`}</td>
                                                    <td>{valor.dtt_fecha_movimiento}</td>
                                                    <td>{valor.str_estado}</td>
                                                </tr>);
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Accordion>
                    </Fragment>
                }
            </div>
            <div id="comentarioGestion">
                <div className="tipoComentario mt-4 mb-4">
                <Fragment>
                    <h3>Está interesado en adquirir la tarjeta de crédito</h3>
                        {props.tipoGestion === 'prospeccion' && <Switch onChange={deseaTarjetaHandler} value={deseaTarjeta}></Switch>}
                    
                </Fragment>
                </div>
                {props.tipoGestion === "prospeccion" && <div>
                    <h3 className="mb-2">Comentario de la gestión</h3>
                    {deseaTarjeta &&
                        <Toggler selectedToggle={seleccionComentarioAfirma} toggles={["Solicitará en otra IFI", "Monto muy bajo", "No desea por el momento", "Regresará con la documentación"]}></Toggler>
                    }
                    {deseaTarjeta ||
                        <Toggler selectedToggle={seleccionComentarioNega} toggles={["En trámite de ser socio", "Lorem Ipsum", "Lorem Ipsum", "Regresará con la documentación"]}></Toggler>
                    }
                </div>}
                <div className="mt-4">
                    <h3 className="mb-2">Comentario Adicional</h3>
                    <Textarea placeholder="Ej. Texto de ejemplo" type="textarea" onChange={comentarioAdicionalHanlder}></Textarea>
                </div>

            </div>
        </div>
    );
}

export default DatosSocio;