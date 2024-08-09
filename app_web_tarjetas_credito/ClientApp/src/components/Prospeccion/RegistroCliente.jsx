import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useState } from "react";
import { validaCedula, validarCorreo } from '../../js/utiles';
import Item from "../Common/UI/Item";
import { useEffect } from "react";
import Button from "../Common/UI/Button";


const RegistroCliente = (props) => {
    //Datos del cliente

    const [nombresCliente, setNombresCliente] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [celularCliente, setCelularCliente] = useState("");
    const [correoCliente, setCorreoCliente] = useState("");
    const [documento, setDocumento] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState(null);

    //Estado validacion
    const [isCedulaValida, setIsCedulaValida] = useState(false);
    const [isCorreoValido, setIsCorreoValido] = useState(false);
    const [isCelularValido, setIsCelularValido] = useState(false);
    const [isFechaNacValido, setFechaNacValido] = useState(false);
    const [maxLengthCedula, setMaxLengthCedula] = useState(10);

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
        setNombresCliente(valor);
        props.datosIngresados({
            nombres: valor,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoCliente,
            documento: documento,
            fechaNacimiento: (fechaNacimiento !== "undefined--undefined" && fechaNacimiento !== "") ? fechaNacimiento : ''
        })
    }
    const apellidoPaternoHandler = (valor) => {
        setApellidoPaterno(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: valor,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoCliente,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }

    const apellidoMaternoHandler = (valor) => {
        setApellidoMaterno(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: valor,
            celular: celularCliente,
            correo: correoCliente,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }

    const celularClienteHandler = (valor) => {
        setIsCelularValido(valor.length === 10)
        setCelularCliente(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: valor,
            correo: correoCliente,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }
    const correoClienteHandler = (valor) => {
        setIsCorreoValido(validarCorreo(valor))
        setCorreoCliente(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: valor,
            documento: documento,
            fechaNacimiento: fechaNacimiento
        })
    }

    const documentoHandler = (valor) => {
        setDocumento(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoCliente,
            documento: valor,
            fechaNacimiento: fechaNacimiento
        })
    }


    const fechaNacimientoHandler = (valor) => {        
        setFechaNacValido((valor.includes("undefined") || valor === null || valor === "" || valor === " ") ? true : false)
        setFechaNacimiento((!valor.includes("undefined") && valor !== null && valor !== "" && valor !== " ") ? valor : null)
        props.datosIngresados({
            nombres: nombresCliente,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            celular: celularCliente,
            correo: correoCliente,
            documento: documento,
            fechaNacimiento: (valor)
        })
    }
    

    useEffect(() => {
        window.scrollTo(0, 0);
        if (props.paso === 0) {
            let validezCedula = validaCedula(documento);
            setIsCedulaValida(validezCedula);
        }

        if (props.infoSocio && props.paso === 1) {
            setNombresCliente(props.infoSocio.nombres);
            //console.log("INFO SOC/CL ", props.infoSocio)

            setDocumento(props.infoSocio.cedula);
            setNombresCliente(props.infoSocio.nombres);
            setApellidoPaterno(props.infoSocio.apellidoPaterno);
            setApellidoMaterno(props.infoSocio.apellidoMaterno);
            setCelularCliente(props.infoSocio.celularCliente);
            setCorreoCliente(props.infoSocio.correoCliente);

            let partesFecha = props.infoSocio.fechaNacimiento.split('-');
            if (props.infoSocio.fechaNacimiento === null || props.infoSocio.fechaNacimiento === "" || props.infoSocio.fechaNacimiento === " ") {
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
    }, [props.infoSocio, props.paso])



    const atajosHandler = (event) => {
        if (event.key === 'Enter') {
            props.AtajoHandler(event, 'Enter');
        }
    };

    const updDatosHandler = () => {
        props.requiereActualizar(true)
    }

    return (
        <>
            {props.paso === 0 &&
                <div className={`f-row w-100 sliding-div ${props.isVisibleBloque ? 'visibleY' : 'hiddenY'}`}>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                        <div className="f-col w-100">
                            <h3>Número de cédula</h3>
                            <Input id="cedulaPaso1" type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={documento} setValueHandler={setCedulaHandler} keyDown={(e) => isCedulaValida ? atajosHandler(e) : ''} tabIndex={0} maxlength={maxLengthCedula}></Input>
                            {!isCedulaValida &&
                                <h4 className="ml-1 mt-1 strong">*Ingrese una cédula válida</h4>
                            }
                        </div>
                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
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
                                    <h3>Correo:</h3>
                                        <div className="f-row">
                                        <Input className={`w-100 ${isCorreoValido === true ? '' : 'no_valido'}`} type="text" placeholder="Ej. test@test.com" setValueHandler={correoClienteHandler} value={correoCliente}></Input>
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