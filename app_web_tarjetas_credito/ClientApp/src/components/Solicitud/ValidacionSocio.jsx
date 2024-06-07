import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useEffect, useState } from "react";
import { validaCedula } from '../../js/utiles';
import Item from "../Common/UI/Item";


const ValidacionSocio = (props) => {
    //Datos del socio
    const [cedulaSocio, setCedulaSocio] = useState("");
    const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [montoIngresos, setMontoIngresos] = useState(3000);
    const [montoEgresos, setMontoEgresos] = useState(1000);
    const [montoGastosFinancieros, setMontoGastosFinancieros] = useState("");

    const [nombresSocio, setNombresSocio] = useState("");
    const [apellidosSocio, setApellidosSocio] = useState("");
    const [celularSocio, setCelularSocio] = useState("");
    const [correoSocio, setCorreoSocio] = useState("");

    const [isCkeckGtosFinancieros, setIsCkeckGtosFinancieros] = useState(false);

    //Estado validacion
    const [isCedulaValida, setIsCedulaValida] = useState(false);


    const setCedulaHandler = (value) => {
        let validezCedula = validaCedula(value);
        setCedulaSocio(value);
        setIsCedulaValida(validezCedula);
        props.setCedulaSocio({
            valido: validezCedula,
            valor: value
        });
    }

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
        setMontoGastosFinancieros(value);
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
        //console.log("CAMBIO DE CHECK 2,",isCkeckGtosFinancieros)
        if (isCkeckGtosFinancieros === false) {
            setMontoGastosFinancieros("");        
        } 

    }, [isCkeckGtosFinancieros])

    return (
            //      <Item xs={3} sm={3} md={2} lg={3} xl={3} className=""></Item>
            //<Item xs={1} sm={1} md={1} lg={1} xl={1} className=""></Item>
        <>
            {props.paso === 0 &&
                <>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                        <div className="f-col w-80">
                            <label>Número de cédula</label>
                            <Input type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={cedulaSocio} setValueHandler={setCedulaHandler}></Input>
                        </div>

                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>

                </>
            }
  
            {props.paso === 1 &&
                <div>                    
                    <Item xs={11} sm={11} md={11} lg={11} xl={11} className="justify-content-center">
                        <h2>Datos del Socio</h2>
                        <Card>
                            <section className="elements_two_column">
                                <div>
                                    <label>Nombres:</label>
                                    <h5>{`${props.infoSocio.str_nombres} ${props.infoSocio.str_apellido_paterno} ${props.infoSocio.str_apellido_materno}`}</h5>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <label>Ente:</label>
                                    <h5>{props.infoSocio.str_ente}</h5>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <label>Correo:</label>
                                    <h5>{props.infoSocio.str_email}</h5>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <label>Celular:</label>
                                    <h5>{props.infoSocio.str_celular}</h5>
                                    <hr className="dashed"></hr>
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
                                            <h2 className='mr-2'>$</h2><Input className={'w-85'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoIngresosHandler} value={montoIngresos} disabled={true}></Input>
                                        </div>
                                    </div>

                                    <div>
                                        <label>Egresos</label>
                                        <div className="f-row">
                                            <h2 className='mr-2'>$</h2><Input className={'w-100'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoEgresosHandler} value={montoEgresos} disabled={true}></Input>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="f-row">
                                            <Input type="checkbox" setValueHandler={CkeckGtosFinancierosHandler} checked={isCkeckGtosFinancieros} ></Input>
                                            <label className='ml-2'>Gtos. Financieros</label>
                                        </div>
                                       
                                        <div className="f-row">
                                            <h2 className='mr-2'>$</h2><Input className={'w-85'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoGastosFinancierosHandler} value={montoGastosFinancieros} disabled={!isCkeckGtosFinancieros}></Input>
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

export default ValidacionSocio;