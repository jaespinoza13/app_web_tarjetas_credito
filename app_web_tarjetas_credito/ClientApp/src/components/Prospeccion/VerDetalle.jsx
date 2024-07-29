import "../../css/Components/DatosSocio.css";
import Accordion from "../Common/UI/Accordion";
import { Fragment, useState } from "react";
import { useDispatch, connect } from 'react-redux';
import Item from "../Common/UI/Item";
import {  fetchInfoEconomica, fetchGetInfoFinan, fetchReporteAval, fetchValidacionSocio, fetchScore } from "../../services/RestServices";
import Switch from "../Common/UI/Switch";
import Toggler from "../Common/UI/Toggler";
import Textarea from "../Common/UI/Textarea";
import Button from "../Common/UI/Button";
import { IsNullOrWhiteSpace, base64ToBlob, descargarArchivo, generarFechaHoy, numberFormatMoney, verificarPdf } from "../../js/utiles";
import { useEffect } from "react";
import { get } from "../../js/crypt";

//TODO PENDIENTE TRAER INFORMACION DE DATOS FINANCIEROS Y OROS



const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data
    };
};



const DatosSocio = (props) => {
    const dispatch = useDispatch();

    const [informacionSocio, setInformacionSocio] = useState([]);
    const [score, setScore] = useState("");
    const [datosUsuario, setDatosUsuario] = useState([]);


    const consultarInformacionGeneral = () => {
        fetchValidacionSocio(props.cedulaSocio, '', props.token, (data) => {
            setInformacionSocio(data);

            //Consultar al buro
            dataBuro(props.cedulaSocio, data.str_nombres + " " + data.str_apellido_paterno + " " + data.str_apellido_materno);

        }, dispatch);

    }


    const dataBuro = async (cedula, nombreCompletoSocio) => {
        //TODO CAMBIAR CEDULA REVISAR SI QUEDA CEDULA
        await fetchScore("C", "1150214375", nombreCompletoSocio, datosUsuario[0].strUserOficial, datosUsuario[0].strOficial, datosUsuario[0].strCargo, props.token, (data) => {
            setScore(data);

            //TODO VALIDAR  CAMPO capacidadPago
            //setCupoSugeridoAval(data.response.result?.capacidadPago[0].cupoSugerido.toString());
//Se captura la calificacion que retorna de la consulta al buro
            //setCalificacionRiesgo(data.response.result.modeloCoopmego[0].decisionModelo)
            

        }, dispatch);

    }




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
    const [comentarioAdicional, setComentarioAdicional] = useState("");



    //InfoFinanciera
    const [dpf, setDpf] = useState([]);
    const [creditosHis, setCreditosHis] = useState([]);

    //Filas del text Area comentarioAdicional

    const toggleAccordionScore = () => {
        setEstadoAccordionScore(!estadoAccordionScore);
    }

    const comentarioAdicionalHanlder = (e) => {
        setComentarioAdicional(e);
        props.onComentarioAdic(e);
    }



   

    const getInfoFinan = () => {
          setEstadoLoadingInfoFinan(true);
        if (!contentReadyInfoFinan && dpf.length === 0) {
            fetchGetInfoFinan(informacionSocio.str_ente, props.token, (data) => {
                setDpf(...[data.lst_dep_plazo_fijo]);
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



    useEffect(() => {
        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));

        const userOficial = get(localStorage.getItem('sender'));
        const userOficina = get(localStorage.getItem('office'));
        setDatosUsuario([{ strCargo: strRol, strOficial: strOficial, strUserOficial: userOficial, strUserOficina: userOficina }]);

        setComentarioAdicional(props.comentarioAdicionalValor);
        consultarInformacionGeneral();
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

    return (
        <div className="f-col w-100">
            <div id="montoSugerido" className="f-row w-100 ">
                <div className="f-row justify-content-center align-content-center">
                    <img src="Imagenes/Cupo sugerido.svg" width="10%" alt="Cupo sugerido Aval"></img>
                    <div className="ml-3 datosMonto">
                        <h3 className="blue">Cupo Sugerido Aval:</h3>
                        <h2 className="strong blue">{`  
                        ${score?.response?.result?.capacidadPago[0]?.cupoSugerido ?
                                numberFormatMoney(score.response.result.capacidadPago[0].cupoSugerido) : "$ 0,00"}`}
                        </h2>
                    </div>
                </div>
                <div className="f-row justify-content-center align-content-center">
                    <img src="Imagenes/Cupo sugerido.svg" width="10%" alt="Cupo sugerido CoopMego"></img>
                    <div className="ml-3 datosMonto">
                        <h3 className="blue">Cupo Sugerido CoopMego: </h3>
                        <h2 className="strong blue">{
                            `${score.str_cupo_sugerido ? numberFormatMoney(score.str_cupo_sugerido) : "$ 0,00"}`}   
                        </h2>

                    </div>
                </div>


            </div>
            <div className="info f-row mb-4 mt-4">
                <h3 className="strong">{score.response.result.identificacionTitular[0]?.nombreRazonSocial}</h3>
            </div>
            <div id="infoSocio" className="w-100">
                <Accordion contentReady={contentReadyScore} title="Score" rotate={estadoAccordionScore} loading={estadoLoadingScore} toggleAccordion={toggleAccordionScore}>
                    <div className="m-4 f-row">
                        <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <h4 className="strong mb-3">Resultado de la calificación</h4>
                            <div className="values  mb-3">
                                <h5>Ingresos</h5>
                                <h5 className="strong">
                                {/*    {`$ ${Number(informacionSocio.datosFinancieros.montoIngresos)?.toLocaleString("en-US")}`}*/}
                                    {numberFormatMoney(informacionSocio.datosFinancieros.montoIngresos)}

                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Egresos</h5>
                                <h5 className="strong">
                                    {numberFormatMoney(informacionSocio.datosFinancieros.montoEgresos)}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Resta Gasto Financiero</h5>
                                <h5 className="strong"> 
                                    {numberFormatMoney(informacionSocio.datosFinancieros.montoRestaGstFinanciero)}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Cupo solicitado</h5>
                                <h5 className="strong">
                                    {numberFormatMoney(informacionSocio.datosFinancieros.montoSolicitado)}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Cupo Sugerido Aval</h5>
                                <h5 className="strong">
                                    {numberFormatMoney(score.response.result.capacidadPago[0].cupoSugerido)}
                                </h5>
                            </div>
                            <div className="values  mb-3">
                                <h5>Score</h5>
                                <h5 className="strong">
                                    {score.response.result && score.response.result.scoreFinanciero && score.response.result.scoreFinanciero[0] && score.response.result.scoreFinanciero[0].score ? score.response.result.scoreFinanciero[0].score : 0}
                                </h5>
                            </div>
                            <Button className={["btn_mg btn_mg__primary mt-2 mr-2"]} disabled={false} onClick={descargarReporte}>Descargar reporte</Button>
                        </Item>
                        <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <h4 className="strong mb-3" >Detalle de deudas:</h4>
                            {score.response.result.deudaVigenteTotal.map((deuda,index) => {
                                return (
                                    <div key={index }>
                                    <h3 className="strong">{deuda.sistemaCrediticio}</h3>
                                    <div>
                                        <div className="values">
                                            <h5>Total deuda:</h5>
                                                <h5 className="strong">
                                                    {numberFormatMoney(deuda.totalDeuda)}
                                                </h5>
                                        </div>
                                        <div className="values">
                                            <h5>Valor demanda judicial:</h5>
                                                <h5 className="strong">
                                                    {numberFormatMoney(deuda.valorDemandaJudicial)} 

                                                </h5>
                                        </div>
                                        <div className="values">
                                            <h5>Valor por vencer:</h5>
                                                <h5 className="strong">
                                                    {numberFormatMoney(deuda.valorPorVencer)} 
                                                </h5>
                                        </div>
                                    </div>
                                </div>);
                            })
                            }

                        </Item>
                    </div>
                </Accordion>
                
            </div>

            {/*<div id="comentarioGestion">*/}
            {/*    <div className="tipoComentario mt-4 mb-4">*/}
            {/*        <Fragment>*/}
                        
            {/*            {props.gestion === 'prospeccion' && (*/}
            {/*                <>*/}
            {/*                    <h3>Está interesado en adquirir la tarjeta de crédito</h3>*/}
            {/*                    <Switch onChange={deseaTarjetaHandler} value={deseaTarjeta}></Switch>*/}
            {/*                </>*/}
            {/*            )*/}
            {/*        }*/}

            {/*        </Fragment>*/}
            {/*    </div>*/}
            {/*    {props.gestion === "prospeccion" && <div>*/}
            {/*        <h3 className="mb-2">Comentario de la gestión</h3>*/}
            {/*        {deseaTarjeta &&*/}
            {/*            <Toggler*/}
            {/*                selectedToggle={seleccionComentarioAfirma}*/}
            {/*                toggles={comentariosPositivos}>*/}
            {/*            </Toggler>*/}
            {/*        }*/}
            {/*        {deseaTarjeta ||*/}
            {/*            <Toggler*/}
            {/*                selectedToggle={seleccionComentarioNega}*/}
            {/*                toggles={comentariosNegativos}>*/}
            {/*            </Toggler>*/}
            {/*        }*/}
            {/*    </div>}*/}
            {/*    <div className="mt-4">*/}
            {/*        <h3 className="mb-2">Comentario Adicional</h3>*/}
            {/*        <Textarea placeholder="Ej. Ingrese algún detalle" onChange={comentarioAdicionalHanlder} esRequerido={false} value={comentarioAdicional}*/}
            {/*            rows={filasTextAreaComentarioAd }></Textarea>*/}
            {/*    </div>*/}

            {/*</div>*/}
        </div>
    );
}

export default connect(mapStateToProps, {})(DatosSocio);