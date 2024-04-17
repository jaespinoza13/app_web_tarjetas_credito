import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useState } from "react";
import { validaCedula } from '../../js/utiles';


const ValidacionSocio = (props) => {
    //Datos del socio
    const [cedulaSocio, setCedulaSocio] = useState("");
    const [montoSolicitado, setMontoSolicitado] = useState(0);

    const [nombresSocio, setNombresSocio] = useState("");
    const [apellidosSocio, setApellidosSocio] = useState("");
    const [celularSocio, setCelularSocio] = useState("");
    const [correoSocio, setCorreoSocio] = useState("");

    //Estado validacion
    const [isCedulaValida, setIsCedulaValida] = useState(false);


    const setCedulaHandler = (value) => {
        let validezCedula = validaCedula(value);
        console.log(validezCedula);
        setCedulaSocio(value);
        setIsCedulaValida(validezCedula);
        props.setCedulaSocio({
            valido: validezCedula,
            valor: value
        });
    }

    const setMontoSolicitadoHandler = (value) => {
        setMontoSolicitado(value);
        props.setMontoSolicitado(value);
    }

    const nombresSocioHandler = (valor) => {
        setNombresSocio(valor);
        props.datosIngresados({
            nombres: valor,
            apellidos: apellidosSocio,
            celular: celularSocio,
            correo: correoSocio
        })
    }
    const apellidosSocioHandler = (valor) => {
        setApellidosSocio(valor);
        props.datosIngresados({
        nombres: nombresSocio,
        apellidos: valor,
        celular: celularSocio,
        correo: correoSocio
        })
    }
    const celularSocioHandler = (valor) => {
        setCelularSocio(valor);
        props.datosIngresados({
        nombres: nombresSocio,
        apellidos: apellidosSocio,
        celular: valor,
        correo: correoSocio
        })
    }
    const correoSocioHandler = (valor) => {
        setCorreoSocio(valor);
        props.datosIngresados({
        nombres: nombresSocio,
        apellidos: apellidosSocio,
        celular: celularSocio,
        correo: valor
        })
    }

    return (
        <>
            {props.paso === 0 &&
                <div className="f-col w-80">
                    <label>Número de cédula</label>
                    <Input type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={cedulaSocio} setValueHandler={setCedulaHandler}></Input>
                </div>
            }
            {props.paso === 1 &&
            <div>
                <h2>Datos del Socio</h2>
                    {props.ingresoDatos ?
                        <Card>
                            <label>Nombres:</label>
                            <Input type="text" placeholder="Ej. Roberth Esteban" setValueHandler={nombresSocioHandler} value={nombresSocio}></Input>
                            <label>Apellidos:</label>
                            <Input type="text" placeholder="Ej. Torres Reyes" setValueHandler={apellidosSocioHandler}></Input>
                            <h2 className="mt-4 mb-3">Datos de contacto</h2>
                            <label>Correo:</label>
                            <Input type="text" placeholder="Ej. test@test.com" setValueHandler={correoSocioHandler}></Input>
                            <label>Número celular:</label>
                            <Input type="text" placeholder="Ej. 0999999999" setValueHandler={celularSocioHandler}></Input>
                        </Card>
                        : 
                        <Card>
                            <label>Nombres:</label>
                            <h4>{`${props.infoSocio.str_nombres} ${props.infoSocio.str_apellido_paterno} ${props.infoSocio.str_apellido_materno}`}</h4>
                            <hr className="dashed"></hr>
                            <label>Ente:</label>
                            <h4>{props.infoSocio.str_ente}</h4>
                            <hr className="dashed"></hr>
                            <label>Correo:</label>
                            <h4>{props.infoSocio.str_email}</h4>
                            <hr className="dashed"></hr>
                            <label>Número celular:</label>
                            <h3>{props.infoSocio.str_celular}</h3>
                        </Card>
                    }
                    <div className="f-col">
                        <h2>Cupo solicitado</h2>
                        <div className="f-row">
                            <h2>$</h2><Input type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoSolicitadoHandler} value={montoSolicitado}></Input>
                        </div>
                        
                    </div>
            </div>
            }

        </>
    );
}

export default ValidacionSocio;