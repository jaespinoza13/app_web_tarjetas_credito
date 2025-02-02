﻿import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { Fragment, useEffect, useRef, useState } from "react";
import Item from "../Common/UI/Item";
import Button from "../Common/UI/Button";
import { numberFormatMoney } from "../../js/utiles";


const DatosFinancieros = (props) => {
    //Datos del socio
    const [controlValorMaxInputs, setControlValorMaxInputs] = useState(100000);
    /*const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [montoIngresos, setMontoIngresos] = useState(0);
    const [montoEgresos, setMontoEgresos] = useState(0);
    const [montoGastoFinaCodeudor, setMontoGastoFinanCodeudor] = useState(0);
    const [restaMontoGastosFinancieros, setRestaMontoGastosFinancieros] = useState(0);
    const [isCkeckRestaGtoFinancero, setIsCkeckRestaGtoFinancero] = useState(false);
    const [isCamposDesactivados, setIsCamposDesactivados] = useState(true);*/



    const [montoSolicitado, setMontoSolicitado] = useState(props.dataConsultFinan.montoSolicitado);
    const [montoIngresos, setMontoIngresos] = useState(props.dataConsultFinan.montoIngresos);
    const [montoEgresos, setMontoEgresos] = useState(props.dataConsultFinan.montoEgresos);
    const [montoGastoFinaCodeudor, setMontoGastoFinanCodeudor] = useState(props.dataConsultFinan.montoGastoFinaCodeudor);
    const [montoGastoFinaTitular, setMontoGastoFinanTitular] = useState(props.dataConsultFinan.montoGastoFinaTitular);
    const [restaMontoGastosFinancieros, setRestaMontoGastosFinancieros] = useState(props.dataConsultFinan.montoRestaGstFinanciero);
    const [isCkeckRestaGtoFinancero, setIsCkeckRestaGtoFinancero] = useState(props.isCheckMontoRestaFinanciera);
    const [isCamposDesactivados, setIsCamposDesactivados] = useState(false);



    const [isActivarBtnRestaGasto, setIsActivarBtnRestaGasto] = useState(false);

    const setMontoSolicitadoHandler = (value) => {
        setMontoSolicitado(Number(value));
        props.setDatosFinancierosFunc({
            montoSolicitado: Number(value),
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            montoGastoFinaTitular: montoGastoFinaTitular,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setMontoIngresosHandler = (value) => {
        setMontoIngresos(Number(value));
        props.setDatosFinancierosFunc({
            montoSolicitado: montoSolicitado,
            montoIngresos: Number(value),
            montoEgresos: montoEgresos,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            montoGastoFinaTitular: montoGastoFinaTitular,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setMontoEgresosHandler = (value) => {
        setMontoEgresos(Number(value));
        props.setDatosFinancierosFunc({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: Number(value),
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            montoGastoFinaTitular: montoGastoFinaTitular,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setMontoGastoFinanCodeudorHandler = (value) => {
        setMontoGastoFinanCodeudor(Number(value));
        props.setDatosFinancierosFunc({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastoFinaCodeudor: Number(value),
            montoGastoFinaTitular: montoGastoFinaTitular,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setMontoGastoFinanTitularHandler = (value) => {
        setMontoGastoFinanTitular(Number(value));
        props.setDatosFinancierosFunc({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            montoGastoFinaTitular: Number(value),
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setRestaGastosFinancierosHandler = (value) => {
        setRestaMontoGastosFinancieros(Number(value))
        props.setDatosFinancierosFunc({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            montoGastoFinaTitular: montoGastoFinaTitular,
            restaGastoFinanciero: Number(value)
        })
    }



    const CkeckGtosFinancierosHandler = (e) => {
        setIsCkeckRestaGtoFinancero(!isCkeckRestaGtoFinancero);
        props.isCkeckGtosFinancierosHandler(!isCkeckRestaGtoFinancero);

    }

    /*
    useEffect(() => {
        //Habilita campo de gastos financieros
        if (isCkeckRestaGtoFinancero === false) {
            setRestaGastosFinancierosHandler(" ");
        }
    }, [isCkeckRestaGtoFinancero])*/


    useEffect(() => {
        if (props.gestion === "solicitud") {
            setIsCamposDesactivados(true);
        } else if (props.gestion === "prospeccion") {
            setIsCamposDesactivados(false);
        }
    }, [props.gestion])


    const updGastosFinancieros = () => {
        props.requiereActualizar(true)
    }

    useEffect(() => {
        //console.log(props.dataConsultFinan)

        window.scrollTo(0, 0);
        return () => {
            setMontoIngresos(0);
            setMontoEgresos(0);
            setRestaMontoGastosFinancieros(0);
            setMontoGastoFinanCodeudor(0);
            setMontoGastoFinanTitular(0);
            setMontoSolicitado(0);
            setIsCkeckRestaGtoFinancero(false);
            setIsCamposDesactivados(true);
        }

    }, [])

    useEffect(() => {
        setIsActivarBtnRestaGasto(props.isActivarSeccionRestaGasto);
    }, [props.isActivarSeccionRestaGasto])


    useEffect(() => {
        window.scrollTo(0, 0);
        setMontoIngresos(props.dataConsultFinan.montoIngresos);
        setMontoEgresos(props.dataConsultFinan.montoEgresos);
        setRestaMontoGastosFinancieros(props.dataConsultFinan.montoRestaGstFinanciero);
        setMontoGastoFinanCodeudor(props.dataConsultFinan.montoGastoFinaCodeudor);
        setMontoGastoFinanTitular(props.dataConsultFinan.montoGastoFinaTitular);
        setMontoSolicitado(props.dataConsultFinan.montoSolicitado);
        setIsCkeckRestaGtoFinancero(props.isCheckMontoRestaFinanciera);

    }, [props])


    return (
        <>

            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
            <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                <div className={"f-row w-100 justify-content-space-between mb-1"}>
                    <h2>Datos de Financieros</h2>
                    <Button className="btn_mg__auto" onClick={updGastosFinancieros}>
                        <img src="/Imagenes/refresh.svg" style={{ transform: "scaleX(-1)", width: "2.2rem" }} alt="Volver a consultar."></img>
                    </Button>

                </div>

                <Card className='mt-2'>
                    <section>
                        <form>
                            <div className='mb-2'>
                                <h3>Ingresos</h3>
                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={`w-90  ${(montoIngresos !== "" && montoIngresos !== 0) ? '' : 'no_valido'}`} type={"number"} placeholder={"1.0000"} readOnly={false} setValueHandler={setMontoIngresosHandler} value={montoIngresos} disabled={isCamposDesactivados} min={0} max={controlValorMaxInputs} ></Input>
                                </div>
                            </div>

                            <div className='mb-2'>
                                <h3>Egresos</h3>
                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={`w-90  ${(montoEgresos !== "" && montoEgresos !== 0) ? '' : 'no_valido'}`} type={"number"} placeholder={"500"} readOnly={false} setValueHandler={setMontoEgresosHandler} value={montoEgresos} disabled={isCamposDesactivados} min={0} max={controlValorMaxInputs} ></Input>
                                </div>
                            </div>

                            {isActivarBtnRestaGasto &&

                                <Fragment>
                                    <div className='mb-2'>
                                        <div className="f-row">
                                            <Input type="checkbox" setValueHandler={CkeckGtosFinancierosHandler} checked={isCkeckRestaGtoFinancero} ></Input>
                                            <h3 className="ml-2">Resta Gasto Financiero</h3>
                                        </div>

                                        <div className="f-row">
                                            <h2 className='mr-2'>$</h2>
                                            <Input className={'w-90'} type={"number"} readOnly={false} setValueHandler={setRestaGastosFinancierosHandler} value={restaMontoGastosFinancieros} disabled={!isCkeckRestaGtoFinancero} min={0} max={controlValorMaxInputs} maxlength={6} ></Input>
                                        </div>
                                    </div>

                                    <div className='mb-2'>
                                        <h3>
                                            Gasto financiero
                                        </h3>
                                        <div className="f-row">
                                            <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} readOnly={false} setValueHandler={setMontoGastoFinanTitularHandler} value={montoGastoFinaTitular} min={0} max={controlValorMaxInputs} maxlength={6} disabled={true} ></Input>
                                        </div>
                                    </div>


                                    <div className='mb-2'>
                                        <h3>
                                            Gasto financiero del titular como codeudor
                                        </h3>
                                        <div className="f-row">
                                            <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} readOnly={false} setValueHandler={setMontoGastoFinanCodeudorHandler} value={Number(montoGastoFinaCodeudor) !== 0 ? montoGastoFinaCodeudor : "0" } min={0} max={controlValorMaxInputs} maxlength={6} disabled={true} ></Input>
                                        </div>
                                    </div>
                                </Fragment>
                            }

                            <div className='mb-2'>
                                <h3>Cupo solicitado</h3>
                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={`w-90  ${(montoSolicitado !== "" && montoSolicitado !== 0 && Number(montoSolicitado) > Number(props.montoMinimoCupoSolicitado)) ? '' : 'no_valido'}`} type={"number"} placeholder={"1.000"} readOnly={false} setValueHandler={setMontoSolicitadoHandler} value={montoSolicitado} min={0} max={controlValorMaxInputs}></Input>
                                </div>
                                <div className="f-row">
                                    {montoSolicitado < props.montoMinimoCupoSolicitado &&
                                        <h4 className="ml-4">*El valor mínimo a solicitar debe superar los {`${numberFormatMoney(props.montoMinimoCupoSolicitado)}`}</h4>
                                    }
                                </div>

                            </div>

                        </form>
                    </section>

                </Card>

            </Item>
            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>

        </>
    );
}

export default DatosFinancieros;