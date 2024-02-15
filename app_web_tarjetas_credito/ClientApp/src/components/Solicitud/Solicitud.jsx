import { connect, useDispatch } from 'react-redux';
import '../../scss/main.css';
import '../../scss/components/solicitud.css';
import { useState, useEffect } from "react";
import { fetchValidacionSocio, fetchScore, fetchInfoSocio } from "../../services/RestServices";
import { IsNullOrWhiteSpace } from '../../js/utiles';
import Modal from '../Common/Modal/Modal';
import Sidebar from '../Common/Navs/Sidebar';
import Card from '../Common/Card';

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
    const [isBtnDisabled, setBtnDisabled] = useState(false);
    const [ciValido, setCiValido] = useState(true);
    const [isValidaciones, setIsValidaciones] = useState(false);
    const [isScore, setIsScore] = useState(false);
    const [score, setScore] = useState({});
    const [infoSocio, setInfoSocio] = useState([]);
    const [isInfoSocio, setIsInfoSocio] = useState(false);
    const [isModalVisible, setisModalVisible] = useState(false);
    const [isDatosSolicitud, setIsDatosSolicitud] = useState(false);
    const [lugarEntrega, setLugarEntrega] = useState();
    const [direccionEntrega, setDirecciónEntrega] = useState("");
    const [nombreTarjeta, setNombreTarjeta] = useState("");
    const [imprimeAutorizacion, setImprimeAutorizacion] = useState(false);
    const [isAutorizacion, setIsAutorizacion] = useState(false);
    const [autoriztionDoc, setAutorizacionDoc] = useState();

    const nombreTarjetaHnadler = (event) => {
        setNombreTarjeta(event.target.value);
    }

    const accionHandler = (e) => {
        setAccion(e.target.value);
        if (e.target.value === "prospeccion") {
            setBtnDisabled(false);
        }
    }

    const oficinaEntregaHandler = (event) => {
        setDirecciónEntrega(event.target.value);
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
        setImprimeAutorizacion(false);
        if (documento === "") {
            setCiValido(false);
            return;
        }
        await fetchValidacionSocio(documento, props.token, (data) => {
            setValidaciones([...data]);
        }, dispatch)
    }

    const closeModalHandler = () => {
        setisModalVisible(false);
    }

    useEffect(() => {
        if (isModalVisible === false) {
            setIsValidaciones(true);
            setIsInfoSocio(false);
            setIsScore(false);
        }
    }, [isModalVisible]);

    useEffect(() => {
        if (validaciones.length > 0) {
            setisModalVisible(true);
            setIsValidaciones(true);
            accionSiguienteHandler(validaciones);
            const isValidacionesOk = validaciones.some((validacion) => validacion.str_estado_alerta === "INCORRECTO");
            console.log(validaciones);
            const estadoAutorizacion = validaciones.find((validacion) => { return validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" })
            console.log(estadoAutorizacion);
            if (estadoAutorizacion.str_estado_alerta === "INCORRECTO") {
                setImprimeAutorizacion(true);
            }
            if (accion === 'solicitud')
                setBtnDisabled(isValidacionesOk);
            else
                setBtnDisabled(false);

        }
    }, [validaciones, accion]);

    useEffect(() => {
        console.log(score);
        if (score.str_res_codigo === "000") {
            setIsValidaciones(false);
            setIsScore(true);
        }
        else if (score.str_res_codigo === "010") {
            console.log("010");
            setAutorizacionDoc(true);
        }
        //else {

        //}
        
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
        if (isInfoSocio) {
            setIsInfoSocio(false);
            setIsDatosSolicitud(true);
        }
    }

    const lugarEntregaHandler = (event) => {
        console.log(event.target.value);
        setLugarEntrega(event.target.value);
    }

    return (<div className="content">
        <Sidebar></Sidebar>
        <div className="container_mg">
            <div className="consulta_buro">
                <Card>
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

                </Card>
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                validaciones.map((validacion) => {
                                    return (<tr key={validacion.str_nemonico}>
                                        <td>{validacion.str_descripcion_alerta}</td>
                                        <td>{validacion.str_estado_alerta === 'CORRECTO'
                                            ? <button className="btn_mg"><img src="/Imagenes/statusActive.png"></img></button>
                                            : <button className="btn_mg" title={validacion.str_descripcion_alerta}><img src="/Imagenes/statusBlocked.png"></img></button>
                                        }</td>
                                        <td>
                                            {(validacion.str_nemonico === "ALERTA_SOLICITUD_TC_005" && imprimeAutorizacion === true) &&
                                                <button className="btn_mg" onClick={getScoreSocioHandler}>
                                                    <img src="/Imagenes/printIcon.svg"></img>
                                                </button>
                                        }
                                        </td>
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
                        <input value={infoSocio[0].nombres} readOnly={true}></input>
                        <label>Apellido paterno:</label>
                        <input value={infoSocio[0].apellido_paterno} readOnly={true}></input>
                        <label>Apellido materno:</label>
                        <input value={infoSocio[0].apellido_materno} readOnly={true}></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: "20px" }}>
                            <label>Fecha de nacimiento:</label>
                            <input value={infoSocio[0].fecha_nacimiento} readOnly={true}></input>
                            <label>Años reside en el pais:</label>
                            <input value="N/D" readOnly={true}></input>
                            <label>Nivel de educación:</label>
                            <input value={infoSocio[0].nivel_educacion} readOnly={true}></input>
                            <label>Código de profesión:</label>
                            <input value={infoSocio[0].codigo_profesion} readOnly={true}></input>
                            <label>Actividad:</label>
                            <input value={infoSocio[0].actividad_economica} readOnly={true}></input>
                            <label>Ocupación:</label>
                            <input value={infoSocio[0].ocupacion} readOnly={true}></input>
                            <label>Estado civil:</label>
                            <input value={infoSocio[0].estado_civil} readOnly={true}></input>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                            <label>Nacionalidad:</label>
                            <input value={infoSocio[0].nacionalidad} readOnly={true}></input>
                            <label>Sexo:</label>
                            <input value={infoSocio[0].sexo === "M" ? "Masculino" : "Femenino"} readOnly={true}></input>
                            <label>Sector:</label>
                            <input value={infoSocio[0].sector} readOnly={true}></input>
                            <label>Subsector:</label>
                            <input value={infoSocio[0].subsector} readOnly={true}></input>
                            <label>Tipo de persona:</label>
                            <input value={infoSocio[0].tipo_persona} readOnly={true}></input>
                            <label>Medio de información:</label>
                            <input value={infoSocio[0].medio_informacion} readOnly={true}></input>
                            <label>Calificación de riesgo:</label>
                            <input value={infoSocio[0].calificacion_riesgo} readOnly={true}></input>
                        </div>
                    </div>

                </div>}
                {isDatosSolicitud && <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: "20px" }}>
                        <Card>
                            <h3>Opción de entrega:</h3>
                            <div>
                                <input type="radio" id="oficina" name="tipo_entrega" value="oficina" onChange={lugarEntregaHandler}></input>
                                <label htmlFor="oficina">Oficina:</label>
                                <input type="radio" id="domicilio" name="tipo_entrega" value="domicilio" onChange={lugarEntregaHandler}></input>
                                <label htmlFor="domicilio">Domicilio:</label>
                                <input type="radio" id="otro" name="tipo_entrega" value="otro" onChange={lugarEntregaHandler}></input>
                                <label htmlFor="otro">Otro:</label>
                            </div>
                            {lugarEntrega === "oficina" &&
                                <div>
                                    <select id="tipo_documento" onChange={oficinaEntregaHandler} value={direccionEntrega}>
                                        <option value="1">MATRIZ</option>
                                        <option value="2">SARAGURO</option>
                                        <option value="3">CATAMAYO</option>
                                        <option value="4">CARIAMANGA</option>
                                        <option value="5">ALAMOR</option>
                                        <option value="6">ZAMORA</option>
                                        <option value="7">CUENCA</option>
                                        <option value="8">AGENCIA NORTE</option>
                                        <option value="9">MACARA</option>
                                        <option value="10">AGENCIA SUR</option>
                                        <option value="11">AGENCIA YANTZAZA</option>
                                        <option value="12">BALSAS</option>
                                        <option value="13">CATACOCHA</option>
                                        <option value="14">SANTA ROSA</option>
                                        <option value="15">AGENCIA GUALAQUIZA</option>
                                        <option value="16">AGENCIA CUARTO CENTENARIO</option>
                                        <option value="17">AGENCIA ZUMBA</option>
                                        <option value="18">AGENCIA EL VALLE</option>
                                        <option value="19">AGENCIA MACHALA</option>
                                        <option value="20">AGENCIA EL EJIDO</option>
                                        <option value="21">AGENCIA LATACUNGA</option>
                                        <option value="22">AGENCIA SANTO DOMINGO</option>
                                    </select>
                                </div>
                            }
                            {lugarEntrega === "otro" && <div>
                                <label htmlFor="lugar_entrega">Ingrese el lugar de entrega</label>
                                <input type="text"></input>
                            </div>
                            }
                        </Card>
                        <Card>
                            <div>
                                <h3>Nombre para imprimir en la tarjeta:</h3>
                                <div>
                                    <input type="radio" name="nombre_tarjeta" value={`${infoSocio[0].nombres.split(" ")[0]} ${infoSocio[0].apellido_paterno}`} onChange={nombreTarjetaHnadler}></input>
                                    <label>{`${infoSocio[0].nombres.split(" ")[0]} ${infoSocio[0].apellido_paterno}`}</label>
                                    <input type="radio" name="nombre_tarjeta" value={`${infoSocio[0].nombres.split(" ")[1]} ${infoSocio[0].apellido_paterno}`} onChange={nombreTarjetaHnadler}></input>
                                    <label>{`${infoSocio[0].nombres.split(" ")[1]} ${infoSocio[0].apellido_paterno}`}</label>
                                </div>
                            </div>

                        </Card>
                        <Card>
                            <div>
                                <h3>Comentario del asesor:</h3>
                                <textarea name="comentario_asesor" placeholder="Ingrese su comentario..." cols="50" rows="4" res></textarea>
                            </div>

                        </Card>
                    </div>
                    </div>
                    
                }
            </Modal>

            {/*<ModalAlert*/}
            {/*    titleAlert={'Error'}*/}
            {/*    icon={'danger'}*/}
            {/*    oepnMidal={score.str_res_codigo !== "000" && score.str_res_codigo !=="010"}*/}
            {/*>*/}
            {/*</ModalAlert>*/}
            
        </div>
    </div>);

}

export default connect(mapStateToProps, {})(Solicitud);