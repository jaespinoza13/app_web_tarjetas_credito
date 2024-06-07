import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useState } from "react";
import { validaCedula } from '../../js/utiles';
import Item from "../Common/UI/Item";
import { useEffect } from "react";


const RegistroCliente = (props) => {
    //Datos del cliente
    
    const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [montoIngresos, setMontoIngresos] = useState(0);
    const [montoEgresos, setMontoEgresos] = useState(0);
    const [montoGastosFinancieros, setMontoGastosFinancieros] = useState(0);

    const [nombresCliente, setNombresCliente] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [celularCliente, setCelularCliente] = useState("");
    const [correoCliente, setCorreoCliente] = useState("");
    const [isCkeckGtosFinancieros, setIsCkeckGtosFinancieros] = useState(false);
    //const [tipoDocumento, setTipoDocumento] = useState("C");
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
            //tipo_documento: tipoDocumento,
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
            //tipo_documento: tipoDocumento,
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
            //tipo_documento: tipoDocumento,
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
            //tipo_documento: tipoDocumento,
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
            //tipo_documento: tipoDocumento,
            documento: documento
        })
    }

    /*
    const tipoDocumentoHandler = (e) => {
        setTipoDocumento(e.target.value);
        props.datosIngresados({
            nombres: nombresCliente,
            apellidos: apellidoPaterno,
            celular: celularCliente,
            correo: correoCliente,
            tipo_documento: e.target.value,
            documento: documento
        })
    }*/


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


    //{
    //    props.paso === 0 &&
    //    <div className="f-col w-80">
    //        <label>Número de cédula</label>
    //        <Input type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={cedulaCliente} setValueHandler={setCedulaHandler}></Input>
    //    </div>
    //}

 

    const setMontoSolicitadoHandler = (value) => {
        setMontoSolicitado(Number(value));
        props.datosFinancieros({
            montoSolicitado: Number(value),
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastosFinancieros: montoGastosFinancieros
        })
    }

    const setMontoIngresosHandler = (value) => {
        setMontoIngresos(Number(value));
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: Number(value),
            montoEgresos: montoEgresos,
            montoGastosFinancieros: montoGastosFinancieros
        })
    }

    const setMontoEgresosHandler = (value) => {
        setMontoEgresos(Number(value));
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: Number(value),
            montoGastosFinancieros: montoGastosFinancieros
        })
    }

    const setMontoGastosFinancierosHandler = (value) => {
        setMontoGastosFinancieros(Number(value));
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastosFinancieros: Number(value)
        })
    }


    const CkeckGtosFinancierosHandler = (e) => {
        //console.log("CAMBIO DE CHECK", !isCkeckGtosFinancieros)

        setIsCkeckGtosFinancieros(!isCkeckGtosFinancieros);
        props.isCkeckGtosFinancierosHandler(!isCkeckGtosFinancieros);

    }

    useEffect(() => {
        //Habilita campo de gastos financieros
        //console.log("CAMBIO DE CHECK 2,", isCkeckGtosFinancieros)
        if (isCkeckGtosFinancieros === false) {
            setMontoGastosFinancieros("");
        }

    }, [isCkeckGtosFinancieros])


    useEffect(() => {
        console.log("DATOS CLIENTE, ",props.infoSocio)
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
                        <div className="f-col w-80">
                        <label>Número de cédula</label>
                        <Input type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={documento} setValueHandler={setCedulaHandler}></Input>
                        </div>

                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>

                </>
            }

        
            {props.paso === 1 &&
                <div>
                    <Item xs={11} sm={11} md={11} lg={11} xl={11} className="justify-content-center">
                <h2>Registro Datos del Cliente</h2>
                    
                    <Card>
                        <section className="elements_two_column">
                            <div>
                                <label>Cédula:</label>
                                    <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="1150216791" setValueHandler={documentoHandler} value={documento} disabled={true}></Input>
                                </div>
                            </div>

                                <div className='ml-1'>
                                <label>Nombres:</label>
                                <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. Luis Miguel" setValueHandler={nombresClienteHandler} value={nombresCliente}></Input>
                                </div>
                                
                            </div>


                            <div>
                                <label>Apellidos paterno:</label>
                                <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. Salazar" setValueHandler={apellidoPaternoHandler} value={apellidoPaterno}></Input>
                                </div>
                            </div>

                                <div className='ml-1'>
                                <label>Apellido materno:</label>
                                <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. Benitez" setValueHandler={apellidoMaternoHandler} value={apellidoMaterno}></Input>
                                </div>

                            </div>

                            {/*<div>*/}
                            {/*    <label>Tipo de documento:</label>*/}
                            {/*    <div className="f-row">*/}
                            {/*        <select className={'w-85'} defaultValue={'-1'} onChange={tipoDocumentoHandler} value={tipoDocumento}>*/}
                            {/*            <option value='-1' disabled={true} >Seleccione una opción</option>*/}
                            {/*            <option value='C' >Cédula</option>*/}
                            {/*            <option value='P' >Pasaporte</option>*/}
                            {/*            <option value='R' >Ruc</option>*/}
                            {/*        </select>*/}
                            {/*    </div>*/}

                            {/*</div>*/}

                           
                                                        
                            <div>
                                <label>Correo:</label>
                                <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. test@test.com" setValueHandler={correoClienteHandler} value={correoCliente}></Input>    
                                </div>

                                
                            </div>

                                <div className='ml-1'>
                                    <label>Celular:</label>
                                <div className="f-row">
                                        <Input className={'w-100'} type="text" placeholder="Ej. 0999999999" setValueHandler={celularClienteHandler} value={celularCliente}></Input>
                                </div>

                                
                            </div>
                                
                        </section>
                           
                    </Card>
                       
                   
                    <div className="mt-3 f-col">
                        <h2>Datos de Financieros</h2>
                        <Card className='mt-2'>
                            <section className="elements_two_column">
                                <div>
                                    <label>Ingresos</label>
                                    <div className="f-row">
                                        <h2 className='mr-2'>$</h2><Input className={'w-85'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoIngresosHandler} value={montoIngresos}></Input>
                                    </div>
                                </div>

                                <div>
                                        <label>Egresos</label>
                                    <div className="f-row">
                                        <h2 className='mr-2'>$</h2><Input className={'w-100'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoEgresosHandler} value={montoEgresos}></Input>
                                    </div>
                                </div>

                                <div>
                                        <div className="f-row">
                                            <Input type="checkbox" setValueHandler={CkeckGtosFinancierosHandler} checked={isCkeckGtosFinancieros} ></Input>
                                            <label className='ml-2'>Gtos. Financieros</label>
                                        </div>

                                    <div className="f-row">
                                            <h2 className='mr-2'>$</h2><Input className={'w-85'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoGastosFinancierosHandler} disabled={!isCkeckGtosFinancieros} value={montoGastosFinancieros}></Input>
                                    </div>
                                </div>

                                <div>
                                        <label>Cupo solicitado</label>
                                    <div className="f-row">
                                        <h2 className='mr-2'>$</h2><Input className={'w-100'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoSolicitadoHandler} value={montoSolicitado}></Input>
                                    </div>
                                </div>

                            </section>

                        </Card>
                        </div>
                    </Item> 
            </div>
            }

        </>
    );
}

export default RegistroCliente;