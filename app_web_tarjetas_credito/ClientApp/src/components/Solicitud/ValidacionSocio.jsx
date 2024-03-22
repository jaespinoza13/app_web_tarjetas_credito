import { useDispatch } from 'react-redux';
import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useEffect, useState } from "react";
import { fetchValidacionSocio } from "../../services/RestServices";
import { validaCedula } from '../../js/utiles';


const ValidacionSocio = (props) => {
    const dispatch = useDispatch();
    //Datos del socio
    const [cedulaSocio, setCedulaSocio] = useState("");
    const [montoSolicitado, setMontoSolicitado] = useState(0);

    //Estado validacion
    const [isCedulaValida, setIsCedulaValida] = useState(false);


    const setCedulaHandler = (value) => {
        let validezCedula = validaCedula(value);
        setIsCedulaValida(validezCedula);
        props.setCedulaSocio({
            valido: validezCedula,
            valor: value
        });
    }

    const setMontoSolicitadoHandler = (value) => {
        setMontoSolicitado(value);
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
                    <Card>
                        <label>Nombres:</label>
                        {/*<h4>{}</h4>*/}
                        {/*<hr className="dashed"></hr>*/}
                        {/*<label>Ente:</label>*/}
                        {/*<h4>{enteSocio}</h4>*/}
                        {/*<hr className="dashed"></hr>*/}
                        {/*<label>Correo:</label>*/}
                        {/*<h4>{correoSocio}</h4>*/}
                        {/*<hr className="dashed"></hr>*/}
                        {/*<label>Número celular:</label>*/}
                        {/*<h3>{celularSocio}</h3>*/}
                    </Card>
                    <h2>Cupo solicitado</h2>
                    <Input type={"number"} placeholder={"10000"} readOnly={false} setValueHandler={setMontoSolicitadoHandler}></Input>
            </div>
            }

        </>
    );
}

export default ValidacionSocio;