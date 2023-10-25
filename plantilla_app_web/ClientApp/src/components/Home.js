import React, { } from 'react';
import { connect } from 'react-redux';
import {
    Container,
} from 'reactstrap';
import { get } from '../js/crypt';

const mapStateToProps = (state) => {
    var array = [...state.GetListaMejoras.data];
    for (let i = 0; i < array.length; i++) {
        array[i] = get(array[i]);
    }
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
        <div>
            <Container className="border-bottom text-center">
                <h2>CoopMego - {props.dataNombreSistema}</h2>
                <h4>
                    <b>Versi&oacute;n:</b>{' '}{props.dataVersion}
                    <br />
                    <b>Fecha Actualizaci&oacute;n:</b>{' '}{props.dataFechaActualizacion}
                </h4>
            </Container>
            <Container>
                <h3>Mejoras:</h3>
                <ul>
                    {props.dataListaMejoras.map((item, index) =>
                        <li key={"Mejora_" + index}>{item}</li>
                    )}
                </ul>
            </Container>
        </div>
    );
}

export default connect(mapStateToProps, {})(Home);