import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useEffect, useState } from "react";
import Item from "../Common/UI/Item";


const DatosFinancieros = (props) => {
    //Datos del socio
    const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [montoIngresos, setMontoIngresos] = useState(3000);
    const [montoEgresos, setMontoEgresos] = useState(1000);
    const [montoGastosFinancieros, setMontoGastosFinancieros] = useState("");
    const [isCkeckGtosFinancieros, setIsCkeckGtosFinancieros] = useState(false);

    const [isCamposDesactivados, setIsCamposDesactivados] = useState(false);


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
            montoGastosFinancieros: value
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
            setMontoGastosFinancieros(" ");
        }
    }, [isCkeckGtosFinancieros])


    useEffect(() => {
        if (props.gestion === "solicitud") {
            setIsCamposDesactivados(true);
        } else if (props.gestion === "prospeccion") {
            setIsCamposDesactivados(false);
        }
    }, [props.gestion])


    return (
        <>

            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
            <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                <h2>Datos de Financieros</h2>
                <Card className='mt-2'>
                    <section>
                        <div className='mb-2'>
                            <label>Ingresos</label>
                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoIngresosHandler} value={montoIngresos} disabled={isCamposDesactivados} max={"100000"} min={"0"} maxlength={"6"}></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <label>Egresos</label>
                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoEgresosHandler} value={montoEgresos} disabled={isCamposDesactivados} max={"100000"} min={"0"} maxlength={"6"}></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <div className="f-row">
                                <Input type="checkbox" setValueHandler={CkeckGtosFinancierosHandler} checked={isCkeckGtosFinancieros} ></Input>
                                <label className='ml-2'>Gtos. Financieros</label>
                            </div>

                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoGastosFinancierosHandler} value={montoGastosFinancieros} disabled={!isCkeckGtosFinancieros} max={"100000"} min={"0"} maxlength={"6"}></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <label>Cupo solicitado</label>
                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoSolicitadoHandler} value={montoSolicitado} max={"100000"} min={"0"} maxlength={"6"}></Input>
                            </div>
                        </div>
                    </section>

                </Card>

            </Item>
            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>

        </>
    );
}

export default DatosFinancieros;