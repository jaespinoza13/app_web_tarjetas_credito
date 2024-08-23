import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useState } from "react";
import { validaCedula, validarCorreo } from '../../js/utiles';
import Item from "../Common/UI/Item";
import { useEffect } from "react";
import Button from "../Common/UI/Button";
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import { fetchGetParametrosSistema } from "../../services/RestServices";
import { useDispatch } from "react-redux";
import { Fragment } from "react";
import SearchIcon from "@mui/icons-material/Search";

const RegistroCliente = (props) => {

    const dispatch = useDispatch();
    //Datos del cliente
    const [nombresCliente, setNombresCliente] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [celularCliente, setCelularCliente] = useState("");
    const [correoCliente, setCorreoCliente] = useState("");
    const [correoCompletoRespaldo, setCorreoCompletoRespaldo] = useState("");
    const [documento, setDocumento] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState(null);
    const [checkMostrarCorreoDominio, setCheckMostrarCorreoDominio] = useState(false);

    //Estado validacion
    const [isCedulaValida, setIsCedulaValida] = useState(false);
    const [isCorreoValido, setIsCorreoValido] = useState(false);
    const [isCelularValido, setIsCelularValido] = useState(false);
    const [isFechaNacValido, setFechaNacValido] = useState(false);
    const [maxLengthCedula, setMaxLengthCedula] = useState(10);

    //Dominios de correo
    const [lstDominiosCorreo, setLstDominiosCorreo] = useState([]);
    const [valorSelectDomCorreo, setValorSelectDomCorreo] = useState("-1");



    const setCedulaHandler = (value) => {
        let validezCedula = validaCedula(value);
        setDocumento(value);
        setIsCedulaValida(validezCedula);
        props.setCedulaSocio({
            valido: validezCedula,
            valor: value
        });
    }


    const nombresClienteHandler = (valor) => {
        let correoValidacion = correoHandlerValidador();
        setNombresCliente(valor);
        props.datosIngresados({
            nombres: valor,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoValidacion,
            documento: documento,
            fechaNacimiento: (fechaNacimiento !== "undefined--undefined" && fechaNacimiento !== "") ? fechaNacimiento : ''
        })
    }
    const apellidoPaternoHandler = (valor) => {
        let correoValidacion = correoHandlerValidador();
        setApellidoPaterno(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: valor,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoValidacion,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }

    const apellidoMaternoHandler = (valor) => {
        let correoValidacion = correoHandlerValidador();
        setApellidoMaterno(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: valor,
            celular: celularCliente,
            correo: correoValidacion,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }

    const celularClienteHandler = (valor) => {
        let correoValidacion = correoHandlerValidador();
        setIsCelularValido(valor.length === 10)
        setCelularCliente(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: valor,
            correo: correoValidacion,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }
    const correoClienteHandler = (valor) => {
        let correoTotal = valor;
        if (checkMostrarCorreoDominio === false && valorSelectDomCorreo !== '-1') {
            correoTotal += '@' + valorSelectDomCorreo;
        }

        setIsCorreoValido(validarCorreo(correoTotal))
        setCorreoCliente(correoTotal);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoTotal,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }

    const documentoHandler = (valor) => {
        let correoValidacion = correoHandlerValidador();
        setDocumento(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoValidacion,
            documento: valor,
            fechaNacimiento: fechaNacimiento
        })
    }

    const correoHandlerValidador = () => {
        let correo = correoCliente;
        if (checkMostrarCorreoDominio === false && valorSelectDomCorreo !== '-1') {
            return correo += '@' + valorSelectDomCorreo;
        } else {
            return correo;
        }
    }


    const fechaNacimientoHandler = (valor) => {
        let correoValidacion = correoHandlerValidador();
        setFechaNacValido((valor.includes("undefined") || valor === null || valor === "" || valor === " ") ? true : false)
        setFechaNacimiento((!valor.includes("undefined") && valor !== null && valor !== "" && valor !== " ") ? valor : null)
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoValidacion,
            documento: documento,
            fechaNacimiento: (valor)
        })
    }

    useEffect(() => {
        if (lstDominiosCorreo.length > 0 && correoCompletoRespaldo !== "") {
            validacionDominioCorreo(correoCompletoRespaldo);
        }
    }, [checkMostrarCorreoDominio, lstDominiosCorreo, correoCompletoRespaldo])

    const validacionDominioCorreo = (correoEvaluar) => {  

        if (checkMostrarCorreoDominio === true) {
            setCorreoCliente(correoEvaluar);
            setValorSelectDomCorreo("otro");
            return;
        }

        if (correoEvaluar.trim() !== "") {

            let userCorreo = correoEvaluar.split('@')[0];
            let dominioCorreo = correoEvaluar.split('@')[1];
            let validarExistenciaDominio = lstDominiosCorreo.some(item => item.valor.includes(dominioCorreo?.trim()));


            //console.log("correoCompletoRespaldo ", correoCompletoRespaldo)
            //console.log("correoInfo ", correoEvaluar)
            //console.log("dominioCorreo ", dominioCorreo)
            //console.log("validarExistenciaDominio ", validarExistenciaDominio)

            if (validarExistenciaDominio) {
                setCorreoCliente(userCorreo);
                setValorSelectDomCorreo(dominioCorreo);
            } else {
                //console.log("setValorSelectDomCorreo -1 ")
                setCorreoCliente(userCorreo);
                setValorSelectDomCorreo("otro");
            }

        } else {//Cuando es vacio
            //console.log("VACIO")
            setCorreoCliente(correoEvaluar)
        }

    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (props.paso === 0) {
            let validezCedula = validaCedula(documento);
            setIsCedulaValida(validezCedula);
        }

        if (props.infoSocio && props.paso === 1 && lstDominiosCorreo.length > 0) {
            setNombresCliente(props.infoSocio.nombres);
            //console.log("INFO SOC/CL ", props.infoSocio)

            setDocumento(props.infoSocio.cedula);
            setNombresCliente(props.infoSocio.nombres);
            setApellidoPaterno(props.infoSocio.apellidoPaterno);
            setApellidoMaterno(props.infoSocio.apellidoMaterno);
            setCelularCliente(props.infoSocio.celularCliente);
            setCorreoCompletoRespaldo(props?.infoSocio?.correoCliente ? props.infoSocio.correoCliente : '')
            //Validacion dominio correo
            if (!checkMostrarCorreoDominio) { //Sino corresponde dominio correo a los parametros se debe activar el checkMostrarCorreoDominio
                validacionDominioCorreo(props.infoSocio.correoCliente);
            }


            let partesFecha = props.infoSocio.fechaNacimiento?.split('-');
            if (props.infoSocio.fechaNacimiento === null || props.infoSocio.fechaNacimiento.trim() === "") {
                setFechaNacimiento(null);
                setFechaNacValido(false);
            }
            else if (partesFecha[0]?.length <= 2) {
                setFechaNacimiento(`${partesFecha[2]}-${partesFecha[0]}-${partesFecha[1]}`);
                setFechaNacValido(true);
            } else {
                setFechaNacimiento(props.infoSocio.fechaNacimiento);
                setFechaNacValido(true);
            }
            setIsCorreoValido(validarCorreo(props.infoSocio.correoCliente))
            setIsCelularValido(props.infoSocio.celularCliente.length === 10)

        }
    }, [props.infoSocio, props.paso, lstDominiosCorreo])


    useEffect(() => {
        consultarParametrosDominioCorreo();

        /*return () => {
            setCheckMostrarCorreoDominio(false);
            setIsCorreoValido(false);
            setIsCelularValido(false);
            setFechaNacValido(false);
        };*/
    }, [])


    const consultarParametrosDominioCorreo = async () => {
        await fetchGetParametrosSistema("DOMINIOS_CORREOS", props.token, (data) => {
            if (data.lst_parametros.length > 0) {
                let ParametrosEntregaTC = data.lst_parametros.map(dominio => ({
                    key: dominio.str_valor_ini,
                    valor: dominio.str_valor_ini,
                }));
                ParametrosEntregaTC.push({ key: "otro", valor: "otro dominio" })
                //console.log("DOMINIOS_CORREOS ", ParametrosEntregaTC)
                setLstDominiosCorreo(ParametrosEntregaTC)
            }
        }, dispatch)
    }


    const atajosHandler = (event) => {
        if (event.key === 'Enter') {
            props.AtajoHandler(event, 'Enter');
        }
    };

    const updDatosHandler = () => {
        props.requiereActualizar(true)
    }

    const cambioDominioCorreoHandler = (valor) => {
        if (valor === "otro") {
            setCheckMostrarCorreoDominio(true)
        } else {
            setCheckMostrarCorreoDominio(false)
        }
        setValorSelectDomCorreo(valor)
    }

    return (
        <>
            {props.paso === 0 &&
                <div className={`f-row w-100 sliding-div ${props.isVisibleBloque ? 'visibleY' : 'hiddenY'}`}>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3}></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div className="f-row w-100 justify-content-center mt-5">
                            <div className="f-col w-100 justify-content-center" style={{ maxWidth: "550px" }}>
                                <div className="f-row justify-content-center">
                                    <SearchIcon style={{ fontSize: 80, color: '#7ca4f4' }} />
                                </div>
                                <h3 className="f-row justify-content-center mb-3">Ingrese el número de identificación</h3>
                                <Input id="cedulaPaso1" type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={documento} setValueHandler={setCedulaHandler} keyDown={(e) => isCedulaValida ? atajosHandler(e) : ''} tabIndex={0} maxlength={maxLengthCedula}></Input>
                                {!isCedulaValida &&
                                    <h4 className="ml-1 mt-1 strong">*Ingrese una cédula válida</h4>
                                }
                            </div>
                        </div>
                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3}></Item>
                </div>
            }

            {props.paso === 1 &&
                <div className={`f-row w-100 sliding-div ${props.isVisibleBloque ? 'visibleX' : 'hiddenX'}`}>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                        <div className={"f-row w-100 justify-content-space-between mb-1"}>
                            <h2>Registro Datos del Socio</h2>
                            <Button className="btn_mg__auto" onClick={updDatosHandler}>
                                <img src="/Imagenes/refresh.svg" style={{ transform: "scaleX(-1)", width: "2.2rem" }} alt="Volver a consultar."></img>
                            </Button>

                        </div>
                        <Card>
                            <section>
                                <div className='mb-2'>
                                    <h3>Cédula:</h3>
                                    <div className="f-row">
                                        <Input id="cedula" className={`w-100`} type="number" placeholder="1150216791" setValueHandler={documentoHandler} value={documento} disabled={true}></Input>
                                    </div>
                                </div>

                                <div className='mb-2'>
                                    <h3>Nombres:</h3>
                                    <div className="f-row">
                                        <Input id="nombres" className={`w-100 ${nombresCliente !== "" ? '' : 'no_valido'}`} type="text" placeholder="Ej. Luis Miguel" setValueHandler={nombresClienteHandler} value={nombresCliente} controlMayusText={true}></Input>
                                    </div>

                                </div>

                                <div className='mb-2'>
                                    <h3>Primer Apellido:</h3>
                                    <div className="f-row">
                                        <Input id="apellido_paterno" className={`w-100 ${apellidoPaterno !== "" ? '' : 'no_valido'}`} type="text" placeholder="Ej. Salazar" setValueHandler={apellidoPaternoHandler} value={apellidoPaterno} controlMayusText={true}></Input>
                                    </div>
                                </div>

                                <div className='mb-2'>
                                    <h3>Segundo Apellido:</h3>
                                    <div className="f-row">
                                        <Input className={`w-100`} type="text" placeholder="Ej. Benitez" setValueHandler={apellidoMaternoHandler} value={apellidoMaterno} controlMayusText={true}></Input>
                                    </div>

                                </div>

                                <div className='mb-2'>
                                    <div className="f-row w-100 justify-content-space-between">
                                        <div className="">
                                            <h3>Correo:</h3>
                                        </div>
                                        {/*<div className="f-row">*/}
                                        {/*    <Input disabled={false} type="checkbox" checked={checkMostrarCorreoDominio} setValueHandler={() => setCheckMostrarCorreoDominio(!checkMostrarCorreoDominio)}></Input>*/}
                                        {/*    <h4 className="ml-1">Ingresar con otro correo</h4>*/}
                                        {/*</div>*/}
                                    </div>

                                    <div className="f-row w-100">
                                        {checkMostrarCorreoDominio.toString() }
                                    </div>

                                    <div className="f-row w-100 ">
                                        <div className="f-row w-60" >
                                            {checkMostrarCorreoDominio === true &&
                                                    <Input className={`w-100 ${isCorreoValido === true ? '' : 'no_valido'}`} type="text" placeholder="Ej. test@test.com" setValueHandler={correoClienteHandler} value={correoCliente}></Input>
                                       
                                            }
                                            {checkMostrarCorreoDominio === false &&
                                                <div className={`f-row w-100 justify-content-center align-content-center` }>
                                                    <input className={`w-95 ${correoCliente.trim() !== '' ? '' : 'no_valido'}`} type="text" value={correoCliente} placeholder="Ej. test@test.com" onChange={(e) => correoClienteHandler(e.target.value)} />
                                                    <AlternateEmailRoundedIcon
                                                        sx={{
                                                            fontSize: 21,
                                                            marginTop: 0.8,
                                                            marginRight: 0,
                                                            padding: 0
                                                        }}
                                                    ></AlternateEmailRoundedIcon>
                                                </div>
                                            }
                                            {/*<input className={`${correoCliente.trim() !== '' ? '' : 'no_valido'}`} type="text" style={{ paddingRight: "2.5rem" }} value={correoCliente} placeholder="Ej. test@test.com" onChange={(e) => correoClienteHandler(e.target.value)} />

                                

                                                {/*<span style={{ position: "absolute", display: "block", top: "0.2px", right: "0.02rem", userSelect: "none", backgroundColor: "#E9ECEF", borderRadius: "20px", padding: "0", margin: "0" }}>*/}
                                            {/*    <div style={{ paddingTop: "2.5px", paddingRight: "2px", paddingLeft: "2px" }}>*/}
                                            {/*    <AlternateEmailRoundedIcon*/}
                                            {/*        sx={{*/}
                                            {/*            fontSize: 20,*/}
                                            {/*            marginTop: 0,*/}
                                            {/*            padding: 0*/}
                                            {/*        }}*/}
                                            {/*        ></AlternateEmailRoundedIcon>*/}
                                            {/*    </div>*/}
                                            {/*</span>*/}
                                        </div>

                                        <div className="f-row w-40">

                                            {lstDominiosCorreo.length > 0 &&
                                                <select className={`w-100 ${valorSelectDomCorreo.trim() !== '-1' ? '' : 'no_valido'}`} style={{ height: "100%" }} disabled={false} onChange={(e) => cambioDominioCorreoHandler(e.target.value)} value={valorSelectDomCorreo}>
                                                    {lstDominiosCorreo.length > 0
                                                        && lstDominiosCorreo?.map((correo, index) => {
                                                            if (index === 0) {
                                                                return (
                                                                    <Fragment key={index} >
                                                                        <option disabled={true} value={"-1"}>Seleccione</option>
                                                                        <option value={correo.key}> {correo.valor}</option>
                                                                    </Fragment>
                                                                )
                                                            }
                                                            else {
                                                                return (<Fragment key={index} >
                                                                    <option value={correo.key}> {correo.valor}</option>
                                                                </Fragment>
                                                                )
                                                            }
                                                        })}
                                                </select>
                                            }


                                        </div>

                                    </div>






                                </div>

                                <div className='mb-2'>
                                    <h3>Celular:</h3>
                                    <div className="f-row">
                                        <Input className={`w-100 ${isCelularValido === true ? '' : 'no_valido'}`} type="number" placeholder="Ej. 0999999999" setValueHandler={celularClienteHandler} value={celularCliente} maxlength={10}></Input>
                                    </div>
                                </div>

                                <div className='mb-2'>
                                    <h3>Fecha Nacimiento:</h3>
                                    <div className="f-row">
                                        <Input className={`w-100 ${(fechaNacimiento !== "" && isFechaNacValido === true) ? '' : 'no_valido'}`} type="date" setValueHandler={fechaNacimientoHandler} value={fechaNacimiento} ></Input>
                                    </div>
                                </div>

                            </section>

                        </Card>



                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                </div>
            }
        </>
    );
}

export default RegistroCliente;