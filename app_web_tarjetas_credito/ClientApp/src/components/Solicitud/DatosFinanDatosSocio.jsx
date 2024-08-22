import { connect, useDispatch } from 'react-redux';
import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useEffect, useState } from "react";
import Item from "../Common/UI/Item";
import Button from "../Common/UI/Button";
import { fetchNuevaSimulacionScore } from "../../services/RestServices";
import { get } from '../../js/crypt';
import { IsNullOrWhiteSpace } from '../../js/utiles';

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        token: state.tokenActive.data,
        dataSimulacion: state.dataSimulacionCupo.data
    };
};


const DatosFinanDatosSocio = (props) => {
    const dispatch = useDispatch();
    const [montoIngresosSimul, setmontoIngresosSimul] = useState(0);
    const [montoEgresosSimul, setMontoEgresosSimul] = useState(0);
    const [montoGastoFinaCodeudorSimul, setMontoGastoFinaCodeudorSimul] = useState(0);
    const [montoGastoFinaTitularSimul, setMontoGastoFinanTitularSimul] = useState(0);
    const [restaMontoGastosFinancierosSimul, setRestaMontoGastosFinancierosSimul] = useState(0);
    const [cupoSugeNuevSimulacion, setCupoSugeNuevSimulacion] = useState("");
    const [isCkeckRestaGtoFinanceroSimul, setIsCkeckRestaGtoFinanceroSimul] = useState(false);
    const [isCamposDesactivadosSimul, setIsCamposDesactivadosSimul] = useState(false);
    const [isHabilitaBtnCalcular, setIsHabilitaBtnCalcular] = useState(true);
    const [controlValorMaxInputs, setControlValorMaxInputs] = useState(100000);


    const setMontoIngresosHandler = (value) => {
        setmontoIngresosSimul(Number(value));
    }

    const setMontoEgresosHandler = (value) => {
        setMontoEgresosSimul(Number(value));
    }

    const setMontoGastoFinanCodeudorHandler = (value) => {
        setMontoGastoFinaCodeudorSimul(Number(value));
    }

    const setMontoGastoFinanTitularHandler = (value) => {
        setMontoGastoFinanTitularSimul(Number(value));
    }

    const setRestaGastosFinancierosHandler = (value) => {
        setRestaMontoGastosFinancierosSimul(value)
    }

    const CkeckGtosFinancierosHandler = (e) => {
        setIsCkeckRestaGtoFinanceroSimul(!isCkeckRestaGtoFinanceroSimul);

    }

    /*
    useEffect(() => {
        //Habilita campo de gastos financieros
        if (isCkeckRestaGtoFinanceroSimul === false) {
            setRestaGastosFinancierosHandler(" ");
        }
    }, [isCkeckRestaGtoFinanceroSimul])
    */

    useEffect(() => {
        window.scrollTo(0, 0);
        setmontoIngresosSimul(props.dataFinanciers.montoIngresos);
        setMontoEgresosSimul(props.dataFinanciers.montoEgresos);
        setRestaMontoGastosFinancierosSimul(props.dataFinanciers.montoRestaGstFinanciero);
        setMontoGastoFinaCodeudorSimul(props.dataFinanciers.montoGastoFinaCodeudor);
        setMontoGastoFinanTitularSimul(props.dataFinanciers.montoGastoFinaTitular);
        setIsCkeckRestaGtoFinanceroSimul(props.isCheckHabilitaRestaMonto);

        if (props.gestion === "solicitud") {
            setIsCamposDesactivadosSimul(true);
        } else if (props.gestion === "prospeccion") {
            setIsCamposDesactivadosSimul(false);
        }

    }, [])


    //PARA ACTUALIZAR CAMPO EN CASO SE ACTUALICE 
    useEffect(() => {
        setMontoGastoFinaCodeudorSimul(props.dataFinanciers.montoGastoFinaCodeudor);
        setRestaMontoGastosFinancierosSimul(props.dataFinanciers.montoRestaGstFinanciero);
    }, [props.dataFinanciers])



    useEffect(() => {
        //RECUPERA EL CUPO SUGERIGO PARA COOPMEGO
        props.nuevoCupoSimulado(cupoSugeNuevSimulacion)
    }, [cupoSugeNuevSimulacion])

    useEffect(() => {
        //console.log("ENTRA")
        let validacion = validarCamposFinancieros();
        setIsHabilitaBtnCalcular(validacion);

    }, [montoIngresosSimul, montoEgresosSimul, isCkeckRestaGtoFinanceroSimul, restaMontoGastosFinancierosSimul]);


    const nuevaSimulacionHandler = async () => {
        let montoRestaGast = (restaMontoGastosFinancierosSimul !== 0 && restaMontoGastosFinancierosSimul !== "" && restaMontoGastosFinancierosSimul !== undefined && restaMontoGastosFinancierosSimul !== " ") ? restaMontoGastosFinancierosSimul : 0;
        let montoGastoCodeud = (montoGastoFinaCodeudorSimul !== 0 && montoGastoFinaCodeudorSimul !== "" && montoGastoFinaCodeudorSimul !== undefined && montoGastoFinaCodeudorSimul !== " ") ? montoGastoFinaCodeudorSimul : 0;

        const strOficial = get(localStorage.getItem("sender_name"));
        const strRol = get(localStorage.getItem("role"));
        const userOficina = get(localStorage.getItem('office'));

        //Se actualiza el check desde hijo hacia padre
        props.isCkeckRestaGtosFinanHjo(isCkeckRestaGtoFinanceroSimul);

        //TODO CAMBIAR LA CEDULA, oficina matriz
        await fetchNuevaSimulacionScore("C", props.dataSimulacion.cedula, props.dataSimulacion.nombresApellidos, userOficina, strOficial, strRol, montoIngresosSimul, montoEgresosSimul, montoRestaGast, montoGastoCodeud,
            props.token, (data) => {
                console.log("DATA SCORE ", data)
                setCupoSugeNuevSimulacion(data.str_cupo_sugerido)
                setMontoGastoFinaCodeudorSimul(data.str_gastos_codeudor)

                let objetoActualizarDtsFinan = {
                    montoSolicitado: props.dataFinanciers.montoSolicitado,
                    montoIngresos: montoIngresosSimul,
                    montoEgresos: montoEgresosSimul,
                    montoGastoFinaCodeudor: montoGastoFinaCodeudorSimul,
                    restaGastoFinanciero: restaMontoGastosFinancierosSimul,
                    montoGastoFinaTitular: montoGastoFinaTitularSimul
                }
                props.setDatosFinancierosHij(objetoActualizarDtsFinan);
            }, dispatch);

    }



    const validarCamposFinancieros = () => {
        let montoRestaGast = (restaMontoGastosFinancierosSimul !== 0 && restaMontoGastosFinancierosSimul !== "" && restaMontoGastosFinancierosSimul !== undefined && restaMontoGastosFinancierosSimul !== " ") ? restaMontoGastosFinancierosSimul : 0;
        let desactivarBtn = false;
        if (isCkeckRestaGtoFinanceroSimul) {
            if (montoIngresosSimul !== 0 && montoEgresosSimul !== 0 && montoRestaGast !== 0) {
                desactivarBtn = false;
            } else {
                desactivarBtn = true;
            }
        } else {
            if (montoIngresosSimul !== 0 && montoEgresosSimul !== 0) {
                desactivarBtn = false;
            } else {
                desactivarBtn = true;
            }
        }
        return desactivarBtn;
    }


    return (
        <>
            <Card className={["f-col w-100 justify-content-space-between align-content-center  mt-2"]}>
                <div style={{ position: "absolute", transform: "translate(-15px, -15px)" }}>
                    <h3 className="strong">Datos Financieros</h3>
                </div>
                <div className={"f-row w-100"}>
                    <Item xs={2} sm={2} md={2} lg={2} xl={2} ></Item>
                    <Item xs={4} sm={4} md={4} lg={4} xl={4} className="">
                        <div className='mb-2'>
                            <label>Ingresos</label>
                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={`w-80  ${(montoIngresosSimul !== "" && montoIngresosSimul !== 0) ? '' : 'no_valido'}`} type={"number"} readOnly={false} setValueHandler={setMontoIngresosHandler} value={montoIngresosSimul} disabled={isCamposDesactivadosSimul} min={0} max={controlValorMaxInputs} ></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <label>Egresos</label>
                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={`w-80  ${(montoEgresosSimul !== "" && montoEgresosSimul !== 0) ? '' : 'no_valido'}`} type={"number"} readOnly={false} setValueHandler={setMontoEgresosHandler} value={montoEgresosSimul} disabled={isCamposDesactivadosSimul} min={0} max={controlValorMaxInputs} ></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <label>
                                Gasto financiero
                            </label>
                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={'w-80'} type={"number"} readOnly={false} setValueHandler={setMontoGastoFinanTitularHandler} value={montoGastoFinaTitularSimul} min={0} max={controlValorMaxInputs} maxlength={6} disabled={true} ></Input>
                            </div>
                        </div>

                    </Item>


                    <Item xs={4} sm={4} md={4} lg={4} xl={4} className="justify-content-center">

                        <div className='mb-2'>
                            <label>
                                Gasto financiero del titular como codeudor
                            </label>
                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={'w-80'} type={"number"} readOnly={false} setValueHandler={setMontoGastoFinanCodeudorHandler} value={Number(montoGastoFinaCodeudorSimul) !== 0 ? montoGastoFinaCodeudorSimul : "0"} min={0} max={controlValorMaxInputs} maxlength={6} disabled={true} ></Input>
                            </div>
                        </div>

                        <div className='mb-2'>
                            <div className="f-row">
                                <Input type="checkbox" setValueHandler={CkeckGtosFinancierosHandler} checked={isCkeckRestaGtoFinanceroSimul} ></Input>
                                <label className="ml-2">Resta Gasto Financiero</label>
                            </div>

                            <div className="f-row">
                                <h2 className='mr-2'>$</h2><Input className={'w-80'} type={"number"} readOnly={false} setValueHandler={setRestaGastosFinancierosHandler} value={restaMontoGastosFinancierosSimul} disabled={!isCkeckRestaGtoFinanceroSimul} min={0} max={controlValorMaxInputs} maxlength={6} ></Input>
                            </div>
                        </div>

                        <div className='mt-5 mb-2'>
                            <div style={{ position: "relative", left: "20%", top: "4px" }}>
                                <Button className="btn_mg__secondary w-50" onClick={nuevaSimulacionHandler} disabled={isHabilitaBtnCalcular}>
                                    Simular
                                </Button>
                            </div>
                        </div>


                    </Item>
                    {/*<Item xs={1} sm={1} md={1} lg={1} xl={1} className="f-col justify-content-center">*/}
                    {/*    <div className={"f-row w-100 justify-content-start"}>*/}
                    {/*        <Button className="btn_mg__secondary " onClick={nuevaSimulacionHandler} disabled={isHabilitaBtnCalcular}>*/}
                    {/*           Simular*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}
                    {/*</Item>*/}
                    <Item xs={2} sm={2} md={2} lg={2} xl={2} className=""></Item>
                </div>
            </Card>


        </>
    );
}


export default connect(mapStateToProps, {})(DatosFinanDatosSocio);