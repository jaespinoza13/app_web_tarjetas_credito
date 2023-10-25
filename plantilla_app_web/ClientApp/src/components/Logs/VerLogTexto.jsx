import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';
import { IsNullOrWhiteSpace } from '../../js/utiles';
import { fetchContenidoArchivoLogs } from '../../services/RestServices';
import Paginador from '../Common/Paginador';

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    var file = state.GetFile.data;
    if (IsNullOrWhiteSpace(file) || Array.isArray(state.GetFile.data)) {
        file = sessionStorage.getItem("FILESELECTED");
    }
    return {
        archivo: file,
        ws: bd,
        token: state.tokenActive.data,
    };
};

function VerLogsTexto(props) {
    const dispatch = useDispatch();

    const [contenido, setContenido] = useState("");
    const [maximoRegistros, setMaximoRegistros] = useState(50);
    const [desde, setDesde] = useState(0);
    const [hasta, setHasta] = useState(50);
    const [updatePaginador, setUpdatePaginador] = useState(false);

    useEffect(() => {
        fetchContenidoArchivoLogs(props.ws, props.archivo, desde, hasta, props.token, (contenido, nroRegistros) => {
            setContenido(contenido);
            setMaximoRegistros(nroRegistros);
        }, dispatch);
        document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        window.addEventListener("resize", function () {
            document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        });
    }, [props.ws, props.archivo, desde, hasta, dispatch]);

    return (
        <div id={"body_container_main"} style={{ paddingLeft: "15px", paddingBottom: "15px" }}>
            <Card className="justify-content-md-center">
                <CardHeader>
                    <Row>
                        <Col md={6}>
                            <h4>{props.ws}</h4>
                        </Col>
                        <Col md={6} className="text-right">
                            <Button onClick={() => fetchContenidoArchivoLogs(props.ws, props.archivo, desde, hasta, props.token, (contenido, nroRegistros) => {
                                setContenido(contenido);
                                setMaximoRegistros(nroRegistros);
                            }, dispatch)}>Recargar</Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <CardTitle tag="h5">
                        Contenido del archivo {props.archivo}
                    </CardTitle>
                    <CardText dangerouslySetInnerHTML={{ __html: contenido }}></CardText>
                    <Paginador
                        desde={desde}
                        setDesde={setDesde}
                        hasta={hasta}
                        setHasta={setHasta}
                        maximoRegistros={maximoRegistros}
                        update={updatePaginador}
                        setUpdate={setUpdatePaginador}
                    />
                </CardBody>
            </Card>
        </div>
    );
}

export default connect(mapStateToProps, {})(VerLogsTexto);