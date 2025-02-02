﻿import { useDispatch, connect } from "react-redux";
import Card from "../Common/Card";
import Toggler from "../Common/UI/Toggler";
import { Fragment, useEffect, useState } from "react";
import { IsNullOrWhiteSpace } from "../../js/utiles";

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data
    };
};




const Personalizacion = (props) => {

    const dispatch = useDispatch();
    const [nombresTarjeta, setNombresTarjeta] = useState([]);
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [direccionEntrega, setDireccionEntrega] = useState("-1");
    const [tiposDireccion, setTiposDireccion] = useState([]);
    const [oficinas, setOficinas] = useState([]);
    const [tiposEntrega, setTiposEntrega] = useState([]);


    //TODO consumir lo parametrizado
    /*const tiposEntrega = [
        { image: "", textPrincipal: "Retiro en agencia", textSecundario: "", key: "Retiro en agencia" },
        //Dehabilitado para se realizo este tipo de entrega
        { image: "", textPrincipal: "Entrega en domicilio", textSecundario: "", key: "Entrega en domicilio" }
    ];*/

    useEffect(() => {
        if (props.lstDomicilio && props.lstDomicilio.length > 0 && props.lstDomicilio[0].str_dir_ciudad) {
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
        setTiposEntrega(props.lstTiposEntregaTC)

        if (props.lstTiposEntregaTC.length > 0) {
            const defaultEntrega = props.lstTiposEntregaTC[0];
            setTipoEntrega(defaultEntrega.textPrincipal);
        }
    }, [props.lstTiposEntregaTC])


    useEffect(() => {
        window.scrollTo(0, 0);
        //Obtener oficinas parametrizadas
        let ParametrosTC = props.parametrosTC.lst_parametros;
        let oficinasParametrosTC = ParametrosTC
            .filter(param => param.str_nombre === 'OFICINAS_TC')
            .map(estado => ({
                prm_id: estado.int_id_parametro,
                prm_nombre: estado.str_nombre,
                prm_nemonico: estado.str_nemonico,
                prm_valor_ini: estado.str_valor_ini,
                prm_valor_fin: estado.str_valor_fin,
                prm_descripcion: estado.str_descripcion
            }));
        setOficinas(oficinasParametrosTC)


        const defaultNombre = `${props.nombres.split(" ")[0]} ${props.str_apellido_paterno}`;
        props.onNombreTarjeta(defaultNombre);
    }, []);



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
        if (tipoEntrega === "OFICINA COOPMEGO") {
            setDireccionEntrega(event.target.value);
        } else {
            setDireccionEntrega(tiposDireccion.find(direccion => direccion.key === event));
        }

    }

    return (
        <Card className='mt-2'>
            <div>
                <h3 className="mb-3">Personalización</h3>
                <h4 className={"mb-2"}>Selecciona el nombre a imprimir en la tarjeta</h4>
                {nombresTarjeta.length > 0 &&
                    <Toggler className={"mb-3"} selectedToggle={nombreSeleccionHandler} toggles={nombresTarjeta}>
                    </Toggler>
                }
            </div>
            <div>
                <h3 className="mb-3">Entrega de la tarjeta</h3>
                <h4 className={"mb-2"}>Forma de entrega</h4>

                {tiposEntrega.length > 0 &&

                    <Toggler className={"mb-3"} selectedToggle={tipoEntregaHandler} toggles={tiposEntrega}>
                    </Toggler>
                }


                {tipoEntrega !== "" && <h3 className={"mb-2"}>Selecciona una opción para la entrega</h3>}
                {tipoEntrega === "OFICINA COOPMEGO" && <div>

                    <select disabled={false} onChange={direccionEntregaHandler} value={direccionEntrega}>
                        {oficinas.length > 0
                            && oficinas?.map((oficina, index) => {
                                if (index === 0) {
                                    return (
                                        <Fragment key={index} >
                                            <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                            <option value={oficina.prm_valor_fin}> {oficina.prm_descripcion}</option>
                                        </Fragment>
                                    )
                                }
                                else {
                                    return (
                                        <Fragment key={index} >
                                            <option value={oficina.prm_valor_fin}> {oficina.prm_descripcion}</option>
                                        </Fragment>
                                    )
                                }
                            })}
                    </select>
                </div>}
                {tipoEntrega === "DOMICILIO" &&
                    <div>
                        <Toggler className={"f-col"} selectedToggle={direccionEntregaHandler} toggles={tiposDireccion}></Toggler>
                    </div>
                }

            </div>
        </Card>
    );
}

