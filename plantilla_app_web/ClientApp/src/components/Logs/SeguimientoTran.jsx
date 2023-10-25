import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Input,
    InputGroup,
    Row,
} from 'reactstrap';
import { IsNullOrWhiteSpace, obtenerConexionesLocales } from '../../js/utiles';
import ReactJson from 'react-json-view'
import JSONViewer from 'react-json-viewer';
import DibujarSeguimiento from './DibujarSeguimiento';
import { useExternalScripts } from '../../hooks/useHooks';
import { handlerGetSeguimiento } from '../../services/RestServices';

const mapStateToProps = (state) => {
    return {
        token: state.tokenActive.data,
    };
};

function SeguimientoTransaccion(props) {
    const dispatch = useDispatch();

    const [transaccionBuscar, setTransaccionBuscar] = useState("");
    const [rSelected, setRSelected] = useState(1);
    const [listaDocumentos, setListaDocumentos] = useState([]);
    useExternalScripts({ url: "https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js", link: "https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css" });

    useEffect(() => {
        obtenerConexionesLocales(sessionStorage.getItem("COEXIONSELECTED")).then((data) => {
            var url = data;
            if (IsNullOrWhiteSpace(url)) {
                props.history.push("/logs");
            }
        });
        document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        window.addEventListener("resize", function () {
            document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        });
    }, [props.history]);

    return (
        <Container id={"body_container_main"}>
            <Card
                className="my-2"
            >
                <CardHeader>
                    <Row>
                        <Col md={6}>
                            <h4>Seguimiento de Transacciones</h4>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody style={{ overflowX: "auto" }}>
                    <Row>
                        <Col sm={12} className="text-right row">
                            <Col sm={6} className="text-right">
                                <ButtonGroup style={{ float: "left" }}>
                                    <Button
                                        color="success"
                                        outline
                                        onClick={() => {
                                            setRSelected(1);
                                            document.getElementById("viewDiagram").style.display = "";
                                            document.getElementById("viewJSON").style.display = "none";
                                            document.getElementById("viewTABLE").style.display = "none";
                                        }}
                                        active={rSelected === 1}
                                    >
                                        Network
                                    </Button>
                                    <Button
                                        color="success"
                                        outline
                                        onClick={() => {
                                            setRSelected(2);
                                            document.getElementById("viewDiagram").style.display = "none";
                                            document.getElementById("viewJSON").style.display = "";
                                            document.getElementById("viewTABLE").style.display = "none";
                                        }}
                                        active={rSelected === 2}
                                    >
                                        JSON
                                    </Button>
                                    <Button
                                        color="primary"
                                        outline
                                        onClick={() => {
                                            setRSelected(3);
                                            document.getElementById("viewDiagram").style.display = "none";
                                            document.getElementById("viewJSON").style.display = "none";
                                            document.getElementById("viewTABLE").style.display = "";
                                        }}
                                        active={rSelected === 3}
                                    >
                                        Tabla
                                    </Button>
                                </ButtonGroup>
                            </Col>
                            <Col sm={6} className="text-right">
                                <InputGroup>
                                    <Input value={transaccionBuscar} type="text" onChange={(e) => {
                                        setTransaccionBuscar(e.target.value);
                                    }} />
                                    <Button onClick={() => {
                                        handlerGetSeguimiento(transaccionBuscar, props.token, (lstSeguimiento) => {
                                            setListaDocumentos(lstSeguimiento);
                                        }, dispatch);
                                    }}>
                                        Buscar
                                    </Button>
                                </InputGroup>
                            </Col>
                            <br />
                            <br />
                        </Col>
                        <Col sm="12">
                            <div id={"viewDiagram"}>
                                {rSelected === 1 ?
                                    <DibujarSeguimiento lists={listaDocumentos} transaccion={transaccionBuscar} />
                                    : ""}
                            </div>
                            <div id={"viewJSON"} style={{ display: "none", fontSize: "15px" }}>
                                <ReactJson src={listaDocumentos} collapsed={true} />
                            </div>
                            <div id={"viewTABLE"} style={{ display: "none", fontSize: "10px" }}>
                                <JSONViewer json={listaDocumentos} />
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    );
}

export default connect(mapStateToProps, {})(SeguimientoTransaccion);