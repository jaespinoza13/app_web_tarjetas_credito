import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Row,
    Table,
} from 'reactstrap';
import { set } from '../../js/crypt';
import { dateFormat, IsNullOrWhiteSpace } from '../../js/utiles';
import { selectFile } from '../../redux/Logs/FileSelected/actions';
import { fetchArchivosLogs, downloadArchivoLogs } from '../../services/RestServices';

const mapStateToProps = (state) => {
    var bd = state.GetWebService.data;
    if (IsNullOrWhiteSpace(bd) || Array.isArray(state.GetWebService.data)) {
        bd = sessionStorage.getItem("WSSELECTED");
    }
    return {
        ws: bd,
        listaFuncionalidades: state.GetListaFuncionalidades.data,
        token: state.tokenActive.data,
    };
};

function LogsTexto(props) {
    const dispatch = useDispatch();

    const [enableVer, setEnableVer] = useState(false);
    const [enableDown, setEnableDown] = useState(false);
    const [listaLogs, setListaLogs] = useState([]);

    useEffect(() => {
        fetchArchivosLogs(props.ws, props.token, (lstArchivos) => {
            setListaLogs(lstArchivos);
        }, dispatch);
        document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        window.addEventListener("resize", function () {
            document.getElementById('body_container_main').style.height = (window.innerHeight - document.getElementById("header_main").clientHeight) + "px";
        });
    }, [props.ws, dispatch]);

    useEffect(() => {
        let enV = false;
        let enD = false;
        if (props.listaFuncionalidades.length > 0) {
            for (let i = 0; i < props.listaFuncionalidades.length; i++) {
                if (props.listaFuncionalidades[i].nombre === set("VER_CONTENIDO_LOGS_DE_TEXTO")) {
                    enV = true;
                }
                if (props.listaFuncionalidades[i].nombre === set("DESCARGAR_LOGS_DE_TEXTO")) {
                    enD = true;
                }
            }
        }
        setEnableVer(enV);
        setEnableDown(enD);
    }, [props.listaFuncionalidades]);

    return (
        <Container id={"body_container_main"}>
            <Card
                className="my-2"
            >
                <CardHeader>
                    <Row>
                        <Col md={6}>
                            <h4>{props.ws}</h4>
                        </Col>
                        <Col md={6} className="text-right">
                            <Button onClick={() => fetchArchivosLogs(props.ws, props.token, (lstArchivos) => {
                                setListaLogs(lstArchivos);
                            }, dispatch)}>Recargar</Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <CardTitle tag="h5">
                        Archivos de Logs de {props.ws}
                    </CardTitle>
                    <Table hover striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Archivo</th>
                                <th>Ultima Actualizaci&oacute;n</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaLogs.map((item) =>
                                <tr key={item.int_id}>
                                    <th scope="row">{item.int_id}</th>
                                    <td>{item.str_nombre}</td>
                                    <td>{dateFormat("yyyy-MMM-DD HH:MIN:SS", item.dtt_actualizacion)}</td>
                                    <td>
                                        <Row width="100%">
                                            <Col>
                                                <Button color={'success'} disabled={!enableVer} onClick={() => {
                                                    sessionStorage.setItem("FILESELECTED", item.str_nombre);
                                                    dispatch(selectFile(item.str_nombre));
                                                    props.history.push("/contenidoLog");
                                                }}>
                                                    Ver
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button color={'primary'} disabled={!enableDown} onClick={() => downloadArchivoLogs(props.ws, item.str_nombre, props.token, dispatch)}>
                                                    Descargar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </Container>
    );
}

export default connect(mapStateToProps, {})(LogsTexto);