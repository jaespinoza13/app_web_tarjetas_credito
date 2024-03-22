import Accordion from "../Common/UI/Accordion";
import { Fragment, useState } from "react";
import { useDispatch } from 'react-redux';
import Item from "../Common/UI/Item";
import { fetchInfoSocio } from "../../services/RestServices";

const DatosSocio = (props) => {
    const dispatch = useDispatch();
    //Acordeon Score
    const [estadoAccordionScore, setEstadoAccordionScore] = useState(true);
    const [estadoLoadingScore, setEstadoLoadingScore] = useState(false);
    const [contentReadyScore, setContentReadyScore] = useState(true);
    //Acordeon InfoSocio
    const [estadoAccordionInfoSocio, setEstadoAccordionInfoSocio] = useState(false);
    const [estadoLoadingInfoSocio, setEstadoLoadingInfoSocio] = useState(false);
    const [contentReadyInfoSocio, setContentReadyInfoSocio] = useState(false);

    const [infoSocio, setInfoSocio] = useState([]);
    const [dirDocimicilioSocio, setDirDomicilioSocio] = useState([]);
    const [dirTrabajoSocio, setDirTrabajoSocio] = useState([]);

    const toggleAccordionScore = () => {
        setEstadoAccordionScore(!estadoAccordionScore);
        console.log(estadoAccordionScore)
    }

    const getInfoSocioHandler = () => {
        console.log(infoSocio.length);
        if (infoSocio.length > 0) {
            setEstadoAccordionInfoSocio(!estadoAccordionInfoSocio)
        } else {
            getInfoSocio();
        }
    }

    const getInfoSocio = async () => {

        setEstadoLoadingInfoSocio(true);
        await fetchInfoSocio("1105970717", props.token, (data) => {
            setDirDomicilioSocio([...data.lst_dir_domicilio]);
            setDirTrabajoSocio([...data.lst_dir_trabajo]);
            setInfoSocio([...data.datos_cliente]);
            setEstadoAccordionInfoSocio(true);
            setContentReadyInfoSocio(true);
        }, dispatch);
        setEstadoLoadingInfoSocio(false);
    }



    return (
        <div className="f-col">
            <div id="montoSugerido" className="f-col">
                <img></img>
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
                    <Accordion title="Score"></Accordion>
                    <Accordion title="Score"></Accordion>
                    <Accordion title="Score"></Accordion>
                    <Accordion title="Score"></Accordion>
                </Fragment>
            }
            </div>
            <div id="comentarioGestion"></div>
        </div>
    );
}

export default DatosSocio;