import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useState } from "react";
import { validaCedula } from '../../js/utiles';
import Item from "../Common/UI/Item";


const ValidacionSocio = (props) => {
    //Datos del socio
    const [cedulaSocio, setCedulaSocio] = useState("");
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

    return (
        <>
            {props.paso === 0 &&
                <>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                    <div className="f-col w-100">
                            <label>Número de cédula</label>
                            <Input type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={cedulaSocio} setValueHandler={setCedulaHandler}></Input>
                        </div>

                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                </> 
            }
  
            {props.paso === 1 &&
                <div className="f-row w-100">           
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6} className="justify-content-center">
                        <h2>Datos del Socio</h2>
                        <Card >
                            <section>
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
                    </Item>     
                    <Item xs={3} sm={3} md={3} lg={3} xl={3} className=""></Item>
                </div>
            }

        </>
    );
}

export default ValidacionSocio;