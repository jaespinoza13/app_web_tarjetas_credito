import Toggler from "../Common/UI/Toggler";
import { useEffect, useState } from "react";

const Personalizacion = (props) => {
    const [nombresTarjeta, setNombresTarjeta] = useState(['', '']);
    const [nombreSeleccion, setNombreSeleccion] = useState("");
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [direccionEntrega, setDireccionEntrega] = useState("");

    const tiposEntrega = ["Retiro en agencia", "Entrega en domicilio"];
    const tiposDireccion = ["Casa", "Trabajo"];

    useEffect(() => {
        setNombresTarjeta([
            `${props.nombres.split(" ")[0]} ${props.str_apellido_paterno}`,
            `${props.nombres.split(" ")[1]} ${props.str_apellido_materno}`
        ]);
    }, [props.nombres]);

    useEffect(() => {
        props.onNombreTarjeta(nombresTarjeta);
    }, [nombreSeleccion]);

    useEffect(() => {
        props.onTipoEntrega(tipoEntrega);
    }, [tipoEntrega]);

    useEffect(() => {
        props.onDireccionEntrega(direccionEntrega);
    }, [direccionEntrega]);

    const nombreSeleccionHandler = (index) => {
        setNombreSeleccion(nombresTarjeta[index]);
    }

    const tipoEntregaHandler = (index) => {
        setTipoEntrega(tiposEntrega[index]);
    }

    const direccionEntregaHandler = (index) => {
        setDireccionEntrega(tiposDireccion[index]); 
    }

    return (
        <div>
            <div>
                <h3 className="mb-3">Personalización</h3>
                <h5 className={"mb-2"}>Selecciona el nombre a imprimir en la tarjeta</h5>

                <Toggler className={"mb-3"} selectedToggle={nombreSeleccionHandler} toggles={nombresTarjeta}>
                </Toggler>
            </div>
            <div>
                <h3 className="mb-3">Entrega de la tarjeta</h3>
                <h5 className={"mb-2"}>Forma de entrega</h5>
                <Toggler className={"mb-3"} selectedToggle={tipoEntregaHandler} toggles={tiposEntrega}>
                </Toggler>
                {tipoEntrega !== "" && <h3 className={"mb-2"}>Selecciona una opción para la entrega</h3>}
                {tipoEntrega === "Retiro en agencia" && <div>
                    <select id="tipo_documento" onChange={direccionEntregaHandler} value={direccionEntrega}>
                        <option value="1">MATRIZ</option>
                        <option value="2">SARAGURO</option>
                        <option value="3">CATAMAYO</option>
                        <option value="4">CARIAMANGA</option>
                        <option value="5">ALAMOR</option>
                        <option value="6">ZAMORA</option>
                        <option value="7">CUENCA</option>
                        <option value="8">AGENCIA NORTE</option>
                        <option value="9">MACARA</option>
                        <option value="10">AGENCIA SUR</option>
                        <option value="11">AGENCIA YANTZAZA</option>
                        <option value="12">BALSAS</option>
                        <option value="13">CATACOCHA</option>
                        <option value="14">SANTA ROSA</option>
                        <option value="15">AGENCIA GUALAQUIZA</option>
                        <option value="16">AGENCIA CUARTO CENTENARIO</option>
                        <option value="17">AGENCIA ZUMBA</option>
                        <option value="18">AGENCIA EL VALLE</option>
                        <option value="19">AGENCIA MACHALA</option>
                        <option value="20">AGENCIA EL EJIDO</option>
                        <option value="21">AGENCIA LATACUNGA</option>
                        <option value="22">AGENCIA SANTO DOMINGO</option>
                    </select>
                </div>}
                {tipoEntrega === "Entrega en domicilio" &&
                    <div>
                        <Toggler className={"f-col"} selectedToggle={direccionEntregaHandler} toggles={tiposDireccion}></Toggler>
                    </div>
                }

            </div>
            {/*<input*/}
            {/*    type="radio"*/}
            {/*    name="nombre_tarjeta"*/}
            {/*    value={`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}*/}
            {/*    onChange={nombreTarjetaHnadler}*/}
            {/*    id={`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}></input>*/}
            {/*<label htmlFor={`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}>{`${infoSocio[0].str_nombres.split(" ")[0]} ${infoSocio[0].str_apellido_paterno}`}</label>*/}
            {/*<input*/}
            {/*    type="radio"*/}
            {/*    name="nombre_tarjeta"*/}
            {/*    value={`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}`}*/}
            {/*    onChange={nombreTarjetaHnadler}*/}
            {/*    id={`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}`} ></input>*/}
            {/*<label htmlFor={`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}`}>{`${infoSocio[0].str_nombres.split(" ")[1]} ${infoSocio[0].str_apellido_paterno}`}</label>*/}
        </div>
    );
}

export default Personalizacion;