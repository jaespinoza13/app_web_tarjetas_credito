import { connect, useDispatch } from 'react-redux';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect } from "react";
import { fetchValidacionSocio, fetchScore, fetchInfoSocio } from "../../services/RestServices";
import { IsNullOrWhiteSpace } from '../../js/utiles';
import Modal from '../Common/Modal/Modal';
import Sidebar from '../Common/Navs/Sidebar';

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

function Solicitud(props) {
    const dispatch = useDispatch();
    const [accion, setAccion] = useState("solicitud");
    const [tipoDoc, setTipoDoc] = useState("C");
    const [documento, setDocumento] = useState("");
    const [validaciones, setValidaciones] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isBtnDisabled, setBtnDisabled] = useState(false);
    const [ciValido, setCiValido] = useState(true);
    const [isValidaciones, setIsValidaciones] = useState(false);
    const [isScore, setIsScore] = useState(false);
    const [score, setScore] = useState({});
    const [infoSocio, setInfoSocio] = useState([]);
    const [isInfoSocio, setIsInfoSocio] = useState(false);
    const [isModalVisible, setisModalVisible] = useState(false);



    const accionHandler = (e) => {
        setAccion(e.target.value);
        if (e.target.value === "prospeccion") {
            setBtnDisabled(false);
        }
    }

    const tipoDocHandler = (e) => {
        setTipoDoc(e.target.value);
    }

    const documentoHandler = (e) => {
        if (e.target.value.length < 10) {
            setCiValido(false);
        }
        else {
            setCiValido(true);
        }
        setDocumento(e.target.value);
    }
    const submitConsultaValidaciones = async (event) => {
        event.preventDefault();
        if (documento === "") {
            setCiValido(false);
            return;
        }
        await fetchValidacionSocio(documento, props.token, (data) => {
            setValidaciones([...data.cuerpo]);
        }, dispatch)
    }

    const closeModalHandler = () => {
        setisModalVisible(false);
    }

    useEffect(() => {
        if (openModal === false) {
            setIsInfoSocio(false);
            setIsValidaciones(true);
            setIsScore(false);
        }
    }, [openModal]);

    useEffect(() => {
        if (validaciones.length > 0) {
            setisModalVisible(true);
            setIsValidaciones(true);
            accionSiguienteHandler(validaciones);
            const isValidacionesOk = validaciones.some((validacion) => validacion.str_estado_alerta === "------");
            console.log(isValidacionesOk);
            if (accion === 'solicitud')
                setBtnDisabled(isValidacionesOk);
            else
                setBtnDisabled(false);

        }
    }, [validaciones]);

    useEffect(() => {
            console.log(score);
        if (score.str_res_codigo === "000") {
            setIsValidaciones(false);
            setIsScore(true);
        }
        
    }, [score]);

    useEffect(() => {
        if (infoSocio.length > 0) {
            setIsScore(false);
            setIsInfoSocio(true);
        }
    }, [infoSocio]);

    const accionSiguienteHandler = (validaciones) => {
        var isValidacionOk;
        isValidacionOk = validaciones.find((validacion) => validacion.str_estado_alerta !== "OK");
        if (accion === "solicitud" && isValidacionOk) {
            setBtnDisabled(true);
            console.log("lo desactiva");
        }
        else {
            console.log("no lo desactiva");
        }
    }

    const getScoreSocioHandler = async () => {
        console.log(isValidaciones, isScore);

        if (isValidaciones) {
            console.log("ejecuta isVlidaciones");
            await fetchScore(tipoDoc, documento, props.token, (data) => {
                console.log(data);
                setScore(data);
            }, dispatch);
        }
        if (isScore) {
            console.log("ejecuta isScore");
            await fetchInfoSocio(documento, props.token, (data) => {
                console.log(data);
                setInfoSocio([...data.datos_cliente]);
            }, dispatch)
        }
    }

    return (<div className="content">
        <Sidebar></Sidebar>
        <div className="container_mg">
            <div className="consulta_buro">
                <form className="form_mg form_mg__md" onSubmit={submitConsultaValidaciones}>
                    <div className="form_mg__item form_mg__item_row">

                        <label htmlFor="username" className="pbmg1">Ingrese documento</label>
                        <input className={`${!ciValido && 'no_valido'}`} tabIndex="1" type="number" name="username" placeholder="Número de cédula" id="username" autoComplete="off" onChange={documentoHandler} />

                        <label htmlFor="tipo_accion">Seleccione acción...</label>
                        <select tabIndex="1" id="tipo_accion" onChange={accionHandler}>
                            <option value="solicitud">Solicitud</option>
                            <option value="prospeccion">Prospección</option>
                        </select>

                        <label htmlFor="tipo_documento">Seleccione tipo documento...</label>
                        <select tabIndex="2" id="tipo_documento" onChange={tipoDocHandler} value={tipoDoc}>
                            <option value="C">Cédula</option>
                            <option value="R">R.U.C</option>
                            <option value="P">Pasaporte</option>
                        </select>

                    </div>
                    <button className="btn_mg btn_mg__primary">Siguiente</button>

                </form>
            </div>
            <div id="listado_solicitudes">
                <table>
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre solicitante</th>
                            <th>Producto TC</th>
                            <th>Monto</th>
                            <th>Calificación</th>
                            <th>Estado</th>
                            <th>Oficina Crea</th>
                            <th>Oficial</th>
                            <th>Usuario</th>
                            <th>Fecha modificación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1106546468</td>
                            <td>Edison José Villamagua Mendieta</td>
                            <td>Black</td>
                            <td>$3600</td>
                            <td>OK</td>
                            <td>Aprobada</td>
                            <td>Matriz</td>
                            <td>xnojeda</td>
                            <td>xnojeda</td>
                            <td>09/01/2023</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>1186549865</td>
                            <td>Janeth del Cisne Lojan</td>
                            <td>Black</td>
                            <td>$3600</td>
                            <td>OK</td>
                            <td>Aprobada</td>
                            <td>Matriz</td>
                            <td>xnojeda</td>
                            <td>xnojeda</td>
                            <td>09/01/2023</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/*{openModal &&*/}
            {/*    <Modal>*/}
            {/*        {isValidaciones && <div>*/}
            {/*            <table>*/}
            {/*                <thead>*/}
            {/*                    <tr>*/}
            {/*                        <th>Validación</th>*/}
            {/*                        <th>Estado</th>*/}
            {/*                    </tr>*/}
            {/*                </thead>*/}
            {/*                <tbody>*/}
            {/*                    {*/}
            {/*                        validaciones.map((validacion) => {*/}
            {/*                            return (<tr key={validacion.str_descripcion_alerta}>*/}
            {/*                                <td>{validacion.str_descripcion_alerta}</td>*/}
            {/*                                <td>{validacion.str_estado_alerta}</td>*/}
            {/*                            </tr>);*/}
            {/*                        })*/}
            {/*                    }*/}
            {/*                </tbody>*/}
            {/*            </table>*/}
            {/*        </div>}*/}
            {/*        {isScore && <div>*/}
            {/*            {score.response.result.identificacionTitular &&*/}
            {/*                <div style={{ display: 'flex', flexDirection:'column' }}>*/}
            {/*                    <label htmlFor="">Nombre:</label>*/}
            {/*                    <input name="nombre" type="text" value={score.response.result.identificacionTitular[0]?.nombreRazonSocial} disabled={true}></input>*/}
            {/*                    <label htmlFor="score">Score:</label>*/}
            {/*                    <input name="score" type="text" value={score.response.result && score.response.result.scoreFinanciero && score.response.result.scoreFinanciero[0] && score.response.result.scoreFinanciero[0].score ? score.response.result.scoreFinanciero[0].score : 800} disabled={true}></input>*/}
            {/*                    <label htmlFor="name">Detalle de deudas:</label>*/}
            {/*                    {score.response.result.deudaVigenteTotal.map((deuda) => {*/}
            {/*                        return (<div>*/}
            {/*                            <label>{deuda.sistemaCrediticio}</label>*/}
            {/*                            <div>*/}
            {/*                                <div>*/}
            {/*                                    <label>Total deuda:</label>*/}
            {/*                                    <input value={deuda.totalDeuda}></input>*/}
            {/*                                    <label>Valor demanda judicial:</label>*/}
            {/*                                    <input value={deuda.valorDemandaJudicial}></input>*/}
            {/*                                    <label>Valor por vencer:</label>*/}
            {/*                                    <input value={deuda.valorPorVencer}></input>*/}
            {/*                                </div>*/}
            {/*                            </div>                                    */}
            {/*                        </div>);*/}
            {/*                        })*/}
            {/*                    }*/}
            {/*                </div>*/}
                        
            {/*            }*/}
                    
            {/*        </div>}*/}
            {/*        {isInfoSocio && <div style={{ display: "flex", flexDirection: "column" }}>*/}
            {/*            <div style={{ display: "flex", flexDirection: "row", alignSelf:"center" }}>*/}
            {/*                <label>Nombres:</label>*/}
            {/*                <input value={infoSocio[0].nombres}></input>*/}
            {/*                <label>Apellido paterno:</label>*/}
            {/*                <input value={infoSocio[0].apellido_paterno}></input>*/}
            {/*                <label>Apellido materno:</label>*/}
            {/*                <input value={infoSocio[0].apellido_materno}></input>*/}
            {/*            </div>*/}
            {/*            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>*/}
            {/*                <div style={{ display: "flex", flexDirection: "column", width: "50%", marginRight:"20px" }}>*/}
            {/*                    <label>Fecha de nacimiento:</label>*/}
            {/*                    <input value={infoSocio[0].fecha_nacimiento}></input>*/}
            {/*                    <label>Años reside en el pais:</label>*/}
            {/*                    <input value="N/D"></input>*/}
            {/*                    <label>Nivel de educación:</label>*/}
            {/*                    <input value={infoSocio[0].nivel_educacion}></input>*/}
            {/*                    <label>Código de profesión:</label>*/}
            {/*                    <input value={infoSocio[0].codigo_profesion}></input>*/}
            {/*                    <label>Actividad:</label>*/}
            {/*                    <input value={infoSocio[0].actividad_economica}></input>*/}
            {/*                    <label>Ocupación:</label>*/}
            {/*                    <input value={infoSocio[0].ocupacion}></input>*/}
            {/*                    <label>Estado civil:</label>*/}
            {/*                    <input value={infoSocio[0].estado_civil}></input>*/}
            {/*                </div>*/}
            {/*                <div style={{ display: "flex", flexDirection: "column", width:"50%" }}>*/}
            {/*                    <label>Nacionalidad:</label>*/}
            {/*                    <input value={infoSocio[0].nacionalidad}></input>*/}
            {/*                    <label>Sexo:</label>*/}
            {/*                    <input value={infoSocio[0].sexo === "M" ? "Masculino" : "Femenino"} ></input>*/}
            {/*                    <label>Sector:</label>*/}
            {/*                    <input value={infoSocio[0].sector}></input>*/}
            {/*                    <label>Subsector:</label>*/}
            {/*                    <input value={infoSocio[0].subsector}></input>*/}
            {/*                    <label>Tipo de persona:</label>*/}
            {/*                    <input value={infoSocio[0].tipo_persona}></input>*/}
            {/*                    <label>Medio de información:</label>*/}
            {/*                    <input value={infoSocio[0].medio_informacion}></input>*/}
            {/*                    <label>Calificación de riesgo:</label>*/}
            {/*                    <input value={infoSocio[0].calificacion_riesgo}></input>*/}
            {/*                </div>*/}
            {/*            </div>*/}
                    
            {/*        </div>}*/}
            {/*        <button className="btn_mg btn_mg__secondary" onClick={closeModalHandler} >Cerrar</button>*/}
            {/*        <button className="btn_mg btn_mg__primary" disabled={isBtnDisabled} onClick={getScoreSocioHandler}>Siguiente</button>*/}
            {/*    </Modal>*/}

            <Modal
                modalIsVisible={isModalVisible}
                titulo={`${accion.charAt(0).toUpperCase() + accion.slice(1)} de tarjeta de crédito`}
                onNextClick={getScoreSocioHandler}
                onCloseClick={closeModalHandler}
                isBtnDisabled={isBtnDisabled}>
                {isValidaciones && <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Validación</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                validaciones.map((validacion) => {
                                    return (<tr key={validacion.str_descripcion_alerta}>
                                        <td>{validacion.str_descripcion_alerta}</td>
                                        <td>{validacion.str_estado_alerta}</td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>}
                {isScore && <div>
                    {score.response.result.identificacionTitular &&
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="">Nombre:</label>
                            <input name="nombre" type="text" value={score.response.result.identificacionTitular[0]?.nombreRazonSocial} disabled={true}></input>
                            <label htmlFor="score">Score:</label>
                            <input name="score" type="text" value={score.response.result && score.response.result.scoreFinanciero && score.response.result.scoreFinanciero[0] && score.response.result.scoreFinanciero[0].score ? score.response.result.scoreFinanciero[0].score : 800} disabled={true}></input>
                            <label htmlFor="name">Detalle de deudas:</label>
                            {score.response.result.deudaVigenteTotal.map((deuda) => {
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

                    }

                </div>}
                {isInfoSocio && <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "row", alignSelf: "center" }}>
                        <label>Nombres:</label>
                        <input value={infoSocio[0].nombres} readOnly="true"></input>
                        <label>Apellido paterno:</label>
                        <input value={infoSocio[0].apellido_paterno} readOnly="true"></input>
                        <label>Apellido materno:</label>
                        <input value={infoSocio[0].apellido_materno} readOnly="true"></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: "20px" }}>
                            <label>Fecha de nacimiento:</label>
                            <input value={infoSocio[0].fecha_nacimiento} readOnly="true"></input>
                            <label>Años reside en el pais:</label>
                            <input value="N/D" readOnly="true"></input>
                            <label>Nivel de educación:</label>
                            <input value={infoSocio[0].nivel_educacion} readOnly="true"></input>
                            <label>Código de profesión:</label>
                            <input value={infoSocio[0].codigo_profesion} readOnly="true"></input>
                            <label>Actividad:</label>
                            <input value={infoSocio[0].actividad_economica} readOnly="true"></input>
                            <label>Ocupación:</label>
                            <input value={infoSocio[0].ocupacion} readOnly="true"></input>
                            <label>Estado civil:</label>
                            <input value={infoSocio[0].estado_civil} readOnly="true"></input>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                            <label>Nacionalidad:</label>
                            <input value={infoSocio[0].nacionalidad} readOnly="true"></input>
                            <label>Sexo:</label>
                            <input value={infoSocio[0].sexo === "M" ? "Masculino" : "Femenino"} readOnly="true"></input>
                            <label>Sector:</label>
                            <input value={infoSocio[0].sector} readOnly="true"></input>
                            <label>Subsector:</label>
                            <input value={infoSocio[0].subsector} readOnly="true"></input>
                            <label>Tipo de persona:</label>
                            <input value={infoSocio[0].tipo_persona} readOnly="true"></input>
                            <label>Medio de información:</label>
                            <input value={infoSocio[0].medio_informacion} readOnly="true"></input>
                            <label>Calificación de riesgo:</label>
                            <input value={infoSocio[0].calificacion_riesgo} readOnly="true"></input>
                        </div>
                    </div>

                </div>}
            </Modal>
            
        </div>
    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);