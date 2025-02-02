﻿import "../../css/Components/DatosSocio.css";
import Accordion from "../Common/UI/Accordion";
import { Fragment, useState } from "react";
import { useDispatch, connect } from 'react-redux';
import Item from "../Common/UI/Item";
import { fetchInfoSocio, fetchInfoEconomica, fetchGetInfoFinan, fetchReporteAval } from "../../services/RestServices";
import Switch from "../Common/UI/Switch";
import Toggler from "../Common/UI/Toggler";
import Textarea from "../Common/UI/Textarea";
import Button from "../Common/UI/Button";
import { IsNullOrWhiteSpace, base64ToBlob, dateFormat, descargarArchivo, generarFechaHoy, numberFormatMoney, verificarPdf } from "../../js/utiles";
import { useEffect } from "react";
import DatosFinanDatosSocio from "./DatosFinanDatosSocio";

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data
    };
};

const DatosSocio = (props) => {
    const dispatch = useDispatch();

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
    const [comentariosPositivos, setComentariosPositivos] = useState([]);
    const [comentariosNegativos, setComentariosNegativos] = useState([]);
    /*const [comentariosPositivosPrueba, setComentariosPositivosPrueba] = useState([{ image: "", textPrincipal: "Solicitará en otra IFI", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Monto muy bajo", textSecundario: "", key: 2 },
    { image: "", textPrincipal: "No desea por el momento", textSecundario: "", key: 3 },
    { image: "", textPrincipal: "Regresará con la documentación", textSecundario: "", key: 4 }]);
    const [comentariosPositivos, setComentariosPositivos] = useState([{ image: "", textPrincipal: "Solicitará en otra IFI", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Monto muy bajo", textSecundario: "", key: 2 },
    { image: "", textPrincipal: "No desea por el momento", textSecundario: "", key: 3 },
    { image: "", textPrincipal: "Regresará con la documentación", textSecundario: "", key: 4 }]);
    const [comentariosNegativos, setComentariosNegativos] = useState([{ image: "", textPrincipal: "En trámite de ser socio", textSecundario: "", key: 1 },
    { image: "", textPrincipal: "Lorem Ipsum", textSecundario: "", key: 2 },
    { image: "", textPrincipal: "Lorem Ipsum", textSecundario: "", key: 3 },
    { image: "", textPrincipal: "Regresará con la documentación", textSecundario: "", key: 4 }]);*/
    const [comentarioAdicional, setComentarioAdicional] = useState("");

    //InfoEconomica
    const [infoEconomica, setInfoEconomica] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [totalIngresos, setTotalIngresos] = useState([]);
    const [egresos, setEgresos] = useState([]);
    const [totalEgresos, setTotalEgresos] = useState([]);
    const [cupoCoopmegoSimulacion, setCupoCoopmegoSimulacion] = useState("");

    //InfoFinanciera
    const [dpf, setDpf] = useState([]);
    const [creditosHis, setCreditosHis] = useState([]);

    //Filas del text Area comentarioAdicional
    //const [filasTextAreaComentarioAd, setFilasTextAreaComentarioAd] = useState(4);

    //DatosFinancierosProspecto
    const [isCkeckRestaGtoFinananciero, setIsCkeckRestaGtoFinananciero] = useState(false);



    const checkGastosFinancieroHandler = (e) => {
        setIsCkeckRestaGtoFinananciero(e);
    }

    const toggleAccordionScore = () => {
        setEstadoAccordionScore(!estadoAccordionScore);
    }

    const comentarioAdicionalHanlder = (e) => {
        setComentarioAdicional(e);
        props.onComentarioAdic(e);
    }

    /*
    //Control para el numero de filas del text area
    useEffect(() => {
        let filasActuales = comentarioAdicional.split('\n');
        if (filasActuales.length >= 4) setFilasTextAreaComentarioAd(filasActuales.length + 1);
        else if (filasActuales.length < 4) setFilasTextAreaComentarioAd(4);
    }, [comentarioAdicional])*/


    const getInfoAccordion = () => {
        setEstadoAccordionInfoSocio(!estadoAccordionInfoSocio);
    }

    const deseaTarjetaHandler = (value) => {
        setDeseaTarjeta(value);
    }

    const getInfoSocio = () => {
        setEstadoLoadingInfoSocio(true);
        //console.log("CEDULA INFOSOCIO", props.informacionSocio.cedula);
        fetchInfoSocio(props.informacionSocio.cedula, props.token, (data) => {
            setDirDomicilioSocio([...data.lst_dir_domicilio]);
            setDirTrabajoSocio([...data.lst_dir_trabajo]);
            setInfoSocio([...data.datos_cliente]);
            setContentReadyInfoSocio(true);
            props.onInfoSocio(data);

        }, dispatch);
        setEstadoLoadingInfoSocio(false);
    }

    const getInfoFinan = () => {
          setEstadoLoadingInfoFinan(true);
        if (!contentReadyInfoFinan && dpf.length === 0) {
            fetchGetInfoFinan(props.informacionSocio.str_ente, props.token, (data) => {
                setDpf(...[data.lst_captaciones]);
                setCreditosHis(...[data.lst_creditos_historicos]);
                setEstadoAccordionInfoFinan(!estadoAccordionInfoFinan);
                setContentReadyInfoFinan(!setContentReadyInfoFinan);
            }, dispatch);
        } else {
            setEstadoAccordionInfoFinan(!estadoAccordionInfoFinan);
        }          
        setEstadoLoadingInfoFinan(false);
    }

    const seleccionComentarioAfirma = (value) => {
        const comentarioSeleccionado = comentariosPositivos.find((element) => { return element.key === value });
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
        setEstadoLoadingInfoEco(true);
        if (!contentReadyInfoEco) {
            fetchInfoEconomica(props.informacionSocio.str_ente, props.token, (data) => {
                setInfoEconomica(data)
                setIngresos([...data.lst_ingresos_socio]);
                setTotalIngresos(data.lst_ingresos_socio.reduce((acumulador, ingresos) => acumulador + ingresos.dcm_valor, 0))
                setEgresos([...data.lst_egresos_socio]);
                setTotalEgresos(data.lst_egresos_socio.reduce((acumulador, egresos) => acumulador + egresos.dcm_valor, 0))
                setEstadoAccordionInfoEco(!estadoAccordionInfoEco);
                setContentReadyInfoEco(!contentReadyInfoEco);
            }, dispatch);
        } else {
            setEstadoAccordionInfoEco(!estadoAccordionInfoEco);
        }        
        setEstadoLoadingInfoEco(false);
    }


    useEffect(() => {
        window.scrollTo(0, 0);
        //Obtener comentarios de la gestion para prospeccion

        let ParametrosTC = props.parametrosTC.lst_parametros;
        let comentariosPosiProspecto = ParametrosTC
            .filter(param => param.str_nombre === "GESTION_PROSPECTO_SI")
            .map(estado => ({
                prm_id: estado.int_id_parametro,
                prm_valor_ini: estado.str_valor_ini,
            }));
        let comentariosNegProspecto = ParametrosTC
            .filter(param => param.str_nombre === "GESTION_PROSPECTO_NO")
            .map(estado => ({
                prm_id: estado.int_id_parametro,
                prm_valor_ini: estado.str_valor_ini,
            }));

        let resultPositivos = comentariosPosiProspecto.map(
            (param, index) => ({
                image: "",
                textPrincipal: param.prm_valor_ini,
                textSecundario: "",
                key: index+1,
            })
        )
        let resultNegativos = comentariosNegProspecto.map(
            (param,index) => ({
                image: "",
                textPrincipal: param.prm_valor_ini,
                textSecundario: "",
                key: index+1,
            })
        )
        //console.log(comentariosPositivosPrueba)
        //console.log(resultPositivos)
        //console.log(resultNegativos)

        setComentariosPositivos(resultPositivos);
        setComentariosNegativos(resultNegativos);


        if (props.gestion === 'solicitud') {
            getInfoSocio();
        }
        setComentarioAdicional(props.comentarioAdicionalValor);


        //Se guarda cupo Coopmego
        setCupoCoopmegoSimulacion(props.score.str_cupo_sugerido);

    }, [])

    const descargarReporte = async () => {

        //TODO CAMBIAR EL ID DEL CLIENTE PARA DESCARGAR REPORTE DEL AVAL A props.idClienteScore 189554
        await fetchReporteAval(Number(props.idClienteScore), props.token, (data) => {
            if (data.file_bytes.length > 0 && verificarPdf(data.file_bytes)) {
                const blob = base64ToBlob(data.file_bytes, 'application/pdf');
                let fechaHoy = generarFechaHoy();
                const nombreArchivo = `ReporteAval_Prueba${(fechaHoy)}`;
                descargarArchivo(blob, nombreArchivo, 'pdf', false);
            }
        }, dispatch);

    }

    const nuevoCupoSimuladoHandler = (e) => {
        setCupoCoopmegoSimulacion(e)
        //Actualiza el cupo sugerido Componente Padre
        props.updateCupoSugeridoMego(e);
    }
    
    /* Number(props?.score?.response?.result?.capacidadPago[0].cupoSugerido).toLocaleString('en-US') : Number('0.00').toLocaleString('en-US')}`}*/
    return (
        <div className="f-col w-100">
            <div id="montoSugerido" className="f-row w-100 ">
                <div className="f-row justify-content-center align-content-center">
                    <img src="Imagenes/Cupo sugerido.svg" width="10%" alt="Cupo sugerido Buró"></img>
                    <div className="ml-3 datosMonto">
                        <h3 className="blue">Cupo Sugerido Buró:</h3>
                        <h2 className="strong blue">{`  
                        ${props.score?.response?.result?.capacidadPago[0]?.cupoSugerido ?                            
                                numberFormatMoney(props?.score?.response?.result?.capacidadPago[0].cupoSugerido) : "$ 0,00"}`}
                        </h2>
                    </div>
                </div>
                <div className="f-row justify-content-center align-content-center">
                    <img src="Imagenes/Cupo sugerido.svg" width="10%" alt="Cupo sugerido CoopMego"></img>
                    <div className="ml-3 datosMonto">
                        <h3 className="blue">Cupo Sugerido CoopMego: </h3>
                        <h2 className="strong blue">{
                            /*`${props.score.str_cupo_sugerido ? numberFormatMoney(props.score.str_cupo_sugerido) : "$ 0,00"}`}*/
                            `${cupoCoopmegoSimulacion ? numberFormatMoney(cupoCoopmegoSimulacion) : "$ 0,00"}`}
                        </h2>
                    </div>
                </div>

                {/*<img src="Imagenes/Cupo sugerido.svg"></img>*/}
                {/*    <div className="ml-3 datosMonto">*/}
                {/*        <h3 className="blue">Cupo Sugerido Coopmego: </h3>*/}
                {/*        <h2 className="strong blue">{`${props.score.str_cupo_sugerido ? Number(props.score.str_cupo_sugerido).toLocaleString('en-US') : Number('0.00').toLocaleString('en-US')}`}</h2>*/}
                {/*        */}{/*<h2 className="strong blue">{`${props.score.str_cupo_sugerido_ccopmego ? Number(props.score.str_cupo_sugerido_ccopmego).toLocaleString('en-US') : Number('0.00').toLocaleString('en-US')}`}</h2>*/}
                {/*    </div>*/}
            </div>
            <div className="info f-row mb-4 mt-4">
                <h3 className="strong">{props?.score?.response?.result?.identificacionTitular[0]?.nombreRazonSocial}</h3>
            </div>
            <div id="infoSocio" className="w-100">
                <Accordion contentReady={contentReadyScore} title="" rotate={estadoAccordionScore} loading={estadoLoadingScore} toggleAccordion={toggleAccordionScore}>
                    <div className="m-4 f-row">
                        <Item xs={1} sm={1} md={1} lg={1} xl={1}> </Item>
                        <Item xs={2} sm={2} md={2} lg={2} xl={2}> 
                            <div className="values mb-3">
                                <h2>Score:</h2>
                                <h2 className="strong">
                                    {props?.score?.response?.result?.scoreFinanciero[0]?.score ? props?.score?.response?.result?.scoreFinanciero[0]?.score : 0}
                                </h2>
                            </div>
                        </Item>
                        <Item xs={2} sm={2} md={2} lg={2} xl={2}></Item>
                        <Item xs={2} sm={2} md={2} lg={2} xl={2}>
                            <div className="values  mb-3">
                                <h2>Calificación:</h2>
                                <h2 className="strong">
                                    {props?.score?.response?.result?.modeloCoopmego[0]?.decisionModelo ? props?.score?.response?.result?.modeloCoopmego[0]?.decisionModelo : 'Sin datos'}
                                </h2>
                            </div>
                        </Item>
                        <Item xs={2} sm={2} md={2} lg={2} xl={2}></Item>
                        <Item xs={2} sm={2} md={2} lg={2} xl={2}>
                            <div className="values  mb-3">
                                <h2>Decisión:</h2>
                                <h2 className="strong ml-3">
                                    {props?.score?.response?.result?.modeloCoopmego[0]?.tipoDecision ? props?.score?.response?.result?.modeloCoopmego[0]?.tipoDecision : 'Sin datos'}
                                </h2>
                            </div>
                        </Item>
                        <Item xs={1} sm={1} md={1} lg={1} xl={1}> </Item>
                    </div>
                    <div className="mr-4 mb-4 ml-4 f-row">
                        <Item xs={5} sm={5} md={5} lg={5} xl={5}>
                            <h3 className="strong mb-3">Resultado de la calificación:</h3>
                            <div className="values  mb-3">
                                <h4>Ingresos</h4>
                                <h4 className="strong">
                                    {numberFormatMoney(props.informacionSocio.datosFinancieros.montoIngresos)}
                                </h4>
                            </div>
                            <div className="values  mb-3">
                                <h4>Egresos</h4>
                                <h4 className="strong">
                                    {numberFormatMoney(props.informacionSocio.datosFinancieros.montoEgresos)}
                                </h4>
                            </div>
                            <div className="values  mb-3">
                                <h4>Gasto financiero del titular como codeudor</h4>
                                <h4 className="strong">                
                                    {numberFormatMoney(props.informacionSocio.datosFinancieros.montoGastoFinaCodeudor)}
                                </h4>
                            </div>
                            <div className="values  mb-3">
                                <h4>Gasto Financiero</h4>
                                <h4 className="strong">                                 
                                    {props?.score?.response?.result?.gastoFinanciero[0]?.cuotaEstimadaTitular ? numberFormatMoney(props?.score?.response?.result?.gastoFinanciero[0]?.cuotaEstimadaTitular) : 0}
                                </h4>
                            </div>
                            <div className="values  mb-3">
                                <h4>Cupo solicitado</h4>
                                <h4 className="strong">
                                    {numberFormatMoney(props?.informacionSocio?.datosFinancieros?.montoSolicitado)}
                                </h4>
                            </div>    
                            <div className="values  mb-3">
                                <h4>Validador de ingresos</h4>
                                <h4 className="strong">
                                    {props?.score?.response?.result?.parametrosCapacidadPago[0]?.validadorIngreso}
                                </h4>
                            </div>
                            <div className="values  mb-3">
                                <h4>Fecha de evaluación</h4>
                                <h4 className="strong">
                                    {props?.score?.response?.result?.modeloCoopmego[0].fechaEvalucion ? dateFormat("dd-MMM-yyyy",props?.score?.response?.result?.modeloCoopmego[0]?.fechaEvalucion) : 'Sin datos'}
                                </h4>
                            </div>
                            <div className="values  mb-3">
                                <h4>Deuda como codeudor</h4>
                                <h4 className="strong">

                                </h4>
                            </div>   
                            <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} disabled={false} onClick={descargarReporte}>Descargar reporte</Button>
                        </Item>
                        <Item xs={2} sm={2} md={2} lg={2} xl={2}></Item>
                        <Item xs={5} sm={5} md={5} lg={5} xl={5}>
                            <h3 className="strong mb-3" >Detalle de deudas:</h3>
                            {props?.score?.response?.result?.deudaVigenteTotal.map((deuda,index) => {
                                return (
                                    <div key={index }>
                                        <h3 className="strong mb-1">{deuda.sistemaCrediticio === "Bancos" ? "Entidades Financieras" : deuda.sistemaCrediticio}</h3>
                                    <div>
                                        <div className="values">
                                                <h4 className="mb-2">Total deuda:</h4>
                                                <h4 className="strong mb-2">
                                                    {numberFormatMoney(deuda.totalDeuda)}
                                                </h4>
                                        </div>
                                            <div className="values">
                                                <h4 className="mb-2">Valor demanda judicial:</h4>
                                                <h4 className="strong mb-2">
                                                    {numberFormatMoney(deuda.valorDemandaJudicial)} 

                                                </h4>
                                        </div>
                                        <div className="values mb-1">
                                                <h4 className="mb-2">Valor por vencer:</h4>
                                                <h4 className="strong mb-2">
                                                    {numberFormatMoney(deuda.valorPorVencer)} 
                                                </h4>
                                        </div>
                                    </div>
                                </div>);
                            })
                            }

                        </Item>
                    </div>
                </Accordion>
                <DatosFinanDatosSocio
                    dataFinanciers={props.informacionSocio.datosFinancieros}
                    nuevoCupoSimulado={nuevoCupoSimuladoHandler}
                    gestion={props.gestion}
                    isCheckHabilitaRestaMonto={props.isCheckMontoRestaFinanciera}
                    setDatosFinancierosHij={props.setDatosFinancierosFunc}
                    isCkeckRestaGtosFinanHjo={props.isCkeckGtosFinancierosHandler}
                />
                {props.gestion === 'solicitud' &&
                    <Fragment>
                        <Accordion className="mt-3" title="Datos generales" rotate={estadoAccordionInfoSocio} loading={estadoLoadingInfoSocio} toggleAccordion={() => { getInfoAccordion(); }} contentReady={contentReadyInfoSocio}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                    <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "50%", paddingRight: "76px" }}>
                                        <div className="values  mb-3">
                                            <h4>Fecha de nacimiento</h4>
                                            <h4 className="strong">
                                                {infoSocio[0]?.str_fecha_nacimiento && 
                                                    dateFormat("dd-MMM-yyyy", infoSocio[0]?.str_fecha_nacimiento)
                                                }
                                            </h4>
                                        </div>
                                        {/*<div className="values mb-3">*/}
                                        {/*    <h4>Años reside en el pais</h4>*/}
                                        {/*    <h4 className="strong">*/}
                                        {/*        {`N/D`}*/}
                                        {/*    </h4>*/}
                                        {/*</div>*/}
                                        <div className="values mb-3">
                                            <h4>Nivel de educación</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_nivel_educacion}`}
                                            </h4>
                                        </div>

                                        <div className="values mb-3">
                                            <h4>Código de profesión</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_codigo_profesion}`}
                                            </h4>
                                        </div>

                                        <div className="values mb-3">
                                            <h4>Actividad</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_actividad_economica}`}
                                            </h4>
                                        </div>
                                        <div className="values mb-3">
                                            <h4>Ocupación</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_ocupacion}`}
                                            </h4>
                                        </div>
                                        <div className="values mb-3">
                                            <h4>Estado civil</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_estado_civil}`}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="m-2" style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                        <div className="values  mb-3">
                                            <h4>Nacionalidad</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_nacionalidad}`}
                                            </h4>
                                        </div>
                                        <div className="values mb-3">
                                            <h4>Sexo</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_sexo}`}
                                            </h4>
                                        </div>
                                        <div className="values mb-3">
                                            <h4>Sector</h4>
                                            <h4 className="strong">
                                                {`${dirDocimicilioSocio[0]?.str_dir_sector}`}
                                            </h4>
                                        </div>

                                        <div className="values mb-3">
                                            <h4>Subsector</h4>
                                            <h4 className="strong">
                                                {`${dirDocimicilioSocio[0]?.str_dir_barrio}`}
                                            </h4>
                                        </div>

                                        <div className="values mb-3">
                                            <h4>Tipo de persona</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_tipo_persona}`}
                                            </h4>
                                        </div>
                                        <div className="values mb-3">
                                            <h4>Medio de información</h4>
                                            <h4 className="strong">
                                                {`${infoSocio[0]?.str_medio_informacion}`}
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Accordion>

                        <Accordion className="mt-3" title="Medios de notificación" rotate={estadoMediosNotif} loading={estadoLoadingInfoSocio} toggleAccordion={() => { getInfoMediosNotif(); }} contentReady={contentReadyInfoSocio}>
                            <div className="m-2 w-50">
                                <div className="values mb-3">
                                    <h4>Celular</h4>
                                    <h4 className="strong">
                                        {`${props.informacionSocio.str_celular || ''}`}
                                    </h4>
                                </div>
                                <div className="values mb-3">
                                    <h4>Correo</h4>
                                    <h4 className="strong">
                                        {`${props.informacionSocio.str_email || ''}`}
                                    </h4>
                                </div>
                            </div>
                        </Accordion>
                        <Accordion className="mt-3" title="Información económica" rotate={estadoAccordionInfoEco} loading={estadoLoadingInfoEco} toggleAccordion={() => { getInfoEco(); }} contentReady={contentReadyInfoEco}>
                            <div className="f-row justify-content-center">
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
                                                        <td>
                                                            {numberFormatMoney(ingreso.dcm_valor)}
                                                        </td>
                                                    </tr>);
                                                })
                                            }
                                            {
                                                <tr key={998}>
                                                    <td>TOTAL</td>
                                                    <td>
                                                        <h4 className="strong">{numberFormatMoney(totalIngresos)}</h4>
                                                    </td>
                                                </tr>
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
                                                        <td>  {numberFormatMoney(egreso.dcm_valor)}</td>
                                                    </tr>);
                                                })
                                            }
                                            {
                                                <tr key={999}>
                                                    <td>TOTAL</td>
                                                    <td>
                                                        <h4 className="strong">{numberFormatMoney(totalEgresos)}</h4>
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Accordion>
                        <Accordion className="mt-3" title="Situación financiera CoopMego" rotate={estadoAccordionInfoFinan} loading={estadoLoadingInfoFinan} toggleAccordion={() => { getInfoFinan(); }} contentReady={contentReadyInfoFinan}>
                            <div className={"m-2"}>
                                <h3>Captaciones</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Número cta</th>
                                            <th>Tipo cta</th>
                                            <th>Valor disponible</th>
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
                                                    <td>{numberFormatMoney(valor.dcm_ahorro)}</td>
                                                    <td>{dateFormat("dd-MMM-yyyy", valor.dtt_fecha_movimiento)}</td>
                                                    <td>{valor.str_estado}</td>
                                                </tr>);
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className={"m-2"}>
                                <h3>Nivel de Riesgo Indirecto (Créditos históricos)</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Id.</th>
                                            <th>Tipo</th>
                                            <th>Operación</th>
                                            <th>Valor Aprobado</th>
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
                                                    <td>{numberFormatMoney(credito.dcm_monto_aprobado)}</td>
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
                        </Accordion>
                    </Fragment>
                }
            </div>
            <div id="comentarioGestion">
                <div className="tipoComentario mt-4 mb-4">
                    <Fragment>
                        
                        {props.gestion === 'prospeccion' && (
                            <>
                                <h3>Está interesado en adquirir la tarjeta de crédito</h3>
                                <Switch onChange={deseaTarjetaHandler} value={deseaTarjeta}></Switch>
                            </>
                        )
                    }

                    </Fragment>
                </div>
                {props.gestion === "prospeccion" && <div>
                    <h3 className="mb-2">Comentario de la gestión</h3>
                    {(deseaTarjeta === true && comentariosPositivos.length) > 0 &&
                        <Toggler
                            className={"responsiveToogle"}
                            selectedToggle={seleccionComentarioAfirma}
                            toggles={comentariosPositivos}>
                        </Toggler>
                    }
                    {(deseaTarjeta === false && comentariosNegativos.length > 0) &&
                        <Toggler
                            className={"responsiveToogle"}
                            selectedToggle={seleccionComentarioNega}
                            toggles={comentariosNegativos}>
                        </Toggler>
                    }
                </div>}
                <div className="mt-4">
                    <h3 className="mb-2">Comentario Adicional</h3>
                    <Textarea placeholder="Ej. Ingrese algún detalle" onChange={comentarioAdicionalHanlder} esRequerido={false} value={comentarioAdicional}
                       
                    controlAnchoTexArea={false}                    ></Textarea>
                </div>

            </div>
        </div>
    );
}

export default connect(mapStateToProps, {})(DatosSocio);