export default connect(mapStateToProps, {})(Personalizacion);

/*import { useDispatch, connect } from "react-redux";
import Card from "../Common/Card";
import Toggler from "../Common/UI/Toggler";
import { Fragment, useEffect, useState } from "react";
import { IsNullOrWhiteSpace } from "../../js/utiles";
import { fetchGetParametrosSistema } from "../../services/RestServices";

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        token: state.tokenActive.data,
        parametrosTC: state.GetParametrosTC.data
    };
};




const Personalizacion = (props) => {

    const dispatch = useDispatch();
    const [nombresTarjeta, setNombresTarjeta] = useState([]);
    const [tipoEntrega, setTipoEntrega] = useState([]);
    const [direccionEntrega, setDireccionEntrega] = useState("-1");
    const [tiposDireccion, setTiposDireccion] = useState([]);
    const [oficinas, setOficinas] = useState([]);



    useEffect(() => {
        if (props.lstDomicilio && props.lstDomicilio.length > 0 && props.lstDomicilio[0].str_dir_ciudad) {
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
        window.scrollTo(0, 0);

        if (props.lstTiposEntregaTC.length > 0) {
            const defaultEntrega = props.lstTiposEntregaTC.shift(0);
            setTipoEntrega(defaultEntrega.textPrincipal);
        }

        //Obtener oficinas parametrizadas
        let ParametrosTC = props.parametrosTC.lst_parametros;
        let oficinasParametrosTC = ParametrosTC
            .filter(param => param.str_nombre === 'OFICINAS_TC')
            .map(estado => ({
                prm_id: estado.int_id_parametro,
                prm_nombre: estado.str_nombre,
                prm_nemonico: estado.str_nemonico,
                prm_valor_ini: estado.str_valor_ini,
                prm_valor_fin: estado.str_valor_fin,
                prm_descripcion: estado.str_descripcion
            }));
        setOficinas(oficinasParametrosTC)


        const defaultNombre = `${props.nombres.split(" ")[0]} ${props.str_apellido_paterno}`;
        props.onNombreTarjeta(defaultNombre);
    }, []);



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
        const entregas = props.lstTiposEntregaTC.find((entrega) => entrega.key === index);
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

                {props.lstTiposEntregaTC.length > 0 &&
                    <Toggler className={"mb-3"} selectedToggle={tipoEntregaHandler} toggles={props.lstTiposEntregaTC}>
                    </Toggler>
                }

                {tipoEntrega !== "" && <h3 className={"mb-2"}>Selecciona una opción para la entrega</h3>}
                {tipoEntrega === "OFICINA COOPMEGO" && <div>

                    <select disabled={false} onChange={direccionEntregaHandler} value={direccionEntrega}>
                        {oficinas.length > 0
                            && oficinas?.map((oficina, index) => {
                                if (index === 0) {
                                    return (
                                        <Fragment key={index} >
                                            <option disabled={true} value={"-1"}>Seleccione una opción</option>
                                            <option value={oficina.prm_valor_fin}> {oficina.prm_descripcion}</option>
                                        </Fragment>
                                    )
                                }
                                else {
                                    return (
                                        <Fragment key={index} >
                                            <option value={oficina.prm_valor_fin}> {oficina.prm_descripcion}</option>
                                        </Fragment>
                                    )
                                }
                            })}
                    </select>
                </div>}
                {tipoEntrega === "COURRIER" &&
                    <div>
                        <Toggler className={"f-col"} selectedToggle={direccionEntregaHandler} toggles={tiposDireccion}></Toggler>
                    </div>
                }

            </div>
        </Card>
    );
}

export default connect(mapStateToProps, {})(Personalizacion);*/