import '../scss/components/Home.css';
import React, { } from 'react';
import { connect } from 'react-redux';
import {
    Container,
} from 'reactstrap';
import { get } from '../js/crypt';

import Sidebar from "./Common/Navs/Sidebar";


const mapStateToProps = (state) => {
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
    return (
        <div className="f-row">
            <Sidebar></Sidebar>
            <Container className="border-bottom text-center ">
                <Container>
                    <h3 className="mb-3">Bienvenido al sistema de </h3>
                    <h2 className="mb-3">{props.dataNombreSistema}</h2>
                    <h3 className="mb-3">Crea y administra solicitudes de tarjeta de credito</h3>
                </Container>
                <Container>
                    <h3>Mejoras:</h3>
                    
                        {props.dataListaMejoras.map((item, index) =>
                            <p>- {item}</p>
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