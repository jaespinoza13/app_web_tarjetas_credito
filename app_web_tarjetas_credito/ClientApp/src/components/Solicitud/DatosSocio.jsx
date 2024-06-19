import "../../css/Components/DatosSocio.css";
import Accordion from "../Common/UI/Accordion";
import { Fragment, useState } from "react";
import { useDispatch } from 'react-redux';
import Item from "../Common/UI/Item";
import { fetchInfoSocio, fetchInfoEconomica, fetchGetInfoFinan, fetchReporteAval } from "../../services/RestServices";
import Switch from "../Common/UI/Switch";
import Toggler from "../Common/UI/Toggler";
import Input from "../Common/UI/Input";
import Textarea from "../Common/UI/Textarea";
import Button from "../Common/UI/Button";
import { base64ToBlob, descargarArchivo, generarFechaHoy, verificarPdf } from "../../js/utiles";

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
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);

    //ComentarioGestion
    const [deseaTarjeta, setDeseaTarjeta] = useState(false);
    const [comentariosPositivos, setComentariosPositivos] = useState([{ image: "", textPrincipal: "Solicitará en otra IFI", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Monto muy bajo", textSecundario: "", key: 2 },
    { image: "", textPrincipal: "No desea por el momento", textSecundario: "", key: 3 },
    { image: "", textPrincipal: "Regresará con la documentación", textSecundario: "", key: 4 }]);
    const [comentariosNegativos, setComentariosNegativos] = useState([{ image: "", textPrincipal: "En trámite de ser socio", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Lorem Ipsum", textSecundario: "", key: 2 },
    { image: "", textPrincipal: "Lorem Ipsum", textSecundario: "", key: 3 },
    { image: "", textPrincipal: "Regresará con la documentación", textSecundario: "", key: 4 }]);
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
        //TODO: CAMBIAR CEDULA QUEMADA
        // PUEDA Q SE TENGA Q RETORNAR CALIFICACION RIESGO PARA HACER RECALCULO DE CUPO SUGERIDO
        setEstadoLoadingInfoSocio(true);
        fetchInfoSocio("1105970717", props.token, (data) => {
            setDirDomicilioSocio([...data.lst_dir_domicilio]);
            setDirTrabajoSocio([...data.lst_dir_trabajo]);
            setInfoSocio([...data.datos_cliente]);
            setEstadoAccordionInfoSocio(true);
            setContentReadyInfoSocio(true);
            props.onInfoSocio(data);
            console.log("DATOS DOC  ", data.lst_dir_domicilio)
            console.log("DATOS TRa ", data.lst_dir_trabajo)
            //props.calificacionRiesgo(data.datos_cliente[0].str_calificacion_riesgo)
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
        const comentarioSeleccionado = comentariosPositivos.find((element) => { return element.key === value });
        console.log(comentarioSeleccionado);
        props.onComentario(comentarioSeleccionado.textPrincipal);
    }
    const seleccionComentarioNega = (value) => {
        const comentarioSeleccionado = comentariosNegativos.find((element) => { return element.key === value });
        props.onComentario(comentarioSeleccionado.textPrincipal);
    }

    const getInfoMediosNotif = () => {
        setEstadoMediosNotif(!estadoMediosNotif);
    }

    const getInfoEco = () => {
        fetchInfoEconomica(props.informacionSocio.str_ente, props.token, (data) => {
            setInfoEconomica(data)
            setIngresos([...data.lst_ingresos_socio]);
            setEgresos([...data.lst_egresos_socio]);
            setEstadoAccordionInfoEco(true);
            setContentReadyInfoEco(true);
        }, dispatch);
    }

    const descargarReporte = async () => {

        /*
        const pdfUrl = "Imagenes/reporteavalhtml.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);*/

        //TODO: REVISAR PRIMER PARAMETRO intCliente reporta del metodo Score

        console.log("SCORE ID CLI ", props.idClienteScore)
        //fetchReporteAval(props.idClienteScore, props.token, (data) => { //TODO: DEJAR ESTA LINEA PARA PRODUCCION

        /*
        let val = setTimeout( async function() {
            await fetchReporteAval(189554, props.token, (data) => {
                console.log("REPORTE AVAL ", data)
                if (data.file_bytes.length > 0 && verificarPdf(data.file_bytes)) {
                    const blob = base64ToBlob(data.file_bytes, 'application/pdf');
                    let fechaHoy = generarFechaHoy();
                    const nombreArchivo = `ReporteAval_Prueba${(fechaHoy)}`;
                    descargarArchivo(blob, nombreArchivo, 'pdf');
                }
            }, dispatch)
            clearTimeout(val)
        }, 5000);*/
               

        await fetchReporteAval(189554, props.token, (data) => {
            console.log("REPORTE AVAL ", data)
            if (data.file_bytes.length > 0) { //&& verificarPdf(data.file_bytes)) {
                const blob = base64ToBlob(data.file_bytes, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `ReporteAval_Prueba${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo, 'pdf');
            }
        }, dispatch);

    }

    return (
        <div className="f-col w-100">
            <div id="montoSugerido" className="f-row w-100 ">
                <img src="Imagenes/Cupo sugerido.svg"></img>
                <div className="ml-3 datosMonto">
                    <h3 className="blue">Cupo sugerido:</h3>
                    <h2 className="strong blue">{`${props.score.montoSugerido ? Number(props.score.montoSugerido).toLocaleString('en-US') : Number('10000.00').toLocaleString('en-US')}`}</h2>
                </div>
            </div>
            <div className="info f-row mb-4">
                <h3 className="strong">{props.score.response.result.identificacionTitular[0]?.nombreRazonSocial}</h3>
            </div>
            <div id="infoSocio" className="w-100">
                <Accordion contentReady={contentReadyScore} title="Score" rotate={estadoAccordionScore} loading={estadoLoadingScore} toggleAccordion={toggleAccordionScore}>
                    <div className="m-4 f-row">
                        <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <h4 className="strong mb-3">Resultado de la calificación</h4>
                            <div className="values  mb-3">
                                <h5>Ingresos</h5>
                                <h5 className="strong">
                                    {/*{`$ ${Number(props.informacionSocio.montoIngresos).toLocaleString("en-US")}`}*/}
                                    {`$ ${Number(props.informacionSocio.datosFinancieros.montoIngresos)}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Egresos</h5>
                                <h5 className="strong">
                                    {/*{`$ ${Number(props.informacionSocio.montoEgresos).toLocaleString("en-US")}`}*/}
                                    {`$ ${Number(props.informacionSocio.datosFinancieros.montoEgresos)}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Resta Gasto Financiero</h5>
                                <h5 className="strong">                                 
                                    {`$ ${Number(props.informacionSocio.datosFinancieros.montoRestaGstFinanciero)}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Gastos Financieros</h5>
                                <h5 className="strong">
                                    {/*{`$ ${Number(props.informacionSocio.montoGastosFinancieros).toLocaleString("en-US")}`}*/}
                                    {`$ ${Number(props.informacionSocio.datosFinancieros.montoGastosFinancieros)}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Cupo solicitado</h5>
                                <h5 className="strong">
                                    {/* {`$ ${(props.informacionSocio.montoSolicitado).toLocaleString("en-US")}`}*/}
                                    {`$ ${(props.informacionSocio.datosFinancieros.montoSolicitado)}`}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Score</h5>
                                <h5 className="strong">
                                    {props.score.response.result && props.score.response.result.scoreFinanciero && props.score.response.result.scoreFinanciero[0] && props.score.response.result.scoreFinanciero[0].score ? props.score.response.result.scoreFinanciero[0].score : 800}
                                </h5>
                            </div>
                            <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} disabled={false} onClick={descargarReporte}>Descargar reporte</Button>
                        </Item>
                        <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <h4 className="strong mb-3" >Detalle de deudas:</h4>
                            {props.score.response.result.deudaVigenteTotal.map((deuda) => {
                                return (<div>
                                    <h3 className="strong">{deuda.sistemaCrediticio}</h3>
                                    <div>
                                        <div className="values">
                                            <h5>Total deuda:</h5>
                                            <h5 className="strong">$ {Number(deuda.totalDeuda).toLocaleString("en-US")}</h5>
                                        </div>
                                        <div className="values">
                                            <h5>Valor demanda judicial:</h5>
                                            <h5 className="strong">$ {Number(deuda.valorDemandaJudicial).toLocaleString("en-US")}</h5>
                                        </div>
                                        <div className="values">
                                            <h5>Valor por vencer:</h5>
                                            <h5 className="strong">$ {Number(deuda.valorPorVencer).toLocaleString("en-US")}</h5>
                                        </div>
                                    </div>
                                </div>);
                            })
                            }

                        </Item>
                    </div>
                </Accordion>
                {props.gestion === 'solicitud' &&
                    <Fragment>
                        <Accordion className="mt-3" title="Datos generales" rotate={estadoAccordionInfoSocio} loading={estadoLoadingInfoSocio} toggleAccordion={() => { getInfoSocioHandler(); }} contentReady={contentReadyInfoSocio}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                    <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: "20px" }}>
                                        <div className="values  mb-3">
                                            <h5>Fecha de nacimiento</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_fecha_nacimiento}`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Años reside en el pais</h5>
                                            <h5 className="strong">
                                                {`N/D`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Nivel de educación</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_nivel_educacion}`}
                                            </h5>
                                        </div>

                                        <div className="values mb-3">
                                            <h5>Código de profesión</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_codigo_profesion}`}
                                            </h5>
                                        </div>

                                        <div className="values mb-3">
                                            <h5>Actividad</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_actividad_economica}`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Ocupación</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_ocupacion}`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Estado civil</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_estado_civil}`}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                        <div className="values  mb-3">
                                            <h5>Nacionalidad</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_nacionalidad}`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Sexo</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_sexo === "M" ? "Masculino" : "Femenino"}`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Sector</h5>
                                            <h5 className="strong">
                                                {`${dirDocimicilioSocio[0]?.str_dir_sector}`}
                                            </h5>
                                        </div>

                                        <div className="values mb-3">
                                            <h5>Subsector</h5>
                                            <h5 className="strong">
                                                {`${dirDocimicilioSocio[0]?.str_dir_barrio}`}
                                            </h5>
                                        </div>

                                        <div className="values mb-3">
                                            <h5>Tipo de persona</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_tipo_persona}`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Medio de información</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_medio_informacion}`}
                                            </h5>
                                        </div>
                                        <div className="values mb-3">
                                            <h5>Calificación de riesgo</h5>
                                            <h5 className="strong">
                                                {`${infoSocio[0]?.str_calificacion_riesgo}`}
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Accordion>

                        <Accordion className="mt-3" title="Medios de notificación" rotate={estadoMediosNotif} loading={estadoLoadingInfoSocio} toggleAccordion={() => { getInfoMediosNotif(); }} contentReady={contentReadyInfoSocio}>
                            <div className="m-2 w-50">
                                <div className="values mb-3">
                                    <h5>Celular</h5>
                                    <h5 className="strong">
                                        {`${props.informacionSocio.str_celular || ''}`}
                                    </h5>
                                </div>
                                <div className="values mb-3">
                                    <h5>Correo</h5>
                                    <h5 className="strong">
                                        {`${props.informacionSocio.str_email || ''}`}
                                    </h5>
                                </div>
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
                        {props.gestion === 'prospeccion' && <Switch onChange={deseaTarjetaHandler} value={deseaTarjeta}></Switch>}

                    </Fragment>
                </div>
                {props.gestion === "prospeccion" && <div>
                    <h3 className="mb-2">Comentario de la gestión</h3>
                    {deseaTarjeta &&
                        <Toggler
                            selectedToggle={seleccionComentarioAfirma}
                            toggles={comentariosPositivos}>
                        </Toggler>
                    }
                    {deseaTarjeta ||
                        <Toggler
                            selectedToggle={seleccionComentarioNega}
                            toggles={comentariosNegativos}>
                        </Toggler>
                    }
                </div>}
                <div className="mt-4">
                    <h3 className="mb-2">Comentario Adicional</h3>
                    <Textarea placeholder="Ej. Texto de ejemplo" type="textarea" onChange={comentarioAdicionalHanlder} esRequerido={false}></Textarea>
                </div>

            </div>
        </div>
    );
}

export default DatosSocio;