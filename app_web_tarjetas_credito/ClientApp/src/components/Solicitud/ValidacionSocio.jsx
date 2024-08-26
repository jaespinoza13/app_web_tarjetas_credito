import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { Fragment, useState } from "react";
import { convertFecha, validaCedula } from '../../js/utiles';
import Item from "../Common/UI/Item";
import { useEffect } from "react";
import Button from "../Common/UI/Button";
import SearchIcon from "@mui/icons-material/Search";

const ValidacionSocio = (props) => {
    //Datos del socio
    const [cedulaSocio, setCedulaSocio] = useState("");
    //Estado validacion
    const [isCedulaValida, setIsCedulaValida] = useState(false);
    const [maxLengthCedula, setMaxLengthCedula] = useState(10);

    const setCedulaHandler = (value) => {
        let validezCedula = validaCedula(value);
        setCedulaSocio(value);
        setIsCedulaValida(validezCedula);
        props.setCedulaSocio({
            valido: validezCedula,
            valor: value
        });

    }

    const updDatosHandler = () => {
        props.requiereActualizar(true)
    }

    const atajosHandler = (event) => {
        if (event.key === 'Enter') {
            props.AtajoHandler(event, 'Enter');
        }
    };

    useEffect(() => {
        setCedulaSocio(props.cedulaSocioValue);
    }, [props.cedulaSocioValue])


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            {props.paso === 0 &&
                <div className={`f-row w-100 sliding-div ${props.isVisibleBloque ? 'visibleY' : 'hiddenY'}`}>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3}></Item>
                    <Item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div className="f-row w-100 justify-content-center mt-5">
                            <div className="f-col w-100 justify-content-center" style={{ maxWidth: "550px" }}>
                                <div className="f-row justify-content-center">
                                    <SearchIcon style={{ fontSize: 80, color: '#7ca4f4' }} />
                                </div>
                                <h3 className="f-row justify-content-center mb-3">Ingrese el número de identificación</h3>
                                <Input id="cedulaInput" type="number" className={`mt-3 ${isCedulaValida ? '' : 'no_valido'}`} placeholder="Ej. 1105970717" readOnly={false} value={cedulaSocio} setValueHandler={setCedulaHandler} keyDown={(e) => isCedulaValida ? atajosHandler(e) : ''} tabIndex={0} maxlength={maxLengthCedula}></Input>
                                {!isCedulaValida &&
                                    <h4 className="ml-1 mt-1 strong">*Ingrese una cédula válida</h4>
                                }
                            </div>
                        </div>
                    </Item>
                    <Item xs={3} sm={3} md={3} lg={3} xl={3}></Item>
                </div>
            }

            {props.paso === 1 &&
                <div className={`f-row w-100 sliding-div ${props.isVisibleBloque ? 'visibleX' : 'hiddenX'}`}>
                    {/* <Item xs={1} sm={1} md={1} lg={1} xl={1} className=""></Item>*/}
                    <Item xs={11} sm={11} md={11} lg={11} xl={11} className="justify-content-center">
                        <div className={"f-row"}>
                            <h2 className="mb-1">Datos del Socio</h2>
                            {/*   <Button className="btn_mg__auto " onClick={updDatosHandler}>*/}
                            {/*       <img src="/Imagenes/refresh.svg" style={{ transform: "scaleX(-1)" }} alt="Volver a consultar"></img>*/}
                            {/*</Button>*/}

                        </div>

                        <Card >
                            <section>
                                <div>
                                    <h3>Nombres:</h3>
                                    <h4 className="strong">{`${props.infoSocio.str_nombres} ${props.infoSocio.str_apellido_paterno} ${props.infoSocio.str_apellido_materno}`}</h4>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <h3>Ente:</h3>
                                    <h4 className="strong">{props.infoSocio.str_ente}</h4>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <h3>Correo:</h3>
                                    <h4 className="strong">{props.infoSocio.str_email}</h4>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <h3>Celular:</h3>
                                    <h4 className="strong">{props.infoSocio.str_celular}</h4>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <h3>Fecha Nacimiento:</h3>
                                    <h4 className="strong">{convertFecha(props.infoSocio.str_fecha_nacimiento)}</h4>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <h3>Sexo:</h3>
                                    <h4 className="strong">{props.infoSocio.str_sexo}</h4>
                                    <hr className="dashed"></hr>
                                </div>

                                <div>
                                    <h3>Estado civil:</h3>
                                    <h4 className="strong">{props.infoSocio.str_estado_civil}</h4>
                                    <hr className="dashed"></hr>
                                </div>

                            </section>

                        </Card>
                    </Item>
                    {/* <Item xs={1} sm={1} md={1} lg={1} xl={1} className=""></Item>*/}
                </div>
            }

        </>
    );
}

export default ValidacionSocio;