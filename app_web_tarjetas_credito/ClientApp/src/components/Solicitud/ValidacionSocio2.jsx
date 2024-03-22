import { useDispatch } from 'react-redux';
import Input from "../Common/UI/Input";
import Card from "../Common/Card";
import { useEffect, useState } from "react";
import { fetchValidacionSocio } from "../../services/RestServices";

const ValidacionSocio = (props) => {
    const dispatch = useDispatch();
    //Datos del socio
    const [cedulaSocio, setCedulaSocio] = useState('');
    const [nombreSocio, setNombreSocio] = useState('');
    const [enteSocio, setEnteSocio] = useState('');
    const [celularSocio, setCelularSocio] = useState('');
    const [correoSocio, setCorreoSocio] = useState('');

    //Validaciones
    const [validacionesOk, setValidacionesOk] = useState([]);
    const [validacionesErr, setValidacionesErr] = useState([]);


    useEffect(() => {
        if (props.paso === 1) {
            fetchValidacionSocio(cedulaSocio, '', props.token, (data) => {

                setValidacionesOk([...data.lst_datos_alerta_true]);
                setValidacionesErr([...data.lst_datos_alerta_false]);
                setEnteSocio(data.str_ente);
                setCelularSocio(data.str_celular);
                setCorreoSocio(data.str_correo);
                setNombreSocio(`${data.str_nombres data.}`)
                //setEnteSolicitud(data.str_ente);
                //setNombresSolicitud(data.str_nombres);
                //setPApellidoSolicitud(data.str_apellido_paterno);
                //setSApellidoSolicitud(data.str_apellido_materno);
                //validaAlertaBuro("ALERTA_SOLICITUD_TC_005", [...data.list_datos_alertas])
            }, dispatch)
        }

    }, [props.paso])

    const setCedulaHandler = (value) => {

    }

    return (
        <>
            {props.paso === 0 && 
                <div>
                    <label>Número de cédula</label>
                    <Input type="number" placeholder="Ej. 1105970717" readOnly={false} value={cedulaSocio} setCedulaHandler={setCedulaHandler}></Input>
                </div>
            }
            {props.paso === 1 &&
            <div>
                <h2>Datos del Socio</h2>
                    <Card>
                        <label>Nombres:</label>
                        <p>{}</p>
                </Card>
            </div>
            }

        </>
    );
}

export default ValidacionSocio;