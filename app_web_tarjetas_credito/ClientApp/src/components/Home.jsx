import '../scss/components/Home.css';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    Container,
} from 'reactstrap';
import { get } from '../js/crypt';

import Sidebar from "./Common/Navs/Sidebar";
import { useHistory } from 'react-router-dom';


const mapStateToProps = (state) => {
    //console.log("PROPS STATE," ,state);
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
    //TODO: PENDIENTE DE HACER UNA VALDIACION SI CUENTA CON PERMISOS SINO PRESENTAR ESTA PAG POR DEFECTO
    const navigate = useHistory();
    useEffect(() => {
        navigate.push("/solicitud")
    },[])

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