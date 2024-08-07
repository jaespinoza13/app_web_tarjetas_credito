import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useEffect, useState } from "react";
import Item from "../Common/UI/Item";
import Button from "../Common/UI/Button";


const DatosFinancieros = (props) => {
    //Datos del socio
    const [montoSolicitado, setMontoSolicitado] = useState(0);
    const [montoIngresos, setMontoIngresos] = useState(0);
    const [montoEgresos, setMontoEgresos] = useState(0);
    const [montoGastoFinaCodeudor, setMontoGastoFinanCodeudor] = useState(0);
    const [restaMontoGastosFinancieros, setRestaMontoGastosFinancieros] = useState(0);
    const [isCkeckRestaGtoFinancero, setIsCkeckRestaGtoFinancero] = useState(false);
    const [isCamposDesactivados, setIsCamposDesactivados] = useState(true);

    const setMontoSolicitadoHandler = (value) => {
        setMontoSolicitado(Number(value));
        props.setDatosFinancierosFunc({
            montoSolicitado: Number(value),
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
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
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setRestaGastosFinancierosHandler = (value) => {
        setRestaMontoGastosFinancieros(value)
        props.setDatosFinancierosFunc({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            restaGastoFinanciero: value
        })
    }



    const CkeckGtosFinancierosHandler = (e) => {
        setIsCkeckRestaGtoFinancero(!isCkeckRestaGtoFinancero);
        props.isCkeckGtosFinancierosHandler(!isCkeckRestaGtoFinancero);

    }

    useEffect(() => {
        //Habilita campo de gastos financieros
        if (isCkeckRestaGtoFinancero === false) {
            setRestaGastosFinancierosHandler(" ");
        }
    }, [isCkeckRestaGtoFinancero])


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
        window.scrollTo(0, 0);
        setMontoIngresos(props.dataConsultFinan.montoIngresos);
        setMontoEgresos(props.dataConsultFinan.montoEgresos);
        setRestaMontoGastosFinancieros(props.dataConsultFinan.montoRestaGstFinanciero);
        setMontoGastoFinanCodeudor(props.dataConsultFinan.montoGastoFinaCodeudor);
        setMontoSolicitado(props.dataConsultFinan.montoSolicitado);
        setIsCkeckRestaGtoFinancero(props.isCheckMontoRestaFinanciera);

    }, [])

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
                                <label>Ingresos</label>
                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={`w-90  ${(montoIngresos !== "" && montoIngresos !== 0)  ? '' : 'no_valido'}`} type={"number"} placeholder={"1.0000"} readOnly={false} setValueHandler={setMontoIngresosHandler} value={montoIngresos} disabled={isCamposDesactivados} min={0} max={99999} ></Input>
                                </div>
                            </div>

                            <div className='mb-2'>
                                <label>Egresos</label>
                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={`w-90  ${(montoEgresos !== "" && montoEgresos !== 0) ? '' : 'no_valido'}`} type={"number"} placeholder={"500"} readOnly={false} setValueHandler={setMontoEgresosHandler} value={montoEgresos} disabled={isCamposDesactivados} min={0} max={99999} ></Input>
                                </div>
                            </div>

                            <div className='mb-2'>
                                <div className="f-row">
                                    <Input type="checkbox" setValueHandler={CkeckGtosFinancierosHandler} checked={isCkeckRestaGtoFinancero} ></Input>
                                    <label className="ml-2">Resta Gasto Financiero</label>
                                </div>

                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"1.000"} readOnly={false} setValueHandler={setRestaGastosFinancierosHandler} value={restaMontoGastosFinancieros} disabled={!isCkeckRestaGtoFinancero} min={0} max={99999} maxlength={6} ></Input>
                                </div>
                            </div>

                            <div className='mb-2'>
                                <label>
                                    Gasto Financiero CoDeudor
                                </label>
                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"}  readOnly={false} setValueHandler={setMontoGastoFinanCodeudorHandler} value={montoGastoFinaCodeudor} min={0} max={99999} maxlength={6} disabled={true} ></Input>
                                </div>
                            </div>

                            <div className='mb-2'>
                                <label>Cupo solicitado</label>
                                <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={`w-90  ${(montoSolicitado !== "" && montoSolicitado !== 0) ? '' : 'no_valido'}`} type={"number"} placeholder={"1.000"} readOnly={false} setValueHandler={setMontoSolicitadoHandler} value={montoSolicitado} min={0} max={99999}></Input>
                                </div>
                                <div className="f-row">
                                    {montoSolicitado < props.montoMinimoCupoSolicitado &&
                                        <h5 className="ml-4">*El monto mínimo a solicitar debe superar los {`$ ${Number(props.montoMinimoCupoSolicitado)?.toLocaleString("en-US")}`}</h5>
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