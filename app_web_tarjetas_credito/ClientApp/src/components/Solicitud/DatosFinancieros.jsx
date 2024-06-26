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
    //const [montoGastosFinancieros, setMontoGastosFinancieros] = useState(0);
    const [montoGastoFinaCodeudor, setMontoGastoFinanCodeudor] = useState("");
    const [restaMontoGastosFinancieros, setRestaMontoGastosFinancieros] = useState("");

    const [isCkeckRestaGtoFinancero, setIsCkeckRestaGtoFinancero] = useState(false);

    const [isCamposDesactivados, setIsCamposDesactivados] = useState(true);
    //const [isHabilitadoRestaGstFinancieros, setIsHabilitadoRestaGstFinancieros] = useState(false);


    const setMontoSolicitadoHandler = (value) => {
        setMontoSolicitado(Number(value));
        props.datosFinancieros({
            montoSolicitado: Number(value),
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            //montoGastosFinancieros: montoGastosFinancieros,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setMontoIngresosHandler = (value) => {
        setMontoIngresos(Number(value));
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: Number(value),
            montoEgresos: montoEgresos,
            //montoGastosFinancieros: montoGastosFinancieros,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setMontoEgresosHandler = (value) => {
        setMontoEgresos(Number(value));
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: Number(value),
            //montoGastosFinancieros: montoGastosFinancieros,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }
    /*
    const setMontoGastosFinancierosHandler = (value) => {
        setMontoGastosFinancieros(Number(value));
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            montoGastosFinancieros: Number(value),
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }*/

    const setMontoGastoFinanCodeudorHandler = (value) => {
        setMontoGastoFinanCodeudor(value);
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            //montoGastosFinancieros: montoGastosFinancieros,
            montoGastoFinaCodeudor: value,
            restaGastoFinanciero: restaMontoGastosFinancieros
        })
    }

    const setRestaGastosFinancierosHandler = (value) => {
        setRestaMontoGastosFinancieros(value)
        props.datosFinancieros({
            montoSolicitado: montoSolicitado,
            montoIngresos: montoIngresos,
            montoEgresos: montoEgresos,
            //montoGastosFinancieros: montoGastosFinancieros,
            montoGastoFinaCodeudor: montoGastoFinaCodeudor,
            restaGastoFinanciero: value
        })
    }



    const CkeckGtosFinancierosHandler = (e) => {
        //console.log("CAMBIO DE CHECK", !isCkeckGtosFinancieros)
        setIsCkeckRestaGtoFinancero(!isCkeckRestaGtoFinancero);
        props.isCkeckGtosFinancierosHandler(!isCkeckRestaGtoFinancero);

    }

    useEffect(() => {
        //Habilita campo de gastos financieros
        //console.log("CAMBIO DE CHECK 2,",isCkeckGtosFinancieros)
        if (isCkeckRestaGtoFinancero === false) {
            //setMontoGastosFinancieros(" ");
            //setMontoGastosFinancierosHandler("")

            //setMontoGastoFinanCodeudor(" ");
            //setMontoGastoFinanCodeudorHandler(" ");
            setRestaMontoGastosFinancieros(" ");
            setRestaGastosFinancierosHandler(" ");
        }
    }, [isCkeckRestaGtoFinancero])

    /*
    useEffect(() => {
        if (props.requiereActualizar) {
            setIsCamposDesactivados(false);
        } else {
            setIsCamposDesactivados(true);
        }
    }, [props.requiereActualizar])*/

    /* POR SI SE REQUIERE OCULTAR EN LA PRIMERA SIMULACION
    useEffect(() => {
        setIsHabilitadoRestaGstFinancieros(props.habilitaRestaGstFinancieros);
    },[props.habilitaRestaGstFinancieros])*/
    

    useEffect(() => {
        if (props.gestion === "solicitud") {
            setIsCamposDesactivados(true);
        } else if (props.gestion === "prospeccion") {
            setIsCamposDesactivados(false);
        }
    }, [props.gestion])

    
    const updGastosFinancieros = () => {
        //props.requiereActualizar(true)

        props.requiereActualizar(true)
        //setIsCamposDesactivados(!isCamposDesactivados);
    }

    useEffect(() => {

        console.log("Datos finan Compon ", props.dataConsultFinan)

        setMontoIngresos(props.dataConsultFinan.montoIngresos);
        setMontoEgresos(props.dataConsultFinan.montoEgresos);

        setRestaMontoGastosFinancieros(props.dataConsultFinan.montoRestaGstFinanciero);
        setMontoGastoFinanCodeudor(props.dataConsultFinan.montoGastoFinaCodeudor)
        //setMontoGastosFinancieros(props.dataConsultFinan.montoGastosFinancieros);
        setMontoSolicitado(props.dataConsultFinan.montoSolicitado)

        setIsCkeckRestaGtoFinancero(props.isCheckMontoRestaFinanciera)

    }, [])

    /*
    useEffect(() => {

        console.log("ACT finan Compon ", props.dataConsultFinan)

        setMontoIngresos(props.dataConsultFinan.montoIngresos);
        setMontoEgresos(props.dataConsultFinan.montoEgresos);

        setRestaMontoGastosFinancieros(props.dataConsultFinan.montoRestaGstFinanciero);
        setMontoGastoFinanCodeudor(props.dataConsultFinan.montoGastoFinaCodeudor)
        //setMontoGastosFinancieros(props.dataConsultFinan.montoGastosFinancieros);
        setMontoSolicitado(props.dataConsultFinan.montoSolicitado)

        setIsCkeckRestaGtoFinancero(props.isCheckMontoRestaFinanciera)

    }, [props.dataConsultFinan])*/


    return (
        <>

            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
            <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                <div className={"f-row"}>
                    <h2>Datos de Financieros</h2>

                    {/*{props.gestion === "solicitud" &&*/}

                        <Button className="btn_mg__auto" onClick={updGastosFinancieros}>
                            <img src="/Imagenes/refresh.svg" style={{ transform: "scaleX(-1)"}}></img>
                        </Button>

                </div>                
                
                <Card className='mt-2'>
                    <section>
                    <form>
                        <div className='mb-2'>
                            <label>Ingresos</label>
                            <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoIngresosHandler} value={montoIngresos} disabled={isCamposDesactivados} min={0} max={99999} ></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <label>Egresos</label>
                            <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoEgresosHandler} value={montoEgresos} disabled={isCamposDesactivados} min={0} max={99999} ></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <div className="f-row">
                                <Input type="checkbox" setValueHandler={CkeckGtosFinancierosHandler} checked={isCkeckRestaGtoFinancero} ></Input>
                                <label>Resta Gasto Financiero</label>
                            </div>
                            
                            <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setRestaGastosFinancierosHandler} value={restaMontoGastosFinancieros} disabled={!isCkeckRestaGtoFinancero} min={0} max={99999}  maxlength={6} ></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <label>Gasto Financiero CoDeudor</label>
                            <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoGastoFinanCodeudorHandler} value={montoGastoFinaCodeudor} min={0} max={99999} maxlength={6} disabled={isCamposDesactivados} ></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <label>Cupo solicitado</label>
                            <div className="f-row">
                                    <h2 className='mr-2'>$</h2><Input className={'w-90'} type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoSolicitadoHandler} value={montoSolicitado} min={0} max={99999}></Input>
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