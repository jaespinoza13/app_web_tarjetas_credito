import { useDispatch } from "react-redux";
import { fetchGetOficinas } from "../../services/RestServices";
import Card from "../Common/Card";
import Toggler from "../Common/UI/Toggler";
import { Fragment, useEffect, useState } from "react";

const Personalizacion = (props) => {

    const dispatch = useDispatch();
    const [nombresTarjeta, setNombresTarjeta] = useState([]);
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [direccionEntrega, setDireccionEntrega] = useState("-1");
    const [tiposDireccion, setTiposDireccion] = useState([]);
    const [oficinas, setOficinas] = useState([]);
    
    const tiposEntrega = [
        { image: "", textPrincipal: "Retiro en agencia", textSecundario: "", key: "Retiro en agencia" },
        { image: "", textPrincipal: "Entrega en domicilio", textSecundario: "", key: "Entrega en domicilio" }
    ];

    useEffect(() => {
        if (props.lstDomicilio && props.lstDomicilio.length > 0 && props.lstDomicilio[0].str_dir_ciudad) {
            //console.log(`DOMIC ${props.lstDomicilio}`)
            setTiposDireccion([
                {
                    image: "",
                    textPrincipal: "Casa",
                    textSecundario: `${props.lstDomicilio[0].str_dir_ciudad}, ${props.lstDomicilio[0].str_dir_descripcion_dom}`,
                    key: props.lstDomicilio[0].int_dir_direccion
                }
            ]);
        }
        if (props.lstTrabajo && props.lstTrabajo.length > 0 && props.lstTrabajo[0].str_dir_ciudad) {
            //console.log(`DOMIC ${props.lstTrabajo}`)
            setTiposDireccion(prevState => [
                ...prevState,
                {
                    image: "",
                    textPrincipal: "Trabajo",
                    textSecundario: `${props.lstTrabajo[0].str_dir_ciudad}, ${props.lstTrabajo[0].str_dir_descripcion_emp}`,
                    key: props.lstTrabajo[0].int_dir_direccion
                }
            ]);
        }

        setNombresTarjeta([
            { image: "", textPrincipal: `${props.nombres.split(" ")[0]} ${props.str_apellido_paterno}`, textSecundario: "", key: `${props.nombres.split(" ")[0]} ${props.str_apellido_paterno}` },
            { image: "", textPrincipal: `${props.nombres.split(" ")[1]} ${props.str_apellido_paterno}`, textSecundario: "", key: `${props.nombres.split(" ")[1]} ${props.str_apellido_paterno}` }
        ]);

    }, [props]);


    
    useEffect(() => {
        fetchGetOficinas(props.token, (data) => {
            setOficinas(data.lst_oficinas);           
        }, dispatch);

        const defaultEntrega = tiposEntrega.shift(0);
        setTipoEntrega(defaultEntrega.textPrincipal);

        const defaultNombre = `${props.nombres.split(" ")[0]} ${ props.str_apellido_paterno }`;
        props.onNombreTarjeta(defaultNombre);
    }, []);



    /*
    useEffect(() => {
        setNombresTarjeta([
            { image: "", textPrincipal: `${props.nombres.split(" ")[0]} ${props.str_apellido_paterno}`, textSecundario: "", key: `${props.nombres.split(" ")[0]} ${props.str_apellido_paterno}` },
            { image: "", textPrincipal: `${props.nombres.split(" ")[1]} ${props.str_apellido_paterno}`, textSecundario: "", key: `${props.nombres.split(" ")[1]} ${props.str_apellido_paterno}` }
        ]);
    }, [props.nombres]);
    */


    useEffect(() => {
        props.onTipoEntrega(tipoEntrega);
    }, [tipoEntrega]);

    useEffect(() => {
        props.onDireccionEntrega(direccionEntrega);
    }, [direccionEntrega]);

    const nombreSeleccionHandler = (index) => {
        const nombreSeleccion = nombresTarjeta.find((nombre) => nombre.key === index);
        props.onNombreTarjeta(nombreSeleccion.textPrincipal);
    }

    const tipoEntregaHandler = (index) => {
        const entregas = tiposEntrega.find((entrega) => entrega.key === index);
        setTipoEntrega(entregas.textPrincipal);
    }

    const direccionEntregaHandler = (event) => {
        if (tipoEntrega === "Retiro en agencia") {
            setDireccionEntrega(event.target.value);
        } else {
            setDireccionEntrega(tiposDireccion.find(direccion => direccion.key === event)); 
        }

    }

    return (
        <Card className='mt-2'>
            <div>
                <h3 className="mb-3">Personalización</h3>
                <h5 className={"mb-2"}>Selecciona el nombre a imprimir en la tarjeta</h5>
                {nombresTarjeta.length > 0 &&
                    <Toggler className={"mb-3"} selectedToggle={nombreSeleccionHandler} toggles={nombresTarjeta}>
                    </Toggler>
                }
            </div>
            <div>
                <h3 className="mb-3">Entrega de la tarjeta</h3>
                <h5 className={"mb-2"}>Forma de entrega</h5>
                <Toggler className={"mb-3"} selectedToggle={tipoEntregaHandler} toggles={tiposEntrega}>
                </Toggler>
                {tipoEntrega !== "" && <h3 className={"mb-2"}>Selecciona una opción para la entrega</h3>}
                {tipoEntrega === "Retiro en agencia" && <div>

                    <select disabled={false} onChange={direccionEntregaHandler} value={direccionEntrega}>
                        {oficinas.length > 0
                            && oficinas?.map((oficina, index) => {
                                if (index === 0) {
                                    return (
                                        <Fragment key={index} >
                                            <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                            <option value={oficina.id_oficina}> {oficina.agencia}</option>
                                        </Fragment>
                                    )
                                }
                                else {
                                    return (
                                        <Fragment key={index} >
                                            <option value={oficina.id_oficina}> {oficina.agencia}</option>
                                        </Fragment>
                                    )
                                }
                            })}
                    </select>


                    {/*<select id="tipo_documento" onChange={direccionEntregaHandler} value={direccionEntrega}>*/}
                    {/*    <option value="-1" disabled={true }>Seleccione una opción</option>*/}
                    {/*    <option value="1">MATRIZ</option>*/}
                    {/*    <option value="2">SARAGURO</option>*/}
                    {/*    <option value="3">CATAMAYO</option>*/}
                    {/*    <option value="4">CARIAMANGA</option>*/}
                    {/*    <option value="5">ALAMOR</option>*/}
                    {/*    <option value="6">ZAMORA</option>*/}
                    {/*    <option value="7">CUENCA</option>*/}
                    {/*    <option value="8">AGENCIA NORTE</option>*/}
                    {/*    <option value="9">MACARA</option>*/}
                    {/*    <option value="10">AGENCIA SUR</option>*/}
                    {/*    <option value="11">AGENCIA YANTZAZA</option>*/}
                    {/*    <option value="12">BALSAS</option>*/}
                    {/*    <option value="13">CATACOCHA</option>*/}
                    {/*    <option value="14">SANTA ROSA</option>*/}
                    {/*    <option value="15">AGENCIA GUALAQUIZA</option>*/}
                    {/*    <option value="16">AGENCIA CUARTO CENTENARIO</option>*/}
                    {/*    <option value="17">AGENCIA ZUMBA</option>*/}
                    {/*    <option value="18">AGENCIA EL VALLE</option>*/}
                    {/*    <option value="19">AGENCIA MACHALA</option>*/}
                    {/*    <option value="20">AGENCIA EL EJIDO</option>*/}
                    {/*    <option value="21">AGENCIA LATACUNGA</option>*/}
                    {/*    <option value="22">AGENCIA SANTO DOMINGO</option>*/}
                    {/*</select>*/}
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
        </Card>
    );
}

export default Personalizacion;