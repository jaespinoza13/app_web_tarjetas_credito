import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useState } from "react";
import { validaCedula } from '../../js/utiles';
import Item from "../Common/UI/Item";
import { useEffect } from "react";


const RegistroCliente = (props) => {
    //Datos del cliente

    const [nombresCliente, setNombresCliente] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [celularCliente, setCelularCliente] = useState("");
    const [correoCliente, setCorreoCliente] = useState("");
    const [documento, setDocumento] = useState("");

    //Estado validacion
    const [isCedulaValida, setIsCedulaValida] = useState(false);


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
            documento: documento
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
            documento: documento
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
            documento: documento
        })
    }

    const celularClienteHandler = (valor) => {
        setCelularCliente(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidos: apellidoPaterno,
            celular: valor,
            correo: correoCliente,
            documento: documento
        })
    }
    const correoClienteHandler = (valor) => {
        setCorreoCliente(valor);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidos: apellidoPaterno,
            celular: celularCliente,
            correo: valor,
            documento: documento
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
            //tipo_documento: tipoDocumento,
            documento: valor
        })
    }



    useEffect(() => {
        //console.log("DATOS CLIENTE, ", props.infoSocio)
        if (props.infoSocio && props.paso === 1) {
            setDocumento(props.infoSocio.cedula);
            setNombresCliente(props.infoSocio.nombres);
            setApellidoPaterno(props.infoSocio.apellidoPaterno);
            setApellidoMaterno(props.infoSocio.apellidoMaterno);
            setCelularCliente(props.infoSocio.celularCliente);
            setCorreoCliente(props.infoSocio.correoCliente);
        }
    }, [props.infoSocio, props.paso])


    return (
        <>
            {props.paso === 0 &&
                <>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                        <div className="f-col w-100">
                            <label>Número de cédula</label>
                            <Input type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={documento} setValueHandler={setCedulaHandler}></Input>
                        </div>
                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                </>
            }


            {props.paso === 1 &&
                <div className="f-row w-100">
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                        <h2>Registro Datos del Cliente</h2>
                        <Card>
                            <section>
                                <div className='mb-2'>
                                    <label>Cédula:</label>
                                    <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="1150216791" setValueHandler={documentoHandler} value={documento} disabled={true}></Input>
                                    </div>
                                </div>

                                <div className='mb-2'>
                                    <label>Nombres:</label>
                                    <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. Luis Miguel" setValueHandler={nombresClienteHandler} value={nombresCliente}></Input>
                                    </div>

                                </div>


                                <div className='mb-2'>
                                    <label>Apellidos paterno:</label>
                                    <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. Salazar" setValueHandler={apellidoPaternoHandler} value={apellidoPaterno}></Input>
                                    </div>
                                </div>

                                <div className='mb-2'>
                                    <label>Apellido materno:</label>
                                    <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. Benitez" setValueHandler={apellidoMaternoHandler} value={apellidoMaterno}></Input>
                                    </div>

                                </div>

                                <div className='mb-2'>
                                    <label>Correo:</label>
                                    <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. test@test.com" setValueHandler={correoClienteHandler} value={correoCliente}></Input>
                                    </div>


                                </div>

                                <div className='mb-2'>
                                    <label>Celular:</label>
                                    <div className="f-row">
                                        <Input className={'w-100'} type="number" placeholder="Ej. 0999999999" setValueHandler={celularClienteHandler} value={celularCliente} maxlength={"10"}></Input>
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