import { connect, useDispatch } from 'react-redux';
import Card from "../Common/Card";
import { IsNullOrWhiteSpace } from "../../js/utiles";
import Sidebar from '../Common/Navs/Sidebar';
import Input from '../Common/UI/Input';
import Button from '../Common/UI/Button';
import { useState, useEffect } from 'react';
import ValidacionSocio from './ValidacionSocio';
import Item from '../Common/UI/Item';
import ValidacionesGenerales from './ValidacionesGenerales';
import DatosSocio from './DatosSocio';
import { fetchScore, fetchValidacionSocio } from '../../services/RestServices';
import { get } from '../../js/crypt';

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
    };
};



const NuevaSolicitud = (props) => {
    const dispatch = useDispatch();
    const [lstValidacionesOk, setLstValidacionesOk] = useState([]);
    const [tipoGestion, setTipoGestion] = useState("");
    const [score, setScore] = useState("");

    //Validaciones
    const [validacionesOk, setValidacionesOk] = useState([]);
    const [validacionesErr, setValidacionesErr] = useState([]);
    const [nombreSocio, setNombreSocio] = useState('');
    const [enteSocio, setEnteSocio] = useState('');
    const [celularSocio, setCelularSocio] = useState('');
    const [correoSocio, setCorreoSocio] = useState('');
    const [cedulaSocio, setCedulaSocio] = useState('');
    const [infoSocio, setInfoSocio] = useState([]);

    //Boton siguiente
    const [estadoBotonSiguiente, setEstadoBotonSiguiente] = useState(true);

    useEffect(() => {
        if (score.str_res_codigo === "000") {
            setStep(step + 1);
        }
    }, [score]);

    useEffect(() => {
        if (validacionesOk.length > 0 || validacionesErr.length > 0) {
            setStep(step + 1);
        }
    }, [enteSocio]);

    const steps = [
        { title: "ValidacionSocio" },
        { title: "MostarDatosSocio" },
        { title: "MostarDatosSocio" },
        { title: "MostarDatosSocio" },
    ]
    const [step, setStep] = useState(0);

    const nextHandler = async () => {
        if (step === 0) {
            fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {
                const arrValidacionesOk = [...data.lst_datos_alerta_true];
                const arrValidacionesErr = [...data.lst_datos_alerta_false];
                setValidacionesOk(arrValidacionesOk);
                setValidacionesErr(arrValidacionesErr);
                setEnteSocio(data.str_ente);
                setCelularSocio(data.str_celular);
                setCorreoSocio(data.str_email);
                setInfoSocio(data);
                setNombreSocio(`${data.str_nombres} ${data.str_apellido_paterno} ${data.str_apellido_materno}`);
                console.log(validacionesOk);
                const objValidaciones = {
                    "lst_validaciones_ok": [...data.lst_datos_alerta_true],
                    "lst_validaciones_err": [...data.lst_datos_alerta_false]
                }
                handleLists(objValidaciones);
            }, dispatch)
        }
        if (step == 2) {
            //const strNombreSocio = `${nombresSolicitud} ${pApellidoSolicitud} ${sApellidoSolicitud}`;
            const strOficina = "MATRIZ";
            //const strOficina = get(localStorage.getItem("office"));
            const strOficial = get(localStorage.getItem("sender_name"));
            const strCargo = get(localStorage.getItem("role"));
            await fetchScore("C", cedulaSocio, nombreSocio, "Matriz", strOficial, strCargo, props.token, (data) => {
                setScore(data);
                //setIsDescargarPdf(false);
            }, dispatch);
            return;
        }
        
    }

    const handleLists = (e) => {
        setLstValidacionesOk(e);
    }

    const cedulaSocioHandler = (e) => {
        setCedulaSocio(e.valor);
        if (step === 0 && e.valido) {
            setEstadoBotonSiguiente(false);
            setCedulaSocio(e.valor);
        }
    }

    return (
        <div className="f-row" >
            <Sidebar></Sidebar>
            <div className="stepper"></div>
            <Card className={["m-max w-100 justify-content-space-between align-content-center"]}>
                <div className="f-row">
                    {(step === 0 || step === 1) &&
                        <div className="f-row w-100">
                            <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                            <Item xs={6} sm={6} md={6} lg={6} xl={6} className="">
                                <ValidacionSocio paso={step} token={props.token} setCedulaSocio={cedulaSocioHandler} infoSocio={infoSocio}></ValidacionSocio>
                            </Item>
                        </div>
                    }

                    {(step === 2) &&
                        <ValidacionesGenerales lst_validaciones={lstValidacionesOk}></ValidacionesGenerales>
                    }
                    {(step === 3) &&
                        <DatosSocio lst_validaciones={lstValidacionesOk} score={score} token={props.token}></DatosSocio>
                    }
                </div>
                <div id="botones" className="f-row ">
                    <Item xs={2} sm={2} md={2} lg={2} xl={2} className=""></Item>
                    <Item xs={8} sm={8} md={8} lg={8} xl={8} className="f-row justify-content-space-between">
                        <Button className={["btn_mg btn_mg__primary mt-2"]} disabled={estadoBotonSiguiente} onClick={nextHandler}>Siguiente</Button>
                        <Button className={["btn_mg btn_mg__secondary mt-2"]} disabled={false} onClick={nextHandler}>Continuar como prospecto</Button>
                    </Item>
                    
                </div>

            </Card>
        </div >
    )
}

export default connect(mapStateToProps, {})(NuevaSolicitud);