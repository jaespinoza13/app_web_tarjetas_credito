import '../scss/components/Home.css';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Container,
} from 'reactstrap';
import { get, set } from '../js/crypt';

import Sidebar from "./Common/Navs/Sidebar";
import { setParametrosSistema } from '../redux/ParametrosSistema/actions';
import { fetchGetParametrosSistema } from '../services/RestServices';


const mapStateToProps = (state) => {
    //console.log(state);
    var array = [...state.GetListaMejoras.data];
    for (let i = 0; i < array.length; i++) {
        array[i] = get(array[i]);
    }

    //for (let funcionalidad = 0; funcionalidad < funcionalidades.length; funcionalidad++) {
    //    funcionalidades[funcionalidad] = get(funcionalidades[funcionalidad]);
    //}
    return {
        token: state.tokenActive.data,
        dataNombreSistema: get(state.GetParametros.data["sistema"]),
        dataVersion: get(state.GetParametros.data["version"]),
        dataFechaActualizacion: get(state.GetParametros.data["fActual"]),
        dataListaMejoras: array
    };
};

function Home(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        //fetchGetParametrosSistema(props.token, (data) => {
        //    if (data.str_res_codigo === "000") {
        //        var array = [];
        //        for (let i = 0; i < data.lst_parametros.length; i++) {
        //            array.push({
        //                prm_id: set((data.lst_parametros[i].prm_id)),
        //                prm_nombre: set(data.lst_parametros[i].prm_nombre),
        //                prm_nemonico: set(data.lst_parametros[i].prm_nemonico),
        //                prm_valor_ini: set(data.lst_parametros[i].prm_valor_ini),
        //                prm_valor_fin: set(data.lst_parametros[i].prm_valor_fin),
        //                prm_descripcion: set(data.lst_parametros[i].prm_descripcion)
        //            });
        //        }
        //        dispatch(setParametrosSistema(array));
        //    }
        //}, dispatch);
    }, []);
    return (
        <div className="f-row">
            <Sidebar enlace={props.location.pathname }></Sidebar>
            <Container className="border-bottom text-center ">
                <Container>
                    <h3 className="mb-3 blue">Bienvenido al sistema de </h3>
                    <h1 className="mb-3 blue strong">{props.dataNombreSistema}</h1>
                    <h3 className="mb-3 blue">Crea y administra solicitudes de tarjeta de credito</h3>
                </Container>
                <Container>
                    <h3>Mejoras:</h3>
                    
                        {props.dataListaMejoras.map((item, index) =>
                            <p key={index }>- {item}</p>
                        )}
                    <h4>
                        <b>Versi&oacute;n:</b>{' '}{props.dataVersion}
                        <br />
                        <b>Fecha Actualizaci&oacute;n:</b>{' '}{props.dataFechaActualizacion}
                    </h4>
                </Container>
            </Container>
        </div>
    );
}

export default connect(mapStateToProps, {})(Home);